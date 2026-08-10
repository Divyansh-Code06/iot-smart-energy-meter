// File: src/services/websocket.js
// THE ONLY FILE THAT SHOULD CHANGE when your FastAPI WebSocket goes live.
// Every component/hook in the app calls subscribeToLiveMetrics() and never
// touches WebSocket or the mock generator directly — so turning on the real
// backend is just: set VITE_WS_URL in .env, redeploy. Nothing else moves.

import { subscribeToMockAnalytics } from './mockAnalyticsData';

const WS_URL = import.meta.env.VITE_WS_URL;
const RECONNECT_DELAY_MS = 3000;

/**
 * Subscribes to the live metrics stream (voltage, current, power, energyKwh,
 * frequency, powerFactor, timestamp).
 *
 * @param {(payload: object) => void} onData - called with each new reading
 * @param {(status: 'connecting'|'connected'|'disconnected'|'mock') => void} onStatusChange
 * @returns {() => void} unsubscribe/close function
 */
export function subscribeToLiveMetrics(onData, onStatusChange = () => {}) {
  if (!WS_URL) {
    // ---- MOCK MODE: no backend configured yet ----
    onStatusChange('mock');
    return subscribeToMockAnalytics(onData, 1000);
  }

  // ---- REAL WEBSOCKET MODE ----
  let socket;
  let reconnectTimer;
  let closedByCaller = false;

  function connect() {
    onStatusChange('connecting');
    socket = new WebSocket(WS_URL);

    socket.onopen = () => onStatusChange('connected');

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        onData(payload);
      } catch (err) {
        console.error('Malformed live-metrics payload from WebSocket', err);
      }
    };

    socket.onclose = () => {
      onStatusChange('disconnected');
      if (!closedByCaller) {
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
      }
    };

    socket.onerror = () => {
      onStatusChange('disconnected');
      socket.close();
    };
  }

  connect();

  return () => {
    closedByCaller = true;
    clearTimeout(reconnectTimer);
    socket?.close();
  };
}
