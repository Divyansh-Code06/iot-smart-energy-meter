// File: src/pages/SettingsPage.jsx
import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Check } from 'lucide-react';
import { Card, CardLabel } from '../components/ui/Card';
import { getSettings, updateSettings } from '../services/api';
import { ordinal } from '../utils/format';

const BILLING_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

export function SettingsPage() {
  const [form, setForm] = useState({ tariffPerUnit: '', monthlyBudgetGoal: '', billingDate: '1' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then((data) => {
      setForm({
        tariffPerUnit: String(data.tariffPerUnit),
        monthlyBudgetGoal: String(data.monthlyBudgetGoal),
        billingDate: String(data.billingDate),
      });
      setLoading(false);
    });
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await updateSettings({
      tariffPerUnit: Number(form.tariffPerUnit),
      monthlyBudgetGoal: Number(form.monthlyBudgetGoal),
      billingDate: Number(form.billingDate),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-[#111827]">Settings</h1>
        <p className="mt-0.5 text-[13px] text-gray-500">
          Tariff, budget, and billing date drive the cost figures on Home and the monthly rollovers in History.
        </p>
      </header>

      <Card className="max-w-md">
        <CardLabel icon={SettingsIcon}>Billing</CardLabel>

        {loading ? (
          <div className="space-y-3">
            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-50" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-50" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-50" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="tariff" className="mb-1.5 block text-[13px] font-medium text-gray-600">
                Electricity tariff (₹ per kWh unit)
              </label>
              <div className="flex items-center rounded-lg border border-[#E5E7EB] px-3">
                <span className="text-sm text-gray-400">₹</span>
                <input
                  id="tariff"
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.tariffPerUnit}
                  onChange={(e) => handleChange('tariffPerUnit', e.target.value)}
                  className="w-full border-0 bg-transparent py-2.5 pl-1.5 text-[14px] text-[#111827] outline-none"
                  placeholder="8.0"
                />
                <span className="text-xs text-gray-400">/ kWh</span>
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="mb-1.5 block text-[13px] font-medium text-gray-600">
                Monthly budget goal (₹)
              </label>
              <div className="flex items-center rounded-lg border border-[#E5E7EB] px-3">
                <span className="text-sm text-gray-400">₹</span>
                <input
                  id="budget"
                  type="number"
                  step="50"
                  min="0"
                  value={form.monthlyBudgetGoal}
                  onChange={(e) => handleChange('monthlyBudgetGoal', e.target.value)}
                  className="w-full border-0 bg-transparent py-2.5 pl-1.5 text-[14px] text-[#111827] outline-none"
                  placeholder="5000"
                />
              </div>
              <p className="mt-1.5 text-[12px] text-gray-400">
                How much you want to spend at most this month — drives the progress ring on Home.
              </p>
            </div>

            <div>
              <label htmlFor="billingDate" className="mb-1.5 block text-[13px] font-medium text-gray-600">
                Custom billing date
              </label>
              <select
                id="billingDate"
                value={form.billingDate}
                onChange={(e) => handleChange('billingDate', e.target.value)}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-[14px] text-[#111827] outline-none focus:border-emerald-400"
              >
                {BILLING_DAYS.map((day) => (
                  <option key={day} value={day}>
                    {ordinal(day)} of the month
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[12px] text-gray-400">
                Your billing cycle resets on this day. Capped at the 28th so it's valid in every month, including
                February. The backend uses this to roll each cycle into History automatically — there's no manual
                reset.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
            >
              {saved ? <Check className="h-4 w-4" /> : null}
              {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
