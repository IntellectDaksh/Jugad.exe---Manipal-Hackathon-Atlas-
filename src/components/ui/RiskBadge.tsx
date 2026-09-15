import type { RiskTier } from '@/types';

const tierStyles: Record<RiskTier, { bg: string; text: string; dot: string; border: string }> = {
  Critical: {
    bg: 'bg-danger-50 dark:bg-danger-950/40',
    text: 'text-danger-700 dark:text-danger-400',
    dot: 'bg-danger-500',
    border: 'border-danger-200 dark:border-danger-900',
  },
  Watchlist: {
    bg: 'bg-warning-50 dark:bg-warning-950/40',
    text: 'text-warning-700 dark:text-warning-400',
    dot: 'bg-warning-500',
    border: 'border-warning-200 dark:border-warning-900',
  },
  Performing: {
    bg: 'bg-success-50 dark:bg-success-950/40',
    text: 'text-success-700 dark:text-success-400',
    dot: 'bg-success-500',
    border: 'border-success-200 dark:border-success-900',
  },
};

export function RiskBadge({ tier, score, size = 'md' }: { tier: RiskTier; score?: number; size?: 'sm' | 'md' }) {
  const s = tierStyles[tier];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 ${padding} font-semibold rounded-full ${s.bg} ${s.text} border ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {tier}
      {score !== undefined && <span className="opacity-60">· {score}</span>}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-900',
    Restructured: 'bg-accent-50 dark:bg-accent-950/40 text-accent-700 dark:text-accent-400 border-accent-200 dark:border-accent-900',
    Watch: 'bg-warning-50 dark:bg-warning-950/40 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-900',
    Default: 'bg-danger-50 dark:bg-danger-950/40 text-danger-700 dark:text-danger-400 border-danger-200 dark:border-danger-900',
    Closed: 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 border-ink-200 dark:border-ink-700',
  };
  const cls = styles[status] || styles.Active;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border ${cls}`}>
      {status}
    </span>
  );
}
