import { useState, type FormEvent } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/store';
import { defaultSeasonalProfile } from '@/lib/rsi';
import type { CashFlowCadence } from '@/types';

interface UnderwriteModalProps {
  open: boolean;
  onClose: () => void;
}

const cadenceOptions: { value: CashFlowCadence; label: string; desc: string }[] = [
  { value: 'stable', label: 'Stable', desc: 'Consistent monthly income' },
  { value: 'seasonal', label: 'Seasonal', desc: 'Peaks and troughs by season' },
  { value: 'irregular', label: 'Irregular', desc: 'Unpredictable cash flow' },
  { value: 'declining', label: 'Declining', desc: 'Income trending downward' },
  { value: 'recovering', label: 'Recovering', desc: 'Income trending upward' },
];

export function UnderwriteModal({ open, onClose }: UnderwriteModalProps) {
  const { pools, addBorrower } = useStore();
  const [form, setForm] = useState({
    borrowerName: '',
    tradeCategory: '',
    cluster: '',
    poolId: pools[0]?.id ?? '',
    principal: '',
    emi: '',
    maturityMonths: '36',
    monthlyIncome: '',
    essentialOutflows: '',
    cadence: 'stable' as CashFlowCadence,
    liquidReserves: '',
    notes: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addBorrower({
      borrowerName: form.borrowerName,
      tradeCategory: form.tradeCategory,
      cluster: form.cluster,
      poolId: form.poolId,
      principal: Number(form.principal),
      emi: Number(form.emi),
      maturity: new Date(Date.now() + Number(form.maturityMonths) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      monthlyIncome: Number(form.monthlyIncome),
      essentialOutflows: Number(form.essentialOutflows),
      cadence: form.cadence,
      liquidReserves: Number(form.liquidReserves),
      notes: form.notes,
    });
    setForm({
      borrowerName: '', tradeCategory: '', cluster: '', poolId: pools[0]?.id ?? '',
      principal: '', emi: '', maturityMonths: '36', monthlyIncome: '', essentialOutflows: '',
      cadence: 'stable', liquidReserves: '', notes: '',
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Underwrite New Borrower"
      subtitle="Enter the borrower's financial profile to calculate their Risk Stress Index"
      icon={<ShieldCheck size={22} />}
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary" disabled={!form.borrowerName || !form.principal || !form.emi || !form.monthlyIncome}>
            <ShieldCheck size={16} /> Underwrite Account
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Legal / Business Name</label>
            <input value={form.borrowerName} onChange={e => setForm({ ...form, borrowerName: e.target.value })} className="input-field" placeholder="e.g. Amani Trading Co." required />
          </div>
          <div>
            <label className="label-text">Trade Category</label>
            <input value={form.tradeCategory} onChange={e => setForm({ ...form, tradeCategory: e.target.value })} className="input-field" placeholder="e.g. Import/Export" required />
          </div>
          <div>
            <label className="label-text">Cluster / Location</label>
            <input value={form.cluster} onChange={e => setForm({ ...form, cluster: e.target.value })} className="input-field" placeholder="e.g. Mombasa" required />
          </div>
          <div>
            <label className="label-text">Credit Pool</label>
            <select value={form.poolId} onChange={e => setForm({ ...form, poolId: e.target.value })} className="input-field cursor-pointer">
              {pools.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        </div>

        <div className="border-t border-ink-200 dark:border-ink-800 pt-4">
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-3">Facility Terms</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label-text">Principal ($)</label>
              <input type="number" value={form.principal} onChange={e => setForm({ ...form, principal: e.target.value })} className="input-field" placeholder="45000" required />
            </div>
            <div>
              <label className="label-text">Monthly EMI ($)</label>
              <input type="number" value={form.emi} onChange={e => setForm({ ...form, emi: e.target.value })} className="input-field" placeholder="1250" required />
            </div>
            <div>
              <label className="label-text">Maturity (months)</label>
              <input type="number" value={form.maturityMonths} onChange={e => setForm({ ...form, maturityMonths: e.target.value })} className="input-field" placeholder="36" required />
            </div>
          </div>
        </div>

        <div className="border-t border-ink-200 dark:border-ink-800 pt-4">
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-3">Cash Flow Profile</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Monthly Income ($)</label>
              <input type="number" value={form.monthlyIncome} onChange={e => setForm({ ...form, monthlyIncome: e.target.value })} className="input-field" placeholder="5200" required />
            </div>
            <div>
              <label className="label-text">Essential Outflows ($)</label>
              <input type="number" value={form.essentialOutflows} onChange={e => setForm({ ...form, essentialOutflows: e.target.value })} className="input-field" placeholder="2800" required />
            </div>
            <div>
              <label className="label-text">Liquid Reserves ($)</label>
              <input type="number" value={form.liquidReserves} onChange={e => setForm({ ...form, liquidReserves: e.target.value })} className="input-field" placeholder="18000" required />
            </div>
          </div>
        </div>

        <div>
          <label className="label-text">Cash-Flow Cadence</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {cadenceOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, cadence: opt.value })}
                className={`px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all text-left ${
                  form.cadence === opt.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300'
                    : 'border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 hover:border-ink-300 dark:hover:border-ink-600'
                }`}
              >
                <span className="block">{opt.label}</span>
                <span className="block text-[10px] font-normal text-ink-400 mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-text">Underwriting Notes</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-field min-h-[80px] resize-y" placeholder="Additional context, collateral details, risk observations..." />
        </div>
      </form>
    </Modal>
  );
}
