import { useState, useMemo } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Line, ComposedChart, RadialBarChart,
  RadialBar, PolarAngleAxis, Area, AreaChart,
} from 'recharts';
import {
  DollarSign, Clock, PauseCircle,
  Gauge, ShieldCheck, AlertTriangle, Sparkles, TrendingDown,
} from 'lucide-react';
import { borrowers, getBorrowerById } from '@/data/borrowers';
import { personaCashflow } from '@/data/personas';
import { rsiColor, formatINR } from '@/utils/stress';

interface WhatIfSimulatorProps {
  selectedBorrowerId: string;
  onSelectBorrower: (id: string) => void;
}

const personaTabs = borrowers.slice(0, 4);

export default function WhatIfSimulator({ selectedBorrowerId, onSelectBorrower }: WhatIfSimulatorProps) {
  const borrower = useMemo(() => getBorrowerById(selectedBorrowerId)!, [selectedBorrowerId]);
  const baseCashflow = personaCashflow[selectedBorrowerId] || personaCashflow['b001'];

  const [incomeAdjust, setIncomeAdjust] = useState(0);
  const [tenureExt, setTenureExt] = useState(0);
  const [moratorium, setMoratorium] = useState(false);

  const simulation = useMemo(() => {
    const incomeFactor = 1 + incomeAdjust / 100;
    const newTenure = borrower.tenureMonths + tenureExt;
    const moratoriumMonths = moratorium ? 2 : 0;

    const remainingPrincipal = borrower.loanAmount * (borrower.monthsRemaining / borrower.tenureMonths);
    const effectiveMonths = newTenure - moratoriumMonths;
    const newEMI = moratoriumMonths > 0
      ? remainingPrincipal / Math.max(effectiveMonths, 1) * 0.95
      : remainingPrincipal / Math.max(newTenure - (borrower.tenureMonths - borrower.monthsRemaining), 1);

    const adjustedData = baseCashflow.map((c, i) => {
      const adjustedIncome = c.income * incomeFactor;
      const isMoratorium = moratorium && i < moratoriumMonths;
      const effectiveEMI = isMoratorium ? 0 : Math.round(newEMI);
      const surplus = adjustedIncome - c.expenses - effectiveEMI;
      const stressRatio = effectiveEMI > 0 && adjustedIncome > 0
        ? Math.max(0, Math.min(1, 1 - surplus / adjustedIncome))
        : 0;
      return {
        month: c.month,
        income: Math.round(adjustedIncome),
        expenses: c.expenses,
        emi: effectiveEMI,
        rsi: Number(stressRatio.toFixed(2)),
        surplus: Math.round(surplus),
      };
    });

    const avgRSI = adjustedData.reduce((sum, d) => sum + d.rsi, 0) / adjustedData.length;
    const recoveryRate = Math.min(100, Math.max(0, 100 - avgRSI * 100 * 0.8 + (moratorium ? 8 : 0) + (tenureExt > 0 ? 5 : 0)));
    const defaultProb = Math.max(0, Math.min(100, avgRSI * 100 * 1.1));

    return {
      adjustedData,
      avgRSI: Number(avgRSI.toFixed(2)),
      recoveryRate: Number(recoveryRate.toFixed(1)),
      defaultProb: Number(defaultProb.toFixed(0)),
      newEMI: Math.round(newEMI),
      newTenure,
      moratoriumMonths,
    };
  }, [incomeAdjust, tenureExt, moratorium, borrower, baseCashflow]);

  const rsiGauge = [{ name: 'RSI', value: simulation.avgRSI * 100, fill: rsiColor(simulation.avgRSI) }];
  const recoveryGauge = [{ name: 'Recovery', value: simulation.recoveryRate, fill: '#059669' }];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">What-If Simulation Playground</h1>
        <p className="text-sm text-slate-500 mt-0.5">Adjust parameters to see real-time impact on stress and recovery</p>
      </div>

      {/* Persona selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400 mr-1">Simulating for:</span>
        {personaTabs.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectBorrower(p.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              selectedBorrowerId === p.id
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: p.avatarColor }}
            >
              {p.initials}
            </div>
            {p.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-800 mb-1">Simulation Controls</h3>
            <p className="text-xs text-slate-500 mb-5">Adjust parameters to see real-time impact</p>

            {/* Income slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Expected Monthly Income
                </label>
                <span className={`text-sm font-bold ${incomeAdjust < 0 ? 'text-red-600' : incomeAdjust > 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {incomeAdjust > 0 ? '+' : ''}{incomeAdjust}%
                </span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={incomeAdjust}
                onChange={(e) => setIncomeAdjust(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>-50%</span>
                <span>0%</span>
                <span>+50%</span>
              </div>
            </div>

            {/* Tenure slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Tenure Extension
                </label>
                <span className="text-sm font-bold text-amber-600">+{tenureExt} months</span>
              </div>
              <input
                type="range"
                min={0}
                max={6}
                value={tenureExt}
                onChange={(e) => setTenureExt(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 mo</span>
                <span>3 mo</span>
                <span>6 mo</span>
              </div>
            </div>

            {/* Moratorium toggle */}
            <div>
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mb-2">
                <PauseCircle className="w-4 h-4 text-red-600" />
                2-Month Moratorium
              </label>
              <button
                onClick={() => setMoratorium(!moratorium)}
                className={`relative w-full h-10 rounded-xl border transition-all ${
                  moratorium
                    ? 'bg-red-50 border-red-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between px-4">
                  <span className={`text-sm font-medium ${moratorium ? 'text-red-700' : 'text-slate-400'}`}>
                    {moratorium ? 'Active — first 2 months deferred' : 'Inactive'}
                  </span>
                  <div className={`relative w-10 h-5 rounded-full transition-colors ${moratorium ? 'bg-red-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${moratorium ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Results gauges */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Live Impact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="65%" outerRadius="100%" data={rsiGauge} startAngle={90} endAngle={-270}>
                      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                      <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#f1f5f9' }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold" style={{ color: rsiColor(simulation.avgRSI) }}>
                      {simulation.avgRSI.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase">RSI</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1">
                  <Gauge className="w-3 h-3" /> Stress Index
                </p>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="65%" outerRadius="100%" data={recoveryGauge} startAngle={90} endAngle={-270}>
                      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                      <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#f1f5f9' }} fill="#059669" />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-emerald-600">
                      {simulation.recoveryRate}%
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase">Recovery</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Lender Recovery
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <span className="text-xs text-slate-500">New EMI</span>
                <span className="text-sm font-semibold text-slate-800">{formatINR(simulation.newEMI)}</span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <span className="text-xs text-slate-500">New Tenure</span>
                <span className="text-sm font-semibold text-slate-800">{simulation.newTenure} months</span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <span className="text-xs text-slate-500">Default Probability</span>
                <span className="text-sm font-semibold" style={{ color: rsiColor(simulation.defaultProb / 100) }}>
                  {simulation.defaultProb}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Simulated Cash-Flow & Stress</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time projection with adjusted parameters</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500" />Income</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-400" />Expenses</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500" />EMI</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-500" />RSI</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={simulation.adjustedData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="simIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <YAxis yAxisId="rsi" orientation="right" domain={[0, 1]} stroke="#f59e0b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                    labelStyle={{ color: '#475569', fontWeight: 600 }}
                    formatter={(value, name) => {
                      const v = Number(value);
                      if (name === 'rsi') return [v.toFixed(2), 'RSI'];
                      return [formatINR(v), String(name).charAt(0).toUpperCase() + String(name).slice(1)];
                    }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} fill="url(#simIncomeGrad)" />
                  <Line type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="emi" stroke="#059669" strokeWidth={2.5} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="rsi" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} yAxisId="rsi" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${simulation.avgRSI < 0.4 ? 'bg-emerald-50 text-emerald-600' : simulation.avgRSI < 0.7 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                  {simulation.avgRSI < 0.5 ? <TrendingDown className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>
                <span className="text-xs text-slate-500">Stress Level</span>
              </div>
              <p className="text-lg font-bold text-slate-800">
                {simulation.avgRSI < 0.3 ? 'Healthy' : simulation.avgRSI < 0.5 ? 'Watch' : simulation.avgRSI < 0.75 ? 'At-Risk' : 'Critical'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {simulation.avgRSI < 0.3 ? 'Low default risk' : simulation.avgRSI < 0.5 ? 'Monitor closely' : 'Restructure recommended'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-500">Recovery Outlook</span>
              </div>
              <p className="text-lg font-bold text-slate-800">{simulation.recoveryRate}%</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {simulation.recoveryRate > 90 ? 'Excellent' : simulation.recoveryRate > 75 ? 'Good' : 'Needs attention'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-500">AI Suggestion</span>
              </div>
              <p className="text-sm font-medium text-slate-700 leading-snug">
                {simulation.avgRSI > 0.7
                  ? 'Enable moratorium + extend tenure to reduce stress'
                  : simulation.avgRSI > 0.4
                    ? 'Seasonal EMI adjustment recommended'
                    : 'Current parameters are healthy'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
