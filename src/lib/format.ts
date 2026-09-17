const EXCHANGE_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.012, // 1 INR = 0.012 USD
  GBP: 0.0094, // 1 INR = 0.0094 GBP
};

export function formatCurrency(n: number, compact = false): string {
  const currency = localStorage.getItem('cashpulse_currency') || 'INR';
  const rate = EXCHANGE_RATES[currency] || 1;
  const converted = n * rate;
  
  if (compact) {
    if (currency === 'INR') {
      if (Math.abs(converted) >= 1_000_000_0) return `₹${(converted / 1_000_000_0).toFixed(1)}Cr`;
      if (Math.abs(converted) >= 1_000_00) return `₹${(converted / 1_000_00).toFixed(1)}L`;
      if (Math.abs(converted) >= 1_000) return `₹${(converted / 1_000).toFixed(1)}K`;
    } else if (currency === 'USD') {
      if (Math.abs(converted) >= 1_000_000) return `$${(converted / 1_000_000).toFixed(1)}M`;
      if (Math.abs(converted) >= 1_000) return `$${(converted / 1_000).toFixed(1)}K`;
    } else if (currency === 'GBP') {
      if (Math.abs(converted) >= 1_000_000) return `£${(converted / 1_000_000).toFixed(1)}M`;
      if (Math.abs(converted) >= 1_000) return `£${(converted / 1_000).toFixed(1)}K`;
    }
  }

  const locales: Record<string, string> = { INR: 'en-IN', USD: 'en-US', GBP: 'en-GB' };
  
  return new Intl.NumberFormat(locales[currency] || 'en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(converted);
}

export function formatNumber(n: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n >= 0 ? '' : ''}${n.toFixed(decimals)}%`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export function generateId(prefix = 'id'): string {
  const r1 = Math.random().toString(36).substring(2, 10);
  const r2 = Math.random().toString(36).substring(2, 6);
  return `${prefix}_${r1}_${r2}`;
}
