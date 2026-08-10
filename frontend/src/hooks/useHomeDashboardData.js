// File: src/hooks/useHomeDashboardData.js
// Everything the Home page's non-live cards need, fetched through
// services/api.js. When the real FastAPI backend goes live, only api.js
// changes — this hook keeps working as-is.
import { useCallback, useEffect, useState } from 'react';
import {
  getEnergyOverview,
  getSocketStates,
  setSocketState,
  getAiSummary,
  getBillPrediction,
  getEfficiencyScore,
  getSettings,
} from '../services/api';

export function useHomeDashboardData() {
  const [energy, setEnergy] = useState(null);
  const [sockets, setSockets] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [billPrediction, setBillPrediction] = useState(null);
  const [efficiencyScore, setEfficiencyScore] = useState(null);
  const [billingDate, setBillingDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getEnergyOverview(),
      getSocketStates(),
      getAiSummary(),
      getBillPrediction(),
      getEfficiencyScore(),
      getSettings(),
    ]).then(([energyData, socketData, aiData, predictionData, scoreData, settingsData]) => {
      if (cancelled) return;
      setEnergy(energyData);
      setSockets(socketData);
      setAiSummary(aiData);
      setBillPrediction(predictionData);
      setEfficiencyScore(scoreData);
      setBillingDate(settingsData.billingDate);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSocket = useCallback(
    (socketId) => {
      const target = sockets.find((s) => s.id === socketId);
      if (!target) return;
      const nextOn = !target.on;

      setSockets((prev) => prev.map((s) => (s.id === socketId ? { ...s, on: nextOn } : s))); // optimistic

      setSocketState(socketId, nextOn).catch(() => {
        // Real relay command failed — roll the UI back.
        setSockets((prev) => prev.map((s) => (s.id === socketId ? { ...s, on: !nextOn } : s)));
      });
    },
    [sockets],
  );

  return { energy, sockets, aiSummary, billPrediction, efficiencyScore, billingDate, loading, toggleSocket };
}
