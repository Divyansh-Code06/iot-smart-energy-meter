// File: src/components/dashboard/BudgetCard.jsx
import { TrendingUp } from 'lucide-react';
import { Card, CardLabel } from '../ui/Card';
import { ordinal } from '../../utils/format';

export function BudgetCard({ spent, limit, billingDate }) {
  const pct = Math.min(100, Math.round((spent / limit) * 100));
  const color = pct < 60 ? '#10B981' : pct < 85 ? '#F59E0B' : '#EF4444';
  const tone = pct < 60 ? 'On track' : pct < 85 ? 'Approaching limit' : 'Over pace';

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <CardLabel icon={TrendingUp}>Monthly Budget Goal</CardLabel>
        <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ color, backgroundColor: `${color}1A` }}>
          {pct}%
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[34px] font-semibold leading-none tracking-tight text-[#111827] tabular-nums">
          ₹{spent.toLocaleString('en-IN')}
        </span>
        <span className="text-sm font-medium text-gray-400">/ ₹{limit.toLocaleString('en-IN')}</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <p className="mt-2 text-[13px] text-gray-500">
        {tone} for this billing cycle
        {billingDate ? ` · resets on the ${ordinal(billingDate)}` : ''}
      </p>
    </Card>
  );
}
