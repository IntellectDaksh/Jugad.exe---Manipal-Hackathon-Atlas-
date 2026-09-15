import { useState, useMemo } from 'react';
import {
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  ArrowLeft, MapPin, Calendar, IndianRupee, TrendingDown, Lightbulb,
  CheckCircle2, Zap, FileText, X, Download, Sparkles, ChevronRight,
} from 'lucide-react';
import { borrowers, getBorrowerById } from '@/data/borrowers';
import { personaCashflow, personaExplainability, restructurePlans } from '@/data/personas';
import { stressTypeColor, rsiColor, formatINR } from '@/utils/stress';
import type { Borrower, RestructurePlan } from '@/types';

interface BorrowerAnalyticsProps {
  selectedBorrowerId: string;
  onSelectBorrower: (id: string) => void;
  onBack: () => void;
}

const personaTabs = borrowers.slice(0, 4);

export default function BorrowerAnalytics({ selectedBorrowerId, onSelectBorrower, onBack }: BorrowerAnalyticsProps) {
  const borrower = useMemo(() => getBorrowerById(selectedBorrowerId)!, [selectedBorrowerId]);
  const cashflow = personaCashflow[selectedBorrowerId] || personaCashflow['b001'];
  const explainability = personaExplainability[selectedBorrowerId] || personaExplainability['b001'];
  const plans = restructurePlans[selectedBorrowerId] || restructurePlans['b001'];
  const [selectedPlan, setSelectedPlan] = useState<string>('plan-b');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const selectedPlanData = plans.find((p) => p.id === selectedPlan) || plans[0];
  const isMonsoonDip = selectedBorrowerId === 'b001';

  const chartData = cashflow.map((c) => ({
    ...c,
    surplus: c.income - c.expenses - c.emi,
  }));

  return (
    <div className="space-y-6">
      {/* Back button + Persona selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 mr-1">Persona:</span>
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
              <span className={`px-1.5 py-0.5 rounded text-[9px] border ${stressTypeColor(p.stressType)}`}>
                {p.stressType}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-sm"
              style={{ backgroundColor: borrower.avatarColor }}
            >
              {borrower.initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{borrower.name}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{borrower.age} yrs</span>
                <span>·</span>
                <span>{borrower.occupation}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:ml-auto w-full lg:w-auto">
            {[
              { label: 'Loan Amount', value: formatINR(borrower.loanAmount), icon: IndianRupee },
              { label: 'Tenure', value: `${borrower.tenureMonths} mos`, icon: Calendar },
              { label: 'Current EMI', value: formatINR(borrower.currentEMI), icon: IndianRupee },
              { label: 'RSI', value: borrower.rsi.toFixed(2), icon: TrendingDown, color: rsiColor(borrower.rsi) },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-w-[100px]">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <stat.icon className="w-3.5 h-3.5" />
                  {stat.label}
                </div>
                <p className="text-lg font-bold" style={{ color: stat.color || '#1e293b' }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cash-Flow Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Cash-Flow vs. Repayment Stress</h3>
            <p className="text-xs text-slate-500 mt-0.5">12-month income, expenses, and EMI with RSI overlay</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500" />Income</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-400" />Expenses</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500" />EMI</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-500" />RSI</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
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
              <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} fill="url(#expenseGrad)" />
              <Line type="monotone" dataKey="emi" stroke="#059669" strokeWidth={2.5} dot={false} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="rsi" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} yAxisId={1} />
              <YAxis yAxisId={1} orientation="right" domain={[0, 1]} hide />
              {isMonsoonDip && (
                <ReferenceLine x="Jul" stroke="#dc2626" strokeDasharray="4 4" label={{ value: 'Monsoon Dip', fill: '#dc2626', fontSize: 10, position: 'top' }} />
              )}
              {isMonsoonDip && (
                <ReferenceLine x="Aug" stroke="#dc2626" strokeDasharray="4 4" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explainability Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Lightbulb className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">Why is this borrower stressed?</h3>
            <p className="text-xs text-slate-500 mt-0.5">AI Explainability Breakdown</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
          <p className="text-sm text-slate-700 leading-relaxed">{explainability.narrative}</p>
        </div>

        {/* Factor bars */}
        <div className="space-y-3 mb-5">
          {explainability.factors.map((factor) => (
            <div key={factor.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700">{factor.label}</span>
                <span className="text-sm font-semibold text-amber-600">{factor.contribution}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700"
                  style={{ width: `${factor.contribution}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">{factor.description}</p>
            </div>
          ))}
        </div>

        {/* Counterfactual */}
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">Counterfactual Insight</p>
            <p className="text-sm text-slate-700">{explainability.counterfactual}</p>
          </div>
        </div>
      </div>

      {/* Restructuring Engine */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">Dynamic Repayment Plan Restructuring Engine</h3>
            <p className="text-xs text-slate-500 mt-0.5">Compare 4 plans side-by-side — AI recommends the optimal structure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </div>

        {/* Selected plan detail + approve */}
        <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-semibold text-slate-800">{selectedPlanData.name}</h4>
                {selectedPlanData.recommended && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3" /> AI RECOMMENDED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-3">{selectedPlanData.description}</p>
              <div className="flex flex-wrap gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-400">Borrower Stress:</span>
                  <span className={`font-semibold ${
                    selectedPlanData.borrowerStress === 'LOW' ? 'text-emerald-600' :
                    selectedPlanData.borrowerStress === 'MODERATE' ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {selectedPlanData.borrowerStress}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-400">Lender Recovery:</span>
                  <span className="font-semibold text-slate-800">{selectedPlanData.lenderRecovery}%</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-400">Default Risk:</span>
                  <span className="font-semibold" style={{ color: rsiColor(selectedPlanData.defaultRisk / 100) }}>
                    {selectedPlanData.defaultRisk}%
                  </span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowSuccessModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simulate & Approve Restructure
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          borrower={borrower}
          plan={selectedPlanData}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
}

function PlanCard({
  plan, isSelected, onSelect,
}: {
  plan: RestructurePlan; isSelected: boolean; onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`text-left rounded-xl border p-4 transition-all duration-200 relative overflow-hidden ${
        isSelected
          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {plan.recommended && (
        <div className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg bg-emerald-100 text-emerald-700 text-[9px] font-bold tracking-wide border-l border-b border-emerald-200">
          RECOMMENDED
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
        <span className="text-xs text-slate-400 font-medium">
          {plan.id === 'plan-a' ? 'Plan A' : plan.id === 'plan-b' ? 'Plan B' : plan.id === 'plan-c' ? 'Plan C' : 'Plan D'}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-slate-800 mb-1.5">{plan.name}</h4>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{plan.description}</p>
      <div className="space-y-1.5">
        {plan.schedule.map((s) => (
          <div key={s.period} className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{s.period}</span>
            <span className="font-semibold text-slate-700">{s.amount > 0 ? formatINR(s.amount) : '₹0'}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">Recovery</span>
          <p className="text-sm font-bold" style={{ color: plan.lenderRecovery > 90 ? '#059669' : plan.lenderRecovery > 75 ? '#ca8a04' : '#dc2626' }}>
            {plan.lenderRecovery}%
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">Risk</span>
          <p className="text-sm font-bold" style={{ color: rsiColor(plan.defaultRisk / 100) }}>
            {plan.defaultRisk}%
          </p>
        </div>
      </div>
    </button>
  );
}

function SuccessModal({
  borrower, plan, onClose,
}: {
  borrower: Borrower; plan: RestructurePlan; onClose: () => void;
}) {
  const now = new Date();
  const slipId = `RSTR-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${borrower.id.toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalIn 0.3s ease-out' }}
      >
        <style>{`@keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-white border-b border-slate-200 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Restructure Approved</h3>
              <p className="text-xs text-slate-500">Loan restructuring audit slip generated</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit slip */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FileText className="w-4 h-4" />
            <span className="font-mono">{slipId}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Borrower', value: borrower.name },
              { label: 'Occupation', value: borrower.occupation },
              { label: 'Loan Amount', value: formatINR(borrower.loanAmount) },
              { label: 'Approved Plan', value: plan.name },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">{item.label}</p>
                <p className="text-sm font-medium text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500">Risk Reduction</span>
              <span className="text-xs font-semibold text-emerald-600">
                {plan.defaultRisk < 20 ? 'Excellent' : plan.defaultRisk < 40 ? 'Good' : 'Moderate'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-[10px] text-red-600 mb-1">Before: {plan.defaultRisk > 50 ? plan.defaultRisk : 74}%</p>
                <div className="h-2 rounded-full bg-red-200 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${plan.defaultRisk > 50 ? plan.defaultRisk : 74}%` }} />
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <div className="flex-1">
                <p className="text-[10px] text-emerald-600 mb-1">After: {plan.defaultRisk}%</p>
                <div className="h-2 rounded-full bg-emerald-200 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${plan.defaultRisk}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>This audit slip is recorded on the CashPulse immutable ledger for regulatory compliance.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-5 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Download Slip
          </button>
        </div>
      </div>
    </div>
  );
}
