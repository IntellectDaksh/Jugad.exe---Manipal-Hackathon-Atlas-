import type { Borrower, RSIBreakdown, RiskTier, ProjectionMonth, StressShock, CashFlowCadence } from '@/types';

export function getTier(score: number): RiskTier {
  if (score >= 65) return 'Critical';
  if (score >= 40) return 'Watchlist';
  return 'Performing';
}

export function tierColor(tier: RiskTier): string {
  switch (tier) {
    case 'Critical': return 'danger';
    case 'Watchlist': return 'warning';
    case 'Performing': return 'success';
  }
}

const cadenceImpact: Record<CashFlowCadence, number> = {
  stable: 0,
  seasonal: 10,
  irregular: 8,
  declining: 15,
  recovering: -5,
};

export function freeOperatingFlow(b: Borrower, shock?: StressShock): number {
  const incomeAdjust = shock ? b.monthlyIncome * (1 + shock.revenueVariance / 100) : b.monthlyIncome;
  const outflowAdd = shock ? shock.unplannedOutflow : 0;
  return incomeAdjust - b.essentialOutflows - outflowAdd;
}

export function dscr(b: Borrower, shock?: StressShock): number {
  const fof = freeOperatingFlow(b, shock);
  return b.emi > 0 ? fof / b.emi : 0;
}

export function reserveDays(b: Borrower): number {
  const dailyBurn = b.emi / 30;
  return dailyBurn > 0 ? b.liquidReserves / dailyBurn : 999;
}

export function monthsToMaturity(b: Borrower): number {
  const now = new Date();
  const mat = new Date(b.maturity);
  return Math.max(0, Math.round((mat.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
}

export function calculateRSI(b: Borrower, shock?: StressShock): RSIBreakdown {
  const fof = freeOperatingFlow(b, shock);
  const ratio = dscr(b, shock);
  const rDays = reserveDays(b);
  const matMonths = monthsToMaturity(b);

  // Base score from DSCR
  let base: number;
  if (ratio >= 2.0) base = 10;
  else if (ratio >= 1.5) base = 20;
  else if (ratio >= 1.2) base = 35;
  else if (ratio >= 1.0) base = 50;
  else if (ratio >= 0.8) base = 70;
  else base = 85;

  const factors: RSIBreakdown['factors'] = [
    { label: 'Debt Service Coverage', value: ratio, impact: base },
    { label: 'Cash-Flow Cadence', value: 0, impact: cadenceImpact[b.cadence] },
  ];

  // Reserve days impact
  let reserveImpact: number;
  if (rDays < 15) reserveImpact = 15;
  else if (rDays < 30) reserveImpact = 8;
  else if (rDays < 60) reserveImpact = 3;
  else reserveImpact = -5;
  factors.push({ label: 'Liquid Reserve Days', value: rDays, impact: reserveImpact });

  // Maturity risk
  let matImpact: number;
  if (matMonths < 6) matImpact = 10;
  else if (matMonths < 12) matImpact = 5;
  else matImpact = 0;
  factors.push({ label: 'Maturity Proximity', value: matMonths, impact: matImpact });

  // Principal-to-income leverage
  const leverageRatio = b.monthlyIncome > 0 ? b.principal / (b.monthlyIncome * 12) : 99;
  let levImpact: number;
  if (leverageRatio > 3) levImpact = 10;
  else if (leverageRatio > 2) levImpact = 5;
  else levImpact = 0;
  factors.push({ label: 'Leverage Ratio', value: leverageRatio, impact: levImpact });

  const raw = base + cadenceImpact[b.cadence] + reserveImpact + matImpact + levImpact;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  return {
    score,
    tier: getTier(score),
    dscr: ratio,
    fof,
    reserveDays: rDays,
    factors,
  };
}

export function projectSixMonths(b: Borrower, shock?: StressShock): ProjectionMonth[] {
  const months: ProjectionMonth[] = [];
  const now = new Date();
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthIdx = d.getMonth();
    const seasonalFactor = b.seasonalProfile?.[monthIdx] ?? 1;

    let projectedIncome = b.monthlyIncome * seasonalFactor;
    if (shock) projectedIncome *= 1 + shock.revenueVariance / 100;

    let projectedOutflows = b.essentialOutflows;
    if (shock) projectedOutflows += shock.unplannedOutflow;

    const projectedFOF = projectedIncome - projectedOutflows;
    const projectedDSCR = b.emi > 0 ? projectedFOF / b.emi : 0;

    // Simplified RSI for projection
    let base: number;
    if (projectedDSCR >= 2.0) base = 10;
    else if (projectedDSCR >= 1.5) base = 20;
    else if (projectedDSCR >= 1.2) base = 35;
    else if (projectedDSCR >= 1.0) base = 50;
    else if (projectedDSCR >= 0.8) base = 70;
    else base = 85;

    const cadenceAdj = cadenceImpact[b.cadence];
    const rDays = reserveDays(b);
    const reserveAdj = rDays < 15 ? 15 : rDays < 30 ? 8 : rDays < 60 ? 3 : -5;
    const raw = base + cadenceAdj + reserveAdj;
    const projectedRSI = Math.max(0, Math.min(100, Math.round(raw)));

    months.push({
      month: d.toISOString(),
      label: monthLabels[monthIdx],
      projectedIncome,
      projectedOutflows,
      projectedFOF,
      projectedDSCR,
      projectedRSI,
      projectedTier: getTier(projectedRSI),
    });
  }

  return months;
}

export function willHitStrain(b: Borrower, shock?: StressShock): boolean {
  const projection = projectSixMonths(b, shock);
  const now = new Date();
  const in60Days = projection.slice(0, 2);
  return in60Days.some(m => m.projectedRSI >= 65 || m.projectedDSCR < 1.0);
}

export function defaultSeasonalProfile(cadence: CashFlowCadence): number[] {
  // 12-month income fraction of average
  switch (cadence) {
    case 'seasonal':
      // Peak in summer months, lean in winter
      return [0.6, 0.65, 0.8, 0.9, 1.1, 1.3, 1.35, 1.2, 1.0, 0.85, 0.7, 0.55];
    case 'declining':
      return [1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6];
    case 'recovering':
      return [0.6, 0.65, 0.7, 0.75, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2];
    case 'irregular':
      return [1.2, 0.7, 1.1, 0.8, 1.3, 0.6, 1.15, 0.9, 1.0, 0.75, 1.25, 0.85];
    case 'stable':
    default:
      return new Array(12).fill(1.0);
  }
}
