// File: src/components/dashboard/EfficiencyScoreCard.jsx
import { Gauge } from 'lucide-react';
import { Card, CardLabel } from '../ui/Card';

const BAND_CONFIG = {
  excellent: { label: 'Excellent', color: '#10B981', classes: 'bg-emerald-50 text-emerald-700' },
  good: { label: 'Good', color: '#F59E0B', classes: 'bg-amber-50 text-amber-700' },
  'needs-improvement': { label: 'Needs Improvement', color: '#EF4444', classes: 'bg-red-50 text-red-600' },
};

const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function EfficiencyScoreCard({ data }) {
  if (!data) {
    return (
      <Card>
        <CardLabel icon={Gauge}>Energy Efficiency Score</CardLabel>
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-gray-100" />
          <div className="h-10 w-2/3 animate-pulse rounded bg-gray-50" />
        </div>
      </Card>
    );
  }

  const { score, band, summary } = data;
  const config = BAND_CONFIG[band] ?? BAND_CONFIG.good;
  const offset = CIRCUMFERENCE - (Math.min(100, Math.max(0, score)) / 100) * CIRCUMFERENCE;

  return (
    <Card>
      <CardLabel icon={Gauge}>Energy Efficiency Score</CardLabel>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 96 96" className="h-24 w-24 -rotate-90">
            <circle cx="48" cy="48" r={RADIUS} fill="none" stroke="#E5E7EB" strokeWidth="8" />
            <circle
              cx="48"
              cy="48"
              r={RADIUS}
              fill="none"
              stroke={config.color}
              strokeWidth="8"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold leading-none tracking-tight text-[#111827] tabular-nums">
              {score}
            </span>
            <span className="mt-0.5 text-[10px] text-gray-400">/ 100</span>
          </div>
        </div>

        <div className="min-w-0">
          <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${config.classes}`}>
            {config.label}
          </span>
          <p className="mt-2 text-[12.5px] leading-relaxed text-gray-500">{summary}</p>
        </div>
      </div>
    </Card>
  );
}
