import { useState } from 'react';
import { Inbox, CheckCircle2, XCircle, AlertCircle, Clock, ChevronRight, Filter } from 'lucide-react';
import { useStore } from '@/store';
import type { OriginationApplication, ApplicationStage } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';

interface OriginationProps {
  onOpenDossier?: (id: string) => void;
}

const STAGES: { id: ApplicationStage; label: string; color: string }[] = [
  { id: 'pending_data', label: 'Pending Data', color: 'border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800/50' },
  { id: 'ai_review', label: 'AI Review', color: 'border-primary-200 dark:border-primary-900 bg-primary-50 dark:bg-primary-950/30' },
  { id: 'human_review', label: 'Manual Review', color: 'border-warning-200 dark:border-warning-900 bg-warning-50 dark:bg-warning-950/30' },
  { id: 'approved', label: 'Approved', color: 'border-success-200 dark:border-success-900 bg-success-50 dark:bg-success-950/30' },
  { id: 'rejected', label: 'Rejected', color: 'border-danger-200 dark:border-danger-900 bg-danger-50 dark:bg-danger-950/30' }
];

export function Origination({ onOpenDossier }: OriginationProps) {
  const { applications, updateApplicationStage } = useStore();
  const [filter, setFilter] = useState('');

  const filteredApps = applications.filter(a => 
    a.businessName.toLowerCase().includes(filter.toLowerCase()) || 
    a.cluster.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ink-900 dark:text-ink-50">Origination Hub</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400">Process and review incoming MSME loan applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input 
              type="text"
              placeholder="Filter applicants..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <button className="btn-primary whitespace-nowrap">
            <Inbox size={16} /> New Application
          </button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
        {STAGES.map(stage => {
          const stageApps = filteredApps.filter(a => a.stage === stage.id);
          
          return (
            <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col gap-3 snap-start">
              <div className={`px-4 py-3 rounded-lg border ${stage.color} flex items-center justify-between`}>
                <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50">{stage.label}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-400 border border-ink-200 dark:border-ink-800">
                  {stageApps.length}
                </span>
              </div>

              <div className="flex flex-col gap-3 flex-1 min-h-[200px]">
                {stageApps.length === 0 ? (
                  <div className="h-24 border-2 border-dashed border-ink-200 dark:border-ink-800 rounded-xl flex items-center justify-center text-xs text-ink-400">
                    Empty Queue
                  </div>
                ) : (
                  stageApps.map(app => (
                    <div key={app.id} className="card p-4 hover:-translate-y-1 transition-transform duration-200 group cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 pr-2">
                          <p className="text-sm font-semibold text-ink-900 dark:text-ink-50 truncate">{app.businessName}</p>
                          <p className="text-xs text-ink-500 dark:text-ink-400">{app.tradeCategory} · {app.cluster}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {app.aiScore ? (
                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${app.aiScore >= 70 ? 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-400' : 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-400'}`}>
                              AI {app.aiScore}
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-2 py-1 rounded-md bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-400">
                              No Score
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs mt-4">
                        <div className="flex items-center gap-1.5 text-ink-600 dark:text-ink-300">
                          <Clock size={14} className="text-ink-400" /> {formatDate(app.submittedAt).split(' ')[0]}
                        </div>
                        <div className="font-semibold stat-value text-ink-900 dark:text-ink-50 ml-auto">
                          {formatCurrency(app.requestedAmount, true)}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-ink-100 dark:border-ink-800 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {stage.id !== 'rejected' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateApplicationStage(app.id, 'rejected'); }} 
                            className="p-1.5 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/40 rounded"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        {stage.id !== 'approved' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateApplicationStage(app.id, 'approved'); }} 
                            className="p-1.5 text-success-500 hover:bg-success-50 dark:hover:bg-success-900/40 rounded"
                            title="Approve"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        <button 
                          className="ml-auto text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:underline"
                        >
                          View Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
