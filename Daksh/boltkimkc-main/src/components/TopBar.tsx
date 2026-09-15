import { Activity, Menu, Moon, Sun, ShieldCheck, Plus } from 'lucide-react';
import type { ViewKey } from '@/types';
import { useStore } from '@/store';

interface TopBarProps {
  view: ViewKey;
  onMenuClick: () => void;
  onUnderwrite: () => void;
  onNewPool: () => void;
}

const viewTitles: Record<ViewKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Portfolio Dashboard', subtitle: 'Risk overview and early warnings' },
  ledger: { title: 'Credit Facility Ledger', subtitle: 'All active accounts and borrowers' },
  sandbox: { title: 'Stress Test Sandbox', subtitle: 'Simulate revenue and outflow shocks' },
  heatmap: { title: 'Seasonal Risk Heatmap', subtitle: '12-month lean income analysis' },
  audit: { title: 'Audit & Compliance Log', subtitle: 'Immutable record of all modifications' },
  settings: { title: 'Settings & Data Management', subtitle: 'Import, export, and pool management' },
};

export function TopBar({ view, onMenuClick, onUnderwrite, onNewPool }: TopBarProps) {
  const { darkMode, toggleDarkMode } = useStore();
  const info = viewTitles[view];

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-ink-900/80 backdrop-blur-md border-b border-ink-200 dark:border-ink-800">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800">
            <Menu size={20} />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <Activity size={18} strokeWidth={2.5} />
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-ink-900 dark:text-ink-50 truncate">{info.title}</h2>
            <p className="text-xs text-ink-500 dark:text-ink-400 truncate hidden sm:block">{info.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="p-2 rounded-lg text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={onUnderwrite} className="hidden sm:inline-flex btn-primary text-xs px-3 py-2">
            <ShieldCheck size={15} /> Underwrite
          </button>
          <button onClick={onNewPool} className="hidden sm:inline-flex btn-secondary text-xs px-3 py-2">
            <Plus size={15} /> New Pool
          </button>
        </div>
      </div>
    </header>
  );
}
