import { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useStore } from '@/store';
import { calculateRSI, willHitStrain } from '@/lib/rsi';
import { motion, AnimatePresence } from 'framer-motion';

export function TopBarAlerts() {
  const [isOpen, setIsOpen] = useState(false);
  const { borrowers } = useStore();
  const menuRef = useRef<HTMLDivElement>(null);

  const alerts = borrowers
    .filter(b => willHitStrain(b))
    .map(b => ({ borrower: b, rsi: calculateRSI(b) }))
    .sort((a, b) => b.rsi.score - a.rsi.score)
    .slice(0, 5); // top 5

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 rounded-lg text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
      >
        <Bell size={18} />
        {alerts.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-ink-900 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-ink-900 rounded-xl shadow-xl border border-ink-200 dark:border-ink-800 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950/50">
              <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Predictive Alerts</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-ink-500 dark:text-ink-400">
                  No critical alerts detected.
                </div>
              ) : (
                <div className="divide-y divide-ink-100 dark:divide-ink-800">
                  {alerts.map(({ borrower, rsi }) => (
                    <div key={borrower.id} className="px-4 py-3 hover:bg-ink-50 dark:hover:bg-ink-800/30 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {rsi.score >= 65 ? <AlertOctagon size={16} className="text-danger-500" /> : <AlertTriangle size={16} className="text-warning-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink-900 dark:text-ink-100">
                            {borrower.borrowerName} <span className="text-ink-500 font-normal">may default soon</span>
                          </p>
                          <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                            Projected RSI spike to {rsi.score}. Recommend structural intervention.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
