import { Activity, Search, Bell, ChevronDown } from 'lucide-react';
import type { ViewKey } from '@/types';

interface NavbarProps {
  activeView: ViewKey;
  onViewChange: (view: ViewKey) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const tabs: { key: ViewKey; label: string }[] = [
  { key: 'portfolio', label: 'Portfolio Monitor' },
  { key: 'borrower', label: 'Borrower Analytics' },
  { key: 'simulator', label: 'What-If Simulator' },
  { key: 'audit', label: 'Audit & Explainability' },
];

export default function Navbar({ activeView, onViewChange, searchQuery, onSearchChange }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-800 leading-none tracking-tight">
                Cash<span className="text-blue-600">Pulse</span>
              </span>
              <span className="text-[10px] text-slate-400 leading-none mt-0.5">AI Repayment Intelligence</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="hidden lg:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onViewChange(tab.key)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === tab.key
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search borrowers..."
                className="w-48 lg:w-64 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Notification badge */}
            <button className="relative flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 hover:bg-red-100 transition-colors">
              <Bell className="w-4 h-4 text-red-600" />
              <span className="text-xs font-semibold text-red-700 hidden sm:inline">
                3 Borrowers in Critical Stress
              </span>
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                3
              </span>
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white">
                PM
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden flex items-center gap-1 pb-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onViewChange(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeView === tab.key
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
