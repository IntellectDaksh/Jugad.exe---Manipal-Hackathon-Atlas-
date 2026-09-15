import { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import { useStore } from '@/store';
import { calculateRSI } from '@/lib/rsi';
import { formatCurrency } from '@/lib/format';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function heatColor(factor: number): string {
  // factor < 1 means lean month (lower income), factor > 1 means surplus
  if (factor < 0.7) return 'bg-danger-500 text-white';
  if (factor < 0.85) return 'bg-danger-300 text-danger-900';
  if (factor < 0.95) return 'bg-warning-300 text-warning-900';
  if (factor < 1.05) return 'bg-success-200 text-success-900';
  if (factor < 1.15) return 'bg-success-300 text-success-900';
  return 'bg-success-500 text-white';
}

export function SeasonalHeatmap() {
  const { borrowers } = useStore();

  const heatmapData = useMemo(() => {
    return borrowers.map(b => {
      const rsi = calculateRSI(b);
      return {
        borrower: b,
        rsi,
        seasonal: b.seasonalProfile.map((factor, monthIdx) => ({
          monthIdx,
          factor,
          projectedIncome: b.monthlyIncome * factor,
        })),
      };
    });
  }, [borrowers]);

  const monthlyTotals = useMemo(() => {
    const totals = new Array(12).fill(0);
    for (const entry of heatmapData) {
      for (const m of entry.seasonal) {
        totals[m.monthIdx] += m.projectedIncome;
      }
    }
    return totals;
  }, [heatmapData]);

  const leanMonths = useMemo(() => {
    const avg = monthlyTotals.reduce((a, c) => a + c, 0) / 12;
    return monthLabels.map((label, i) => ({
      label,
      total: monthlyTotals[i],
      ratio: avg > 0 ? monthlyTotals[i] / avg : 1,
      isLean: monthlyTotals[i] < avg * 0.9,
    }));
  }, [monthlyTotals]);

  return (
    <div className="space-y-5">
      {/* Portfolio monthly income trend */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={18} className="text-primary-500" />
          <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Portfolio Monthly Income Trend</h3>
        </div>
        <div className="flex items-end gap-1.5 h-32">
          {leanMonths.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-t transition-all ${m.isLean ? 'bg-danger-400' : 'bg-primary-400'}`}
                  style={{ height: `${Math.max(10, (m.total / Math.max(...monthlyTotals)) * 100)}%` }}
                  title={`${m.label}: ${formatCurrency(m.total)}`}
                />
              </div>
              <span className={`text-[10px] font-medium ${m.isLean ? 'text-danger-600 dark:text-danger-400' : 'text-ink-500'}`}>{m.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[10px] text-ink-500 dark:text-ink-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-danger-400" /> Lean month (&lt;90% avg)</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-primary-400" /> Normal/Surplus</span>
        </div>
      </div>

      {/* Per-borrower heatmap */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-200 dark:border-ink-800">
          <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Per-Borrower Seasonal Income Heatmap</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">Each cell shows projected income as a fraction of the borrower's monthly average</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950/50">
                <th className="table-header text-left px-4 py-3 sticky left-0 bg-ink-50 dark:bg-ink-950/50 z-10">Borrower</th>
                {monthLabels.map(m => (
                  <th key={m} className="table-header text-center px-2 py-3">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {heatmapData.map(({ borrower, rsi }) => (
                <tr key={borrower.id} className="hover:bg-ink-50 dark:hover:bg-ink-800/30">
                  <td className="px-4 py-2.5 sticky left-0 bg-white dark:bg-ink-900 z-10">
                    <p className="text-sm font-semibold text-ink-900 dark:text-ink-100 truncate max-w-[160px]">{borrower.borrowerName}</p>
                    <p className="text-[10px] text-ink-500">{rsi.tier} · RSI {rsi.score}</p>
                  </td>
                  {borrower.seasonalProfile.map((factor, i) => (
                    <td key={i} className="px-1 py-1.5 text-center">
                      <div
                        className={`w-12 h-9 rounded-md flex flex-col items-center justify-center text-[10px] font-bold ${heatColor(factor)}`}
                        title={`${monthLabels[i]}: ${formatCurrency(borrower.monthlyIncome * factor)} (${(factor * 100).toFixed(0)}% of avg)`}
                      >
                        {(factor * 100).toFixed(0)}%
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lean months summary */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 mb-3">Lean Month Analysis</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {leanMonths.filter(m => m.isLean).map((m, i) => (
            <div key={i} className="bg-danger-50 dark:bg-danger-950/30 rounded-lg p-3 border border-danger-200 dark:border-danger-900">
              <p className="text-sm font-bold text-danger-700 dark:text-danger-400">{m.label}</p>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">{formatCurrency(m.total, true)}</p>
              <p className="text-[10px] text-danger-600 dark:text-danger-400 mt-0.5">{(m.ratio * 100).toFixed(0)}% of avg</p>
            </div>
          ))}
          {leanMonths.filter(m => m.isLean).length === 0 && (
            <p className="col-span-full text-sm text-ink-500 dark:text-ink-400 text-center py-4">No lean months detected across the portfolio.</p>
          )}
        </div>
      </div>
    </div>
  );
}
