import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/format';
import { Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LiveTicker() {
  const { borrowers } = useStore();
  const [transactions, setTransactions] = useState<{ id: number; name: string; amount: number }[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (borrowers.length === 0) return;
    
    const interval = setInterval(() => {
      const b = borrowers[Math.floor(Math.random() * borrowers.length)];
      const amount = Math.max(100, Math.round(b.emi * (Math.random() * 0.2 + 0.1) / 100) * 100);
      
      setTransactions(prev => {
        const newTx = [{ id: counter, name: b.borrowerName, amount }, ...prev].slice(0, 5);
        return newTx;
      });
      setCounter(c => c + 1);
    }, 4500);

    return () => clearInterval(interval);
  }, [borrowers, counter]);

  if (transactions.length === 0) return null;

  return (
    <div className="flex items-center gap-3 bg-ink-900 dark:bg-ink-950 text-white px-4 py-2 rounded-lg overflow-hidden border border-ink-800 shadow-md">
      <div className="flex items-center gap-1.5 text-primary-400 font-semibold text-[10px] uppercase tracking-wider flex-shrink-0">
        <Zap size={14} className="animate-pulse" /> Live Feed
      </div>
      <div className="flex-1 overflow-hidden relative h-6">
        <AnimatePresence>
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center gap-2 text-xs"
            >
              <span className="text-success-400 font-bold">+{formatCurrency(tx.amount)}</span>
              <span className="text-ink-400">received from</span>
              <span className="text-ink-100 font-medium truncate">{tx.name}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
