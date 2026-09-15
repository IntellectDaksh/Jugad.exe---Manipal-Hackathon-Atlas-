import { useMemo } from 'react';
import { useStore } from '@/store';
import { MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { motion } from 'framer-motion';

export function GeoWidget() {
  const { borrowers } = useStore();

  const geoStats = useMemo(() => {
    const counts: Record<string, { exposure: number; count: number }> = {};
    let totalExp = 0;

    borrowers.forEach(b => {
      if (!counts[b.cluster]) {
        counts[b.cluster] = { exposure: 0, count: 0 };
      }
      counts[b.cluster].exposure += b.principal;
      counts[b.cluster].count += 1;
      totalExp += b.principal;
    });

    return Object.entries(counts)
      .map(([cluster, data]) => ({
        cluster,
        exposure: data.exposure,
        count: data.count,
        pct: totalExp > 0 ? (data.exposure / totalExp) * 100 : 0
      }))
      .sort((a, b) => b.exposure - a.exposure);
  }, [borrowers]);

  return (
    <motion.div 
      initial={{ y: 0 }}
      animate={{ y: [-4, 4, -4] }}
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      className="card overflow-hidden"
    >
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-ink-200 dark:border-ink-800">
        <MapPin size={18} className="text-primary-500" />
        <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Geographic Distribution</h3>
      </div>
      <div className="p-5 space-y-4 relative max-h-[400px] overflow-y-auto custom-scrollbar">
        {geoStats.map((geo, i) => (
          <div key={geo.cluster} className="relative group cursor-pointer">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-ink-900 dark:text-ink-100">{geo.cluster}</span>
              <span className="text-ink-500 dark:text-ink-400">{formatCurrency(geo.exposure, true)} ({geo.count})</span>
            </div>
            <div className="h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${geo.pct}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
              />
            </div>
            
            {/* Floating Tooltip on Hover */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              whileHover={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none hidden group-hover:block z-10 bg-ink-900 dark:bg-white text-white dark:text-ink-900 text-[10px] px-2.5 py-1.5 rounded shadow-lg whitespace-nowrap"
            >
              {geo.pct.toFixed(1)}% of Portfolio
            </motion.div>
          </div>
        ))}
        {geoStats.length === 0 && (
          <p className="text-xs text-ink-500 text-center">No data available.</p>
        )}
      </div>
    </motion.div>
  );
}
