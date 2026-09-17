import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { useStore } from '@/store';
import { calculateRSI } from '@/lib/rsi';
import { PieChart as PieChartIcon, TrendingUp, AlertTriangle, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#64748b', '#eab308'];

export function MacroAnalytics() {
  const { borrowers, pools } = useStore();

  const clusterData = useMemo(() => {
    const map = new Map<string, { cluster: string, performing: number, watchlist: number, critical: number }>();
    
    borrowers.forEach(b => {
      const tier = calculateRSI(b).tier;
      if (!map.has(b.cluster)) {
        map.set(b.cluster, { cluster: b.cluster, performing: 0, watchlist: 0, critical: 0 });
      }
      const entry = map.get(b.cluster)!;
      if (tier === 'Performing') entry.performing += b.principal;
      else if (tier === 'Watchlist') entry.watchlist += b.principal;
      else entry.critical += b.principal;
    });

    return Array.from(map.values()).sort((a, b) => {
      if (b.critical !== a.critical) return b.critical - a.critical;
      if (b.watchlist !== a.watchlist) return b.watchlist - a.watchlist;
      return b.performing - a.performing;
    });
  }, [borrowers]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    borrowers.forEach(b => {
      map.set(b.tradeCategory, (map.get(b.tradeCategory) || 0) + b.principal);
    });
    const sorted = Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    
    // Group into top 5 and "Other" to prevent legend overflow
    if (sorted.length > 5) {
      const top5 = sorted.slice(0, 5);
      const otherValue = sorted.slice(5).reduce((acc, curr) => acc + curr.value, 0);
      top5.push({ name: 'Other Sectors', value: otherValue });
      return top5;
    }
    return sorted;
  }, [borrowers]);

  // Mock trend data
  const trendData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        month: d.toLocaleString('default', { month: 'short' }),
        avgRsi: 35 + Math.random() * 15 + (i === 0 ? 5 : 0), // slight uptick recently
        defaultRate: 2 + Math.random() * 2,
      });
    }
    return data;
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ink-900 dark:text-ink-50">Macro Analytics</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400">Deep dive into portfolio distribution and macroeconomic risk factors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk by Cluster Bar Chart */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 mb-6 flex items-center gap-2">
            <ShieldAlert size={16} className="text-primary-500" /> Capital at Risk by Cluster (₹)
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clusterData} margin={{ top: 10, right: 10, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-ink-200 dark:text-ink-800" />
                <XAxis dataKey="cluster" tick={{ fill: 'currentColor', fontSize: 11 }} angle={-45} textAnchor="end" height={60} className="text-ink-500" axisLine={false} tickLine={false} interval={0} />
                <YAxis tickFormatter={(val) => `₹${(val/100000).toFixed(1)}L`} tick={{ fill: 'currentColor', fontSize: 12 }} className="text-ink-500" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ backgroundColor: '#18181b', color: '#fafafa', borderRadius: '8px', border: '1px solid #27272a' }}
                  itemStyle={{ color: '#fafafa' }}
                  labelStyle={{ color: '#e4e4e7', marginBottom: '4px' }}
                  formatter={(value: any) => formatCurrency(value as number, true)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="performing" name="Performing" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="watchlist" name="Watchlist" stackId="a" fill="#f59e0b" />
                <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Allocation Pie Chart */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 mb-6 flex items-center gap-2">
            <PieChartIcon size={16} className="text-primary-500" /> Portfolio Sector Allocation
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="40%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', color: '#fafafa', borderRadius: '8px', border: '1px solid #27272a' }}
                  itemStyle={{ color: '#fafafa' }}
                  labelStyle={{ color: '#e4e4e7', marginBottom: '4px' }}
                  formatter={(value: any) => formatCurrency(value as number, true)}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right" 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '12px', width: '50%' }} 
                  formatter={(value) => {
                    const item = categoryData.find(d => d.name === value);
                    const total = categoryData.reduce((a, b) => a + b.value, 0);
                    const percent = item ? ((item.value / total) * 100).toFixed(0) : 0;
                    return <span className="text-ink-700 dark:text-ink-300 font-medium ml-1">{value} <span className="text-ink-400 dark:text-ink-500 ml-1">{percent}%</span></span>;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Macro Trend Line Chart */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50 mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-500" /> Historical Risk Trends (6 Months)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-ink-200 dark:text-ink-800" />
                <XAxis dataKey="month" tick={{ fill: 'currentColor', fontSize: 12 }} className="text-ink-500" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: '#f59e0b', fontSize: 12 }} className="text-ink-500" axisLine={false} tickLine={false} domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#ef4444', fontSize: 12 }} className="text-ink-500" axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', color: '#fafafa', borderRadius: '8px', border: '1px solid #27272a' }}
                  itemStyle={{ color: '#fafafa' }}
                  labelStyle={{ color: '#e4e4e7', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="avgRsi" name="Avg RSI (Risk Score)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="defaultRate" name="Default Rate (%)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
