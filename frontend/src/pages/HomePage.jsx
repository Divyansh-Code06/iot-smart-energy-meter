// File: src/pages/HomePage.jsx
import { EnergyCard } from '../components/dashboard/EnergyCard';
import { BudgetCard } from '../components/dashboard/BudgetCard';
import { BillPredictionCard } from '../components/dashboard/BillPredictionCard';
import { EfficiencyScoreCard } from '../components/dashboard/EfficiencyScoreCard';
import { PowerUsageCard } from '../components/dashboard/PowerUsageCard';
import { SocketControlsCard } from '../components/dashboard/SocketControlsCard';
import { AISummaryCard } from '../components/dashboard/AISummaryCard';
import { useHomeDashboardData } from '../hooks/useHomeDashboardData';

export function HomePage() {
  const { energy, sockets, aiSummary, billPrediction, efficiencyScore, billingDate, loading, toggleSocket } =
    useHomeDashboardData();

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {loading || !energy ? (
          <>
            <div className="h-[132px] animate-pulse rounded-2xl border border-[#E5E7EB] bg-gray-50" />
            <div className="h-[132px] animate-pulse rounded-2xl border border-[#E5E7EB] bg-gray-50" />
          </>
        ) : (
          <>
            <EnergyCard kwh={energy.totalKwh} tariff={energy.tariffPerUnit} />
            <BudgetCard spent={energy.budgetSpent} limit={energy.budgetLimit} billingDate={billingDate} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <BillPredictionCard data={billPrediction} />
        <EfficiencyScoreCard data={efficiencyScore} />
      </div>

      <PowerUsageCard />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <SocketControlsCard sockets={sockets} onToggle={toggleSocket} />
        <AISummaryCard summary={aiSummary} />
      </div>
    </div>
  );
}
