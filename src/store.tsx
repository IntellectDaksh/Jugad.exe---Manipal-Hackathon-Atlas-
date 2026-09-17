import { useState, useCallback, useContext, createContext, type ReactNode, useEffect } from 'react';
import type { Borrower, CreditPool, AuditEntry, OriginationApplication, ApplicationStage } from '@/types';
import { pools as initialPools, borrowers as initialBorrowers, auditLog as initialAudit } from '@/lib/mockData';
import { mockApplications } from '@/lib/mockOrigination';
import { generateId } from '@/lib/format';
import { defaultSeasonalProfile } from '@/lib/rsi';

interface StoreState {
  borrowers: Borrower[];
  pools: CreditPool[];
  audit: AuditEntry[];
  applications: OriginationApplication[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  addBorrower: (b: Omit<Borrower, 'id' | 'createdAt' | 'seasonalProfile' | 'restructured' | 'status'>) => void;
  updateBorrower: (id: string, patch: Partial<Borrower>) => void;
  deleteBorrower: (id: string) => void;
  restructureBorrower: (id: string, terms: { newEmi: number; newMaturity: string; termMonths: number; interestRate: number; reason: string }) => void;
  addPool: (p: Omit<CreditPool, 'id' | 'createdAt'>) => void;
  updatePool: (id: string, patch: Partial<CreditPool>) => void;
  deletePool: (id: string) => void;
  addAudit: (action: string, entity: string, entityId: string, detail: string) => void;
  clearAudit: () => void;
  updateApplicationStage: (id: string, stage: ApplicationStage) => void;
  recordPayment: (id: string, amount: number, method: string) => void;
  importData: (data: { borrowers: Borrower[]; pools: CreditPool[]; audit: AuditEntry[] }) => void;
  exportData: () => { borrowers: Borrower[]; pools: CreditPool[]; audit: AuditEntry[] };
  resetData: () => void;
}

const StoreContext = createContext<StoreState | null>(null);

function loadSavedData<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [borrowers, setBorrowers] = useState<Borrower[]>(() => loadSavedData('cp_borrowers', initialBorrowers));
  const [pools, setPools] = useState<CreditPool[]>(() => loadSavedData('cp_pools', initialPools));
  const [audit, setAudit] = useState<AuditEntry[]>(() => loadSavedData('cp_audit', initialAudit));
  const [applications, setApplications] = useState<OriginationApplication[]>(() => loadSavedData('cp_applications', mockApplications));
  const [darkMode, setDarkMode] = useState(() => loadSavedData('cp_dark', false));

  useEffect(() => { localStorage.setItem('cp_borrowers', JSON.stringify(borrowers)); }, [borrowers]);
  useEffect(() => { localStorage.setItem('cp_pools', JSON.stringify(pools)); }, [pools]);
  useEffect(() => { localStorage.setItem('cp_audit', JSON.stringify(audit)); }, [audit]);
  useEffect(() => { localStorage.setItem('cp_applications', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('cp_dark', JSON.stringify(darkMode)); }, [darkMode]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode(d => !d), []);

  const addAudit = useCallback((action: string, entity: string, entityId: string, detail: string) => {
    const entry: AuditEntry = {
      id: generateId('aud'),
      timestamp: new Date().toISOString(),
      action,
      entity,
      entityId,
      detail,
      user: 'risk.officer@cashpulse',
    };
    setAudit(prev => [entry, ...prev]);
  }, []);

  const addBorrower = useCallback((b: Omit<Borrower, 'id' | 'createdAt' | 'seasonalProfile' | 'restructured' | 'status'>) => {
    const newBorrower: Borrower = {
      ...b,
      id: generateId('acc'),
      createdAt: new Date().toISOString(),
      restructured: false,
      status: 'Active',
      seasonalProfile: defaultSeasonalProfile(b.cadence),
    };
    setBorrowers(prev => [...prev, newBorrower]);
    addAudit('UNDERWRITE', 'Borrower', newBorrower.id, `Underwritten ${newBorrower.borrowerName} - Principal: $${newBorrower.principal.toLocaleString()}, EMI: $${newBorrower.emi}`);
  }, [addAudit]);

  const updateBorrower = useCallback((id: string, patch: Partial<Borrower>) => {
    setBorrowers(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b));
    addAudit('UPDATE', 'Borrower', id, `Updated details for ${id}`);
  }, [addAudit]);

  const deleteBorrower = useCallback((id: string) => {
    setBorrowers(prev => prev.filter(b => b.id !== id));
    addAudit('DELETE', 'Borrower', id, `Deleted borrower ${id}`);
  }, [addAudit]);

  const restructureBorrower = useCallback((id: string, terms: { newEmi: number; newMaturity: string; termMonths: number; interestRate: number; reason: string }) => {
    setBorrowers(prev => prev.map(b => {
      if (b.id !== id) return b;
      return {
        ...b,
        emi: terms.newEmi,
        maturity: terms.newMaturity,
        restructured: true,
        status: 'Restructured',
        restructureTerms: {
          ...terms,
          appliedAt: new Date().toISOString(),
        },
      };
    }));
    addAudit('RESTRUCTURE', 'Borrower', id, `Restructured ${id} - New EMI: $${terms.newEmi}, Term: ${terms.termMonths}mo, Rate: ${terms.interestRate}% - Reason: ${terms.reason}`);
  }, [addAudit]);

  const addPool = useCallback((p: Omit<CreditPool, 'id' | 'createdAt'>) => {
    const newPool: CreditPool = {
      ...p,
      id: generateId('pool'),
      createdAt: new Date().toISOString(),
    };
    
    setBorrowers(prev => prev.map(b => {
      let matches = false;
      if (p.jurisdiction && p.jurisdiction !== 'All Clusters' && b.cluster.toLowerCase().includes(p.jurisdiction.toLowerCase())) {
        matches = true;
      } else if (p.jurisdiction === 'All Clusters') {
        matches = true;
      }
      if (matches && p.mandate && p.mandate !== 'Any Category' && !b.tradeCategory.toLowerCase().includes(p.mandate.toLowerCase())) {
        matches = false;
      } else if (!p.jurisdiction && p.mandate && p.mandate !== 'Any Category' && b.tradeCategory.toLowerCase().includes(p.mandate.toLowerCase())) {
         matches = true;
      }
      if (matches) return { ...b, poolId: newPool.id };
      return b;
    }));

    setPools(prev => [...prev, newPool]);
    addAudit('POOL_CREATE', 'CreditPool', newPool.id, `Created ${newPool.title} - ${newPool.jurisdiction}`);
  }, [addAudit]);

  const updatePool = useCallback((id: string, patch: Partial<CreditPool>) => {
    setPools(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
    addAudit('UPDATE', 'CreditPool', id, `Updated pool details`);
  }, [addAudit]);

  const deletePool = useCallback((id: string) => {
    setPools(prev => prev.filter(p => p.id !== id));
    setBorrowers(prev => prev.filter(b => b.poolId !== id));
    addAudit('POOL_DELETE', 'CreditPool', id, `Deleted pool ${id} and associated accounts`);
  }, [addAudit]);

  const clearAudit = useCallback(() => setAudit([]), []);

  const updateApplicationStage = useCallback((id: string, stage: ApplicationStage) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, stage } : a));
    addAudit('STAGE_UPDATE', 'Application', id, `Moved application to ${stage.replace('_', ' ')}`);
  }, [addAudit]);

  const recordPayment = useCallback((id: string, amount: number, method: string) => {
    setBorrowers(prev => prev.map(b => {
      if (b.id !== id) return b;
      const newPrincipal = Math.max(0, b.principal - amount);
      const isPaidOff = newPrincipal === 0;
      return {
        ...b,
        principal: newPrincipal,
        status: isPaidOff ? 'Closed' : b.status,
      };
    }));
    addAudit('PAYMENT', 'Borrower', id, `Recorded ${method} payment of $${amount.toLocaleString()} for ${id}`);
  }, [addAudit]);

  const importData = useCallback((data: { borrowers: Borrower[]; pools: CreditPool[]; audit: AuditEntry[] }) => {
    setBorrowers(data.borrowers);
    setPools(data.pools);
    setAudit(data.audit);
    addAudit('IMPORT', 'System', 'system', `Imported ${data.borrowers.length} borrowers, ${data.pools.length} pools`);
  }, [addAudit]);

  const exportData = useCallback(() => ({ borrowers, pools, audit }), [borrowers, pools, audit]);

  const resetData = useCallback(() => {
    setBorrowers(initialBorrowers);
    setPools(initialPools);
    setAudit(initialAudit);
    setApplications(mockApplications);
    localStorage.clear();
  }, []);

  return (
    <StoreContext.Provider value={{
      borrowers, pools, audit, applications, darkMode, toggleDarkMode,
      addBorrower, updateBorrower, deleteBorrower, restructureBorrower,
      addPool, updatePool, deletePool, addAudit, clearAudit,
      updateApplicationStage, recordPayment,
      importData, exportData, resetData,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
