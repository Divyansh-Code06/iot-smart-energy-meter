// File: src/components/dashboard/BillPredictionCard.jsx
import { CalendarClock, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardLabel } from '../ui/Card';

export function BillPredictionCard({ data }) {
  if (!data) {
    return (
      <Card>
        <CardLabel icon={CalendarClock}>Bill Prediction</CardLabel>
        <div className="h-9 w-2/3 animate-pulse rounded bg-gray-100" />
        <div className="mt-3 h-4 w-4/5 animate-pulse rounded bg-gray-50" />
      </Card>
    );
  }

  const { projectedKwh, projectedCost, daysRemainingInCycle, vsBudget } = data;
  const over = vsBudget > 0;

  return (
    <Card>
      <CardLabel icon={CalendarClock}>Bill Prediction</CardLabel>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[34px] font-semibold leading-none tracking-tight text-[#111827] tabular-nums">
          ₹{projectedCost.toLocaleString('en-IN')}
        </span>
        <span className="text-sm font-medium text-gray-400">projected</span>
      </div>
      <p className="mt-2 text-[13px] text-gray-500">
        {projectedKwh} kWh estimated by cycle end · {daysRemainingInCycle} days left
      </p>
      <div
        className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
          over ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
        }`}
      >
        {over ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        ₹{Math.abs(vsBudget).toLocaleString('en-IN')} {over ? 'over budget' : 'under budget'}
      </div>
    </Card>
  );
}
