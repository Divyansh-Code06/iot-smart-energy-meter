// File: src/components/history/MonthSummaryCard.jsx
import { Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';

export function MonthSummaryCard({ month }) {
  const { label, totalKwh, totalCost, aiSummary } = month;

  return (
    <Card>
      <h3 className="mb-3 text-[14px] font-semibold text-[#111827]">{label}</h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-medium text-gray-400">Total Energy</p>
          <p className="mt-0.5 text-[20px] font-semibold tracking-tight text-[#111827] tabular-nums">
            {totalKwh} <span className="text-xs font-medium text-gray-400">kWh</span>
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-gray-400">Total Cost</p>
          <p className="mt-0.5 text-[20px] font-semibold tracking-tight text-[#111827] tabular-nums">
            ₹{totalCost.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {aiSummary && (
        <div className="mt-3 rounded-lg bg-emerald-50/70 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-[11px] font-semibold text-emerald-700">AI Summary</span>
          </div>
          <p className="text-[12.5px] leading-relaxed text-emerald-900">{aiSummary.summary}</p>
          {aiSummary.tip && <p className="mt-1.5 text-[12px] font-medium text-emerald-800">Tip: {aiSummary.tip}</p>}
        </div>
      )}
    </Card>
  );
}
