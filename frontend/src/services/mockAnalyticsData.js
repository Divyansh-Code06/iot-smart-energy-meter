// File: src/services/mockAnalyticsData.js
// Emulates the JSON frames a FastAPI WebSocket would push from the ESP32 +
// PZEM-004T sensor. Only services/websocket.js should import this — nothing
// else in the app should know a mock exists.

let voltage = 230;
let current = 4.5;
let frequency = 50;
let powerFactor = 0.94;
let cumulativeKwh = 62.4; // pretend we're partway through the billing cycle

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function nextTick() {
  voltage = clamp(voltage + (Math.random() - 0.5) * 2.5, 210, 248);
  current = clamp(current + (Math.random() - 0.5) * 1.2, 0.2, 18);
  frequency = clamp(frequency + (Math.random() - 0.5) * 0.08, 49.4, 50.6);
  powerFactor = clamp(powerFactor + (Math.random() - 0.5) * 0.03, 0.55, 1);

  const power = Math.round(voltage * current * powerFactor);
  cumulativeKwh += power / 3_600_000; // integrate power draw, ~1s ticks

  return {
    voltage: round(voltage, 1),
    current: round(current, 2),
    power,
    energyKwh: round(cumulativeKwh, 2),
    frequency: round(frequency, 2),
    powerFactor: round(powerFactor, 2),
    timestamp: Date.now(),
  };
}

/**
 * Starts a mock live feed. Returns an unsubscribe function — the same shape
 * as a WebSocket's close(), so callers don't need to know which one they got.
 */
export function subscribeToMockAnalytics(onData, intervalMs = 1000) {
  onData(nextTick()); // emit immediately so the UI isn't empty on mount
  const id = setInterval(() => onData(nextTick()), intervalMs);
  return () => clearInterval(id);
}
