import { Activity, LayoutDashboard, TableProperties, FlaskConical, CalendarDays, ScrollText, Settings, Moon, Sun, ShieldCheck } from 'lucide-react';
import type { ViewKey } from '@/types';
import { useStore } from '@/store';

interface SidebarProps {
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

export function Sidebar({ view, onViewChange, onUnderwrite, onNewPool }: SidebarProps) {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-ink-200 dark:border-ink-800">
        <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white">
          <Activity size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-base font-bold text-ink-900 dark:text-ink-50 leading-tight">CashPulse</h1>
          <p className="text-[10px] text-ink-500 dark:text-ink-400 font-medium uppercase tracking-wider">Credit Risk Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300'
                  : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-200'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3 space-y-1.5 border-t border-ink-200 dark:border-ink-800">
        <button onClick={onUnderwrite} className="w-full btn-primary text-xs py-2.5">
          <ShieldCheck size={16} /> Underwrite Borrower
        </button>
        <button onClick={onNewPool} className="w-full btn-secondary text-xs py-2.5">
          New Credit Pool
        </button>
      </div>

      <div className="px-3 py-3 border-t border-ink-200 dark:border-ink-800">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <div className="px-5 py-3 border-t border-ink-200 dark:border-ink-800">
        <p className="text-[10px] text-ink-400 dark:text-ink-500 leading-relaxed">
          Aligned with UN SDG 8 — Decent Work & Economic Growth. Responsible microfinance tooling.
        </p>
      </div>
    </aside>
  );
}
