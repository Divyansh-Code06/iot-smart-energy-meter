// File: src/hooks/useLiveAnalytics.js
// Owns threshold config + evaluation. Data itself comes from
// services/websocket.js, so this hook doesn't know or care whether it's
// reading mock or real ESP32 data.

import { useEffect, useMemo, useState } from 'react';
import { subscribeToLiveMetrics } from '../services/websocket';

/** Single source of truth for every card's safe-operating parameters. */
export const METRIC_LIMITS = {
  voltage: { kind: 'range', min: 220, max: 240, unit: 'V', displayLabel: 'Target: 220V – 240V' },
  current: { kind: 'ceiling', max: 16, unit: 'A', displayLabel: 'Safe Limit: 16A' },
  power: { kind: 'ceiling', max: 3500, unit: 'W', displayLabel: 'Safe Limit: 3500W' },
  energy: { kind: 'budget', limit: 150, unit: 'kWh', displayLabel: 'Monthly Budget: 150 kWh' },
  frequency: { kind: 'target', target: 50, tolerance: 0.5, unit: 'Hz', displayLabel: 'Target: 50Hz ± 0.5' },
  powerFactor: { kind: 'range', min: 0.85, max: 1.0, unit: '', displayLabel: 'Target: 0.85 – 1.00' },
};

const METRIC_META = {
  voltage: { label: 'Voltage', decimals: 1 },
  current: { label: 'Current', decimals: 2 },
  power: { label: 'Active Power', decimals: 0 },
  energy: { label: 'Energy Consumed', decimals: 1 },
  frequency: { label: 'Frequency', decimals: 2 },
  powerFactor: { label: 'Power Factor', decimals: 2 },
};

const METRIC_KEYS = ['voltage', 'current', 'power', 'energy', 'frequency', 'powerFactor'];

const PAYLOAD_ACCESSORS = {
  voltage: (p) => p.voltage,
  current: (p) => p.current,
  power: (p) => p.power,
  energy: (p) => p.energyKwh,
  frequency: (p) => p.frequency,
  powerFactor: (p) => p.powerFactor,
};

/** Pure function: given a limit config and a live value, decide the pill state. */
export function evaluateStatus(value, limit) {
  switch (limit.kind) {
    case 'range': {
      const buffer = (limit.max - limit.min) * 0.1;
      if (value >= limit.min && value <= limit.max) return 'normal';
      if (value >= limit.min - buffer && value <= limit.max + buffer) return 'warning';
      return 'critical';
    }
    case 'ceiling':
      if (value <= limit.max * 0.85) return 'normal';
      if (value <= limit.max) return 'warning';
      return 'critical';
    case 'target': {
      const deviation = Math.abs(value - limit.target);
      if (deviation <= limit.tolerance) return 'normal';
      if (deviation <= limit.tolerance * 2) return 'warning';
      return 'critical';
    }
    case 'budget': {
      const pct = (value / limit.limit) * 100;
      if (pct < 80) return 'normal';
      if (pct <= 100) return 'warning';
      return 'critical';
    }
    default:
      return 'normal';
  }
}

function emptyHistory() {
  return METRIC_KEYS.reduce((acc, key) => ({ ...acc, [key]: [] }), {});
}

/**
 * Drives every live-data consumer in the app (Live Monitor cards, Home's
 * live power chart, the alerts watcher). Mount this ONCE, in
 * LiveDataContext — components should read via useLiveData(), not call this
 * hook directly, or you'll open a second parallel connection.
 */
export function useLiveAnalytics({ historyLength = 20 } = {}) {
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [history, setHistory] = useState(emptyHistory);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    function handlePayload(payload) {
      setLatest(payload);
      setLastUpdated(payload.timestamp);
      setHistory((prev) => {
        const next = { ...prev };
        for (const key of METRIC_KEYS) {
          next[key] = [...prev[key], PAYLOAD_ACCESSORS[key](payload)].slice(-historyLength);
        }
        return next;
      });
    }

    const unsubscribe = subscribeToLiveMetrics(handlePayload, setConnectionStatus);
    return unsubscribe;
  }, [historyLength]);

  const metrics = useMemo(() => {
    if (!latest) return [];
    return METRIC_KEYS.map((key) => {
      const value = PAYLOAD_ACCESSORS[key](latest);
      const limit = METRIC_LIMITS[key];
      return {
        key,
        label: METRIC_META[key].label,
        unit: limit.unit,
        value,
        decimals: METRIC_META[key].decimals,
        history: history[key],
        status: evaluateStatus(value, limit),
        limit,
      };
    });
  }, [latest, history]);

  return { metrics, connectionStatus, lastUpdated };
}
