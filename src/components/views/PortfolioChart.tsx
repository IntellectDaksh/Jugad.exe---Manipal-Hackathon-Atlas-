import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/format';
import { TrendingUp } from 'lucide-react';

export function PortfolioChart() {
  const { borrowers } = useStore();

  const data = useMemo(() => {
    // Mock historical portfolio growth over the last 6 months
    const base = borrowers.reduce((acc, b) => acc + b.principal, 0);
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    let current = base * 0.7; // Start at 70% of current

    return months.map((month) => {
      const step = current * (1 + (Math.random() * 0.1 - 0.02));
      current = step;
      return {
        month,
        exposure: Math.round(step),
      };
    });
  }, [borrowers]);

  return (
    <div className="card p-5 overflow-hidden relative group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Portfolio Exposure Trend</h3>
          <p className="text-xs text-ink-500 dark:text-ink-400">6-month historical deployment</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center text-primary-600 dark:text-primary-400">
          <TrendingUp size={20} />
        </div>
      </div>
      
      <div className="h-64 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorExposure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#71717a' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#71717a' }}
              tickFormatter={(value) => formatCurrency(value, true).replace('₹', '')}
              dx={-10}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fafafa' }}
              itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
              formatter={(value: number) => [formatCurrency(value), 'Exposure']}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="exposure"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorExposure)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
