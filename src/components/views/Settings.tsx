import { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, Building2, Trash2, AlertCircle, CheckCircle2, Bell, Save } from 'lucide-react';
import { useStore } from '@/store';
import { formatDate } from '@/lib/format';

export function Settings() {
  const { borrowers, pools, audit, exportData, importData, resetData, deletePool } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDeletePool, setConfirmDeletePool] = useState<string | null>(null);
  
  // F15: Customizable Alert Thresholds
  const [thresholds, setThresholds] = useState({
    criticalRsi: 65,
    watchlistRsi: 40,
    reserveDays: 30,
    dscr: 1.2
  });

  const handleSaveThresholds = () => {
    setMessage({ type: 'success', text: 'Alert thresholds updated successfully.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cashpulse-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: 'Ledger exported successfully.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!data.borrowers || !data.pools) throw new Error('Invalid format');
        importData(data);
        setMessage({ type: 'success', text: `Imported ${data.borrowers.length} borrowers, ${data.pools.length} pools.` });
      } catch {
        setMessage({ type: 'error', text: 'Invalid file format. Expected CashPulse export JSON.' });
      }
      setTimeout(() => setMessage(null), 3000);
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === 'success'
            ? 'bg-success-50 dark:bg-success-950/40 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-900'
            : 'bg-danger-50 dark:bg-danger-950/40 text-danger-700 dark:text-danger-400 border border-danger-200 dark:border-danger-900'
        } animate-fade-in`}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Data Management */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 mb-1">Data Import / Export</h3>
        <p className="text-xs text-ink-500 dark:text-ink-400 mb-4">Export the full ledger as JSON or import a previously saved export.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="btn-primary">
            <Download size={16} /> Export Ledger
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn-secondary">
            <Upload size={16} /> Import Ledger
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="bg-ink-50 dark:bg-ink-800/50 rounded-lg p-3">
            <p className="text-2xl font-bold stat-value text-ink-900 dark:text-ink-50">{borrowers.length}</p>
            <p className="text-xs text-ink-500">Borrowers</p>
          </div>
          <div className="bg-ink-50 dark:bg-ink-800/50 rounded-lg p-3">
            <p className="text-2xl font-bold stat-value text-ink-900 dark:text-ink-50">{pools.length}</p>
            <p className="text-xs text-ink-500">Credit Pools</p>
          </div>
          <div className="bg-ink-50 dark:bg-ink-800/50 rounded-lg p-3">
            <p className="text-2xl font-bold stat-value text-ink-900 dark:text-ink-50">{audit.length}</p>
            <p className="text-xs text-ink-500">Audit Entries</p>
          </div>
        </div>
      </div>

      {/* Customizable Alert Thresholds (F15) */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 mb-1 flex items-center gap-2">
          <Bell size={16} className="text-primary-500" /> Alert Thresholds
        </h3>
        <p className="text-xs text-ink-500 dark:text-ink-400 mb-4">Configure when the system should flag borrowers for intervention.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-ink-700 dark:text-ink-300 mb-1">Critical RSI Score ({'>='})</label>
            <input 
              type="number" 
              value={thresholds.criticalRsi} 
              onChange={e => setThresholds({...thresholds, criticalRsi: parseInt(e.target.value) || 0})}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-700 dark:text-ink-300 mb-1">Watchlist RSI Score ({'>='})</label>
            <input 
              type="number" 
              value={thresholds.watchlistRsi} 
              onChange={e => setThresholds({...thresholds, watchlistRsi: parseInt(e.target.value) || 0})}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-700 dark:text-ink-300 mb-1">Minimum Reserve Days</label>
            <input 
              type="number" 
              value={thresholds.reserveDays} 
              onChange={e => setThresholds({...thresholds, reserveDays: parseInt(e.target.value) || 0})}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-700 dark:text-ink-300 mb-1">Minimum DSCR</label>
            <input 
              type="number" 
              step="0.1"
              value={thresholds.dscr} 
              onChange={e => setThresholds({...thresholds, dscr: parseFloat(e.target.value) || 0})}
              className="input-field w-full"
            />
          </div>
        </div>
        <button onClick={handleSaveThresholds} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
          <Save size={16} /> Save Thresholds
        </button>
      </div>

      {/* Credit Pool Management */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-200 dark:border-ink-800">
          <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 flex items-center gap-2">
            <Building2 size={16} className="text-primary-500" /> Credit Pool Management
          </h3>
        </div>
        <div className="divide-y divide-ink-100 dark:divide-ink-800">
          {pools.map(pool => {
            const count = borrowers.filter(b => b.poolId === pool.id).length;
            return (
              <div key={pool.id} className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{pool.title}</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{pool.jurisdiction} · {count} accounts</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">{pool.mandate}</p>
                  <p className="text-[10px] text-ink-400 mt-1">Created {formatDate(pool.createdAt)}</p>
                </div>
                {confirmDeletePool === pool.id ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => { deletePool(pool.id); setConfirmDeletePool(null); }} className="btn-danger text-xs px-3 py-2">Confirm</button>
                    <button onClick={() => setConfirmDeletePool(null)} className="btn-ghost text-xs px-3 py-2">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeletePool(pool.id)} className="btn-ghost text-xs px-2 py-2 flex-shrink-0">
                    <Trash2 size={14} className="text-danger-500" />
                  </button>
                )}
              </div>
            );
          })}
          {pools.length === 0 && (
            <p className="px-5 py-8 text-sm text-ink-500 text-center">No credit pools created yet.</p>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-5 border-danger-200 dark:border-danger-900">
        <h3 className="text-sm font-semibold text-danger-700 dark:text-danger-400 mb-1 flex items-center gap-2">
          <AlertCircle size={16} /> Danger Zone
        </h3>
        <p className="text-xs text-ink-500 dark:text-ink-400 mb-4">Reset all data to the original demo dataset. This cannot be undone.</p>
        {confirmReset ? (
          <div className="flex items-center gap-2">
            <button onClick={() => { resetData(); setConfirmReset(false); setMessage({ type: 'success', text: 'Data reset to demo defaults.' }); setTimeout(() => setMessage(null), 3000); }} className="btn-danger">
              <RotateCcw size={16} /> Confirm Reset
            </button>
            <button onClick={() => setConfirmReset(false)} className="btn-ghost">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setConfirmReset(true)} className="btn-secondary">
            <RotateCcw size={16} /> Reset to Demo Data
          </button>
        )}
      </div>
    </div>
  );
}
