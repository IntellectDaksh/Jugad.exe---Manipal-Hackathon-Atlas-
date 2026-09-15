import { useState, useMemo, type FormEvent } from 'react';
import { RotateCcw } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/store';
import { calculateRSI } from '@/lib/rsi';
import { formatCurrency, formatNumber } from '@/lib/format';
import { RiskBadge } from '@/components/ui/RiskBadge';
import type { Borrower } from '@/types';

interface RestructureModalProps {
  borrower: Borrower | null;
  onClose: () => void;
}

const termOptions = [
  { months: 12, rate: 8.5, label: '12 months · 8.5% APR' },
  { months: 24, rate: 9.0, label: '24 months · 9.0% APR' },
  { months: 36, rate: 9.5, label: '36 months · 9.5% APR' },
  { months: 48, rate: 10.0, label: '48 months · 10.0% APR' },
  { months: 60, rate: 10.5, label: '60 months · 10.5% APR' },
];

export function RestructureModal({ borrower, onClose }: RestructureModalProps) {
  const { restructureBorrower } = useStore();
  const [termIdx, setTermIdx] = useState(2);
  const [reason, setReason] = useState('');

  const newTerms = useMemo(() => {
    if (!borrower) return null;
    const term = termOptions[termIdx];
    const monthlyRate = term.rate / 100 / 12;
    const newEmi = Math.round(borrower.principal * monthlyRate * Math.pow(1 + monthlyRate, term.months) / (Math.pow(1 + monthlyRate, term.months) - 1));
    const newMaturity = new Date();
    newMaturity.setMonth(newMaturity.getMonth() + term.months);
    return { ...term, newEmi, newMaturity: newMaturity.toISOString() };
  }, [borrower, termIdx]);

  const currentRSI = useMemo(() => borrower ? calculateRSI(borrower) : null, [borrower]);
  const simulatedRSI = useMemo(() => {
    if (!borrower || !newTerms) return null;
    const simulated: Borrower = { ...borrower, emi: newTerms.newEmi, maturity: newTerms.newMaturity };
    return calculateRSI(simulated);
  }, [borrower, newTerms]);

  if (!borrower || !newTerms || !currentRSI || !simulatedRSI) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    restructureBorrower(borrower.id, {
      newEmi: newTerms.newEmi,
      newMaturity: newTerms.newMaturity,
      termMonths: newTerms.months,
      interestRate: newTerms.rate,
      reason: reason || 'Restructuring applied to improve debt service coverage.',
    });
    onClose();
  };

  return (
    <Modal
      open={!!borrower}
      onClose={onClose}
      title="Restructure Debt Servicing"
      subtitle={`${borrower.borrowerName} · ${borrower.id}`}
      icon={<RotateCcw size={22} />}
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary" disabled={!reason}>
            <RotateCcw size={16} /> Apply Restructure
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current vs simulated comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4">
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-3">Current Terms</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">EMI</span><span className="stat-value font-semibold">{formatCurrency(borrower.emi)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">RSI</span><span className="stat-value font-semibold">{currentRSI.score}</span></div>
              <div className="flex justify-end"><RiskBadge tier={currentRSI.tier} size="sm" /></div>
            </div>
          </div>
          <div className="card p-4 border-primary-200 dark:border-primary-800">
            <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-3">After Restructure</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">New EMI</span><span className="stat-value font-semibold">{formatCurrency(newTerms.newEmi)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">New RSI</span><span className="stat-value font-semibold">{simulatedRSI.score}</span></div>
              <div className="flex justify-end"><RiskBadge tier={simulatedRSI.tier} size="sm" /></div>
            </div>
          </div>
        </div>

        {/* EMI change indicator */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-ink-500">EMI change:</span>
          <span className={`font-bold stat-value ${newTerms.newEmi < borrower.emi ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
            {newTerms.newEmi < borrower.emi ? '−' : '+'}{formatCurrency(Math.abs(newTerms.newEmi - borrower.emi))}/mo
          </span>
          <span className="text-ink-500">·</span>
          <span className={`font-bold stat-value ${simulatedRSI.score < currentRSI.score ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
            RSI {simulatedRSI.score < currentRSI.score ? '−' : '+'}{Math.abs(simulatedRSI.score - currentRSI.score)} pts
          </span>
        </div>

        {/* Term sheet selection */}
        <div>
          <label className="label-text">Term Sheet</label>
          <div className="space-y-2">
            {termOptions.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTermIdx(i)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all text-left ${
                  termIdx === i
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300'
                    : 'border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300 hover:border-ink-300 dark:hover:border-ink-600'
                }`}
              >
                <span className="text-sm font-semibold">{opt.label}</span>
                {termIdx === i && <span className="w-2 h-2 rounded-full bg-primary-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="label-text">Restructure Reason / Justification</label>
          <textarea value={reason} onChange={e => setReason(e.target.value)} className="input-field min-h-[80px] resize-y" placeholder="e.g. Borrower experiencing seasonal income decline, extending term to reduce EMI burden while maintaining repayment capacity..." required />
        </div>
      </form>
    </Modal>
  );
}
