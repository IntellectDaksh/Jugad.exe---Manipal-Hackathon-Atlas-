import { useState, useEffect } from 'react';
import { StoreProvider } from '@/store';
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
  const [view, setView] = useState<ViewKey>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [underwriteOpen, setUnderwriteOpen] = useState(false);
  const [poolOpen, setPoolOpen] = useState(false);
  const [dossierBorrower, setDossierBorrower] = useState<Borrower | null>(null);
  const [restructureBorrower, setRestructureBorrower] = useState<Borrower | null>(null);
  const [restructurePlanIdx, setRestructurePlanIdx] = useState<number>(1);
  const [paymentBorrower, setPaymentBorrower] = useState<Borrower | null>(null);
  const [editBorrower, setEditBorrower] = useState<Borrower | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

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
          setDossierBorrower(null);
        }
      } else {
        // Fallback if no state
        setDossierBorrower(null);
      }
      
      // Close other modals on back if we are navigating backwards
      if (!state?.restructureId) setRestructureBorrower(null);
      if (!state?.paymentId) setPaymentBorrower(null);
      if (!state?.editId) setEditBorrower(null);
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
    setDossierBorrower(null); // Ensure dossier is closed when switching views
  };

  const handleOpenDossier = (b: Borrower) => {
    window.history.pushState({ view, dossierId: b.id }, '');
    setDossierBorrower(b);
  };

  const handleCloseDossier = () => {
    window.history.back();
  };

  const handleOpenRestructure = (b: Borrower, planIdx: number) => {
    window.history.pushState({ view, dossierId: null, restructureId: b.id }, '');
    setDossierBorrower(null);
    setRestructureBorrower(b);
    setRestructurePlanIdx(planIdx);
  };

  const handleCloseRestructure = () => {
    window.history.back();
  };

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
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
              onAddPayment={setPaymentBorrower}
            />
          )}
          {view === 'sandbox' && <StressSandbox />}
          {view === 'heatmap' && <SeasonalHeatmap />}
          {view === 'origination' && <Origination onOpenDossier={handleOpenDossier} />}
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
          onEdit={setEditBorrower}
          onPayment={setPaymentBorrower}
        />
      </ErrorBoundary>
      <RestructureModal
        borrower={restructureBorrower}
        planIdx={restructurePlanIdx}
        onClose={handleCloseRestructure}
      />
      <PaymentModal
        borrower={paymentBorrower}
        onClose={() => setPaymentBorrower(null)}
      />
      <EditBorrowerModal
        borrower={editBorrower}
        onClose={() => setEditBorrower(null)}
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
