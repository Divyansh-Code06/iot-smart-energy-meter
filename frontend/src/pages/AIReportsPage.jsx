// File: src/pages/AIReportsPage.jsx
// Deliberately minimal — full weekly/predictive reports are the "later"
// feature discussed alongside this build. This page just proves the wiring
// (same getAiSummary() call as the Home page card) and gives it a home.
import { useEffect, useState } from 'react';
import { Sparkles, FileDown } from 'lucide-react';
import { Card, CardLabel } from '../components/ui/Card';
import { getAiSummary } from '../services/api';

export function AIReportsPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getAiSummary().then(setSummary);
  }, []);

  return (
    <div className="mx-auto max-w-[1180px]">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-[#111827]">AI Reports</h1>
        <p className="mt-0.5 text-[13px] text-gray-500">
          Gemini-generated summaries of your usage, computed on the backend and cached here.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <CardLabel icon={Sparkles}>Latest Summary</CardLabel>
          {!summary ? (
            <div className="h-16 w-full animate-pulse rounded-lg bg-gray-50" />
          ) : (
            <>
              <p className="text-[13.5px] leading-relaxed text-[#111827]">{summary.summary}</p>
              <div className="mt-3 rounded-lg bg-emerald-50/70 p-3">
                <p className="text-[12.5px] font-medium text-emerald-800">Tip: {summary.tip}</p>
              </div>
            </>
          )}
        </Card>

        <Card className="flex flex-col items-start justify-center gap-2 border-dashed text-gray-400">
          <FileDown className="h-5 w-5" />
          <p className="text-[13px] font-medium text-gray-500">Downloadable predictive reports</p>
          <p className="text-[12.5px] leading-relaxed">
            Planned for a later phase — a PDF/CSV export with a month-end cost forecast, generated on the
            backend once historical data has accumulated in InfluxDB.
          </p>
        </Card>
      </div>
    </div>
  );
}
