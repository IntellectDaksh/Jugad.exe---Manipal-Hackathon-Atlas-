import { useState, useMemo } from 'react';
import { ScrollText, Search, Trash2, ShieldCheck, Building2, RotateCcw, Download, AlertCircle } from 'lucide-react';
import { useStore } from '@/store';
import { formatRelativeTime, formatDate } from '@/lib/format';

const actionConfig: Record<string, { icon: typeof ShieldCheck; color: string; bg: string }> = {
  UNDERWRITE: { icon: ShieldCheck, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-950/40' },
  POOL_CREATE: { icon: Building2, color: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-50 dark:bg-accent-950/40' },
  POOL_DELETE: { icon: Building2, color: 'text-danger-600 dark:text-danger-400', bg: 'bg-danger-50 dark:bg-danger-950/40' },
  RESTRUCTURE: { icon: RotateCcw, color: 'text-warning-600 dark:text-warning-400', bg: 'bg-warning-50 dark:bg-warning-950/40' },
  STATUS_CHANGE: { icon: AlertCircle, color: 'text-danger-600 dark:text-danger-400', bg: 'bg-danger-50 dark:bg-danger-950/40' },
  IMPORT: { icon: Download, color: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-50 dark:bg-accent-950/40' },
};

export function AuditLog() {
  const { audit, clearAudit } = useStore();
  const [search, setSearch] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return audit;
    const q = search.toLowerCase();
    return audit.filter(a =>
      a.action.toLowerCase().includes(q) ||
      a.detail.toLowerCase().includes(q) ||
      a.entity.toLowerCase().includes(q) ||
      a.user.toLowerCase().includes(q)
    );
  }, [audit, search]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search audit entries..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-ink-500 dark:text-ink-400 whitespace-nowrap">{filtered.length} entries</span>
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <button onClick={() => { clearAudit(); setConfirmClear(false); }} className="btn-danger text-xs px-3 py-2">Confirm Clear</button>
                <button onClick={() => setConfirmClear(false)} className="btn-ghost text-xs px-3 py-2">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)} className="btn-secondary text-xs px-3 py-2">
                <Trash2 size={14} /> Clear Log
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <ScrollText size={28} className="mx-auto text-ink-300 dark:text-ink-600 mb-2" />
            <p className="text-sm text-ink-500 dark:text-ink-400">No audit entries found.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-px bg-ink-200 dark:bg-ink-800 hidden sm:block" />

            <div className="divide-y divide-ink-100 dark:divide-ink-800">
              {filtered.map(entry => {
                const cfg = actionConfig[entry.action] ?? { icon: ScrollText, color: 'text-ink-500', bg: 'bg-ink-100 dark:bg-ink-800' };
                const Icon = cfg.icon;
                return (
                  <div key={entry.id} className="flex items-start gap-4 px-5 py-4 hover:bg-ink-50 dark:hover:bg-ink-800/30 transition-colors">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.color} relative z-10`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wide text-ink-700 dark:text-ink-200">{entry.action.replace(/_/g, ' ')}</span>
                        <span className="text-xs text-ink-400">·</span>
                        <span className="text-xs text-ink-500 dark:text-ink-400">{entry.entity}</span>
                      </div>
                      <p className="text-sm text-ink-800 dark:text-ink-200 mt-1">{entry.detail}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-ink-400 dark:text-ink-500">
                        <span>{formatRelativeTime(entry.timestamp)}</span>
                        <span>·</span>
                        <span>{formatDate(entry.timestamp)}</span>
                        <span>·</span>
                        <span className="font-mono">{entry.user}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
