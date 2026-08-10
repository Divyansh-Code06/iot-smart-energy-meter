// File: src/components/dashboard/EnergyCard.jsx
import { Zap } from 'lucide-react';
import { Card, CardLabel } from '../ui/Card';

export function EnergyCard({ kwh, tariff }) {
  const cost = Math.round(kwh * tariff);
  return (
    <Card>
      <CardLabel icon={Zap}>Total Energy Consumed</CardLabel>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[34px] font-semibold leading-none tracking-tight text-[#111827] tabular-nums">
          {kwh}
        </span>
        <span className="text-sm font-medium text-gray-400">kWh</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[13px] text-gray-500">
        <span>
          ≈ ₹{cost.toLocaleString('en-IN')} at ₹{tariff}/unit
        </span>
      </div>
    </Card>
  );
}
