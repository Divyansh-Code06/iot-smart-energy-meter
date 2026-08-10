// File: src/components/analytics/MetricCard.jsx
import { SafeLimitBadge } from './SafeLimitBadge';
import { Sparkline } from './Sparkline';

export function MetricCard({ icon: Icon, label, value, unit, decimals, limitLabel, status, history }) {
  const ringClass =
    status === 'critical' ? 'ring-1 ring-red-200' : status === 'warning' ? 'ring-1 ring-amber-200' : '';

  return (
    <div
      className={`flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(17,24,39,0.04)] transition-shadow ${ringClass}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500">
          <Icon className="h-3.5 w-3.5" />
          <span>{label}</span>
        </div>
        <SafeLimitBadge status={status} />
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-[32px] font-semibold leading-none tracking-tight text-[#111827] tabular-nums">
          {value.toFixed(decimals)}
        </span>
        {unit && <span className="text-xs font-medium text-gray-400">{unit}</span>}
      </div>

      <p className="mt-1.5 text-[12px] text-gray-400">{limitLabel}</p>

      <div className="mt-3">
        <Sparkline data={history} status={status} />
      </div>
    </div>
  );
}
