// File: src/pages/HistoryPage.jsx
// Deliberately no reset/rollover control here — per the product decision,
// the backend closes out a billing cycle automatically on the Custom
// Billing Date set in Settings, and this page only ever displays what it's
// given. If you're looking for where a "reset" button might go: it
// shouldn't exist on this page at all.
import { useEffect, useState } from 'react';
import { getMonthlyHistory } from '../services/api';
import { MonthSummaryCard } from '../components/history/MonthSummaryCard';

export function HistoryPage() {
  const [months, setMonths] = useState(null);

  useEffect(() => {
    getMonthlyHistory().then(setMonths);
  }, []);

  return (
    <div className="mx-auto max-w-[1180px]">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-[#111827]">History</h1>
        <p className="mt-0.5 text-[13px] text-gray-500">
          Past billing cycles, closed out automatically on your Custom Billing Date from Settings.
        </p>
      </header>

      {!months ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[220px] animate-pulse rounded-2xl border border-[#E5E7EB] bg-gray-50" />
          ))}
        </div>
      ) : months.length === 0 ? (
        <p className="text-[13px] text-gray-400">No completed billing cycles yet — check back after your first rollover.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {months.map((month) => (
            <MonthSummaryCard key={month.id} month={month} />
          ))}
        </div>
      )}
    </div>
  );
}
