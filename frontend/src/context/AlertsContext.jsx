// File: src/context/AlertsContext.jsx
// Watches the shared live metrics for status transitions and turns them
// into alerts automatically — this is what makes a breach on the Live
// Monitor page's data show up in the Header's bell on any page, since both
// read from the same LiveDataProvider.
//
// Alert shape: { id, metricKey, level: 'warning'|'critical'|'resolved',
//                 message, timestamp, read }
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLiveData } from './LiveDataContext';

const AlertsContext = createContext(null);
const MAX_ALERTS = 30;

function describeTransition(metric, level) {
  const value = metric.value.toFixed(metric.decimals);
  if (level === 'resolved') {
    return `${metric.label} is back within its safe range (${value}${metric.unit}).`;
  }
  if (level === 'critical') {
    return `${metric.label} hit ${value}${metric.unit} — outside its safe range (${metric.limit.displayLabel}).`;
  }
  return `${metric.label} reached ${value}${metric.unit} — approaching its limit (${metric.limit.displayLabel}).`;
}

/** Only fires on a genuine state change, so it alerts once per breach, not once per tick. */
function classifyTransition(prev, current) {
  if (prev === current) return null;
  if (current === 'normal' && (prev === 'warning' || prev === 'critical')) return 'resolved';
  if (current === 'critical') return 'critical';
  if (current === 'warning' && prev !== 'critical') return 'warning';
  return null; // e.g. critical -> warning: still abnormal, not alert-worthy on its own
}

export function AlertsProvider({ children }) {
  const { metrics } = useLiveData();
  const [alerts, setAlerts] = useState([]);
  const previousStatus = useRef({});

  useEffect(() => {
    const fresh = [];
    metrics.forEach((metric) => {
      const transition = classifyTransition(previousStatus.current[metric.key], metric.status);
      if (transition) {
        fresh.push({
          id: `${metric.key}-${Date.now()}`,
          metricKey: metric.key,
          level: transition,
          message: describeTransition(metric, transition),
          timestamp: Date.now(),
          read: false,
        });
      }
      previousStatus.current[metric.key] = metric.status;
    });
    if (fresh.length > 0) {
      setAlerts((prev) => [...fresh, ...prev].slice(0, MAX_ALERTS));
    }
  }, [metrics]);

  const markAllRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => (a.read ? a : { ...a, read: true })));
  }, []);

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <AlertsContext.Provider value={{ alerts, unreadCount, markAllRead }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) {
    throw new Error('useAlerts() must be called within an <AlertsProvider>.');
  }
  return ctx;
}
