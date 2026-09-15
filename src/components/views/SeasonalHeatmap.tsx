import { useMemo, useState } from 'react';
import { CalendarDays, Info, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useStore } from '@/store';
import { calculateRSI } from '@/lib/rsi';
import { formatCurrency } from '@/lib/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [hoveredCell, setHoveredCell] = useState<{ borrower: string; month: string; factor: number; income: number } | null>(null);

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

  const handleExport = async () => {
    const element = document.getElementById('heatmap-container');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, { backgroundColor: '#18181b' });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `risk_heatmap_${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export heatmap', err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Portfolio monthly income trend */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={18} className="text-primary-500" />
          <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Portfolio Monthly Income Trend</h3>
        </div>
        <div className="h-48 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leanMonths} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="label" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#71717a' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#71717a' }}
                tickFormatter={(value) => formatCurrency(value, true).replace('₹', '')}
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fafafa' }}
                formatter={(value: number) => [formatCurrency(value), 'Income']}
                labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]} animationDuration={1000}>
                {leanMonths.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isLean ? '#f87171' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center gap-4 text-[10px] text-ink-500 dark:text-ink-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-danger-400" /> Lean month (&lt;90% avg)</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-primary-400" /> Normal/Surplus</span>
        </div>
      </div>

      {/* Per-borrower heatmap */}
      <div className="card overflow-hidden" id="heatmap-container">
        <div className="px-5 py-4 border-b border-ink-200 dark:border-ink-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Dynamic Risk Heatmap Calendar</h3>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">Projected income fluctuations indicating potential repayment stress</p>
          </div>
          <div className="flex gap-3">
            {hoveredCell && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="hidden lg:flex items-center gap-3 bg-ink-900 dark:bg-ink-50 text-white dark:text-ink-900 px-4 py-2 rounded-lg text-xs"
                >
                  <Info size={14} className="text-primary-400" />
                  <div>
                    <span className="font-semibold">{hoveredCell.borrower}</span> · {hoveredCell.month}
                    <span className="mx-2 font-bold stat-value">{formatCurrency(hoveredCell.income)}</span>
                    <span className={hoveredCell.factor < 1 ? 'text-danger-400 font-bold' : 'text-success-400 font-bold'}>
                      ({(hoveredCell.factor * 100).toFixed(0)}% avg)
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
            <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-xs py-1.5" title="Export PNG">
              <Download size={14} /> <span className="hidden sm:inline">Export PNG</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-sm border-separate border-spacing-y-1 px-4">
            <thead>
              <tr>
                <th className="table-header text-left px-2 py-3 sticky left-0 z-10 bg-white dark:bg-ink-950">Borrower</th>
                {monthLabels.map(m => (
                  <th key={m} className="table-header text-center px-1 py-3 w-12">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map(({ borrower, rsi }) => (
                <tr key={borrower.id} className="group">
                  <td className="px-2 py-2 sticky left-0 z-10 bg-white dark:bg-ink-950 group-hover:bg-ink-50 dark:group-hover:bg-ink-900 transition-colors rounded-l-lg">
                    <p className="text-sm font-semibold text-ink-900 dark:text-ink-100 truncate max-w-[140px]">{borrower.borrowerName}</p>
                    <p className="text-[10px] text-ink-500">{rsi.tier} · RSI {rsi.score}</p>
                  </td>
                  {borrower.seasonalProfile.map((factor, i) => (
                    <td key={i} className="px-1 py-1">
                      <motion.div
                        whileHover={{ scale: 1.15, zIndex: 20 }}
                        onHoverStart={() => setHoveredCell({ borrower: borrower.borrowerName, month: monthLabels[i], factor, income: borrower.monthlyIncome * factor })}
                        onHoverEnd={() => setHoveredCell(null)}
                        className={`w-full h-10 rounded-lg flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors shadow-sm ${heatColor(factor)}`}
                      >
                        {(factor * 100).toFixed(0)}%
                      </motion.div>
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
