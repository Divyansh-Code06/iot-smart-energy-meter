// File: src/components/dashboard/PowerUsageCard.jsx
// Two different data sources on purpose: "Live" reads the shared WebSocket
// context (instant power draw), while Daily/Weekly/Monthly fetch through
// services/api.js (historical data — this is what should read from
// InfluxDB on the real backend, not the live socket).
import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';
import { Card, CardLabel } from '../ui/Card';
import { SegmentedControl } from '../ui/SegmentedControl';
import { useLiveData } from '../../context/LiveDataContext';
import { getConsumptionHistory } from '../../services/api';

const EMERALD = '#10B981';
const EMERALD_DARK = '#059669';
const BORDER = '#E5E7EB';
const MUTED = '#6B7280';

const TIMEFRAMES = [
  { id: 'live', label: 'Live' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs shadow-md">
      <div className="mb-0.5 font-medium text-gray-500">{label}</div>
      <div className="font-semibold text-[#111827]">
        {payload[0].value} <span className="font-normal text-gray-400">{unit}</span>
      </div>
    </div>
  );
}

export function PowerUsageCard() {
  const { metrics } = useLiveData();
  const [timeframe, setTimeframe] = useState('live');
  const [historyData, setHistoryData] = useState({ daily: [], weekly: [], monthly: [] });
  const [loadingHistory, setLoadingHistory] = useState(false);

  const powerMetric = metrics.find((m) => m.key === 'power');
  const liveSeries = useMemo(
    () => (powerMetric ? powerMetric.history.map((v, i) => ({ label: String(i), value: v })) : []),
    [powerMetric],
  );

  useEffect(() => {
    if (timeframe === 'live' || historyData[timeframe]?.length) return;
    let cancelled = false;
    setLoadingHistory(true);
    getConsumptionHistory(timeframe).then((data) => {
      if (cancelled) return;
      setHistoryData((prev) => ({ ...prev, [timeframe]: data }));
      setLoadingHistory(false);
    });
    return () => {
      cancelled = true;
    };
  }, [timeframe]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, unit, isBar, xInterval } = useMemo(() => {
    switch (timeframe) {
      case 'daily':
        return { data: historyData.daily, unit: 'kWh so far', isBar: false, xInterval: 2 };
      case 'weekly':
        return { data: historyData.weekly, unit: 'kWh', isBar: true, xInterval: 0 };
      case 'monthly':
        return { data: historyData.monthly, unit: 'kWh', isBar: true, xInterval: 3 };
      default:
        return { data: liveSeries, unit: 'W', isBar: false, xInterval: 3 };
    }
  }, [timeframe, historyData, liveSeries]);

  const latest = data[data.length - 1]?.value ?? 0;

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardLabel icon={LineChartIcon}>Live Power Usage</CardLabel>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tracking-tight text-[#111827] tabular-nums">{latest}</span>
            <span className="text-xs font-medium text-gray-400">{unit}</span>
          </div>
        </div>
        <SegmentedControl options={TIMEFRAMES} value={timeframe} onChange={setTimeframe} />
      </div>

      <div className="h-64 w-full">
        {loadingHistory ? (
          <div className="flex h-full items-center justify-center text-[13px] text-gray-400">Loading…</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {isBar ? (
              <BarChart data={data} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} interval={xInterval} />
                <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ fill: 'rgba(16,185,129,0.06)' }} />
                <Bar dataKey="value" fill={EMERALD} radius={[4, 4, 0, 0]} maxBarSize={timeframe === 'monthly' ? 10 : 34} />
              </BarChart>
            ) : (
              <AreaChart data={data} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="powerFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={EMERALD} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={EMERALD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} interval={xInterval} />
                <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: BORDER, strokeWidth: 1 }} />
                <Area type="monotone" dataKey="value" stroke={EMERALD_DARK} strokeWidth={2} fill="url(#powerFill)" dot={false} isAnimationActive={timeframe !== 'live'} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
