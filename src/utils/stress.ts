import type { StressLevel, StressType } from '@/types';

export function stressColor(level: StressLevel): string {
  switch (level) {
    case 'green': return '#059669';
    case 'yellow': return '#ca8a04';
    case 'orange': return '#ea580c';
    case 'red': return '#dc2626';
  }
}

export function stressBg(level: StressLevel): string {
  switch (level) {
    case 'green': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'yellow': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'orange': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'red': return 'bg-red-50 text-red-700 border-red-200';
  }
}

export function stressLabel(level: StressLevel): string {
  switch (level) {
    case 'green': return 'Healthy';
    case 'yellow': return 'Watch';
    case 'orange': return 'At-Risk';
    case 'red': return 'Critical';
  }
}

export function stressTypeColor(type: StressType): string {
  switch (type) {
    case 'Seasonal': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Structural': return 'bg-red-50 text-red-700 border-red-200';
    case 'Irregular': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Stable': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
}

export function rsiColor(rsi: number): string {
  if (rsi < 0.3) return '#059669';
  if (rsi < 0.5) return '#ca8a04';
  if (rsi < 0.75) return '#ea580c';
  return '#dc2626';
}

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}
