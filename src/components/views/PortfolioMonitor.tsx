import { useState, useMemo } from 'react';
import {
  Wallet, ShieldCheck, AlertTriangle, TrendingDown, Sparkles,
  ArrowUpRight, ArrowDownRight, Minus, Waves, ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis,
} from 'recharts';
import { borrowers } from '@/data/borrowers';
import { stressBg, stressLabel, stressTypeColor, rsiColor, formatINR } from '@/utils/stress';
import type { Borrower, StressType } from '@/types';

interface PortfolioMonitorProps {
  searchQuery: string;
  onSelectBorrower: (id: string) => void;
}

const filterTabs: (StressType | 'All')[] = ['All', 'Seasonal', 'Structural', 'Irregular', 'Stable'];

function TrendIcon({ trend }: { trend: Borrower['trend'] }) {
  if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-emerald-600" />;
  if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-red-600" />;
  if (trend === 'volatile') return <Waves className="w-4 h-4 text-orange-600" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

function KpiCard({
  icon: Icon, label, value, sublabel, accent, delay,
}: {
  icon: React.ElementType; label: string; value: string; sublabel: string; accent: string; delay: number;
}) {
  return (
    <div
      className="group relative bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300"
      style={{ animation: `fadeInUp 0.5s ease-out ${delay}ms both` }}
    >
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-5 ${accent}`} />
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center`}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sublabel}</p>
    </div>
  );
}

export default function PortfolioMonitor({ searchQuery, onSelectBorrower }: PortfolioMonitorProps) {
  const [activeFilter, setActiveFilter] = useState<StressType | 'All'>('All');

  const filteredBorrowers = useMemo(() => {
    return borrowers.filter((b) => {
      const matchesFilter = activeFilter === 'All' || b.stressType === activeFilter;
      const matchesSearch =
        !searchQuery ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.occupation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const stressCounts = useMemo(() => {
    return {
      green: borrowers.filter((b) => b.stressLevel === 'green').length,
      yellow: borrowers.filter((b) => b.stressLevel === 'yellow').length,
      orange: borrowers.filter((b) => b.stressLevel === 'orange').length,
      red: borrowers.filter((b) => b.stressLevel === 'red').length,
    };
  }, []);

  const recoveryData = [{ name: 'Recovery', value: 87, fill: '#059669' }];

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Portfolio Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time monitoring of all active microloans</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live data · Updated 2 min ago
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KpiCard icon={Wallet} label="Total Active Loans" value="₹18.4L" sublabel="Across 42 Borrowers" accent="bg-blue-50 text-blue-600" delay={0} />
        <KpiCard icon={ShieldCheck} label="Healthy / Green" value="62%" sublabel="26 Borrowers on track" accent="bg-emerald-50 text-emerald-600" delay={60} />
        <KpiCard icon={AlertTriangle} label="At-Risk / Seasonal" value="24%" sublabel="10 Borrowers showing stress" accent="bg-amber-50 text-amber-600" delay={120} />
        <KpiCard icon={TrendingDown} label="Critical Default Risk" value="14%" sublabel="6 Borrowers in structural decline" accent="bg-red-50 text-red-600" delay={180} />
        <div
          className="group relative bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-emerald-300"
          style={{ animation: `fadeInUp 0.5s ease-out 240ms both` }}
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-10 bg-emerald-500" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="w-14 h-14 -mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={recoveryData} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#f1f5f9' }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="text-xs text-emerald-700 font-medium mb-1">Preventable Default Rate</p>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">87%</p>
          <p className="text-xs text-emerald-600 mt-1">Recovery with dynamic restructuring</p>
        </div>
      </div>

      {/* Stress Distribution Heatmap */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Risk Distribution Heatmap</h3>
            <p className="text-xs text-slate-500 mt-0.5">Stress level pills across the portfolio</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {([
            { level: 'green' as const, label: 'Healthy', count: stressCounts.green, pct: 62, icon: ShieldCheck },
            { level: 'yellow' as const, label: 'Watch', count: stressCounts.yellow, pct: 24, icon: AlertTriangle },
            { level: 'orange' as const, label: 'At-Risk', count: stressCounts.orange, pct: 8, icon: TrendingDown },
            { level: 'red' as const, label: 'Critical', count: stressCounts.red, pct: 6, icon: TrendingDown },
          ]).map((item) => (
            <div
              key={item.level}
              className={`relative rounded-xl border p-4 overflow-hidden ${stressBg(item.level)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <item.icon className="w-5 h-5" />
                <span className="text-2xl font-bold">{item.count}</span>
              </div>
              <p className="text-sm font-semibold">{item.label}</p>
              <div className="mt-2 h-1.5 rounded-full bg-slate-200/60 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${item.pct}%`, backgroundColor: item.level === 'green' ? '#059669' : item.level === 'yellow' ? '#ca8a04' : item.level === 'orange' ? '#ea580c' : '#dc2626' }}
                />
              </div>
              <p className="text-xs opacity-70 mt-1.5">{item.pct}% of portfolio</p>
            </div>
          ))}
        </div>
      </div>

      {/* Borrower Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-slate-200">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Borrower Portfolio</h3>
            <p className="text-xs text-slate-500 mt-0.5">{filteredBorrowers.length} borrowers shown</p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-200 bg-slate-50/50">
                <th className="px-5 py-3 font-medium">Borrower</th>
                <th className="px-5 py-3 font-medium">Occupation</th>
                <th className="px-5 py-3 font-medium">Loan Amount</th>
                <th className="px-5 py-3 font-medium">Monthly EMI</th>
                <th className="px-5 py-3 font-medium">RSI</th>
                <th className="px-5 py-3 font-medium">Stress Type</th>
                <th className="px-5 py-3 font-medium">Trend</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowers.map((b, i) => (
                <tr
                  key={b.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                  style={{ animation: `fadeInUp 0.3s ease-out ${i * 30}ms both` }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: b.avatarColor }}
                      >
                        {b.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{b.name}</p>
                        <p className="text-xs text-slate-400">{b.age} yrs</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{b.occupation}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 font-medium">{formatINR(b.loanAmount)}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 font-medium">{formatINR(b.currentEMI)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: rsiColor(b.rsi) }}>
                        {b.rsi.toFixed(2)}
                      </span>
                      <div className="w-12 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${b.rsi * 100}%`, backgroundColor: rsiColor(b.rsi) }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${stressTypeColor(b.stressType)}`}>
                      {b.stressType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <TrendIcon trend={b.trend} />
                      <span className="text-xs text-slate-500 capitalize">{b.trend}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onSelectBorrower(b.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all"
                    >
                      Analyze & Restructure
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBorrowers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-400">No borrowers match the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
