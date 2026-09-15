import type { Borrower, CreditPool, AuditEntry } from '@/types';
import { defaultSeasonalProfile } from './rsi';
import { generateId } from './format';

const pools: CreditPool[] = [
  {
    id: 'pool_001',
    title: 'Coastal Trade Finance Pool',
    jurisdiction: 'Mombasa Cluster',
    mandate: 'Working capital for small-scale import/export traders in coastal East Africa',
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'pool_002',
    title: 'Highland Agriculture Pool',
    jurisdiction: 'Ethiopian Highlands',
    mandate: 'Seasonal crop financing for smallholder farmer cooperatives',
    createdAt: '2025-02-20T08:00:00Z',
  },
  {
    id: 'pool_003',
    title: 'Urban Micro-Enterprise Pool',
    jurisdiction: 'Nairobi Metro',
    mandate: 'Micro-enterprise growth capital for urban informal sector businesses',
    createdAt: '2025-03-10T08:00:00Z',
  },
];

function makeBorrower(
  name: string,
  trade: string,
  cluster: string,
  poolId: string,
  principal: number,
  emi: number,
  maturityMonths: number,
  income: number,
  outflows: number,
  cadence: Borrower['cadence'],
  reserves: number,
  status: Borrower['status'] = 'Active',
  notes = '',
): Borrower {
  const maturity = new Date();
  maturity.setMonth(maturity.getMonth() + maturityMonths);
  return {
    id: generateId('acc'),
    borrowerName: name,
    tradeCategory: trade,
    cluster,
    poolId,
    principal,
    emi,
    maturity: maturity.toISOString(),
    monthlyIncome: income,
    essentialOutflows: outflows,
    cadence,
    liquidReserves: reserves,
    restructured: false,
    status,
    createdAt: new Date().toISOString(),
    seasonalProfile: defaultSeasonalProfile(cadence),
    notes,
  };
}

const borrowers: Borrower[] = [
  makeBorrower('Amani Trading Co.', 'Import/Export', 'Mombasa', 'pool_001', 45000, 1250, 36, 5200, 2800, 'seasonal', 18000, 'Active', 'Strong repayment history, seasonal revenue concentration in Q2/Q3.'),
  makeBorrower('Bahari Fisheries', 'Fishing & Seafood', 'Mombasa', 'pool_001', 28000, 820, 36, 3400, 1900, 'seasonal', 9500, 'Watch', 'Monsoon season impact on catch volume flagged in last review.'),
  makeBorrower('Sahara Textiles Ltd.', 'Textile Manufacturing', 'Malindi', 'pool_001', 62000, 1800, 42, 6800, 4200, 'stable', 24000, 'Active', 'Diversified buyer base, stable contract pipeline.'),
  makeBorrower('Highland Coffee Coop', 'Agriculture - Coffee', 'Yirgacheffe', 'pool_002', 35000, 980, 36, 2800, 1600, 'seasonal', 7200, 'Watch', 'Global coffee price volatility affecting margins.'),
  makeBorrower('Tena Grain Collective', 'Agriculture - Grains', 'Bahir Dar', 'pool_002', 18000, 520, 36, 1900, 1200, 'seasonal', 4800, 'Active', 'Good harvest season, reserves building well.'),
  makeBorrower('Adama Livestock', 'Agriculture - Livestock', 'Adama', 'pool_002', 22000, 640, 36, 2100, 1450, 'irregular', 3100, 'Critical', 'Drought impact on pasture, irregular income, reserves depleting.'),
  makeBorrower('Nairobi Bakers United', 'Food Processing', 'Nairobi', 'pool_003', 15000, 450, 24, 2600, 1400, 'stable', 12000, 'Active', 'Stable demand, long-term supply contracts in place.'),
  makeBorrower('Kibera Crafts Hub', 'Handicrafts & Artisan', 'Nairobi', 'pool_003', 8000, 240, 36, 1200, 700, 'irregular', 2200, 'Watch', 'Tourism recovery slow, irregular order flow.'),
  makeBorrower('Eastleigh Retail Group', 'Retail Trade', 'Nairobi', 'pool_003', 52000, 1550, 36, 6200, 3800, 'stable', 28000, 'Active', 'Multiple retail outlets, strong cash flow.'),
  makeBorrower('Mavoko Construction Co.', 'Construction Services', 'Machakos', 'pool_003', 38000, 1100, 36, 3400, 2400, 'declining', 6500, 'Critical', 'Infrastructure project delays, declining contract pipeline.'),
  makeBorrower('Rift Valley Logistics', 'Transport & Logistics', 'Nakuru', 'pool_003', 41000, 1200, 36, 3800, 2200, 'recovering', 8500, 'Watch', 'Recovering from fuel price shock, new contracts incoming.'),
  makeBorrower('Lamu Boat Builders', 'Boat Building & Repair', 'Lamu', 'pool_001', 12000, 360, 36, 1800, 1100, 'seasonal', 4200, 'Active', 'Niche market, strong local demand.'),
];

const auditLog: AuditEntry[] = [
  {
    id: generateId('aud'),
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    action: 'UNDERWRITE',
    entity: 'Borrower',
    entityId: borrowers[0].id,
    detail: `Underwritten ${borrowers[0].borrowerName} — Principal: $${borrowers[0].principal.toLocaleString()}, EMI: $${borrowers[0].emi}`,
    user: 'risk.officer@cashpulse',
  },
  {
    id: generateId('aud'),
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    action: 'POOL_CREATE',
    entity: 'CreditPool',
    entityId: 'pool_003',
    detail: 'Created Urban Micro-Enterprise Pool — Nairobi Metro',
    user: 'portfolio.admin@cashpulse',
  },
  {
    id: generateId('aud'),
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    action: 'STATUS_CHANGE',
    entity: 'Borrower',
    entityId: borrowers[5].id,
    detail: `${borrowers[5].borrowerName} moved to Critical — RSI exceeded 65 threshold`,
    user: 'risk.officer@cashpulse',
  },
  {
    id: generateId('aud'),
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    action: 'STATUS_CHANGE',
    entity: 'Borrower',
    entityId: borrowers[9].id,
    detail: `${borrowers[9].borrowerName} moved to Critical — declining cash flow cadence`,
    user: 'risk.officer@cashpulse',
  },
  {
    id: generateId('aud'),
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    action: 'UNDERWRITE',
    entity: 'Borrower',
    entityId: borrowers[3].id,
    detail: `Underwritten ${borrowers[3].borrowerName} — Principal: $${borrowers[3].principal.toLocaleString()}, EMI: $${borrowers[3].emi}`,
    user: 'risk.officer@cashpulse',
  },
];

export { pools, borrowers, auditLog };
