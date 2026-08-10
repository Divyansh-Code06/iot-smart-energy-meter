// File: src/components/analytics/SafeLimitBadge.jsx
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

const STATUS_CONFIG = {
  normal: { label: 'NORMAL', icon: ShieldCheck, classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  warning: { label: 'WARNING', icon: AlertTriangle, classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  critical: { label: 'CRITICAL', icon: ShieldAlert, classes: 'bg-red-50 text-red-700 border-red-200' },
};

export function SafeLimitBadge({ status }) {
  const { label, icon: Icon, classes } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${classes}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
