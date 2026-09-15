import { useState } from 'react';
import Navbar from '@/components/Navbar';
import PortfolioMonitor from '@/components/views/PortfolioMonitor';
import BorrowerAnalytics from '@/components/views/BorrowerAnalytics';
import WhatIfSimulator from '@/components/views/WhatIfSimulator';
import AuditExplainability from '@/components/views/AuditExplainability';
import type { ViewKey } from '@/types';

function App() {
  const [activeView, setActiveView] = useState<ViewKey>('portfolio');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBorrowerId, setSelectedBorrowerId] = useState('b001');

  const handleSelectBorrower = (id: string) => {
    setSelectedBorrowerId(id);
    setActiveView('borrower');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Navbar
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'portfolio' && (
          <PortfolioMonitor
            searchQuery={searchQuery}
            onSelectBorrower={handleSelectBorrower}
          />
        )}
        {activeView === 'borrower' && (
          <BorrowerAnalytics
            selectedBorrowerId={selectedBorrowerId}
            onSelectBorrower={setSelectedBorrowerId}
            onBack={() => setActiveView('portfolio')}
          />
        )}
        {activeView === 'simulator' && (
          <WhatIfSimulator
            selectedBorrowerId={selectedBorrowerId}
            onSelectBorrower={setSelectedBorrowerId}
          />
        )}
        {activeView === 'audit' && <AuditExplainability />}
      </main>

      <footer className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-slate-200 mt-6">
        <p className="text-xs text-slate-400 text-center">
          CashPulse — AI-Powered Dynamic Microloan Repayment & Cash-Flow Planning System
        </p>
      </footer>
    </div>
  );
}

export default App;
