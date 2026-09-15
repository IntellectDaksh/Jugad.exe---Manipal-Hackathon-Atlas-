import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Borrower, CreditPool, AuditEntry } from '@/types';
import { pools as initialPools, borrowers as initialBorrowers, auditLog as initialAudit } from '@/lib/mockData';
import { generateId } from '@/lib/format';
import { defaultSeasonalProfile } from '@/lib/rsi';

interface StoreState {
  borrowers: Borrower[];
  pools: CreditPool[];
  audit: AuditEntry[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  addBorrower: (b: Omit<Borrower, 'id' | 'createdAt' | 'seasonalProfile' | 'restructured' | 'status'>) => void;
  updateBorrower: (id: string, patch: Partial<Borrower>) => void;
  restructureBorrower: (id: string, terms: { newEmi: number; newMaturity: string; termMonths: number; interestRate: number; reason: string }) => void;
  addPool: (p: Omit<CreditPool, 'id' | 'createdAt'>) => void;
  deletePool: (id: string) => void;
  addAudit: (action: string, entity: string, entityId: string, detail: string) => void;
  clearAudit: () => void;
  importData: (data: { borrowers: Borrower[]; pools: CreditPool[]; audit: AuditEntry[] }) => void;
  exportData: () => { borrowers: Borrower[]; pools: CreditPool[]; audit: AuditEntry[] };
  resetData: () => void;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [borrowers, setBorrowers] = useState<Borrower[]>(initialBorrowers);
  const [pools, setPools] = useState<CreditPool[]>(initialPools);
  const [audit, setAudit] = useState<AuditEntry[]>(initialAudit);
  const [darkMode, setDarkMode] = useState(false);

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
    addAudit('UNDERWRITE', 'Borrower', newBorrower.id, `Underwritten ${newBorrower.borrowerName} — Principal: $${newBorrower.principal.toLocaleString()}, EMI: $${newBorrower.emi}`);
  }, [addAudit]);

  const updateBorrower = useCallback((id: string, patch: Partial<Borrower>) => {
    setBorrowers(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b));
  }, []);

  const restructureBorrower = useCallback((id: string, terms: { newEmi: number; newMaturity: string; termMonths: number; interestRate: number; reason: string }) => {
    setBorrowers(prev => prev.map(b => {
      if (b.id !== id) return b;
      const updated: Borrower = {
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
      return updated;
    }));
    const b = borrowers.find(x => x.id === id);
    addAudit('RESTRUCTURE', 'Borrower', id, `Restructured ${b?.borrowerName ?? id} — New EMI: $${terms.newEmi}, Term: ${terms.termMonths}mo, Rate: ${terms.interestRate}% — Reason: ${terms.reason}`);
  }, [borrowers, addAudit]);

  const addPool = useCallback((p: Omit<CreditPool, 'id' | 'createdAt'>) => {
    const newPool: CreditPool = {
      ...p,
      id: generateId('pool'),
      createdAt: new Date().toISOString(),
    };
    setPools(prev => [...prev, newPool]);
    addAudit('POOL_CREATE', 'CreditPool', newPool.id, `Created ${newPool.title} — ${newPool.jurisdiction}`);
  }, [addAudit]);

  const deletePool = useCallback((id: string) => {
    const pool = pools.find(p => p.id === id);
    setPools(prev => prev.filter(p => p.id !== id));
    setBorrowers(prev => prev.filter(b => b.poolId !== id));
    if (pool) addAudit('POOL_DELETE', 'CreditPool', id, `Deleted pool ${pool.title} and associated accounts`);
  }, [pools, addAudit]);

  const clearAudit = useCallback(() => setAudit([]), []);

  const importData = useCallback((data: { borrowers: Borrower[]; pools: CreditPool[]; audit: AuditEntry[] }) => {
    setBorrowers(data.borrowers);
    setPools(data.pools);
    setAudit(data.audit);
    addAudit('IMPORT', 'System', 'system', `Imported ${data.borrowers.length} borrowers, ${data.pools.length} pools, ${data.audit.length} audit entries`);
  }, [addAudit]);

  const exportData = useCallback(() => ({ borrowers, pools, audit }), [borrowers, pools, audit]);

  const resetData = useCallback(() => {
    setBorrowers(initialBorrowers);
    setPools(initialPools);
    setAudit(initialAudit);
  }, []);

  return (
    <StoreContext.Provider value={{
      borrowers, pools, audit, darkMode, toggleDarkMode,
      addBorrower, updateBorrower, restructureBorrower,
      addPool, deletePool, addAudit, clearAudit,
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
