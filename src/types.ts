export type RiskTier = 'Performing' | 'Watchlist' | 'Critical';

export type CashFlowCadence = 'stable' | 'seasonal' | 'irregular' | 'declining' | 'recovering';

export type AccountStatus = 'Active' | 'Restructured' | 'Watch' | 'Default' | 'Closed';

export interface Borrower {
  id: string;
  borrowerName: string;
  tradeCategory: string;
  cluster: string;
  poolId: string;
  principal: number;
  emi: number;
  maturity: string; // ISO date
  monthlyIncome: number;
  essentialOutflows: number;
  cadence: CashFlowCadence;
  liquidReserves: number;
  restructured: boolean;
  restructureTerms?: RestructureTerms;
  status: AccountStatus;
  createdAt: string;
  seasonalProfile: number[]; // 12 values 0-1, income as fraction of average per month
  notes: string;
  collateralType?: string;
  collateralValue?: number;
}

export interface RestructureTerms {
  newEmi: number;
  newMaturity: string;
  termMonths: number;
  interestRate: number;
  appliedAt: string;
  reason: string;
}

export interface CreditPool {
  id: string;
  title: string;
  jurisdiction: string;
  mandate: string;
  capacity: number;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  entity: string;
  entityId: string;
  detail: string;
  user: string;
}

export interface StressShock {
  revenueVariance: number; // -50 to +20 percent
  unplannedOutflow: number; // absolute amount
}

export interface RSIBreakdown {
  score: number;
  tier: RiskTier;
  dscr: number;
  fof: number;
  reserveDays: number;
  factors: { label: string; value: number; impact: number }[];
}

export interface ProjectionMonth {
  month: string;
  label: string;
  projectedIncome: number;
  projectedOutflows: number;
  projectedFOF: number;
  projectedDSCR: number;
  projectedRSI: number;
  projectedTier: RiskTier;
}

export type ViewKey = 'dashboard' | 'ledger' | 'sandbox' | 'heatmap' | 'audit' | 'settings' | 'origination' | 'analytics' | 'compliance';

export type ApplicationStage = 'pending_data' | 'ai_review' | 'human_review' | 'approved' | 'rejected';

export interface OriginationApplication {
  id: string;
  businessName: string;
  applicantName: string;
  requestedAmount: number;
  tradeCategory: string;
  cluster: string;
  stage: ApplicationStage;
  submittedAt: string;
  aiScore?: number;
  phoneDataFound: boolean;
  smsConsent: boolean;
}
