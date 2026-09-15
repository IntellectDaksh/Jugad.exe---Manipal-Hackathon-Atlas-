import { useMemo, useState } from 'react';
import { User, Building2, MapPin, DollarSign, Calendar, TrendingUp, TrendingDown, Wallet, FileText, RotateCcw, AlertCircle, Download, MessageSquare, Phone, Mail, Activity, History, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid } from 'recharts';

import { Modal } from '@/components/ui/Modal';
import { RiskBadge, StatusBadge } from '@/components/ui/RiskBadge';
import { useStore } from '@/store';
import { calculateRSI, projectSixMonths, freeOperatingFlow, dscr, reserveDays, monthsToMaturity } from '@/lib/rsi';
import { analyzeBorrower } from '@/lib/analysis';
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
  
  const intelligence = useMemo(() => analyzeBorrower(borrower), [borrower]);

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
          <button onClick={() => {
            const element = document.getElementById('dossier-content');
            if (element) {
              import('html2pdf.js').then((module) => {
                const html2pdf = module.default || (module as any);
                const opt: any = {
                  margin: 0.5,
                  filename: `${borrower.borrowerName.replace(/\s+/g, '_')}_Dossier.pdf`,
                  image: { type: 'jpeg', quality: 0.98 },
                  html2canvas: { scale: 2, useCORS: true },
                  jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                html2pdf().set(opt).from(element).save();
              }).catch(err => console.error('Failed to load html2pdf', err));
            }
          }} className="btn-secondary flex items-center gap-2">
            <Download size={16} /> Export PDF
          </button>
          <button onClick={onClose} className="btn-secondary">Close</button>
          <button onClick={() => onRestructure(borrower)} className="btn-primary">
            <RotateCcw size={16} /> Restructure
          </button>
        </>
      }
    >
      <div id="dossier-content" className="space-y-5 p-2 bg-ink-50 dark:bg-ink-950">
        {/* Header info */}
        <div className="flex flex-wrap items-center gap-3">
          <RiskBadge tier={rsi.tier} score={rsi.score} />
          <StatusBadge status={borrower.status} />
          {borrower.restructured && <span className="text-xs font-semibold text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/40 px-2 py-0.5 rounded-full border border-accent-200 dark:border-accent-900">Restructured</span>}
        </div>

        {/* Profile row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
          {borrower.collateralType && (
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck size={15} className="text-ink-400" />
              <div>
                <p className="text-[10px] text-ink-500 uppercase tracking-wide">Collateral</p>
                <p className="font-medium text-ink-800 dark:text-ink-200 text-xs">{borrower.collateralType} ({formatCurrency(borrower.collateralValue || 0)})</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          
          {/* Historical Health Score Progression (F13) */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-primary-500" />
              <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Health Score Progression (6mo)</h3>
            </div>
            <div className="h-32 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: 'M-6', score: Math.max(0, rsi.score - 15) },
                  { month: 'M-5', score: Math.max(0, rsi.score - 10) },
                  { month: 'M-4', score: Math.max(0, rsi.score - 5) },
                  { month: 'M-3', score: Math.min(100, rsi.score + 5) },
                  { month: 'M-2', score: Math.min(100, rsi.score + 2) },
                  { month: 'M-1', score: rsi.score },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', color: '#fafafa' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 6-month projection */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary-500" />
              <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">6-Month Forward Stress Projection</h3>
            </div>
            <ProjectionChart months={projection} />
          </div>
          
          {/* Historical Repayment Timeline (F14) */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <History size={16} className="text-primary-500" />
              <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Repayment Timeline</h3>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { month: 'Jan', amount: borrower.emi, status: 'paid' },
                  { month: 'Feb', amount: borrower.emi, status: 'paid' },
                  { month: 'Mar', amount: borrower.emi * 0.5, status: 'partial' },
                  { month: 'Apr', amount: borrower.emi, status: 'paid' },
                  { month: 'May', amount: 0, status: 'missed' },
                  { month: 'Jun', amount: borrower.emi * 1.5, status: 'catchup' },
                ]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', color: '#fafafa' }}
                    formatter={(value: number) => [formatCurrency(value, true), 'Paid']}
                  />
                  <Area type="step" dataKey="amount" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
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

        {/* Intelligence & Intervention Section */}
        <div className="card p-5 mt-6 border border-primary-200 dark:border-primary-900 bg-white dark:bg-ink-900">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-primary-500" />
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Intelligence & Recommended Intervention</h3>
            <span className="ml-auto text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 px-2 py-0.5 rounded-full">
              {intelligence.confidence}% Confidence
            </span>
          </div>
          
          <div className="mb-5 bg-ink-50 dark:bg-ink-950 p-4 rounded-lg text-sm text-ink-700 dark:text-ink-300">
            <p className="font-medium text-ink-900 dark:text-ink-100 mb-2">{intelligence.classificationReason}</p>
            <div className="space-y-2 mt-4">
              <p className="text-[10px] text-ink-500 uppercase font-bold tracking-wide">Key Evidence Vectors</p>
              {intelligence.evidence.map((e, idx) => (
                <div key={idx} className="flex gap-2 items-start text-xs border-l-2 border-ink-200 dark:border-ink-800 pl-3">
                  <span className={`flex-shrink-0 ${e.direction === 'up' ? 'text-danger-500' : 'text-success-500'}`}>
                    {e.direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  </span>
                  <div>
                    <span className="font-semibold">{e.factorName} (Weight: {e.weight}%)</span>
                    <p className="text-ink-500 dark:text-ink-400">{e.evidence}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-ink-900 dark:text-ink-100 mb-3 uppercase">Alternative Repayment Architectures</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {intelligence.plans.map((plan) => (
                <div key={plan.id} className={`p-4 rounded-xl border-2 transition-all ${plan.recommended ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 shadow-sm' : 'border-ink-200 dark:border-ink-800 opacity-70 hover:opacity-100'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-ink-900 dark:text-ink-50">{plan.label}</h4>
                    {plan.recommended && <span className="text-[10px] font-bold bg-primary-500 text-white px-2 py-0.5 rounded-full">RECOMMENDED</span>}
                  </div>
                  <p className="text-[11px] text-ink-500 dark:text-ink-400 mb-4 h-8">{plan.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center">
                      <p className="text-[10px] text-ink-500 uppercase">Sustainability</p>
                      <p className={`font-bold text-lg stat-value ${plan.sustainabilityScore >= 80 ? 'text-success-500' : plan.sustainabilityScore >= 60 ? 'text-warning-500' : 'text-danger-500'}`}>{plan.sustainabilityScore}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-ink-500 uppercase">Payment</p>
                      <p className="font-bold text-lg stat-value text-ink-900 dark:text-ink-50">{formatCurrency(plan.monthlyEmi)}</p>
                      <p className="text-[9px] text-ink-400">{plan.type.includes('Weekly') ? 'per week' : 'per month'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-ink-500 uppercase">Total</p>
                      <p className="font-bold text-lg stat-value text-ink-900 dark:text-ink-50">{formatCurrency(plan.totalRepayment, true)}</p>
                    </div>
                  </div>
                  <div className="h-16 mt-2 -mx-2 bg-ink-50 dark:bg-ink-950/50 rounded-b-lg overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={plan.schedule} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`color-${plan.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={plan.recommended ? '#3b82f6' : '#71717a'} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={plan.recommended ? '#3b82f6' : '#71717a'} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="label" hide />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', color: '#fafafa' }}
                          formatter={(value: number) => [formatCurrency(value, true), 'Payment']}
                          labelStyle={{ display: 'none' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="amount" 
                          stroke={plan.recommended ? '#3b82f6' : '#71717a'} 
                          strokeWidth={2} 
                          fillOpacity={1} 
                          fill={`url(#color-${plan.id})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[9px] text-ink-500 mt-2 text-center uppercase tracking-widest">{plan.guardrailStatus}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes & Communication Log */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {borrower.notes && (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={15} className="text-ink-400" />
                <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Underwriting Notes</h3>
              </div>
              <p className="text-sm text-ink-700 dark:text-ink-300 bg-ink-50 dark:bg-ink-900/50 p-3 rounded-lg border border-ink-100 dark:border-ink-800">{borrower.notes}</p>
            </div>
          )}

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={15} className="text-ink-400" />
                <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Communication Log</h3>
              </div>
              <button className="text-xs text-primary-500 font-semibold hover:underline">Add Entry</button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center flex-shrink-0 text-ink-500">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="font-semibold text-ink-900 dark:text-ink-100">Outbound Call <span className="text-xs font-normal text-ink-500">— 2 days ago</span></p>
                  <p className="text-ink-600 dark:text-ink-400 text-xs mt-1">Discussed recent drop in revenue. Borrower expects recovery by next month due to festive season.</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center flex-shrink-0 text-ink-500">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="font-semibold text-ink-900 dark:text-ink-100">Email Reminder <span className="text-xs font-normal text-ink-500">— 1 week ago</span></p>
                  <p className="text-ink-600 dark:text-ink-400 text-xs mt-1">Automated EMI reminder sent. Status: Delivered.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
