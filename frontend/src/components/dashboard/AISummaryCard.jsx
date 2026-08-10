// File: src/components/dashboard/AISummaryCard.jsx
import { Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';

export function AISummaryCard({ summary }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-100/60 blur-2xl" />
      <div className="relative mb-3 flex items-center gap-1.5">
        <Sparkles className="h-4 w-4 text-emerald-500" />
        <span className="text-[13px] font-medium text-gray-500">AI Energy Summary</span>
        {summary && (
          <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            {summary.period}
          </span>
        )}
      </div>

      {!summary ? (
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-gray-100" />
          <div className="mt-3 h-10 w-full animate-pulse rounded-lg bg-gray-50" />
        </div>
      ) : (
        <>
          <p className="relative text-[13.5px] leading-relaxed text-[#111827]">{summary.summary}</p>
          <div className="relative mt-3 rounded-lg bg-emerald-50/70 p-3">
            <p className="text-[12.5px] font-medium text-emerald-800">Tip: {summary.tip}</p>
          </div>
        </>
      )}
    </Card>
  );
}
