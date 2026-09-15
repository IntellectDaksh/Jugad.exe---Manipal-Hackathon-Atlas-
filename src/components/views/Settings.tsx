import { useRef, useState, useEffect } from 'react';
import { Download, Upload, RotateCcw, Building2, Trash2, AlertCircle, CheckCircle2, Bell, Save, Key, Shield, Globe, Clock, Smartphone, Mail, Eye, Sun, Moon, Banknote, Languages } from 'lucide-react';
import { useStore } from '@/store';
import { formatDate } from '@/lib/format';
import { CustomSelect } from '@/components/ui/CustomSelect';

type SettingsTab = 'general' | 'appearance' | 'notifications' | 'data' | 'danger';

export function Settings() {
  const { borrowers, pools, audit, exportData, importData, resetData, deletePool, darkMode, toggleDarkMode } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDeletePool, setConfirmDeletePool] = useState<string | null>(null);
  
  const [thresholds, setThresholds] = useState({ criticalRsi: 65, watchlistRsi: 40, reserveDays: 30, dscr: 1.2 });
  const [prefs, setPrefs] = useState({ currency: 'INR', lang: 'en', timeout: 30, emailAlerts: true, smsAlerts: false });

  useEffect(() => {
    const savedPrefs = localStorage.getItem('cashpulse_prefs');
    if (savedPrefs) setPrefs(JSON.parse(savedPrefs));
    const savedThresholds = localStorage.getItem('cashpulse_thresholds');
    if (savedThresholds) setThresholds(JSON.parse(savedThresholds));
  }, []);

  const savePrefs = () => {
    localStorage.setItem('cashpulse_prefs', JSON.stringify(prefs));
    localStorage.setItem('cashpulse_currency', prefs.currency);
    showMessage('Preferences saved. Reloading...');
    setTimeout(() => window.location.reload(), 1000);
  };

  const saveThresholds = () => {
    localStorage.setItem('cashpulse_thresholds', JSON.stringify(thresholds));
    showMessage('Thresholds saved. Reloading...');
    setTimeout(() => window.location.reload(), 1000);
  };

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage({ type, text: msg });
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
    showMessage('Ledger exported successfully.');
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
        showMessage(`Imported ${data.borrowers.length} borrowers, ${data.pools.length} pools.`);
      } catch {
        showMessage('Invalid file format. Expected CashPulse export JSON.', 'error');
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in max-w-6xl">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-1">
        <h2 className="text-lg font-bold text-ink-900 dark:text-ink-50 mb-4 px-3">Settings</h2>
        {[
          { id: 'general', label: 'General', icon: Globe },
          { id: 'appearance', label: 'Appearance', icon: Eye },
          { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
          { id: 'data', label: 'Data Management', icon: Save },
          { id: 'danger', label: 'Danger Zone', icon: AlertCircle },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400' : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800'
              }`}
            >
              <Icon size={18} className={active ? 'text-primary-600 dark:text-primary-500' : 'text-ink-400'} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6 relative">
        {message && (
          <div className={`absolute -top-4 right-0 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg animate-slide-down z-50 ${
            message.type === 'success' ? 'bg-success-50 text-success-700 border border-success-200 dark:bg-success-950/90 dark:text-success-400 dark:border-success-900' : 'bg-danger-50 text-danger-700 border border-danger-200 dark:bg-danger-950/90 dark:text-danger-400 dark:border-danger-900'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        {activeTab === 'general' && (
          <div className="card p-6 space-y-6">
            <div className="border-b border-ink-100 dark:border-ink-800 pb-4">
              <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">Localization</h3>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">Configure your region and currency.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="z-20">
                <CustomSelect
                  label="Base Currency"
                  value={prefs.currency}
                  onChange={(v) => setPrefs({...prefs, currency: v})}
                  options={[
                    { value: 'INR', label: 'INR (₹)', icon: <Banknote size={16} /> },
                    { value: 'USD', label: 'USD ($)', icon: <Banknote size={16} /> },
                    { value: 'GBP', label: 'UK POUND (£)', icon: <Banknote size={16} /> },
                    { value: 'EUR', label: 'EURO (€)', icon: <Banknote size={16} /> },
                    { value: 'JPY', label: 'YEN (¥)', icon: <Banknote size={16} /> },
                    { value: 'AUD', label: 'AUD (A$)', icon: <Banknote size={16} /> },
                    { value: 'CAD', label: 'CAD (C$)', icon: <Banknote size={16} /> },
                    { value: 'CHF', label: 'FRANC (CHF)', icon: <Banknote size={16} /> },
                  ]}
                />
              </div>
              <div className="z-10">
                <CustomSelect
                  label="Language"
                  value={prefs.lang}
                  onChange={(v) => setPrefs({...prefs, lang: v})}
                  options={[
                    { value: 'en', label: 'English', icon: <Languages size={16} /> },
                    { value: 'hi', label: 'Hindi (हिन्दी)', icon: <Languages size={16} /> },
                  ]}
                />
              </div>
            </div>
            
            <div className="border-b border-ink-100 dark:border-ink-800 pb-4 pt-6">
              <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">Security</h3>
            </div>
            <div>
              <label className="label-text">Session Timeout (Minutes)</label>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-ink-400" />
                <input type="number" value={prefs.timeout} onChange={e => setPrefs({...prefs, timeout: parseInt(e.target.value) || 30})} className="input-field max-w-[120px]" />
              </div>
            </div>
            <button onClick={savePrefs} className="btn-primary"><Save size={16} /> Save Changes</button>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="card p-6 space-y-6">
            <div className="border-b border-ink-100 dark:border-ink-800 pb-4">
              <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">Theme Preferences</h3>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">Customize the look and feel of CashPulse.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={toggleDarkMode} className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${!darkMode ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-ink-200 dark:border-ink-800 hover:border-primary-300'}`}>
                <div className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"><Sun size={24} className="text-warning-500" /></div>
                <span className="font-semibold text-sm">Light Mode</span>
              </button>
              <button onClick={toggleDarkMode} className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${darkMode ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-ink-200 dark:border-ink-800 hover:border-primary-300'}`}>
                <div className="w-12 h-12 bg-ink-900 rounded-full shadow flex items-center justify-center"><Moon size={24} className="text-primary-400" /></div>
                <span className="font-semibold text-sm">Dark Mode</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="card p-6 space-y-6">
            <div className="border-b border-ink-100 dark:border-ink-800 pb-4">
              <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">Alert Thresholds & Routing</h3>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">Configure when and how the system alerts you.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="label-text">Critical RSI Score ({'>='})</label>
                <input type="number" value={thresholds.criticalRsi} onChange={e => setThresholds({...thresholds, criticalRsi: parseInt(e.target.value) || 0})} className="input-field" />
              </div>
              <div>
                <label className="label-text">Watchlist RSI Score ({'>='})</label>
                <input type="number" value={thresholds.watchlistRsi} onChange={e => setThresholds({...thresholds, watchlistRsi: parseInt(e.target.value) || 0})} className="input-field" />
              </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={prefs.emailAlerts} onChange={e => setPrefs({...prefs, emailAlerts: e.target.checked})} className="w-4 h-4 text-primary-600 rounded border-ink-300" />
                <Mail size={16} className="text-ink-500" />
                <span className="text-sm font-medium text-ink-700 dark:text-ink-300">Email alerts for Critical breaches</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={prefs.smsAlerts} onChange={e => setPrefs({...prefs, smsAlerts: e.target.checked})} className="w-4 h-4 text-primary-600 rounded border-ink-300" />
                <Smartphone size={16} className="text-ink-500" />
                <span className="text-sm font-medium text-ink-700 dark:text-ink-300">SMS alerts for Defaults</span>
              </label>
            </div>
            <button onClick={saveThresholds} className="btn-primary"><Save size={16} /> Save Settings</button>
          </div>
        )}



        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <div className="border-b border-ink-100 dark:border-ink-800 pb-4 mb-4">
                <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">Import / Export</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleExport} className="btn-primary"><Download size={16} /> Export Ledger (JSON)</button>
                <button onClick={() => fileRef.current?.click()} className="btn-secondary"><Upload size={16} /> Import Ledger</button>
                <input ref={fileRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-ink-200 dark:border-ink-800">
                <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 flex items-center gap-2">
                  <Building2 size={16} className="text-primary-500" /> Credit Pool Management
                </h3>
              </div>
              <div className="divide-y divide-ink-100 dark:divide-ink-800">
                {pools.map(pool => (
                  <div key={pool.id} className="px-5 py-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{pool.title}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{pool.jurisdiction}</p>
                    </div>
                    {confirmDeletePool === pool.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => { deletePool(pool.id); setConfirmDeletePool(null); }} className="btn-danger text-xs px-3 py-1">Confirm</button>
                        <button onClick={() => setConfirmDeletePool(null)} className="btn-ghost text-xs px-3 py-1">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDeletePool(pool.id)} className="btn-ghost p-2 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded"><Trash2 size={16} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="card p-6 border-danger-200 dark:border-danger-900/50 bg-danger-50/30 dark:bg-danger-950/10">
            <h3 className="text-base font-bold text-danger-700 dark:text-danger-400 mb-2 flex items-center gap-2"><AlertCircle size={18} /> Danger Zone</h3>
            <p className="text-sm text-ink-600 dark:text-ink-400 mb-6">Resetting data will permanently delete all borrowers, pools, and audit logs. This cannot be undone.</p>
            {confirmReset ? (
              <div className="flex items-center gap-3">
                <button onClick={() => { resetData(); setConfirmReset(false); showMessage('System reset to factory defaults.'); }} className="btn-danger"><RotateCcw size={16} /> Yes, Factory Reset</button>
                <button onClick={() => setConfirmReset(false)} className="btn-ghost font-medium">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmReset(true)} className="btn-secondary border-danger-200 text-danger-700 hover:bg-danger-100"><RotateCcw size={16} /> Reset to Demo Data</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
