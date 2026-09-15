import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/format';
import { Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LiveTicker() {
  const { borrowers } = useStore();

  if (borrowers.length === 0) return null;

  return (
    <div className="hidden lg:flex items-center gap-4 bg-ink-900 dark:bg-ink-950 text-white px-4 py-2 rounded-lg overflow-hidden border border-ink-800 shadow-md h-9">
      <div className="flex items-center gap-1.5 text-primary-400 font-semibold text-[10px] uppercase tracking-wider flex-shrink-0">
        <Zap size={14} className="text-primary-400" /> System Status
      </div>
      <div className="w-px h-4 bg-ink-700 mx-1"></div>
      <div className="flex items-center gap-2 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse"></span>
        <span className="text-ink-300 font-medium tracking-wide text-[11px]">AI Engine: <span className="text-success-400 font-bold">Active</span></span>
      </div>
      <div className="w-px h-4 bg-ink-700 mx-1"></div>
      <div className="flex items-center gap-2 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-success-400"></span>
        <span className="text-ink-300 font-medium tracking-wide text-[11px]">Risk Models: <span className="text-ink-100 font-bold">Synced</span></span>
      </div>
    </div>
  );
}
