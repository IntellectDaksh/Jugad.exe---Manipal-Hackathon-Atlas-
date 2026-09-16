import { useState, type FormEvent } from 'react';
import { Plus, CheckSquare } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/format';
import type { Borrower } from '@/types';
import { useStore } from '@/store';

interface PaymentModalProps {
  borrower: Borrower | null;
  onClose: () => void;
}

export function PaymentModal({ borrower, onClose }: PaymentModalProps) {
  const { recordPayment } = useStore();
  const [amount, setAmount] = useState<number | ''>('');
  const [method, setMethod] = useState('Bank Transfer');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!borrower) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setIsSubmitting(true);
    
    // Simulate API call delay for UX
    setTimeout(() => {
      recordPayment(borrower.id, Number(amount), method);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        setShowSuccess(false);
        setAmount('');
        onClose();
      }, 1500);
    }, 800);
  };

  if (showSuccess) {
    return (
      <Modal open={true} onClose={onClose} size="sm" title="Record Payment">
        <div className="py-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-success-100 text-success-600 rounded-full flex items-center justify-center mb-4">
            <CheckSquare size={32} />
          </div>
          <h2 className="text-xl font-bold text-ink-900 dark:text-ink-50 mb-2">Payment Recorded</h2>
          <p className="text-ink-500">Successfully recorded payment for {borrower.borrowerName}</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={!!borrower}
      onClose={onClose}
      title="Record Payment"
      subtitle={`For ${borrower.borrowerName} · EMI: ${formatCurrency(borrower.emi)}`}
      icon={<Plus size={22} />}
      size="md"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary" disabled={isSubmitting}>Cancel</button>
          <button onClick={handleSubmit} className="btn-primary" disabled={isSubmitting || !amount}>
            {isSubmitting ? 'Recording...' : 'Record Payment'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Payment Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 font-medium">₹</span>
            <input 
              type="number" 
              min="0"
              value={amount} 
              onChange={e => setAmount(e.target.value === '' ? '' : parseInt(e.target.value, 10))} 
              className="input-field pl-8" 
              placeholder={borrower.emi.toString()} 
              required 
            />
          </div>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => setAmount(borrower.emi)} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 rounded hover:bg-ink-200 dark:hover:bg-ink-700">Full EMI</button>
            <button type="button" onClick={() => setAmount(Math.round(borrower.emi / 2))} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 rounded hover:bg-ink-200 dark:hover:bg-ink-700">Half EMI</button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Payment Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="input-field" 
              required 
            />
          </div>
          <div>
            <label className="label-text">Payment Method</label>
            <select 
              value={method} 
              onChange={e => setMethod(e.target.value)} 
              className="input-field"
            >
              <option>Bank Transfer</option>
              <option>UPI</option>
              <option>Cash</option>
              <option>Auto-Debit</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label-text">Reference Note (Optional)</label>
          <input type="text" className="input-field" placeholder="Transaction ID or note..." />
        </div>
      </form>
    </Modal>
  );
}
