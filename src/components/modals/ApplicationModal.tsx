import { useState, type FormEvent } from 'react';
import { Inbox, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/store';

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
}

export function ApplicationModal({ open, onClose }: ApplicationModalProps) {
  const { addApplication } = useStore();
  const [form, setForm] = useState({ businessName: '', applicantName: '', requestedAmount: '', tradeCategory: '', cluster: '' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addApplication({
      businessName: form.businessName,
      applicantName: form.applicantName,
      requestedAmount: Number(form.requestedAmount) || 0,
      tradeCategory: form.tradeCategory,
      cluster: form.cluster
    });
    setForm({ businessName: '', applicantName: '', requestedAmount: '', tradeCategory: '', cluster: '' });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Loan Application"
      subtitle="Manually enter a new MSME loan request into the origination pipeline."
      icon={<Inbox size={22} />}
      size="md"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary" disabled={!form.businessName || !form.applicantName || !form.requestedAmount}>
            <Check size={16} /> Submit Application
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Business Name</label>
          <input value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} className="input-field" placeholder="e.g. Amani Trading Co." required />
        </div>
        <div>
          <label className="label-text">Applicant Name</label>
          <input value={form.applicantName} onChange={e => setForm({ ...form, applicantName: e.target.value })} className="input-field" placeholder="e.g. Jane Doe" required />
        </div>
        <div>
          <label className="label-text">Requested Amount (?)</label>
          <input 
            type="text" 
            value={form.requestedAmount} 
            onChange={e => setForm({ ...form, requestedAmount: e.target.value.replace(/[^0-9]/g, '') })} 
            className="input-field" 
            placeholder="e.g. 50000"
            required 
          />
        </div>
        <div>
          <label className="label-text">Trade Category</label>
          <input value={form.tradeCategory} onChange={e => setForm({ ...form, tradeCategory: e.target.value })} className="input-field" placeholder="e.g. Retail, Agriculture" required />
        </div>
        <div>
          <label className="label-text">Cluster / Region</label>
          <input value={form.cluster} onChange={e => setForm({ ...form, cluster: e.target.value })} className="input-field" placeholder="e.g. Mombasa, Nairobi" required />
        </div>
      </form>
    </Modal>
  );
}
