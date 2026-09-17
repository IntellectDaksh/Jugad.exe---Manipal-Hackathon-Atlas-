import { Activity, Menu, Moon, Sun, ShieldCheck, Plus } from 'lucide-react';
import type { ViewKey } from '@/types';
import { useStore } from '@/store';
import { TopBarAlerts } from './ui/TopBarAlerts';

interface TopBarProps {
  view: ViewKey;
  onMenuClick: () => void;
  onUnderwrite: () => void;
  onNewPool: () => void;
  onSearchClick: () => void;
  onSelectBorrower: (b: any) => void;
}

const viewTitles: Record<ViewKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Portfolio Dashboard', subtitle: 'Risk overview and early warnings' },
  ledger: { title: 'Credit Facility Ledger', subtitle: 'All active accounts and borrowers' },
  sandbox: { title: 'Stress Test Sandbox', subtitle: 'Simulate revenue and outflow shocks' },
  heatmap: { title: 'Seasonal Risk Heatmap', subtitle: '12-month lean income analysis' },
  audit: { title: 'Audit & Compliance Log', subtitle: 'Immutable record of all modifications' },
  settings: { title: 'Settings & Data Management', subtitle: 'Import, export, and pool management' },
  origination: { title: 'Origination Hub', subtitle: 'Process and review new applications' },
  analytics: { title: 'Macro Analytics', subtitle: 'Portfolio distribution and risk factors' },
  compliance: { title: 'Compliance & Reports', subtitle: 'Basel-III reporting and system audit' },
};

export function TopBar({ view, onMenuClick, onUnderwrite, onNewPool, onSearchClick, onSelectBorrower }: TopBarProps) {
  const { darkMode, toggleDarkMode } = useStore();
  const info = viewTitles[view];

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-ink-900/80 backdrop-blur-md border-b border-ink-200 dark:border-ink-800">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800">
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-ink-900 dark:text-ink-50 truncate">{info.title}</h2>
            <p className="text-xs text-ink-500 dark:text-ink-400 truncate hidden sm:block">{info.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex relative max-w-md w-full mr-2">
            <input 
              type="text" 
              placeholder="Search borrowers... (Cmd+K)" 
              onClick={onSearchClick}
              readOnly
              className="w-full bg-ink-100 dark:bg-ink-800/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm text-ink-900 dark:text-ink-50 focus:ring-2 focus:ring-primary-500 cursor-pointer"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
          
          <button onClick={onSearchClick} className="md:hidden p-2 rounded-lg text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>

          <TopBarAlerts onSelectBorrower={onSelectBorrower} />
          
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
