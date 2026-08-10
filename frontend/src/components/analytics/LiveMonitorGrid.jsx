// File: src/components/analytics/LiveMonitorGrid.jsx
import { Zap, Activity, Gauge, BatteryCharging, Waves, Percent } from 'lucide-react';
import { MetricCard } from './MetricCard';

const ICONS = {
  voltage: Zap,
  current: Activity,
  power: Gauge,
  energy: BatteryCharging,
  frequency: Waves,
  powerFactor: Percent,
};

export function LiveMonitorGrid({ metrics }) {
  if (metrics.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[172px] animate-pulse rounded-2xl border border-[#E5E7EB] bg-gray-50" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.key}
          icon={ICONS[metric.key]}
          label={metric.label}
          value={metric.value}
          unit={metric.unit}
          decimals={metric.decimals}
          limitLabel={metric.limit.displayLabel}
          status={metric.status}
          history={metric.history}
        />
      ))}
    </div>
  );
}
