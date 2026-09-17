import { useState, type FormEvent } from 'react';
import { Building2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/store';

interface PoolModalProps {
  open: boolean;
  onClose: () => void;
}

export function PoolModal({ open, onClose }: PoolModalProps) {
  const { addPool, borrowers } = useStore();
  const [form, setForm] = useState<{ title: string; jurisdiction: string; mandate: string; capacity: string }>({ title: '', jurisdiction: '', mandate: '', capacity: '500000' });

  const uniqueClusters = Array.from(new Set(borrowers.map(b => b.cluster))).sort();
  const uniqueCategories = Array.from(new Set(borrowers.map(b => b.tradeCategory))).sort();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addPool({ ...form, capacity: Number(form.capacity) || 0 });
    setForm({ title: '', jurisdiction: '', mandate: '', capacity: '500000' });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Credit Pool"
      subtitle="Define a new lending pool with jurisdiction and mandate"
      icon={<Building2 size={22} />}
      size="md"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary" disabled={!form.title || !form.jurisdiction}>
            <Building2 size={16} /> Create Pool
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Pool Title</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Coastal Trade Finance Pool" required />
        </div>
        <div>
          <label className="label-text">Target Cluster (Auto-Assigns Accounts)</label>
          <select value={form.jurisdiction} onChange={e => setForm({ ...form, jurisdiction: e.target.value })} className="input-field" required>
            <option value="">Select a Cluster...</option>
            {uniqueClusters.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="All Clusters">All Clusters</option>
          </select>
        </div>
        <div>
          <label className="label-text">Target Category (Optional filter)</label>
          <select value={form.mandate} onChange={e => setForm({ ...form, mandate: e.target.value })} className="input-field">
            <option value="">Any Category</option>
            {uniqueCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-text">Capital Limit / Capacity (₹)</label>
          <input 
            type="text" 
            value={form.capacity} 
            onChange={e => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setForm({ ...form, capacity: val });
            }} 
            className="input-field" 
            required 
          />
        </div>
      </form>
    </Modal>
  );
}
