import { useMemo } from 'react';
import { User, Building2, MapPin, DollarSign, Calendar, TrendingUp, TrendingDown, Wallet, FileText, RotateCcw, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { RiskBadge, StatusBadge } from '@/components/ui/RiskBadge';
import { useStore } from '@/store';
import { calculateRSI, projectSixMonths, reserveDays, monthsToMaturity, freeOperatingFlow, dscr } from '@/lib/rsi';
import { formatCurrency, formatNumber, formatDate } from '@/lib/format';
import type { Borrower, ProjectionMonth, RiskTier } from '@/types';

interface BorrowerDossierProps {
  borrower: Borrower | null;
  onClose: () => void;
  onRestructure: (b: Borrower) => void;
}

const tierBarColor: Record<RiskTier, string> = {
  Critical: 'bg-danger-500',
  Watchlist: 'bg-warning-500',
  Performing: 'bg-success-500',
};

const tierTextColor: Record<RiskTier, string> = {
  Critical: 'text-danger-600 dark:text-danger-400',
  Watchlist: 'text-warning-600 dark:text-warning-400',
  Performing: 'text-success-600 dark:text-success-400',
};

function ProjectionChart({ months }: { months: ProjectionMonth[] }) {
  const maxRSI = 100;
  const width = 100;
  const barWidth = width / months.length;

  return (
    <div>
      <div className="flex items-end gap-2 h-40">
        {months.map((m, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="text-[10px] font-bold stat-value text-ink-700 dark:text-ink-200">{m.projectedRSI}</div>
            <div className="w-full flex-1 flex items-end">
              <div
                className={`w-full rounded-t-md transition-all ${tierBarColor[m.projectedTier]}`}
                style={{ height: `${(m.projectedRSI / maxRSI) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-ink-500 dark:text-ink-400 font-medium">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-ink-500 dark:text-ink-400">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success-500" /> Performing</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning-500" /> Watchlist</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-danger-500" /> Critical</span>
      </div>
    </div>
  );
}

function MetricRow({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800/40">
      <div className="flex items-center gap-2.5">
        <span className="text-ink-400 dark:text-ink-500">{icon}</span>
        <span className="text-sm text-ink-600 dark:text-ink-300">{label}</span>
      </div>
      <div className="text-right">
        <span className="text-sm font-semibold stat-value text-ink-900 dark:text-ink-50">{value}</span>
        {sub && <p className="text-[10px] text-ink-500 dark:text-ink-400">{sub}</p>}
      </div>
    </div>
  );
}

export function BorrowerDossier({ borrower, onClose, onRestructure }: BorrowerDossierProps) {
  const { pools } = useStore();

  const analysis = useMemo(() => {
    if (!borrower) return null;
    const rsi = calculateRSI(borrower);
    const projection = projectSixMonths(borrower);
    const pool = pools.find(p => p.id === borrower.poolId);
    return { rsi, projection, pool };
  }, [borrower, pools]);

  if (!borrower || !analysis) return null;
  const { rsi, projection, pool } = analysis;
  const fof = freeOperatingFlow(borrower);
  const ratio = dscr(borrower);
  const rDays = reserveDays(borrower);
  const matMonths = monthsToMaturity(borrower);

  return (
    <Modal
      open={!!borrower}
      onClose={onClose}
      title={borrower.borrowerName}
      subtitle={`Credit Dossier · ${borrower.id}`}
      icon={<User size={22} />}
      size="xl"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Close</button>
          <button onClick={() => onRestructure(borrower)} className="btn-primary">
            <RotateCcw size={16} /> Restructure
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Header info */}
        <div className="flex flex-wrap items-center gap-3">
          <RiskBadge tier={rsi.tier} score={rsi.score} />
          <StatusBadge status={borrower.status} />
          {borrower.restructured && <span className="text-xs font-semibold text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/40 px-2 py-0.5 rounded-full border border-accent-200 dark:border-accent-900">Restructured</span>}
        </div>

        {/* Profile row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Building2 size={15} className="text-ink-400" />
            <div>
              <p className="text-[10px] text-ink-500 uppercase tracking-wide">Trade</p>
              <p className="font-medium text-ink-800 dark:text-ink-200 text-xs">{borrower.tradeCategory}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={15} className="text-ink-400" />
            <div>
              <p className="text-[10px] text-ink-500 uppercase tracking-wide">Cluster</p>
              <p className="font-medium text-ink-800 dark:text-ink-200 text-xs">{borrower.cluster}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wallet size={15} className="text-ink-400" />
            <div>
              <p className="text-[10px] text-ink-500 uppercase tracking-wide">Pool</p>
              <p className="font-medium text-ink-800 dark:text-ink-200 text-xs truncate">{pool?.title ?? 'Unassigned'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={15} className="text-ink-400" />
            <div>
              <p className="text-[10px] text-ink-500 uppercase tracking-wide">Maturity</p>
              <p className="font-medium text-ink-800 dark:text-ink-200 text-xs">{formatDate(borrower.maturity)} ({matMonths}mo)</p>
            </div>
          </div>
        </div>

        {/* RSI Breakdown */}
        <div className="card p-5 bg-ink-50/50 dark:bg-ink-950/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Risk Stress Index Breakdown</h3>
            <div className="text-right">
              <span className={`text-3xl font-bold stat-value ${tierTextColor[rsi.tier]}`}>{rsi.score}</span>
              <span className="text-sm text-ink-400 ml-1">/ 100</span>
            </div>
          </div>
          <div className="space-y-2">
            {rsi.factors.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-ink-600 dark:text-ink-300 w-36 flex-shrink-0">{f.label}</span>
                <div className="flex-1 h-2 rounded-full bg-ink-200 dark:bg-ink-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${f.impact > 10 ? 'bg-danger-500' : f.impact > 0 ? 'bg-warning-500' : 'bg-success-500'}`}
                    style={{ width: `${Math.min(100, Math.abs(f.impact) * 4)}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold stat-value w-12 text-right ${f.impact > 0 ? 'text-danger-600 dark:text-danger-400' : 'text-success-600 dark:text-success-400'}`}>
                  {f.impact > 0 ? '+' : ''}{f.impact}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">Cash Flow Metrics</h3>
            <MetricRow icon={<TrendingUp size={15} />} label="Monthly Income" value={formatCurrency(borrower.monthlyIncome)} />
            <MetricRow icon={<TrendingDown size={15} />} label="Essential Outflows" value={formatCurrency(borrower.essentialOutflows)} />
            <MetricRow icon={<DollarSign size={15} />} label="Free Operating Flow" value={formatCurrency(fof)} sub={fof >= 0 ? 'Positive' : 'Negative'} />
            <MetricRow icon={<DollarSign size={15} />} label="Monthly EMI" value={formatCurrency(borrower.emi)} />
            <MetricRow icon={<TrendingUp size={15} />} label="DSCR" value={formatNumber(ratio, 2)} sub={ratio >= 1.0 ? 'Above 1.0' : 'Below 1.0 — strain'} />
          </div>
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">Resilience Metrics</h3>
            <MetricRow icon={<Wallet size={15} />} label="Liquid Reserves" value={formatCurrency(borrower.liquidReserves)} />
            <MetricRow icon={<Calendar size={15} />} label="Reserve Days" value={`${formatNumber(Math.round(rDays))} days`} sub={rDays < 30 ? 'Low' : rDays < 60 ? 'Moderate' : 'Healthy'} />
            <MetricRow icon={<DollarSign size={15} />} label="Principal Exposure" value={formatCurrency(borrower.principal)} />
            <MetricRow icon={<Calendar size={15} />} label="Months to Maturity" value={`${matMonths} months`} />
            <MetricRow icon={<TrendingUp size={15} />} label="Leverage Ratio" value={formatNumber(borrower.monthlyIncome > 0 ? borrower.principal / (borrower.monthlyIncome * 12) : 0, 2)} />
          </div>
        </div>

        {/* 6-month projection */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-primary-500" />
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">6-Month Forward Stress Projection</h3>
          </div>
          <ProjectionChart months={projection} />
        </div>

        {/* Restructure terms if applicable */}
        {borrower.restructureTerms && (
          <div className="card p-4 border-l-4 border-l-accent-500">
            <div className="flex items-center gap-2 mb-3">
              <RotateCcw size={15} className="text-accent-500" />
              <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Active Restructure Terms</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div><p className="text-[10px] text-ink-500 uppercase">New EMI</p><p className="font-semibold stat-value">{formatCurrency(borrower.restructureTerms.newEmi)}</p></div>
              <div><p className="text-[10px] text-ink-500 uppercase">Term</p><p className="font-semibold">{borrower.restructureTerms.termMonths} months</p></div>
              <div><p className="text-[10px] text-ink-500 uppercase">Rate</p><p className="font-semibold">{borrower.restructureTerms.interestRate}%</p></div>
              <div><p className="text-[10px] text-ink-500 uppercase">Applied</p><p className="font-semibold text-xs">{formatDate(borrower.restructureTerms.appliedAt)}</p></div>
            </div>
            <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">Reason: {borrower.restructureTerms.reason}</p>
          </div>
        )}

        {/* Notes */}
        {borrower.notes && (
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={15} className="text-ink-400" />
              <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Underwriting Notes</h3>
            </div>
            <p className="text-sm text-ink-700 dark:text-ink-300">{borrower.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
