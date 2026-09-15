import { useState } from 'react';
import {
  FileText, CheckCircle2, Clock, XCircle, Download,
  ShieldCheck, Filter, ChevronRight, History,
} from 'lucide-react';
import { auditEntries } from '@/data/personas';
import type { AuditEntry } from '@/types';

const statusConfig: Record<AuditEntry['status'], { icon: React.ElementType; color: string; bg: string }> = {
  Approved: { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  Pending: { icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  Rejected: { icon: XCircle, color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
};

const filterTabs = ['All', 'Approved', 'Pending', 'Rejected'] as const;

export default function AuditExplainability() {
  const [filter, setFilter] = useState<typeof filterTabs[number]>('All');

  const filtered = auditEntries.filter((e) => filter === 'All' || e.status === filter);

  const stats = {
    total: auditEntries.length,
    approved: auditEntries.filter((e) => e.status === 'Approved').length,
    pending: auditEntries.filter((e) => e.status === 'Pending').length,
    avgRiskReduction: Math.round(
      auditEntries
        .filter((e) => e.status === 'Approved')
        .reduce((sum, e) => sum + (e.riskBefore - e.riskAfter), 0) /
        Math.max(auditEntries.filter((e) => e.status === 'Approved').length, 1),
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Audit & Explainability Ledger</h2>
          <p className="text-sm text-slate-500">Immutable record of all AI-driven restructuring decisions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Decisions', value: stats.total, icon: History, accent: 'bg-blue-50 text-blue-600' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, accent: 'bg-emerald-50 text-emerald-600' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, accent: 'bg-amber-50 text-amber-600' },
          { label: 'Avg Risk Reduction', value: `${stats.avgRiskReduction}%`, icon: ShieldCheck, accent: 'bg-emerald-50 text-emerald-600' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            style={{ animation: `fadeInUp 0.4s ease-out ${i * 60}ms both` }}
          >
            <div className={`w-9 h-9 rounded-xl ${stat.accent} flex items-center justify-center mb-3`}>
              <stat.icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Audit entries */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-200 bg-slate-50/50">
                <th className="px-5 py-3 font-medium">Timestamp</th>
                <th className="px-5 py-3 font-medium">Borrower</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Officer</th>
                <th className="px-5 py-3 font-medium">Risk Change</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Slip</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => {
                const sc = statusConfig[entry.status];
                return (
                  <tr
                    key={entry.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    style={{ animation: `fadeInUp 0.3s ease-out ${i * 30}ms both` }}
                  >
                    <td className="px-5 py-3.5 text-xs text-slate-400 font-mono">{entry.timestamp}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{entry.borrower}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{entry.action}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{entry.plan}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{entry.officer}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-600">{entry.riskBefore}%</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="text-sm font-semibold text-emerald-600">{entry.riskAfter}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${sc.bg} ${sc.color}`}>
                        <sc.icon className="w-3 h-3" />
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explainability note */}
      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">AI Decision Explainability</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every restructuring recommendation in CashPulse is backed by a full audit trail: the input data used,
              the stress classification model output, the counterfactual simulation, and the officer who approved it.
              This ensures regulatory compliance and builds trust with borrowers and MFIs alike.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Input Data Log', 'Model Decision Path', 'Counterfactual Trace', 'Officer Approval', 'Immutable Ledger'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-white text-slate-600 border border-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
