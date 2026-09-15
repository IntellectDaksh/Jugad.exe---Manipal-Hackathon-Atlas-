import { useState, useMemo } from 'react';
import { useStore } from '@/store';
import { formatCurrency, formatNumber } from '@/lib/format';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, AlertTriangle, Sparkles, TrendingDown, TrendingUp, Clock } from 'lucide-react';
import type { Borrower } from '@/types';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function generateSimulationData(borrower: Borrower, incomeDelta: number, tenureDelta: number, moratorium: boolean) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseIncome = borrower.monthlyIncome * (1 + (incomeDelta / 100));
  const baseExpense = borrower.essentialOutflows;
  
  // Fake new EMI based on tenure extension
  const oldTenure = 12; // assumed
  const newTenure = oldTenure + tenureDelta;
  const newEmi = borrower.emi * (oldTenure / newTenure);

  return months.map((m, i) => {
    const monthPhase = (i / 12) * Math.PI * 2;
    const phaseOffset = (parseInt(borrower.id.replace(/\D/g, '')) || 0) % 12;
    const seasonality = Math.sin(monthPhase - phaseOffset);
    
    const isSeasonal = borrower.structuralTraits?.includes('Seasonal Revenue') || borrower.tradeCategory === 'Agriculture';
    const incomeMultiplier = isSeasonal ? 1 + (seasonality * 0.45) : 1 + (seasonality * 0.15);
    const expenseMultiplier = 1 + (Math.cos(monthPhase) * 0.1);
    
    let income = Math.max(0, baseIncome * incomeMultiplier);
    
    // Simulate drop in Jul/Aug to match screenshot
    if (i === 6 || i === 7) {
       income = income * 0.6; 
    }
    
    const expenses = Math.max(0, baseExpense * expenseMultiplier);
    
    // Moratorium: 0 EMI for first 2 months
    const appliedEmi = (moratorium && i < 2) ? 0 : newEmi;
    
    const freeCash = income - expenses;
    const coverage = freeCash > 0 ? appliedEmi / freeCash : 2;
    const mockRsi = Math.min(100, Math.max(0, (coverage * 50) + 20));
    
    return {
      month: m,
      income,
      expenses,
      emi: appliedEmi,
      rsi: mockRsi / 100,
    };
  });
}

export function StressSandbox() {
  const { borrowers } = useStore();
  const [selectedId, setSelectedId] = useState<string>(borrowers[0]?.id ?? '');
  
  const [incomeDelta, setIncomeDelta] = useState(0);
  const [tenureDelta, setTenureDelta] = useState(0);
  const [moratorium, setMoratorium] = useState(false);

  const selectedBorrower = borrowers.find(b => b.id === selectedId) ?? borrowers[0];

  const chartData = useMemo(() => {
    if (!selectedBorrower) return [];
    return generateSimulationData(selectedBorrower, incomeDelta, tenureDelta, moratorium);
  }, [selectedBorrower, incomeDelta, tenureDelta, moratorium]);

  if (!selectedBorrower) {
    return <div className="card p-8 text-center text-ink-500">No borrowers available.</div>;
  }

  // Fake metrics for the Live Impact
  const newTenure = 15 + tenureDelta;
  const newEmi = (selectedBorrower.emi * 15) / newTenure;
  
  // Calculate average RSI from chart data
  const avgRsi = chartData.reduce((acc, curr) => acc + curr.rsi, 0) / (chartData.length || 1);
  const recovery = Math.max(0, Math.min(100, 100 - (avgRsi * 100) + (tenureDelta * 2) + (moratorium ? 5 : 0)));

  return (
    <div className="max-w-[1600px] mx-auto pb-12">
      {/* Top Header section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-50">What-If Simulation Playground</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Adjust parameters to see real-time impact on stress and recovery</p>
      </div>

      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-ink-200 dark:border-ink-800 overflow-x-auto">
        <span className="text-xs text-ink-500 uppercase tracking-widest font-semibold mr-2 whitespace-nowrap">Simulating for:</span>
        {borrowers.slice(0, 4).map((b, i) => {
          const colors = ['text-warning-600 bg-warning-50 border-warning-200', 'text-danger-600 bg-danger-50 border-danger-200', 'text-orange-600 bg-orange-50 border-orange-200', 'text-success-600 bg-success-50 border-success-200'];
          const darkColors = ['dark:text-warning-400 dark:bg-warning-950/30 dark:border-warning-800', 'dark:text-danger-400 dark:bg-danger-950/30 dark:border-danger-800', 'dark:text-orange-400 dark:bg-orange-950/30 dark:border-orange-800', 'dark:text-success-400 dark:bg-success-950/30 dark:border-success-800'];
          
          return (
            <button 
              key={b.id} 
              onClick={() => setSelectedId(b.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${selectedId === b.id ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-ink-950' : 'opacity-70 hover:opacity-100'} ${colors[i % colors.length]} ${darkColors[i % darkColors.length]}`}
            >
              <div className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center text-white ${['bg-warning-500', 'bg-danger-500', 'bg-orange-500', 'bg-success-500'][i % 4]}`}>
                {getInitials(b.borrowerName)}
              </div>
              <span className="text-sm font-semibold">{b.borrowerName.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Controls & Live Impact */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-1">Simulation Controls</h2>
            <p className="text-xs text-ink-500 mb-6">Adjust parameters to see real-time impact</p>

            <div className="space-y-6">
              {/* Income Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-ink-700 dark:text-ink-300 flex items-center gap-2 text-blue-500">
                    <span className="font-bold text-lg leading-none">$</span> Expected Monthly Income
                  </label>
                  <span className="font-bold stat-value text-ink-900 dark:text-ink-50 text-sm">{incomeDelta > 0 ? '+' : ''}{incomeDelta}%</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  step={5}
                  value={incomeDelta}
                  onChange={e => setIncomeDelta(Number(e.target.value))}
                  className="w-full h-1.5 bg-ink-200 dark:bg-ink-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] font-medium text-ink-400 mt-2">
                  <span>-50%</span>
                  <span>0%</span>
                  <span>+50%</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-ink-700 dark:text-ink-300 flex items-center gap-2 text-orange-500">
                    <Clock size={16} /> Tenure Extension
                  </label>
                  <span className="font-bold stat-value text-orange-600 dark:text-orange-400 text-sm">+{tenureDelta} months</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={6}
                  step={1}
                  value={tenureDelta}
                  onChange={e => setTenureDelta(Number(e.target.value))}
                  className="w-full h-1.5 bg-ink-200 dark:bg-ink-800 rounded-full appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] font-medium text-ink-400 mt-2">
                  <span>0 mo</span>
                  <span>3 mo</span>
                  <span>6 mo</span>
                </div>
              </div>

              {/* Moratorium Toggle */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-ink-700 dark:text-ink-300 flex items-center gap-2 text-danger-500">
                    <AlertTriangle size={16} /> 2-Month Moratorium
                  </label>
                </div>
                <div 
                  onClick={() => setMoratorium(!moratorium)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${moratorium ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-900'}`}
                >
                  <span className={`text-sm font-semibold ${moratorium ? 'text-primary-700 dark:text-primary-300' : 'text-ink-500'}`}>
                    {moratorium ? 'Active' : 'Inactive'}
                  </span>
                  <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${moratorium ? 'bg-primary-500' : 'bg-ink-300 dark:bg-ink-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${moratorium ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-6">Live Impact</h2>
            
            <div className="flex justify-around mb-8">
              {/* Fake Circular Gauge for RSI */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-ink-100 dark:text-ink-800" />
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-danger-500" strokeDasharray={`${avgRsi * 251} 251`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold stat-value text-ink-900 dark:text-ink-50">{avgRsi.toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-ink-400 uppercase tracking-widest">RSI</span>
                  </div>
                </div>
                <span className="text-xs text-ink-500 font-medium flex items-center gap-1"><TrendingDown size={14}/> Stress Index</span>
              </div>

              {/* Fake Circular Gauge for Recovery */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-ink-100 dark:text-ink-800" />
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-success-500" strokeDasharray={`${(recovery/100) * 251} 251`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold stat-value text-ink-900 dark:text-ink-50">{recovery.toFixed(1)}%</span>
                    <span className="text-[9px] font-bold text-ink-400 uppercase tracking-widest">RECOVERY</span>
                  </div>
                </div>
                <span className="text-xs text-ink-500 font-medium flex items-center gap-1"><TrendingUp size={14}/> Lender Recovery</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-lg bg-ink-50 dark:bg-ink-900/50">
                <span className="text-sm font-medium text-ink-600 dark:text-ink-400">New EMI</span>
                <span className="text-base font-bold stat-value text-ink-900 dark:text-ink-50">{formatCurrency(newEmi)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-ink-50 dark:bg-ink-900/50">
                <span className="text-sm font-medium text-ink-600 dark:text-ink-400">New Tenure</span>
                <span className="text-base font-bold stat-value text-ink-900 dark:text-ink-50">{newTenure} months</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chart and Outcomes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 h-[480px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-bold text-ink-900 dark:text-ink-50">Simulated Cash-Flow & Stress</h2>
                <p className="text-sm text-ink-500">Real-time projection with adjusted parameters</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500"/> Income</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500"/> Expenses</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500"/> EMI</span>
                <span className="flex items-center gap-2"><div className="w-3 h-0.5 bg-warning-500"/> RSI</span>
              </div>
            </div>

            <div className="flex-1 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" strokeOpacity={0.4} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                  
                  <YAxis 
                    yAxisId="left" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#71717a' }} 
                    tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`}
                    dx={-10}
                  />
                  
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 border-l-4 border-l-danger-500">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-danger-500" />
                <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Stress Level</h3>
              </div>
              <p className="text-xl font-bold text-ink-900 dark:text-ink-50">Critical</p>
              <p className="text-sm text-ink-500 mt-1">Restructure recommended</p>
            </div>
            
            <div className="card p-5 border-l-4 border-l-success-500">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={16} className="text-success-500" />
                <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Recovery Outlook</h3>
              </div>
              <p className="text-xl font-bold text-ink-900 dark:text-ink-50 stat-value">{recovery.toFixed(1)}%</p>
              <p className="text-sm text-ink-500 mt-1">Needs attention</p>
            </div>
            
            <div className="card p-5 border-l-4 border-l-primary-500 bg-primary-50/50 dark:bg-primary-950/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-primary-500" />
                <h3 className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">AI Suggestion</h3>
              </div>
              <p className="text-sm text-ink-900 dark:text-ink-100 font-medium leading-relaxed">
                Enable moratorium + extend tenure to reduce stress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
