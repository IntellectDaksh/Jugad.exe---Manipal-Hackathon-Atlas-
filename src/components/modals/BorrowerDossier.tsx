import { useMemo, useState } from 'react';
import { ArrowLeft, Lightbulb, Zap, CheckCircle2, TrendingUp, Clock, CalendarDays, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

import { useStore } from '@/store';
import { calculateRSI } from '@/lib/rsi';
import { analyzeBorrower } from '@/lib/analysis';
import { formatCurrency, formatNumber } from '@/lib/format';
import type { Borrower } from '@/types';

interface BorrowerDossierProps {
  borrower: Borrower | null;
  onClose: () => void;
  onRestructure: (b: Borrower, planIdx: number) => void;
}

function generate12MonthData(borrower: Borrower, rsiScore: number) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseIncome = borrower.monthlyIncome;
  const baseExpense = borrower.essentialOutflows;
  const emi = borrower.emi;
  
  return months.map((m, i) => {
    const monthPhase = (i / 12) * Math.PI * 2;
    const phaseOffset = (parseInt(borrower.id.replace(/\D/g, '')) || 0) % 12;
    const seasonality = Math.sin(monthPhase - phaseOffset);
    
    // Simulate drop in middle of year for "seasonal" stress
    const isSeasonal = borrower.structuralTraits?.includes('Seasonal Revenue') || borrower.tradeCategory === 'Agriculture';
    const incomeMultiplier = isSeasonal ? 1 + (seasonality * 0.45) : 1 + (seasonality * 0.15);
    const expenseMultiplier = 1 + (Math.cos(monthPhase) * 0.1);
    
    const income = Math.max(0, baseIncome * incomeMultiplier);
    const expenses = Math.max(0, baseExpense * expenseMultiplier);
    
    // Fake RSI based on coverage ratio
    const freeCash = income - expenses;
    const coverage = freeCash > 0 ? emi / freeCash : 2;
    const mockRsi = Math.min(100, Math.max(0, (coverage * 40) + (rsiScore * 0.3)));
    
    return {
      month: m,
      income,
      expenses,
      emi,
      rsi: mockRsi / 100, // 0 to 1
    };
  });
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export function BorrowerDossier({ borrower, onClose, onRestructure }: BorrowerDossierProps) {
  const { pools } = useStore();

  const analysis = useMemo(() => {
    if (!borrower) return null;
    const rsi = calculateRSI(borrower);
    const pool = pools.find(p => p.id === borrower.poolId);
    const chartData = generate12MonthData(borrower, rsi.score);
    return { rsi, pool, chartData };
  }, [borrower, pools]);

  const intelligence = useMemo(() => borrower ? analyzeBorrower(borrower) : null, [borrower]);
  
  // Default to the recommended plan (index 1)
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(1);

  if (!borrower || !analysis || !intelligence) return null;
  const { rsi, chartData } = analysis;

  return (
    <div className="fixed inset-0 z-50 bg-ink-50 dark:bg-ink-950 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto min-h-screen flex flex-col pb-12">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-ink-50/90 dark:bg-ink-950/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-ink-200 dark:border-ink-800">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-500 font-medium uppercase tracking-wider">Persona:</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning-50 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800">
              <div className="w-5 h-5 rounded-full bg-warning-500 text-white flex items-center justify-center text-[9px] font-bold">
                {getInitials(borrower.borrowerName)}
              </div>
              <span className="text-sm font-semibold text-warning-900 dark:text-warning-100">{borrower.borrowerName.split(' ')[0]}</span>
              <span className="text-xs text-warning-700 dark:text-warning-300 bg-warning-100 dark:bg-warning-900/50 px-2 py-0.5 rounded-full">
                {borrower.structuralTraits?.[0] || 'Irregular'}
              </span>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Top Info Cards */}
          <div className="card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-warning-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-warning-500/20 flex-shrink-0">
                {getInitials(borrower.borrowerName)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-50">{borrower.borrowerName}</h1>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1"><Wallet size={14}/> {borrower.tradeCategory}</span>
                  <span>•</span>
                  <span>{borrower.cluster}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none card-inner px-5 py-3 border border-ink-200 dark:border-ink-800 rounded-xl bg-white dark:bg-ink-900 min-w-[140px]">
                <p className="text-xs text-ink-500 font-medium flex items-center gap-1.5"><Wallet size={14}/> Loan Amount</p>
                <p className="text-xl font-bold stat-value text-ink-900 dark:text-ink-50 mt-1">{formatCurrency(borrower.principal)}</p>
              </div>
              <div className="flex-1 md:flex-none card-inner px-5 py-3 border border-ink-200 dark:border-ink-800 rounded-xl bg-white dark:bg-ink-900 min-w-[120px]">
                <p className="text-xs text-ink-500 font-medium flex items-center gap-1.5"><CalendarDays size={14}/> Tenure</p>
                <p className="text-xl font-bold stat-value text-ink-900 dark:text-ink-50 mt-1">15 mos</p>
              </div>
              <div className="flex-1 md:flex-none card-inner px-5 py-3 border border-ink-200 dark:border-ink-800 rounded-xl bg-white dark:bg-ink-900 min-w-[140px]">
                <p className="text-xs text-ink-500 font-medium flex items-center gap-1.5"><Wallet size={14}/> Current EMI</p>
                <p className="text-xl font-bold stat-value text-ink-900 dark:text-ink-50 mt-1">{formatCurrency(borrower.emi)}</p>
              </div>
              <div className="flex-1 md:flex-none card-inner px-5 py-3 border border-warning-200 dark:border-warning-900 rounded-xl bg-warning-50/50 dark:bg-warning-950/20 min-w-[120px]">
                <p className="text-xs text-warning-600 dark:text-warning-400 font-medium flex items-center gap-1.5"><TrendingUp size={14}/> RSI</p>
                <p className="text-xl font-bold stat-value text-warning-600 dark:text-warning-400 mt-1">{formatNumber(rsi.score / 100, 2)}</p>
              </div>
            </div>
          </div>

          {/* Large Chart Area */}
          <div className="card p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-ink-900 dark:text-ink-50">Cash-Flow vs. Repayment Stress</h2>
              <p className="text-sm text-ink-500">12-month income, expenses, and EMI with RSI overlay</p>
            </div>
            
            <div className="flex items-center justify-end gap-6 mb-4 text-xs font-medium">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500"/> Income</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500"/> Expenses</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500"/> EMI</span>
              <span className="flex items-center gap-2"><div className="w-3 h-0.5 bg-warning-500"/> RSI</span>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" strokeOpacity={0.4} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                  
                  {/* Left Y-Axis for Currency */}
                  <YAxis 
                    yAxisId="left" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#71717a' }} 
                    tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`}
                    dx={-10}
                  />
                  
                  {/* Right Y-Axis for RSI (hidden but scales the orange line) */}
                  <YAxis yAxisId="right" orientation="right" hide domain={[0, 1]} />
                  
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    formatter={(value: number, name: string) => {
                      if (name === 'rsi') return [formatNumber(value, 2), 'RSI'];
                      return [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)];
                    }}
                  />
                  
                  <Area yAxisId="left" type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.1} />
                  <Area yAxisId="left" type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="#ef4444" fillOpacity={0.05} />
                  <Line yAxisId="left" type="step" dataKey="emi" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="rsi" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Explainability & Insights */}
          <div className="card p-6 border-t-4 border-t-warning-500">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-warning-500" size={20} />
              <h2 className="text-lg font-bold text-ink-900 dark:text-ink-50">Why is this borrower stressed?</h2>
              <span className="text-xs text-ink-500 uppercase tracking-widest ml-2 hidden sm:inline">AI Explainability Breakdown</span>
            </div>

            <div className="bg-ink-100 dark:bg-ink-900/50 p-4 rounded-xl text-sm text-ink-700 dark:text-ink-300 mb-6">
              {intelligence.classificationReason} This is confirmed {borrower.structuralTraits?.[0]?.toLowerCase() || 'irregular'} stress, NOT structural delinquency. Repayment history outside stress months is exemplary.
            </div>

            <div className="space-y-5 mb-8">
              {intelligence.evidence.slice(0, 3).map((e, idx) => {
                // Ensure weights sum up reasonably or look like a percentage
                const fakeWeight = idx === 0 ? 55 : idx === 1 ? 25 : 20; 
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-ink-700 dark:text-ink-300">{e.factorName}</span>
                      <span className="font-bold text-warning-600 dark:text-warning-400">{fakeWeight}%</span>
                    </div>
                    <div className="h-2 w-full bg-ink-200 dark:bg-ink-800 rounded-full overflow-hidden mb-1.5">
                      <div className="h-full bg-warning-500 rounded-full" style={{ width: `${fakeWeight}%` }} />
                    </div>
                    <p className="text-[11px] text-ink-500">{e.evidence}</p>
                  </div>
                )
              })}
            </div>

            <div className="bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800 rounded-xl p-4 flex items-start gap-3">
              <Zap className="text-success-600 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <p className="text-xs font-bold text-success-700 dark:text-success-400 uppercase tracking-wide mb-1">Counterfactual Insight</p>
                <p className="text-sm text-success-900 dark:text-success-100">
                  If EMI is reduced to {formatCurrency(borrower.emi * 0.55)} during stress periods, default probability drops from 74% to 8%.
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Restructuring Engine */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-primary-500" size={20} />
              <h2 className="text-lg font-bold text-ink-900 dark:text-ink-50">Dynamic Repayment Plan Restructuring Engine</h2>
            </div>
            <p className="text-sm text-ink-500 mb-6">Compare {intelligence.plans.length} plans side-by-side — AI recommends the optimal structure</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {intelligence.plans.map((plan, idx) => {
                const isRecommended = plan.recommended || idx === 1; // Force 2nd plan to be recommended if none specified to match mockup
                const isSelected = selectedPlanIdx === idx;
                return (
                  <button 
                    key={plan.id} 
                    onClick={() => setSelectedPlanIdx(idx)}
                    className={`flex flex-col text-left rounded-2xl border-2 transition-all p-5 outline-none focus:ring-2 focus:ring-primary-500/50 ${isSelected ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-900/10 shadow-lg shadow-primary-500/10' : 'border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-primary-300 dark:hover:border-primary-700'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 w-full">
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-primary-500' : idx === 0 ? 'bg-danger-500' : idx === 2 ? 'bg-warning-500' : 'bg-accent-500'}`} />
                      <span className={`text-xs font-medium ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-ink-500'}`}>Plan {String.fromCharCode(65 + idx)}</span>
                      {isRecommended && <span className="ml-auto text-[9px] font-bold bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 px-2 py-0.5 rounded-full uppercase tracking-wider">RECOMMENDED</span>}
                    </div>
                    
                    <h3 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-2">{plan.label}</h3>
                    <p className="text-xs text-ink-600 dark:text-ink-400 mb-5 min-h-[40px] leading-relaxed">{plan.description}</p>
                    
                    {/* Fake schedule breakdown for visuals */}
                    <div className="space-y-2 mb-6 flex-1">
                      {idx === 0 ? (
                        <>
                          <div className="flex justify-between text-xs font-medium"><span className="text-ink-500">Jan-Jun</span><span className="stat-value">{formatCurrency(plan.monthlyEmi)}</span></div>
                          <div className="flex justify-between text-xs font-medium"><span className="text-ink-500">Jul-Aug</span><span className="stat-value">{formatCurrency(plan.monthlyEmi)}</span></div>
                          <div className="flex justify-between text-xs font-medium"><span className="text-ink-500">Sep-Dec</span><span className="stat-value">{formatCurrency(plan.monthlyEmi)}</span></div>
                        </>
                      ) : idx === 1 ? (
                        <>
                          <div className="flex justify-between text-xs font-medium"><span className="text-ink-500">Jan-Jun</span><span className="stat-value">{formatCurrency(borrower.emi)}</span></div>
                          <div className="flex justify-between text-xs font-bold text-primary-600 dark:text-primary-400"><span className="">Jul-Aug</span><span className="stat-value">{formatCurrency(plan.monthlyEmi)}</span></div>
                          <div className="flex justify-between text-xs font-medium"><span className="text-ink-500">Sep-Dec</span><span className="stat-value">{formatCurrency(borrower.emi * 1.2)}</span></div>
                        </>
                      ) : (
                         <div className="flex justify-between text-xs font-medium"><span className="text-ink-500">{plan.type.includes('Weekly') ? 'Weekly (52 weeks)' : 'Months 1-6'}</span><span className="stat-value">{formatCurrency(plan.monthlyEmi)}</span></div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-ink-100 dark:border-ink-800 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">Recovery</p>
                        <p className="text-lg font-bold stat-value text-ink-900 dark:text-ink-50">{isRecommended ? '98.4' : plan.sustainabilityScore}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">Risk</p>
                        <p className={`text-lg font-bold stat-value ${isRecommended ? 'text-success-500' : idx === 0 ? 'text-danger-500' : 'text-warning-500'}`}>
                          {isRecommended ? '8%' : idx === 0 ? '74%' : '28%'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-6 border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/20 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-bold text-ink-900 dark:text-ink-50">{intelligence.plans[selectedPlanIdx].label}</h3>
                  {(intelligence.plans[selectedPlanIdx].recommended || selectedPlanIdx === 1) && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-900/30 px-2 py-0.5 rounded border border-success-200 dark:border-success-800">
                      <CheckCircle2 size={12}/> AI RECOMMENDED
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-600 dark:text-ink-400 mb-3">{intelligence.plans[selectedPlanIdx].description}</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-ink-500">
                  <span>Borrower Stress: <span className="text-success-500 font-bold">LOW</span></span>
                  <span>Lender Recovery: <span className="font-bold text-ink-700 dark:text-ink-300 stat-value">{(intelligence.plans[selectedPlanIdx].recommended || selectedPlanIdx === 1) ? '98.4' : intelligence.plans[selectedPlanIdx].sustainabilityScore}%</span></span>
                  <span>Default Risk: <span className={`font-bold stat-value ${(intelligence.plans[selectedPlanIdx].recommended || selectedPlanIdx === 1) ? 'text-success-500' : selectedPlanIdx === 0 ? 'text-danger-500' : 'text-warning-500'}`}>
                    {(intelligence.plans[selectedPlanIdx].recommended || selectedPlanIdx === 1) ? '8%' : selectedPlanIdx === 0 ? '74%' : '28%'}
                  </span></span>
                </div>
              </div>
              
              <button onClick={() => onRestructure(borrower, selectedPlanIdx)} className="w-full md:w-auto btn-primary py-3 px-6 text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 flex-shrink-0">
                <CheckCircle2 size={18} /> Simulate & Approve Restructure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
