import { useState, useEffect } from 'react';
import { StoreProvider, useStore } from '@/store';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { MobileNav } from '@/components/MobileNav';
import { Dashboard } from '@/components/views/Dashboard';
import { Ledger } from '@/components/views/Ledger';
import { StressSandbox } from '@/components/views/StressSandbox';
import { SeasonalHeatmap } from '@/components/views/SeasonalHeatmap';
import { AuditLog } from '@/components/views/AuditLog';
import { Settings } from '@/components/views/Settings';
import { Origination } from '@/components/views/Origination';
import { MacroAnalytics } from '@/components/views/MacroAnalytics';
import { Compliance } from '@/components/views/Compliance';
import { UnderwriteModal } from '@/components/modals/UnderwriteModal';
import { PoolModal } from '@/components/modals/PoolModal';
import { BorrowerDossier } from '@/components/modals/BorrowerDossier';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RestructureModal } from '@/components/modals/RestructureModal';
import { GlobalSearch } from '@/components/modals/GlobalSearch';
import { PaymentModal } from '@/components/modals/PaymentModal';
import { EditBorrowerModal } from '@/components/modals/EditBorrowerModal';
import type { ViewKey, Borrower } from '@/types';

function AppContent() {
  const { borrowers } = useStore();
  const [view, setView] = useState<ViewKey>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [underwriteOpen, setUnderwriteOpen] = useState(false);
  const [poolOpen, setPoolOpen] = useState(false);
  const [dossierId, setDossierId] = useState<string | null>(null);
  const [restructureId, setRestructureId] = useState<string | null>(null);
  const [restructurePlanIdx, setRestructurePlanIdx] = useState<number>(1);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dossierBorrower = borrowers.find(b => b.id === dossierId) || null;
  const restructureBorrower = borrowers.find(b => b.id === restructureId) || null;
  const paymentBorrower = borrowers.find(b => b.id === paymentId) || null;
  const editBorrower = borrowers.find(b => b.id === editId) || null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [view]);

  // Initialize history state on first load
  useEffect(() => {
    window.history.replaceState({ view, dossierId: null }, '');
    
    const handlePopState = (e: PopStateEvent) => {
      const state = e.state;
      if (state) {
        if (state.view) setView(state.view);
        
        // Handle dossier back button
        if (!state.dossierId) {
          setDossierId(null);
        }
      } else {
        // Fallback if no state
        setDossierId(null);
      }
      
      // Close other modals on back if we are navigating backwards
      if (!state?.restructureId) setRestructureId(null);
      if (!state?.paymentId) setPaymentId(null);
      if (!state?.editId) setEditId(null);
      if (!state?.searchOpen) setSearchOpen(false);
      if (!state?.poolOpen) setPoolOpen(false);
      if (!state?.underwriteOpen) setUnderwriteOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSetView = (newView: ViewKey) => {
    window.history.pushState({ view: newView, dossierId: null }, '');
    setView(newView);
    setDossierId(null); // Ensure dossier is closed when switching views
  };

  const handleOpenDossier = (b: Borrower) => {
    window.history.pushState({ view, dossierId: b.id }, '');
    setDossierId(b.id);
  };

  const handleCloseDossier = () => {
    window.history.back();
  };

  const handleOpenRestructure = (b: Borrower, planIdx: number) => {
    window.history.pushState({ view, dossierId: null, restructureId: b.id }, '');
    setDossierId(null);
    setRestructureId(b.id);
    setRestructurePlanIdx(planIdx);
  };

  const handleCloseRestructure = () => {
    window.history.back();
  };

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950 relative">
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-success-50 dark:bg-success-950/40 border border-success-200 dark:border-success-900 text-success-700 dark:text-success-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg animate-slide-down z-[100]">
          {toastMessage}
        </div>
      )}
      
      <Sidebar
        view={view}
        onViewChange={handleSetView}
        onUnderwrite={() => setUnderwriteOpen(true)}
        onNewPool={() => setPoolOpen(true)}
      />
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        view={view}
        onViewChange={handleSetView}
        onUnderwrite={() => setUnderwriteOpen(true)}
        onNewPool={() => setPoolOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          view={view}
          onMenuClick={() => setMobileNavOpen(true)}
          onUnderwrite={() => setUnderwriteOpen(true)}
          onNewPool={() => setPoolOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto">
          {view === 'dashboard' && (
            <Dashboard
              onSelectBorrower={handleOpenDossier}
              onViewLedger={() => handleSetView('ledger')}
            />
          )}
          {view === 'ledger' && (
            <Ledger 
              onSelectBorrower={handleOpenDossier} 
              onAddPayment={(b) => setPaymentId(b.id)}
            />
          )}
          {view === 'sandbox' && <StressSandbox />}
          {view === 'heatmap' && <SeasonalHeatmap />}
          {view === 'origination' && <Origination onOpenDossier={handleOpenDossier} onUnderwrite={() => setUnderwriteOpen(true)} />}
          {view === 'analytics' && <MacroAnalytics />}
          {view === 'compliance' && <Compliance />}
          {view === 'audit' && <AuditLog />}
          {view === 'settings' && <Settings />}
        </main>
      </div>

      {/* Modals */}
      <UnderwriteModal open={underwriteOpen} onClose={() => setUnderwriteOpen(false)} />
      <PoolModal open={poolOpen} onClose={() => setPoolOpen(false)} />
      <ErrorBoundary>
        <BorrowerDossier
          borrower={dossierBorrower}
          onClose={handleCloseDossier}
          onRestructure={handleOpenRestructure}
          onEdit={(b) => setEditId(b.id)}
          onPayment={(b) => setPaymentId(b.id)}
        />
      </ErrorBoundary>
      <RestructureModal
        borrower={restructureBorrower}
        planIdx={restructurePlanIdx}
        onClose={() => {
          handleCloseRestructure();
          setToastMessage("Restructure applied successfully. Borrower risk reduced.");
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />
      <PaymentModal
        borrower={paymentBorrower}
        onClose={() => setPaymentId(null)}
      />
      <EditBorrowerModal
        borrower={editBorrower}
        onClose={() => setEditId(null)}
      />
      <GlobalSearch 
        open={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        onSelectBorrower={(b) => {
          setSearchOpen(false);
          handleOpenDossier(b);
        }} 
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
