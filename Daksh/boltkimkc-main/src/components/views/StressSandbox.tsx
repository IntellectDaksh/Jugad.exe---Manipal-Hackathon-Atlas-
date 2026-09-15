import { useState, useMemo } from 'react';
import { FlaskConical, TrendingDown, Zap, RotateCcw } from 'lucide-react';
import { useStore } from '@/store';
import { calculateRSI, projectSixMonths, freeOperatingFlow, dscr } from '@/lib/rsi';
import { formatCurrency, formatNumber } from '@/lib/format';
import { RiskBadge } from '@/components/ui/RiskBadge';
import type { Borrower, StressShock, RiskTier } from '@/types';

const tierBarColor: Record<RiskTier, string> = {
  Critical: 'bg-danger-500',
  Watchlist: 'bg-warning-500',
  Performing: 'bg-success-500',
};

export function StressSandbox() {
  const { borrowers } = useStore();
  const [selectedId, setSelectedId] = useState<string>(borrowers[0]?.id ?? '');
  const [revenueVar, setRevenueVar] = useState(-20);
  const [unplannedOutflow, setUnplannedOutflow] = useState(2000);

  const selectedBorrower = borrowers.find(b => b.id === selectedId) ?? borrowers[0];

  const shock: StressShock = useMemo(() => ({
    revenueVariance: revenueVar,
    unplannedOutflow,
  }), [revenueVar, unplannedOutflow]);

  const analysis = useMemo(() => {
    if (!selectedBorrower) return null;
    const baseline = calculateRSI(selectedBorrower);
    const stressed = calculateRSI(selectedBorrower, shock);
    const baselineProj = projectSixMonths(selectedBorrower);
    const stressedProj = projectSixMonths(selectedBorrower, shock);
    return { baseline, stressed, baselineProj, stressedProj };
  }, [selectedBorrower, shock]);

  if (!selectedBorrower || !analysis) {
    return <div className="card p-8 text-center text-ink-500">No borrowers available. Underwrite a borrower first.</div>;
  }

  const { baseline, stressed, baselineProj, stressedProj } = analysis;
  const baselineFOF = freeOperatingFlow(selectedBorrower);
  const stressedFOF = freeOperatingFlow(selectedBorrower, shock);
  const baselineDSCR = dscr(selectedBorrower);
  const stressedDSCR = dscr(selectedBorrower, shock);

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Borrower selector */}
        <div className="card p-5">
          <label className="label-text">Select Borrower</label>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="input-field cursor-pointer"
          >
            {borrowers.map(b => (
              <option key={b.id} value={b.id}>{b.borrowerName} — {b.tradeCategory}</option>
            ))}
          </select>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Current RSI</span>
              <span className="stat-value font-bold">{baseline.score}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Monthly Income</span>
              <span className="stat-value">{formatCurrency(selectedBorrower.monthlyIncome)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Monthly EMI</span>
              <span className="stat-value">{formatCurrency(selectedBorrower.emi)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">DSCR</span>
              <span className="stat-value">{formatNumber(baselineDSCR, 2)}</span>
            </div>
          </div>
        </div>

        {/* Shock sliders */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 flex items-center gap-2">
              <Zap size={16} className="text-warning-500" /> Shock Parameters
            </h3>
            <button
              onClick={() => { setRevenueVar(0); setUnplannedOutflow(0); }}
              className="btn-ghost text-xs"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-ink-700 dark:text-ink-200 flex items-center gap-1.5">
                  <TrendingDown size={15} className="text-danger-500" /> Revenue Variance Shock
                </label>
                <span className={`text-sm font-bold stat-value ${revenueVar < 0 ? 'text-danger-600 dark:text-danger-400' : 'text-success-600 dark:text-success-400'}`}>
                  {revenueVar > 0 ? '+' : ''}{revenueVar}%
                </span>
              </div>
              <input
                type="range"
                min={-50}
                max={20}
                step={5}
                value={revenueVar}
                onChange={e => setRevenueVar(Number(e.target.value))}
                className="w-full h-2 bg-ink-200 dark:bg-ink-700 rounded-full appearance-none cursor-pointer accent-danger-500"
              />
              <div className="flex justify-between text-[10px] text-ink-400 mt-1">
                <span>−50%</span>
                <span>0%</span>
                <span>+20%</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-ink-700 dark:text-ink-200 flex items-center gap-1.5">
                  <Zap size={15} className="text-warning-500" /> Unplanned Outflow Shock
                </label>
                <span className="text-sm font-bold stat-value text-warning-600 dark:text-warning-400">
                  {formatCurrency(unplannedOutflow)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10000}
                step={500}
                value={unplannedOutflow}
                onChange={e => setUnplannedOutflow(Number(e.target.value))}
                className="w-full h-2 bg-ink-200 dark:bg-ink-700 rounded-full appearance-none cursor-pointer accent-warning-500"
              />
              <div className="flex justify-between text-[10px] text-ink-400 mt-1">
                <span>$0</span>
                <span>$5K</span>
                <span>$10K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Baseline (No Shock)</h3>
            <RiskBadge tier={baseline.tier} score={baseline.score} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-ink-50 dark:bg-ink-800/50 rounded-lg p-3">
              <p className="text-[10px] text-ink-500 uppercase tracking-wide">Free Operating Flow</p>
              <p className="stat-value font-bold text-lg mt-1">{formatCurrency(baselineFOF)}</p>
            </div>
            <div className="bg-ink-50 dark:bg-ink-800/50 rounded-lg p-3">
              <p className="text-[10px] text-ink-500 uppercase tracking-wide">DSCR</p>
              <p className="stat-value font-bold text-lg mt-1">{formatNumber(baselineDSCR, 2)}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] text-ink-500 uppercase tracking-wide mb-2">6-Month RSI Projection</p>
            <div className="flex items-end gap-2 h-28">
              {baselineProj.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold stat-value">{m.projectedRSI}</span>
                  <div className="w-full flex-1 flex items-end">
                    <div className={`w-full rounded-t ${tierBarColor[m.projectedTier]}`} style={{ height: `${m.projectedRSI}%` }} />
                  </div>
                  <span className="text-[10px] text-ink-400">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5 border-2 border-warning-200 dark:border-warning-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 flex items-center gap-2">
              <FlaskConical size={16} className="text-warning-500" /> Stressed (With Shock)
            </h3>
            <RiskBadge tier={stressed.tier} score={stressed.score} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-ink-50 dark:bg-ink-800/50 rounded-lg p-3">
              <p className="text-[10px] text-ink-500 uppercase tracking-wide">Free Operating Flow</p>
              <p className={`stat-value font-bold text-lg mt-1 ${stressedFOF < 0 ? 'text-danger-600 dark:text-danger-400' : ''}`}>{formatCurrency(stressedFOF)}</p>
            </div>
            <div className="bg-ink-50 dark:bg-ink-800/50 rounded-lg p-3">
              <p className="text-[10px] text-ink-500 uppercase tracking-wide">DSCR</p>
              <p className={`stat-value font-bold text-lg mt-1 ${stressedDSCR < 1 ? 'text-danger-600 dark:text-danger-400' : ''}`}>{formatNumber(stressedDSCR, 2)}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] text-ink-500 uppercase tracking-wide mb-2">6-Month RSI Projection</p>
            <div className="flex items-end gap-2 h-28">
              {stressedProj.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold stat-value">{m.projectedRSI}</span>
                  <div className="w-full flex-1 flex items-end">
                    <div className={`w-full rounded-t ${tierBarColor[m.projectedTier]}`} style={{ height: `${m.projectedRSI}%` }} />
                  </div>
                  <span className="text-[10px] text-ink-400">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delta summary */}
      <div className="card p-5 bg-ink-50/50 dark:bg-ink-950/30">
        <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 mb-4">Stress Impact Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] text-ink-500 uppercase tracking-wide">RSI Change</p>
            <p className={`text-xl font-bold stat-value mt-1 ${stressed.score > baseline.score ? 'text-danger-600 dark:text-danger-400' : 'text-success-600 dark:text-success-400'}`}>
              {stressed.score > baseline.score ? '+' : ''}{stressed.score - baseline.score} pts
            </p>
          </div>
          <div>
            <p className="text-[10px] text-ink-500 uppercase tracking-wide">FOF Change</p>
            <p className={`text-xl font-bold stat-value mt-1 ${stressedFOF < baselineFOF ? 'text-danger-600 dark:text-danger-400' : 'text-success-600 dark:text-success-400'}`}>
              {formatCurrency(stressedFOF - baselineFOF)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-ink-500 uppercase tracking-wide">DSCR Change</p>
            <p className={`text-xl font-bold stat-value mt-1 ${stressedDSCR < baselineDSCR ? 'text-danger-600 dark:text-danger-400' : 'text-success-600 dark:text-success-400'}`}>
              {stressedDSCR > baselineDSCR ? '+' : ''}{formatNumber(stressedDSCR - baselineDSCR, 2)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-ink-500 uppercase tracking-wide">Tier Shift</p>
            <div className="mt-1 flex items-center gap-2">
              <RiskBadge tier={baseline.tier} size="sm" />
              <span className="text-ink-400">→</span>
              <RiskBadge tier={stressed.tier} size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
