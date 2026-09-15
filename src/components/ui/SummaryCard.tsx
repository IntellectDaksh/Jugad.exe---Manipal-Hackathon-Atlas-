import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface SummaryCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  accent?: 'primary' | 'success' | 'warning' | 'danger' | 'accent' | 'neutral';
  trend?: { value: string; positive: boolean };
  sparklineData?: { value: number }[];
}

const accentMap = {
  primary: { bg: 'bg-primary-50 dark:bg-primary-950/40', text: 'text-primary-600 dark:text-primary-400', ring: 'ring-primary-100 dark:ring-primary-900/50' },
  success: { bg: 'bg-success-50 dark:bg-success-950/40', text: 'text-success-600 dark:text-success-400', ring: 'ring-success-100 dark:ring-success-900/50' },
  warning: { bg: 'bg-warning-50 dark:bg-warning-950/40', text: 'text-warning-600 dark:text-warning-400', ring: 'ring-warning-100 dark:ring-warning-900/50' },
  danger: { bg: 'bg-danger-50 dark:bg-danger-950/40', text: 'text-danger-600 dark:text-danger-400', ring: 'ring-danger-100 dark:ring-danger-900/50' },
  accent: { bg: 'bg-accent-50 dark:bg-accent-950/40', text: 'text-accent-600 dark:text-accent-400', ring: 'ring-accent-100 dark:ring-accent-900/50' },
  neutral: { bg: 'bg-ink-100 dark:bg-ink-800', text: 'text-ink-600 dark:text-ink-300', ring: 'ring-ink-200 dark:ring-ink-700' },
};

export function SummaryCard({ label, value, sub, icon, accent = 'neutral', trend, sparklineData }: SummaryCardProps) {
  const a = accentMap[accent];
  
  const strokeColor = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    accent: '#8b5cf6',
    neutral: '#71717a'
  }[accent];

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card card-hover p-5 relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink-900 dark:text-ink-50 stat-value">{value}</p>
          {sub && <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{sub}</p>}
          {trend && (
            <p className={`mt-2 text-xs font-semibold ${trend.positive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
              {trend.value}
            </p>
          )}
        </div>
          {icon && (
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${a.bg} ${a.text} flex items-center justify-center ring-1 ${a.ring}`}>
              {icon}
            </div>
          )}
        </div>
        
        {sparklineData && (
          <div className="h-10 mt-3 -mx-2 -mb-2 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={strokeColor} 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={true} 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
    </motion.div>
  );
}
