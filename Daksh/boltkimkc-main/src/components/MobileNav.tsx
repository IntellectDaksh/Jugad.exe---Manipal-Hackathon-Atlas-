import { X, ShieldCheck, Plus, Activity } from 'lucide-react';
import type { ViewKey } from '@/types';
import { LayoutDashboard, TableProperties, FlaskConical, CalendarDays, ScrollText, Settings } from 'lucide-react';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  view: ViewKey;
  onViewChange: (v: ViewKey) => void;
  onUnderwrite: () => void;
  onNewPool: () => void;
}

const navItems: { key: ViewKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'ledger', label: 'Credit Ledger', icon: TableProperties },
  { key: 'sandbox', label: 'Stress Sandbox', icon: FlaskConical },
  { key: 'heatmap', label: 'Seasonal Heatmap', icon: CalendarDays },
  { key: 'audit', label: 'Audit Log', icon: ScrollText },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export function MobileNav({ open, onClose, view, onViewChange, onUnderwrite, onNewPool }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-ink-900 flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-200 dark:border-ink-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-bold text-ink-900 dark:text-ink-50">CashPulse</h1>
              <p className="text-[10px] text-ink-500 font-medium uppercase tracking-wider">Credit Risk Platform</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { onViewChange(item.key); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300'
                    : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-3 space-y-1.5 border-t border-ink-200 dark:border-ink-800">
          <button onClick={() => { onUnderwrite(); onClose(); }} className="w-full btn-primary text-xs py-2.5">
            <ShieldCheck size={16} /> Underwrite Borrower
          </button>
          <button onClick={() => { onNewPool(); onClose(); }} className="w-full btn-secondary text-xs py-2.5">
            <Plus size={16} /> New Credit Pool
          </button>
        </div>
      </div>
    </div>
  );
}
