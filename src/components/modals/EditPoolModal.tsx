import { useState, type FormEvent, useEffect } from 'react';
import { Building2, Save } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/store';
import type { CreditPool } from '@/types';

interface EditPoolModalProps {
  pool: CreditPool | null;
  onClose: () => void;
}

export function EditPoolModal({ pool, onClose }: EditPoolModalProps) {
  const { updatePool, deletePool, borrowers } = useStore();
  const [form, setForm] = useState<{ title: string; jurisdiction: string; mandate: string; capacity: string }>({ title: '', jurisdiction: '', mandate: '', capacity: '' });

  useEffect(() => {
    if (pool) {
      setForm({
        title: pool.title,
        jurisdiction: pool.jurisdiction,
        mandate: pool.mandate,
        capacity: pool.capacity.toString()
      });
    }
  }, [pool]);

  const uniqueClusters = Array.from(new Set(borrowers.map(b => b.cluster))).sort();
  const uniqueCategories = Array.from(new Set(borrowers.map(b => b.tradeCategory))).sort();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!pool) return;
    updatePool(pool.id, { ...form, capacity: Number(form.capacity) || 0 });
    onClose();
  };

  const handleDelete = () => {
    if (!pool) return;
    if (confirm(`Are you sure you want to delete ${pool.title}? WARNING: All borrower accounts currently assigned to this pool will be permanently deleted.`)) {
      deletePool(pool.id);
      onClose();
    }
  };

  if (!pool) return null;

  return (
    <Modal
      open={!!pool}
      onClose={onClose}
      title="Edit Credit Pool"
      subtitle={"Manage settings and capacity for "}
      icon={<Building2 size={22} />}
      size="md"
      footer={
        <div className="flex justify-between w-full">
          <button onClick={handleDelete} className="text-danger-500 hover:text-danger-600 text-sm font-semibold">Delete Pool</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary" disabled={!form.title || !form.jurisdiction}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Pool Title</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" required />
        </div>
        <div>
          <label className="label-text">Target Cluster</label>
          <select value={form.jurisdiction} onChange={e => setForm({ ...form, jurisdiction: e.target.value })} className="input-field" required>
            <option value="">Select a Cluster...</option>
            {uniqueClusters.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="All Clusters">All Clusters</option>
          </select>
        </div>
        <div>
          <label className="label-text">Target Category</label>
          <select value={form.mandate} onChange={e => setForm({ ...form, mandate: e.target.value })} className="input-field">
            <option value="">Any Category</option>
            {uniqueCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-text">Capital Limit / Capacity (?)</label>
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
