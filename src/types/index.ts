export type StressLevel = 'green' | 'yellow' | 'orange' | 'red';
export type StressType = 'Seasonal' | 'Structural' | 'Irregular' | 'Stable';
export type TrendDirection = 'up' | 'down' | 'flat' | 'volatile';

export interface Borrower {
  id: string;
  name: string;
  age: number;
  occupation: string;
  loanAmount: number;
  tenureMonths: number;
  currentEMI: number;
  rsi: number;
  stressType: StressType;
  stressLevel: StressLevel;
  trend: TrendDirection;
  monthsRemaining: number;
  avatarColor: string;
  initials: string;
}

export interface MonthlyCashflow {
  month: string;
  income: number;
  expenses: number;
  emi: number;
  rsi: number;
}

export interface RestructurePlan {
  id: string;
  name: string;
  description: string;
  schedule: { period: string; amount: number }[];
  borrowerStress: 'LOW' | 'MODERATE' | 'HIGH';
  lenderRecovery: number;
  defaultRisk: number;
  recommended: boolean;
  color: string;
}

export interface ExplainabilityFactor {
  label: string;
  contribution: number;
  description: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  borrower: string;
  action: string;
  plan: string;
  officer: string;
  riskBefore: number;
  riskAfter: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export type ViewKey = 'portfolio' | 'borrower' | 'simulator' | 'audit';
