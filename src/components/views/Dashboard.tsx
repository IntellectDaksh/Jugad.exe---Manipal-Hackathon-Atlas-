import { useMemo } from 'react';
import { DollarSign, TrendingDown, AlertTriangle, CheckCircle2, Activity, AlertOctagon, ArrowRight, Users, Building2, ShieldCheck, Wallet, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { calculateRSI, willHitStrain, projectSixMonths } from '@/lib/rsi';
import { formatCurrency, formatNumber } from '@/lib/format';
import { t } from '@/lib/i18n';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { LiveTicker } from '@/components/ui/LiveTicker';
import { PortfolioChart } from './PortfolioChart';
import { GeoWidget } from './GeoWidget';
import type { Borrower } from '@/types';

interface DashboardProps {
  onSelectBorrower: (b: Borrower) => void;
  onViewLedger: () => void;
}

export function Dashboard({ onSelectBorrower, onViewLedger }: DashboardProps) {
  const { borrowers, pools } = useStore();

  const stats = useMemo(() => {
    let totalExposure = 0;
    let totalEMI = 0;
    let scores: number[] = [];
    let critical = 0, watch = 0, performing = 0;

    for (const b of borrowers) {
      const rsi = calculateRSI(b);
      totalExposure += b.principal;
      totalEMI += b.emi;
      scores.push(rsi.score);
      if (rsi.tier === 'Critical') critical++;
      else if (rsi.tier === 'Watchlist') watch++;
      else performing++;
    }

    const avgRSI = scores.length > 0 ? Math.round(scores.reduce((a, c) => a + c, 0) / scores.length) : 0;
    
    // Generate mock sparkline data
    const genSpark = (base: number, volatility: number = 0.1) => 
      Array.from({ length: 14 }).map((_, i) => ({ 
        value: base * (1 + (Math.sin(i) * volatility + (Math.random() * volatility * 0.5)))
      }));

    return { 
      totalExposure, 
      totalEMI, 
      avgRSI, 
      critical, 
      watch, 
      performing,
      sparks: {
        exposure: genSpark(totalExposure, 0.05),
        rsi: genSpark(avgRSI, 0.1),
        emi: genSpark(totalEMI, 0.05),
        pools: genSpark(pools.length, 0.02)
      }
    };
  }, [borrowers, pools.length]);

  const earlyWarnings = useMemo(() => {
    return borrowers
      .filter(b => willHitStrain(b))
      .map(b => ({ borrower: b, rsi: calculateRSI(b), projection: projectSixMonths(b) }))
      .sort((a, b) => b.rsi.score - a.rsi.score);
  }, [borrowers]);

  const poolExposure = useMemo(() => {
    return pools.map(pool => {
      const poolBorrowers = borrowers.filter(b => b.poolId === pool.id);
      const exposure = poolBorrowers.reduce((sum, b) => sum + b.principal, 0);
      const avgRSI = poolBorrowers.length > 0
        ? Math.round(poolBorrowers.reduce((sum, b) => sum + calculateRSI(b).score, 0) / poolBorrowers.length)
        : 0;
      return { pool, count: poolBorrowers.length, exposure, avgRSI };
    });
  }, [borrowers, pools]);

  return (
    <div className="space-y-6">
      <LiveTicker />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          label={t('Total Deployed Exposure')}
          value={formatCurrency(stats.totalExposure, true)}
          sub={`${borrowers.length} ${t('active accounts')}`}
          icon={<DollarSign size={20} />}
          accent="primary"
          sparklineData={stats.sparks.exposure}
        />
        <SummaryCard
          label="Average Risk Stress Index"
          value={formatNumber(stats.avgRSI)}
          sub={stats.avgRSI >= 65 ? 'Critical portfolio level' : stats.avgRSI >= 40 ? 'Elevated portfolio risk' : 'Healthy portfolio'}
          icon={<Activity size={20} />}
          accent={stats.avgRSI >= 65 ? 'danger' : stats.avgRSI >= 40 ? 'warning' : 'success'}
          sparklineData={stats.sparks.rsi}
        />
        <SummaryCard
          label="Monthly Debt Service"
          value={formatCurrency(stats.totalEMI, true)}
          sub="Aggregate EMI obligation"
          icon={<TrendingDown size={20} />}
          accent="accent"
          sparklineData={stats.sparks.emi}
        />
        <SummaryCard
          label="Credit Pools Active"
          value={formatNumber(pools.length)}
          sub={`${formatCurrency(stats.totalExposure, true)} deployed`}
          icon={<Building2 size={20} />}
          accent="neutral"
          sparklineData={stats.sparks.pools}
        />
      </div>
      
      {/* Interactive Portfolio Chart */}
      <PortfolioChart />

      {/* Risk tier breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 border-l-4 border-l-success-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide">Performing</p>
              <p className="mt-1 text-3xl font-bold text-ink-900 dark:text-ink-50 stat-value">{stats.performing}</p>
              <p className="text-xs text-ink-500 mt-1">RSI &lt; 40</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-50 dark:bg-success-950/40 flex items-center justify-center text-success-600 dark:text-success-400">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>
        <div className="card p-5 border-l-4 border-l-warning-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide">Watchlist</p>
              <p className="mt-1 text-3xl font-bold text-ink-900 dark:text-ink-50 stat-value">{stats.watch}</p>
              <p className="text-xs text-ink-500 mt-1">RSI 40–64</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning-50 dark:bg-warning-950/40 flex items-center justify-center text-warning-600 dark:text-warning-400">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
        <div className="card p-5 border-l-4 border-l-danger-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide">Critical</p>
              <p className="mt-1 text-3xl font-bold text-ink-900 dark:text-ink-50 stat-value">{stats.critical}</p>
              <p className="text-xs text-ink-500 mt-1">RSI &ge; 65</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-danger-50 dark:bg-danger-950/40 flex items-center justify-center text-danger-600 dark:text-danger-400">
              <AlertOctagon size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Early warning queue + pool exposure */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="card overflow-hidden h-fit">
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink-200 dark:border-ink-800">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={18} className="text-danger-500" />
                <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Early Warning Queue</h3>
                <span className="text-xs text-ink-500 dark:text-ink-400">· projected strain within 60 days</span>
              </div>
              <button onClick={onViewLedger} className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </button>
            </div>
            {earlyWarnings.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <CheckCircle2 size={32} className="mx-auto text-success-500 mb-2" />
                <p className="text-sm text-ink-500 dark:text-ink-400">No borrowers projected to hit strain within 60 days.</p>
              </div>
            ) : (
              <div className="divide-y divide-ink-100 dark:divide-ink-800">
                {earlyWarnings.map(({ borrower, rsi, projection }) => {
                  const strainMonth = projection.find(m => m.projectedRSI >= 65 || m.projectedDSCR < 1.0);
                  return (
                    <button
                      key={borrower.id}
                      onClick={() => onSelectBorrower(borrower)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-ink-50 dark:hover:bg-ink-800/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center flex-shrink-0">
                          <Users size={16} className="text-ink-500 dark:text-ink-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink-900 dark:text-ink-100 truncate">{borrower.borrowerName}</p>
                          <p className="text-xs text-ink-500 dark:text-ink-400 truncate">
                            {borrower.tradeCategory} · {borrower.cluster}
                            {strainMonth && <span className="text-danger-600 dark:text-danger-400 font-medium"> · strain in {strainMonth.label}</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-bold stat-value text-ink-900 dark:text-ink-50">{rsi.score}</p>
                          <p className="text-[10px] text-ink-500 dark:text-ink-400">RSI</p>
                        </div>
                        <RiskBadge tier={rsi.tier} size="sm" />
                        <ArrowRight size={16} className="text-ink-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-ink-200 dark:border-ink-800">
              <Building2 size={18} className="text-primary-500" />
              <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Pool Exposure</h3>
            </div>
            <div className="divide-y divide-ink-100 dark:divide-ink-800">
              {poolExposure.map(({ pool, count, exposure, avgRSI }) => (
                <div key={pool.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900 dark:text-ink-100 truncate">{pool.title}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400">{pool.jurisdiction} · {count} accounts</p>
                    </div>
                    <RiskBadge tier={avgRSI >= 65 ? 'Critical' : avgRSI >= 40 ? 'Watchlist' : 'Performing'} size="sm" />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold stat-value text-ink-900 dark:text-ink-50">
                      {formatCurrency(exposure, true)}
                      <span className="text-[10px] font-medium text-ink-500 dark:text-ink-400 ml-1">/ {formatCurrency(pool.capacity, true)}</span>
                    </span>
                    <span className="text-xs text-ink-500 dark:text-ink-400">avg RSI {avgRSI}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${(exposure / (pool.capacity || 1)) >= 0.9 ? 'bg-danger-500' : (exposure / (pool.capacity || 1)) >= 0.75 ? 'bg-warning-500' : 'bg-primary-500'}`}
                      style={{ width: `${Math.min(100, (exposure / (pool.capacity || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Feed, GeoWidget, AI Insights */}
        <div className="flex flex-col gap-6">
          {/* Live Activity Feed */}
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-ink-200 dark:border-ink-800">
              <Activity size={18} className="text-primary-500" />
              <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Live Activity Feed</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 flex items-center justify-center flex-shrink-0">
                  <DollarSign size={14} />
                </div>
                <div>
                  <p className="text-sm text-ink-900 dark:text-ink-50 font-medium">Repayment Received</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400">Omar Said paid ₹4,500</p>
                  <p className="text-[10px] text-ink-400 mt-0.5">2 mins ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <p className="text-sm text-ink-900 dark:text-ink-50 font-medium">New Origination Approved</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400">TechHub Repair Centre</p>
                  <p className="text-[10px] text-ink-400 mt-0.5">15 mins ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={14} />
                </div>
                <div>
                  <p className="text-sm text-ink-900 dark:text-ink-50 font-medium">Risk Alert</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400">Kilimani Auto Spares RSI increased to 68</p>
                  <p className="text-[10px] text-ink-400 mt-0.5">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
          
          <GeoWidget />

          {/* AI Insights (F19) */}
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-ink-200 dark:border-ink-800">
              <Sparkles size={18} className="text-primary-500" />
              <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">AI Insights</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-primary-50 dark:bg-primary-950/30 p-3 rounded-lg border border-primary-200 dark:border-primary-900/50">
                <p className="text-xs font-semibold text-primary-700 dark:text-primary-400 mb-1">Portfolio Risk Trend</p>
                <p className="text-[11px] text-ink-600 dark:text-ink-300">Average RSI has increased by 4% in the last 30 days, primarily driven by seasonal income drops in the Agriculture sector.</p>
              </div>
              <div className="bg-warning-50 dark:bg-warning-950/30 p-3 rounded-lg border border-warning-200 dark:border-warning-900/50">
                <p className="text-xs font-semibold text-warning-700 dark:text-warning-400 mb-1">Upcoming Vulnerability</p>
                <p className="text-[11px] text-ink-600 dark:text-ink-300">24 borrowers in the 'Mombasa' cluster are projected to enter 'Watchlist' status next month due to declining free operating flow.</p>
              </div>
              <div className="bg-success-50 dark:bg-success-950/30 p-3 rounded-lg border border-success-200 dark:border-success-900/50">
                <p className="text-xs font-semibold text-success-700 dark:text-success-400 mb-1">Restructure Success</p>
                <p className="text-[11px] text-ink-600 dark:text-ink-300">Recent flexible-EMI restructures have improved repayment rates by 12% in the Retail sector.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
