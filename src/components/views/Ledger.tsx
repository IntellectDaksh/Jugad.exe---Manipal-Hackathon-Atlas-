import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Users, Filter, Download, Plus, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { calculateRSI } from '@/lib/rsi';
import { formatCurrency, formatDate } from '@/lib/format';
import { RiskBadge, StatusBadge } from '@/components/ui/RiskBadge';
import type { Borrower, RiskTier } from '@/types';

interface LedgerProps {
  onSelectBorrower: (b: Borrower) => void;
  onAddPayment: (b: Borrower) => void;
}

type SortKey = 'borrowerName' | 'rsi' | 'emi' | 'principal' | 'maturity';
type SortDir = 'asc' | 'desc';

export function Ledger({ onSelectBorrower, onAddPayment }: LedgerProps) {
  const { borrowers, pools } = useStore();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<RiskTier | 'all'>('all');
  const [poolFilter, setPoolFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('rsi');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState<string | null>(null);

  const enriched = useMemo(() => {
    return borrowers.map(b => ({ borrower: b, rsi: calculateRSI(b) }));
  }, [borrowers]);

  const filtered = useMemo(() => {
    let result = enriched;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(({ borrower }) =>
        borrower.borrowerName.toLowerCase().includes(q) ||
        borrower.tradeCategory.toLowerCase().includes(q) ||
        borrower.cluster.toLowerCase().includes(q) ||
        borrower.id.toLowerCase().includes(q)
      );
    }

    if (tierFilter !== 'all') {
      result = result.filter(({ rsi }) => rsi.tier === tierFilter);
    }

    if (poolFilter !== 'all') {
      result = result.filter(({ borrower }) => borrower.poolId === poolFilter);
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(({ borrower }) => borrower.status.toLowerCase() === statusFilter.toLowerCase());
    }

    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'borrowerName':
          cmp = a.borrower.borrowerName.localeCompare(b.borrower.borrowerName);
          break;
        case 'rsi':
          cmp = a.rsi.score - b.rsi.score;
          break;
        case 'emi':
          cmp = a.borrower.emi - b.borrower.emi;
          break;
        case 'principal':
          cmp = a.borrower.principal - b.borrower.principal;
          break;
        case 'maturity':
          cmp = new Date(a.borrower.maturity).getTime() - new Date(b.borrower.maturity).getTime();
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [enriched, search, tierFilter, poolFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'borrowerName' ? 'asc' : 'desc');
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={13} className="text-ink-300 dark:text-ink-600" />;
    return sortDir === 'asc' ? <ArrowUp size={13} className="text-primary-500" /> : <ArrowDown size={13} className="text-primary-500" />;
  };

  const exportCSV = () => {
    const headers = ['Borrower Name', 'ID', 'Category', 'Cluster', 'Principal', 'EMI', 'Maturity', 'Status', 'RSI Score', 'RSI Tier'];
    const exportData = selectedIds.size > 0 ? filtered.filter(f => selectedIds.has(f.borrower.id)) : filtered;
    const rows = exportData.map(({ borrower, rsi }) => [
      `"${borrower.borrowerName}"`,
      borrower.id,
      `"${borrower.tradeCategory}"`,
      `"${borrower.cluster}"`,
      borrower.principal,
      borrower.emi,
      borrower.maturity,
      borrower.status,
      rsi.score,
      rsi.tier
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ledger_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(f => f.borrower.id)));
    }
  };

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleAddPayment = (e: React.MouseEvent, borrower: Borrower) => {
    e.stopPropagation();
    onAddPayment(borrower);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search borrowers, categories, clusters..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
              <select
                value={tierFilter}
                onChange={e => setTierFilter(e.target.value as RiskTier | 'all')}
                className="input-field pl-9 pr-8 appearance-none cursor-pointer"
              >
                <option value="all">All Tiers</option>
                <option value="Performing">Performing</option>
                <option value="Watchlist">Watchlist</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <select
              value={poolFilter}
              onChange={e => setPoolFilter(e.target.value)}
              className="input-field pr-8 appearance-none cursor-pointer"
            >
              <option value="all">All Pools</option>
              {pools.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="input-field pr-8 appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="restructured">Restructured</option>
              <option value="default">Default</option>
            </select>
            
            <button onClick={exportCSV} className="btn-secondary whitespace-nowrap flex items-center gap-2">
              <Download size={16} /> <span className="hidden sm:inline">Export {selectedIds.size > 0 ? `Selected (${selectedIds.size})` : 'All'}</span>
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 bg-ink-900 dark:bg-white text-white dark:text-ink-900 px-4 py-2 rounded-lg shadow-xl font-medium text-sm flex items-center gap-2"
          >
            <CheckSquare size={16} className="text-success-500" />
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950/50">
                <th className="px-4 py-3 text-left w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === filtered.length && filtered.length > 0} 
                    onChange={toggleSelectAll}
                    className="rounded border-ink-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                </th>
                <th className="table-header text-left px-4 py-3">
                  <button onClick={() => toggleSort('borrowerName')} className="flex items-center gap-1.5 hover:text-ink-700 dark:hover:text-ink-200">
                    Borrower <SortIcon col="borrowerName" />
                  </button>
                </th>
                <th className="table-header text-left px-4 py-3 hidden md:table-cell">Category</th>
                <th className="table-header text-left px-4 py-3 hidden lg:table-cell">Cluster</th>
                <th className="table-header text-right px-4 py-3 hidden sm:table-cell">
                  <button onClick={() => toggleSort('principal')} className="flex items-center gap-1.5 ml-auto hover:text-ink-700 dark:hover:text-ink-200">
                    Principal <SortIcon col="principal" />
                  </button>
                </th>
                <th className="table-header text-right px-4 py-3">
                  <button onClick={() => toggleSort('emi')} className="flex items-center gap-1.5 ml-auto hover:text-ink-700 dark:hover:text-ink-200">
                    EMI <SortIcon col="emi" />
                  </button>
                </th>
                <th className="table-header text-center px-4 py-3">
                  <button onClick={() => toggleSort('rsi')} className="flex items-center gap-1.5 mx-auto hover:text-ink-700 dark:hover:text-ink-200">
                    RSI <SortIcon col="rsi" />
                  </button>
                </th>
                <th className="table-header text-left px-4 py-3 hidden xl:table-cell">
                  <button onClick={() => toggleSort('maturity')} className="flex items-center gap-1.5 hover:text-ink-700 dark:hover:text-ink-200">
                    Maturity <SortIcon col="maturity" />
                  </button>
                </th>
                <th className="table-header text-left px-4 py-3">Status</th>
                <th className="table-header text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-ink-500 dark:text-ink-400">
                    <Users size={28} className="mx-auto mb-2 text-ink-300 dark:text-ink-600" />
                    No accounts match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map(({ borrower, rsi }, i) => (
                  <motion.tr
                    key={borrower.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.05, 0.5) }}
                    onClick={() => onSelectBorrower(borrower)}
                    className={`cursor-pointer hover:bg-ink-50 dark:hover:bg-ink-800/40 transition-colors ${selectedIds.has(borrower.id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                  >
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(borrower.id)} 
                        onChange={(e) => toggleSelect(e as any, borrower.id)}
                        className="rounded border-ink-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-ink-600 dark:text-ink-300">
                            {borrower.borrowerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink-900 dark:text-ink-100 truncate">{borrower.borrowerName}</p>
                          <p className="text-xs text-ink-500 dark:text-ink-400 truncate">{borrower.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-ink-600 dark:text-ink-300">{borrower.tradeCategory}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-ink-600 dark:text-ink-300">{borrower.cluster}</td>
                    <td className="px-4 py-3 text-right stat-value text-ink-900 dark:text-ink-100 hidden sm:table-cell">{formatCurrency(borrower.principal, true)}</td>
                    <td className="px-4 py-3 text-right stat-value text-ink-900 dark:text-ink-100">{formatCurrency(borrower.emi)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-base font-bold stat-value text-ink-900 dark:text-ink-50">{rsi.score}</span>
                        <RiskBadge tier={rsi.tier} size="sm" />
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell text-ink-600 dark:text-ink-300 text-xs">{formatDate(borrower.maturity)}</td>
                    <td className="px-4 py-3"><StatusBadge status={borrower.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={(e) => handleAddPayment(e, borrower)}
                        className="p-1.5 text-ink-400 hover:text-success-600 hover:bg-success-50 dark:hover:bg-success-900/30 rounded transition-colors"
                        title="Quick Add Payment"
                      >
                        <Plus size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-ink-200 dark:border-ink-800 text-xs text-ink-500 dark:text-ink-400">
            Showing {filtered.length} of {borrowers.length} accounts
          </div>
        )}
      </div>
    </div>
  );
}
