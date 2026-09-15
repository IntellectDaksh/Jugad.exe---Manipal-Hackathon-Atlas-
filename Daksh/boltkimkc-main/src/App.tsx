import { useState } from 'react';
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
import { UnderwriteModal } from '@/components/modals/UnderwriteModal';
import { PoolModal } from '@/components/modals/PoolModal';
import { BorrowerDossier } from '@/components/modals/BorrowerDossier';
import { RestructureModal } from '@/components/modals/RestructureModal';
import type { ViewKey, Borrower } from '@/types';

function AppContent() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [underwriteOpen, setUnderwriteOpen] = useState(false);
  const [poolOpen, setPoolOpen] = useState(false);
  const [dossierBorrower, setDossierBorrower] = useState<Borrower | null>(null);
  const [restructureBorrower, setRestructureBorrower] = useState<Borrower | null>(null);

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
      <Sidebar
        view={view}
        onViewChange={setView}
        onUnderwrite={() => setUnderwriteOpen(true)}
        onNewPool={() => setPoolOpen(true)}
      />
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        view={view}
        onViewChange={setView}
        onUnderwrite={() => setUnderwriteOpen(true)}
        onNewPool={() => setPoolOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          view={view}
          onMenuClick={() => setMobileNavOpen(true)}
          onUnderwrite={() => setUnderwriteOpen(true)}
          onNewPool={() => setPoolOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto">
          {view === 'dashboard' && (
            <Dashboard
              onSelectBorrower={setDossierBorrower}
              onViewLedger={() => setView('ledger')}
            />
          )}
          {view === 'ledger' && (
            <Ledger onSelectBorrower={setDossierBorrower} />
          )}
          {view === 'sandbox' && <StressSandbox />}
          {view === 'heatmap' && <SeasonalHeatmap />}
          {view === 'audit' && <AuditLog />}
          {view === 'settings' && <Settings />}
        </main>
      </div>

      {/* Modals */}
      <UnderwriteModal open={underwriteOpen} onClose={() => setUnderwriteOpen(false)} />
      <PoolModal open={poolOpen} onClose={() => setPoolOpen(false)} />
      <BorrowerDossier
        borrower={dossierBorrower}
        onClose={() => setDossierBorrower(null)}
        onRestructure={(b) => { setDossierBorrower(null); setRestructureBorrower(b); }}
      />
      <RestructureModal
        borrower={restructureBorrower}
        onClose={() => setRestructureBorrower(null)}
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
