import { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, User, Building2, TrendingUp, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/format';
import { calculateRSI } from '@/lib/rsi';
import type { Borrower } from '@/types';

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
  onSelectBorrower: (borrower: Borrower) => void;
}

export function GlobalSearch({ open, onClose, onSelectBorrower }: GlobalSearchProps) {
  const { borrowers } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [open]);

  const results = borrowers.filter(b => {
    if (!query) return false;
    const q = query.toLowerCase();
    return b.borrowerName.toLowerCase().includes(q) || 
           b.tradeCategory.toLowerCase().includes(q) ||
           b.cluster.toLowerCase().includes(q) ||
           b.id.toLowerCase().includes(q);
  }).slice(0, 5); // top 5 results

  return (
    <Modal open={open} onClose={onClose} size="md" title="" hideHeader={true}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-ink-200 dark:border-ink-800">
        <Search size={18} className="text-ink-400" />
        <input 
          ref={inputRef}
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search borrowers, trades, clusters..." 
          className="flex-1 bg-transparent border-none outline-none text-ink-900 dark:text-ink-50 placeholder:text-ink-400 text-sm"
        />
        <div className="flex gap-1 text-[10px] text-ink-400 font-medium">
          <kbd className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 border border-ink-200 dark:border-ink-700">ESC</kbd>
        </div>
      </div>
      
      <div className="p-2 min-h-[200px] max-h-[400px] overflow-y-auto">
        {!query && (
          <div className="flex flex-col items-center justify-center h-full text-ink-400 pt-12 pb-8">
            <Search size={32} className="mb-2 opacity-20" />
            <p className="text-sm">Type to start searching...</p>
          </div>
        )}
        
        {query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-ink-400 pt-12 pb-8">
            <AlertTriangle size={32} className="mb-2 opacity-20" />
            <p className="text-sm">No borrowers found for "{query}"</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-1">
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-500">Borrowers</p>
            {results.map(b => {
              const rsi = calculateRSI(b);
              return (
                <button 
                  key={b.id}
                  onClick={() => { onClose(); onSelectBorrower(b); }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800/50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{b.borrowerName}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-ink-500">
                        <span className="flex items-center gap-1"><Building2 size={10} /> {b.tradeCategory}</span>
                        <span className="flex items-center gap-1"><TrendingUp size={10} /> {rsi.score} RSI</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold text-ink-700 dark:text-ink-300">{formatCurrency(b.principal)}</p>
                      <p className="text-[10px] text-ink-500">{rsi.tier}</p>
                    </div>
                    <ChevronRight size={16} className="text-ink-300 dark:text-ink-600 group-hover:text-primary-500 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
