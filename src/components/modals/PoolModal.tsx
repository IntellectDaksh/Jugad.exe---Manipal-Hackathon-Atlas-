import { useState, type FormEvent } from 'react';
import { Building2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/store';

interface PoolModalProps {
  open: boolean;
  onClose: () => void;
}

export function PoolModal({ open, onClose }: PoolModalProps) {
  const { addPool } = useStore();
  const [form, setForm] = useState({ title: '', jurisdiction: '', mandate: '', capacity: 1000000 });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addPool(form);
    setForm({ title: '', jurisdiction: '', mandate: '', capacity: 1000000 });
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
          <label className="label-text">Jurisdiction / Cluster</label>
          <input value={form.jurisdiction} onChange={e => setForm({ ...form, jurisdiction: e.target.value })} className="input-field" placeholder="e.g. Mombasa Cluster" required />
        </div>
        <div>
          <label className="label-text">Mandate</label>
          <textarea value={form.mandate} onChange={e => setForm({ ...form, mandate: e.target.value })} className="input-field min-h-[80px] resize-y" placeholder="Working capital for small-scale traders in coastal East Africa..." />
        </div>
        <div>
          <label className="label-text">Capital Limit / Capacity (₹)</label>
          <input type="number" min="0" value={form.capacity || ''} onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })} className="input-field" required />
        </div>
      </form>
    </Modal>
  );
}
