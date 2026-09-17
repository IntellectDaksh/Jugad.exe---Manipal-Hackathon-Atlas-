import type { Borrower, CreditPool, AuditEntry } from '@/types';
import { defaultSeasonalProfile } from './rsi';
import { generateId } from './format';

const pools: CreditPool[] = [
  {
    id: 'pool_001',
    title: 'Coastal Trade Finance Pool',
    jurisdiction: 'Mangaluru Cluster',
    mandate: 'Working capital for small-scale import/export traders in coastal Karnataka',
    capacity: 250000,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'pool_002',
    title: 'Malnad Agriculture Pool',
    jurisdiction: 'Western Ghats',
    mandate: 'Seasonal crop financing for smallholder farmer cooperatives',
    capacity: 150000,
    createdAt: '2025-02-20T08:00:00Z',
  },
  {
    id: 'pool_003',
    title: 'Urban Micro-Enterprise Pool',
    jurisdiction: 'Bengaluru Metro',
    mandate: 'Micro-enterprise growth capital for urban informal sector businesses',
    capacity: 500000,
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
  makeBorrower('Amani Trading Co.', 'Import/Export', 'Mangaluru', 'pool_001', 45000, 1560, 36, 5200, 2800, 'seasonal', 18000, 'Active', 'Strong repayment history, seasonal revenue concentration in Q2/Q3.'),
  makeBorrower('Bahari Fisheries', 'Fishing & Seafood', 'Mangaluru', 'pool_001', 28000, 970, 36, 3400, 1900, 'seasonal', 9500, 'Watch', 'Monsoon season impact on catch volume flagged in last review.'),
  makeBorrower('Sahara Textiles Ltd.', 'Textile Manufacturing', 'Udupi', 'pool_001', 62000, 1850, 42, 6800, 4200, 'stable', 24000, 'Active', 'Diversified buyer base, stable contract pipeline.'),
  makeBorrower('Highland Coffee Coop', 'Agriculture - Coffee', 'Chikmagalur', 'pool_002', 35000, 1210, 36, 2800, 1600, 'seasonal', 7200, 'Watch', 'Global coffee price volatility affecting margins.'),
  makeBorrower('Tena Grain Collective', 'Agriculture - Grains', 'Shivamogga', 'pool_002', 18000, 620, 36, 1900, 1200, 'seasonal', 4800, 'Active', 'Good harvest season, reserves building well.'),
  makeBorrower('Adama Livestock', 'Agriculture - Livestock', 'Davangere', 'pool_002', 22000, 760, 36, 2100, 1450, 'irregular', 3100, 'Watch', 'Drought impact on pasture, irregular income, reserves depleting.'),
  makeBorrower('Bengaluru Bakers United', 'Food Processing', 'Bengaluru', 'pool_003', 15000, 780, 24, 2600, 1400, 'stable', 12000, 'Active', 'Stable demand, long-term supply contracts in place.'),
  makeBorrower('Kibera Crafts Hub', 'Handicrafts & Artisan', 'Bengaluru', 'pool_003', 8000, 270, 36, 1200, 700, 'irregular', 2200, 'Watch', 'Tourism recovery slow, irregular order flow.'),
  makeBorrower('Eastleigh Retail Group', 'Retail Trade', 'Bengaluru', 'pool_003', 52000, 1550, 42, 6200, 3800, 'stable', 28000, 'Active', 'Multiple retail outlets, strong cash flow.'),
  makeBorrower('Mavoko Construction Co.', 'Construction Services', 'Kolar', 'pool_003', 38000, 1310, 36, 3400, 2400, 'declining', 6500, 'Watch', 'Infrastructure project delays, declining contract pipeline.'),
  makeBorrower('Rift Valley Logistics', 'Transport & Logistics', 'Tumakuru', 'pool_003', 41000, 1420, 36, 3800, 2200, 'recovering', 8500, 'Watch', 'Recovering from fuel price shock, new contracts incoming.'),
  makeBorrower('Lamu Boat Builders', 'Boat Building & Repair', 'Karwar', 'pool_001', 12000, 410, 36, 1800, 1100, 'seasonal', 4200, 'Active', 'Niche market, strong local demand.'),
];

const auditLog: AuditEntry[] = [
  {
    id: generateId('aud'),
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    action: 'UNDERWRITE',
    entity: 'Borrower',
    entityId: borrowers[0].id,
    detail: `Underwritten ${borrowers[0].borrowerName} — Principal: ₹${borrowers[0].principal.toLocaleString()}, EMI: ₹${borrowers[0].emi}`,
    user: 'risk.officer@cashpulse',
  },
  {
    id: generateId('aud'),
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    action: 'POOL_CREATE',
    entity: 'CreditPool',
    entityId: 'pool_003',
    detail: 'Created Urban Micro-Enterprise Pool — Bengaluru Metro',
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
    detail: `Underwritten ${borrowers[3].borrowerName} — Principal: ₹${borrowers[3].principal.toLocaleString()}, EMI: ₹${borrowers[3].emi}`,
    user: 'risk.officer@cashpulse',
  },
];


// --- Anvir Ported Data ---
pools.push({
  id: 'mysuru-demo',
  title: 'Mysuru Field Unit',
  jurisdiction: 'Karnataka · Cluster 04',
  mandate: 'Empirical field portfolio covering seasonal agriculture, street vendor cycles, urban gig workers, and recovering trades.',
  capacity: 350000,
  createdAt: '2026-09-12T08:00:00.000Z',
});
borrowers.push(makeBorrower('Lakshmi', 'Seasonal Vegetable Vendor', 'Mysuru Central Mandi, Karnataka', 'mysuru-demo', 48000, 1660, 36, 18400, 11700, 'seasonal', 2223, 'Watch', 'Income dips during monsoon vegetable supply shortages; surges ahead of festive season.'));
borrowers.push(makeBorrower('Raju', 'Smallholder Sugarcane Farmer', 'Mandya District, Karnataka', 'mysuru-demo', 62000, 2150, 36, 22300, 16100, 'seasonal', 1288, 'Watch', 'Major cash harvest realized in Oct-Nov. Pre-harvest inputs cause temporary acute cash pinch.'));
borrowers.push(makeBorrower('Arun', 'Urban Delivery & Gig Courier', 'Bengaluru South, Karnataka', 'mysuru-demo', 35000, 1210, 36, 16200, 10800, 'irregular', 1512, 'Watch', 'Variable weekly incentives. Monthly lump-sum EMI creates timing mismatch.'));
borrowers.push(makeBorrower('Meena', 'Neighbourhood Kirana Store Owner', 'Hassan Town, Karnataka', 'mysuru-demo', 54000, 1870, 36, 29400, 17600, 'stable', 5984, 'Active', 'Consistent daily footfall. Robust working capital buffer and excellent payment hygiene.'));
borrowers.push(makeBorrower('Suresh', 'Independent Carpenter & Joiner', 'Tumakuru Outer Ring, Karnataka', 'mysuru-demo', 41000, 1420, 36, 13800, 12100, 'declining', 605, 'Watch', 'Sustained order slowdown from local real estate halts. Requires structured term relief.'));
borrowers.push(makeBorrower('Fatima', 'Custom Apparel Tailor & Embroidery', 'Shivajinagar, Bengaluru, Karnataka', 'mysuru-demo', 29000, 1000, 36, 17100, 10900, 'recovering', 2398, 'Watch', 'Recovered following purchase of sewing machine motor; orders steadily increasing.'));
pools.push({
  id: 'dharwad-agri',
  title: 'Dharwad Agri & Dairy Cluster',
  jurisdiction: 'Karnataka · Cluster 07',
  mandate: 'Rural micro-enterprise portfolio focusing on dairy farming, pulses, and allied rural production.',
  capacity: 120000,
  createdAt: '2026-09-13T09:30:00.000Z',
});
borrowers.push(makeBorrower('Basavaraj Patil', 'Dairy Cooperative Producer', 'Dharwad Rural, Karnataka', 'dharwad-agri', 50000, 1730, 36, 21500, 13200, 'stable', 3696, 'Active', 'Regular payments via local dairy society direct deposit.'));
borrowers.push(makeBorrower('Gangamma', 'Chilli & Groundnut Cultivator', 'Hubballi Outskirts, Karnataka', 'dharwad-agri', 38000, 1310, 36, 15800, 11500, 'seasonal', 1265, 'Watch', 'Weeding and fertilizer peak costs coincide with lean monsoon income.'));

export { pools, borrowers, auditLog };
