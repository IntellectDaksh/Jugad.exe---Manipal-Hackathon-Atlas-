import { useState, type FormEvent } from 'react';
import { ShieldCheck, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { CustomSelect } from '@/components/ui/CustomSelect';
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
    collateralType: '',
    collateralValue: '',
  });

  const [step, setStep] = useState(1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

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
      collateralType: form.collateralType,
      collateralValue: form.collateralValue ? Number(form.collateralValue) : undefined,
    });
    setForm({
      borrowerName: '', tradeCategory: '', cluster: '', poolId: pools[0]?.id ?? '',
      principal: '', emi: '', maturityMonths: '36', monthlyIncome: '', essentialOutflows: '',
      cadence: 'stable', liquidReserves: '', notes: '', collateralType: '', collateralValue: '',
    });
    setStep(1);
    onClose();
  };

  const isNameValid = form.borrowerName.trim().length > 0 && /[a-zA-Z]/.test(form.borrowerName);
  const isStep1Valid = isNameValid && form.tradeCategory && form.cluster;
  const isStep2Valid = form.principal && form.emi && form.maturityMonths;
  const isStep3Valid = form.monthlyIncome && form.essentialOutflows && form.liquidReserves;

  return (
    <Modal
      open={open}
      onClose={() => { setStep(1); onClose(); }}
      title="Underwrite New Borrower"
      subtitle="Enter the borrower's financial profile to calculate their Risk Stress Index"
      icon={<ShieldCheck size={22} />}
      size="lg"
      footer={
        <div className="flex justify-between w-full">
          <div>
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="btn-secondary">
                <ChevronLeft size={16} /> Back
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setStep(1); onClose(); }} className="btn-secondary">Cancel</button>
            <button 
              onClick={handleSubmit} 
              className="btn-primary" 
              disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}
            >
              {step === 3 ? <><Check size={16} /> Complete Underwriting</> : <>Next Step <ChevronRight size={16} /></>}
            </button>
          </div>
        </div>
      }
    >
      <div className="mb-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-ink-100 dark:bg-ink-800 rounded-full z-0" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 rounded-full z-0 transition-all duration-300"
            style={{ width: `${(step - 1) * 50}%` }}
          />
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= s ? 'bg-primary-500 text-white' : 'bg-ink-200 dark:bg-ink-800 text-ink-500'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs font-medium text-ink-500">
          <span>Identity</span>
          <span>Terms</span>
          <span>Cash Flow</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <label className="label-text">Legal / Business Name</label>
            <input value={form.borrowerName} onChange={e => setForm({ ...form, borrowerName: e.target.value })} className="input-field" placeholder="e.g. Amani Trading Co." required />
            {form.borrowerName && !isNameValid && <p className="text-xs text-danger-500 mt-1">Name must contain letters.</p>}
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
            <CustomSelect 
              label="Credit Pool"
              value={form.poolId} 
              onChange={val => setForm({ ...form, poolId: val })} 
              options={pools.map(p => ({ value: p.id, label: p.title }))}
            />
          </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Collateral Type (Optional)</label>
                <input value={form.collateralType} onChange={e => setForm({ ...form, collateralType: e.target.value })} className="input-field" placeholder="e.g. Vehicle, Real Estate, Inventory" />
              </div>
              <div>
                <label className="label-text">Estimated Collateral Value ($)</label>
                <input type="number" value={form.collateralValue} onChange={e => setForm({ ...form, collateralValue: e.target.value })} className="input-field" placeholder="15000" />
              </div>
            </div>
            
            <div>
              <label className="label-text">Underwriting Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-field min-h-[80px] resize-y" placeholder="Additional context, risk observations..." />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
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
                <label className="label-text">Liquid Reserves (₹)</label>
                <input type="number" value={form.liquidReserves} onChange={e => setForm({ ...form, liquidReserves: e.target.value })} className="input-field" placeholder="18000" required />
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
          </div>
        )}
      </form>
    </Modal>
  );
}
