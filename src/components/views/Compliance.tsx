import { useState } from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { useStore } from '@/store';
import { formatDate } from '@/lib/format';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Compliance() {
  const { audit } = useStore();
  const [generating, setGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("CashPulse Basel-III Compliance Report", 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
      doc.text("Status: Compliant", 14, 40);
      
      autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Value', 'Regulatory Threshold', 'Status']],
        body: [
          ['Capital Adequacy Ratio (CAR)', '14.2%', '> 10.5%', 'PASS'],
          ['Liquidity Coverage Ratio (LCR)', '115%', '> 100%', 'PASS'],
          ['Non-Performing Assets (NPA)', '3.8%', '< 5.0%', 'PASS'],
          ['Tier 1 Capital Ratio', '12.1%', '> 8.5%', 'PASS'],
        ],
      });

      doc.save('basel-iii-compliance-report.pdf');

      setGenerating(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const handleGenerateGenericReport = (title: string) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`CashPulse - ${title}`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text("This is a dynamically generated PDF report for your microfinance portfolio.", 14, 40);
    
    // Add some mock data to make the PDF look realistic
    autoTable(doc, {
      startY: 50,
      head: [['Category', 'Count/Value', 'Trend']],
      body: [
        ['Total Active Borrowers', '241', '+12%'],
        ['Average Risk Stress Index (RSI)', '42', 'Stable'],
        ['Total Portfolio Exposure', '$1.2M', '+5%'],
      ],
    });
    
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-success-50 dark:bg-success-950/40 border border-success-200 dark:border-success-900 text-success-700 dark:text-success-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg animate-slide-down z-50">
          <CheckCircle2 size={16} />
          Basel-III Compliance Report Downloaded
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ink-900 dark:text-ink-50">Compliance & Reports</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400">Generate regulatory reports and view detailed system audit trails.</p>
        </div>
        <button 
          onClick={handleGenerateReport} 
          disabled={generating}
          className="btn-primary"
        >
          {generating ? <span className="flex items-center gap-2"><Clock size={16} className="animate-spin" /> Generating...</span> : <span className="flex items-center gap-2"><Download size={16} /> Export Basel-III Report</span>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-success-500" /> Regulatory Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600 dark:text-ink-300">Capital Adequacy Ratio</span>
                <span className="text-sm font-bold text-success-600 dark:text-success-400">14.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600 dark:text-ink-300">Liquidity Coverage Ratio</span>
                <span className="text-sm font-bold text-success-600 dark:text-success-400">115%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600 dark:text-ink-300">Non-Performing Assets (NPA)</span>
                <span className="text-sm font-bold text-warning-600 dark:text-warning-400">3.8%</span>
              </div>
              <div className="pt-4 border-t border-ink-100 dark:border-ink-800">
                <div className="flex items-start gap-2 bg-success-50 dark:bg-success-950/30 p-3 rounded-lg border border-success-200 dark:border-success-900/50">
                  <CheckCircle2 size={16} className="text-success-500 mt-0.5" />
                  <p className="text-xs text-success-700 dark:text-success-400 leading-relaxed">
                    Portfolio is currently well within regulatory thresholds. Last audited 2 days ago.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 mb-4 flex items-center gap-2">
              <FileText size={16} className="text-primary-500" /> Available Reports
            </h3>
            <div className="space-y-2">
              <button onClick={() => handleGenerateGenericReport('Monthly Risk Summary')} className="w-full text-left px-3 py-2 rounded hover:bg-ink-50 dark:hover:bg-ink-800 text-sm text-ink-700 dark:text-ink-300 transition-colors flex items-center justify-between group">
                Monthly Risk Summary <Download size={14} className="opacity-0 group-hover:opacity-100 text-ink-400 transition-opacity" />
              </button>
              <button onClick={() => handleGenerateGenericReport('Stress Test Results Q3')} className="w-full text-left px-3 py-2 rounded hover:bg-ink-50 dark:hover:bg-ink-800 text-sm text-ink-700 dark:text-ink-300 transition-colors flex items-center justify-between group">
                Stress Test Results (Q3) <Download size={14} className="opacity-0 group-hover:opacity-100 text-ink-400 transition-opacity" />
              </button>
              <button onClick={() => handleGenerateGenericReport('Portfolio Restructure Log')} className="w-full text-left px-3 py-2 rounded hover:bg-ink-50 dark:hover:bg-ink-800 text-sm text-ink-700 dark:text-ink-300 transition-colors flex items-center justify-between group">
                Portfolio Restructure Log <Download size={14} className="opacity-0 group-hover:opacity-100 text-ink-400 transition-opacity" />
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 card overflow-hidden flex flex-col h-[600px]">
          <div className="px-5 py-4 border-b border-ink-200 dark:border-ink-800 flex items-center justify-between bg-ink-50/50 dark:bg-ink-900/50">
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">System Audit Trail</h3>
            <span className="text-xs text-ink-500 dark:text-ink-400 font-medium px-2 py-1 bg-white dark:bg-ink-800 rounded border border-ink-200 dark:border-ink-700 shadow-sm">
              {audit.length} Records
            </span>
          </div>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white dark:bg-ink-900 shadow-sm z-10">
                <tr>
                  <th className="px-5 py-3 table-header border-b border-ink-200 dark:border-ink-800">Timestamp</th>
                  <th className="px-5 py-3 table-header border-b border-ink-200 dark:border-ink-800">Action</th>
                  <th className="px-5 py-3 table-header border-b border-ink-200 dark:border-ink-800">Detail</th>
                  <th className="px-5 py-3 table-header border-b border-ink-200 dark:border-ink-800 text-right">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60">
                {audit.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-sm text-ink-500 dark:text-ink-400">
                      No audit logs found.
                    </td>
                  </tr>
                ) : (
                  audit.map((entry) => (
                    <tr key={entry.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-800/30 transition-colors">
                      <td className="px-5 py-3 text-xs text-ink-500 dark:text-ink-400 whitespace-nowrap">
                        {formatDate(entry.timestamp)}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">
                          {entry.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-ink-700 dark:text-ink-300 max-w-md truncate" title={entry.detail}>
                        {entry.detail}
                      </td>
                      <td className="px-5 py-3 text-xs text-ink-500 dark:text-ink-400 text-right">
                        {entry.user}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
