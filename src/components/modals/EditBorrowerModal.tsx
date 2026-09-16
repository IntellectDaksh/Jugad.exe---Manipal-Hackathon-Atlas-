import { useState, useEffect, type FormEvent } from 'react';
import { Settings2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/store';
import type { Borrower } from '@/types';

interface EditBorrowerModalProps {
  borrower: Borrower | null;
  onClose: () => void;
}

export function EditBorrowerModal({ borrower, onClose }: EditBorrowerModalProps) {
  const { updateBorrower } = useStore();
  
  const [formData, setFormData] = useState<{
    borrowerName: string;
    tradeCategory: string;
    cluster: string;
    monthlyIncome: number | '';
    essentialOutflows: number | '';
  }>({
    borrowerName: '',
    tradeCategory: '',
    cluster: '',
    monthlyIncome: 0,
    essentialOutflows: 0
  });

  useEffect(() => {
    if (borrower) {
      setFormData({
        borrowerName: borrower.borrowerName,
        tradeCategory: borrower.tradeCategory,
        cluster: borrower.cluster,
        monthlyIncome: borrower.monthlyIncome,
        essentialOutflows: borrower.essentialOutflows
      });
    }
  }, [borrower]);

  if (!borrower) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateBorrower(borrower.id, {
      borrowerName: formData.borrowerName,
      tradeCategory: formData.tradeCategory,
      cluster: formData.cluster,
      monthlyIncome: Number(formData.monthlyIncome) || 0,
      essentialOutflows: Number(formData.essentialOutflows) || 0
    });
    onClose();
  };

  return (
    <Modal
      open={!!borrower}
      onClose={onClose}
      title="Edit Borrower Details"
      subtitle={`Updating profile for ${borrower.borrowerName}`}
      icon={<Settings2 size={22} />}
      size="md"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">Save Changes</button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Borrower Name</label>
          <input 
            type="text" 
            value={formData.borrowerName} 
            onChange={e => setFormData({ ...formData, borrowerName: e.target.value })} 
            className="input-field" 
            required 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Trade Category</label>
            <input 
              type="text" 
              value={formData.tradeCategory} 
              onChange={e => setFormData({ ...formData, tradeCategory: e.target.value })} 
              className="input-field" 
              required 
            />
          </div>
          <div>
            <label className="label-text">Cluster</label>
            <input 
              type="text" 
              value={formData.cluster} 
              onChange={e => setFormData({ ...formData, cluster: e.target.value })} 
              className="input-field" 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Monthly Income</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 font-medium">₹</span>
              <input 
                type="number" 
                min="0"
                value={formData.monthlyIncome} 
                onChange={e => setFormData({ ...formData, monthlyIncome: e.target.value === '' ? '' : parseInt(e.target.value, 10) })} 
                className="input-field pl-8" 
                required 
              />
            </div>
          </div>
          <div>
            <label className="label-text">Essential Outflows</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 font-medium">₹</span>
              <input 
                type="number"
                min="0"
                value={formData.essentialOutflows} 
                onChange={e => setFormData({ ...formData, essentialOutflows: e.target.value === '' ? '' : parseInt(e.target.value, 10) })} 
                className="input-field pl-8" 
                required 
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
