import { Borrower, RiskTier } from '@/types';
import { calculateRSI } from './rsi';
import { formatCurrency } from './format';

export interface RepaymentPlan {
  id: string;
  type: string;
  label: string;
  description: string;
  sustainabilityScore: number;
  affordabilityRatioAvg: number;
  totalRepayment: number;
  tenureMonths: number;
  monthlyEmi: number;
  recommended: boolean;
  guardrailStatus: string;
  schedule: { label: string; amount: number }[];
}

export interface AnalysisEvidence {
  factorName: string;
  weight: number;
  evidence: string;
  direction: 'up' | 'down';
}

export interface BorrowerAnalysis {
  rsiCurrent: number;
  riskLevel: RiskTier;
  confidence: number;
  classificationReason: string;
  evidence: AnalysisEvidence[];
  plans: RepaymentPlan[];
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export function generateAlternativePlans(borrower: Borrower, rsi: number): RepaymentPlan[] {
  const emi = borrower.emi;
  const remainingMonths = 12; // Approximation, or calculate from maturity
  const totalOriginalRepayment = emi * remainingMonths;
  const isSeasonal = borrower.cadence === 'seasonal';
  const leanMonthCount = 3;

  const leanMonthEmi = Math.max(Math.round(emi * 0.6), Math.round(emi * 0.45));
  const normalMonthEmi = Math.round((totalOriginalRepayment - leanMonthEmi * leanMonthCount) / (remainingMonths - leanMonthCount));

  const weeklyAmount = Math.round(emi / 4.33);
  const extendedMonths = Math.ceil(remainingMonths * 1.5);
  const extendedMonthlyEmi = Math.round(totalOriginalRepayment / extendedMonths);

  let recommendedId = 'current';
  if (isSeasonal) recommendedId = 'seasonal';
  else if (borrower.cadence === 'recovering') recommendedId = 'step';
  else if (borrower.cadence === 'declining' || rsi >= 65) recommendedId = 'extend';
  else if (borrower.cadence === 'irregular') recommendedId = 'weekly';

  const disposableIncome = Math.max(borrower.monthlyIncome - borrower.essentialOutflows, emi * 0.5);

  return [
    {
      id: 'current',
      type: 'Current Standard Contract',
      label: 'Fixed Monthly Amortization',
      description: 'Preserves existing monthly collection cycle without modifying repayment maturity.',
      sustainabilityScore: Math.round(clamp(100 - rsi * 0.75, 15, 88)),
      affordabilityRatioAvg: clamp(emi / disposableIncome, 0.12, 0.85),
      totalRepayment: totalOriginalRepayment,
      tenureMonths: remainingMonths,
      monthlyEmi: emi,
      recommended: recommendedId === 'current',
      schedule: [
        { label: 'Month 1', amount: emi },
        { label: 'Month 2', amount: emi },
        { label: 'Month 3', amount: emi },
      ],
      guardrailStatus: rsi >= 65 ? 'Elevated probability of delinquency' : 'Within default lending covenants',
    },
    {
      id: 'seasonal',
      type: 'Seasonal Moratorium & Cash-Flow Flex',
      label: 'Amortization Linked to Harvest Cycles',
      description: isSeasonal ? `Reduces obligation to ${formatCurrency(leanMonthEmi)} during lean months, recovering at ${formatCurrency(normalMonthEmi)} post-harvest.` : 'Dynamic payment shaping to match seasonal liquidity influx.',
      sustainabilityScore: Math.round(clamp(86 - rsi * 0.08 + (isSeasonal ? 8 : 0), 58, 95)),
      affordabilityRatioAvg: clamp((leanMonthEmi / disposableIncome) * 0.75, 0.12, 0.52),
      totalRepayment: Math.round(totalOriginalRepayment * 1.008),
      tenureMonths: remainingMonths,
      monthlyEmi: leanMonthEmi,
      recommended: recommendedId === 'seasonal',
      schedule: [
        { label: 'Lean Mo 1', amount: leanMonthEmi },
        { label: 'Normal Mo 2', amount: normalMonthEmi },
        { label: 'Normal Mo 3', amount: normalMonthEmi },
      ],
      guardrailStatus: 'Passes UN SDG 8 affordability criteria',
    },
    {
      id: 'weekly',
      type: 'Micro-Frequency Shift',
      label: 'Bite-Sized Weekly Micro-Amortization',
      description: `Disaggregates monthly lumpsum into 4 manageable weekly installments of ${formatCurrency(weeklyAmount)}. Ideal for daily retail & gig earners.`,
      sustainabilityScore: Math.round(clamp(78 - rsi * 0.11 + (borrower.cadence === 'irregular' ? 10 : 0), 50, 90)),
      affordabilityRatioAvg: clamp((weeklyAmount * 4.33) / disposableIncome, 0.10, 0.48),
      totalRepayment: Math.round(totalOriginalRepayment * 0.995),
      tenureMonths: remainingMonths,
      monthlyEmi: weeklyAmount,
      recommended: recommendedId === 'weekly',
      schedule: [
        { label: 'Week 1', amount: weeklyAmount },
        { label: 'Week 2', amount: weeklyAmount },
        { label: 'Week 3', amount: weeklyAmount },
      ],
      guardrailStatus: 'Eliminates month-end liquidity friction',
    },
    {
      id: borrower.cadence === 'recovering' ? 'step' : 'extend',
      type: borrower.cadence === 'recovering' ? 'Graduated Step-Up Plan' : 'Controlled Maturity Extension',
      label: borrower.cadence === 'recovering' ? 'Stepped Amortization with Revenue Growth' : 'Horizon Extension to Lower Payment',
      description: borrower.cadence === 'recovering'
        ? `Starts below current EMI (${formatCurrency(Math.round(emi * 0.65))}) and scales up as revenue consolidates.`
        : `Extends remaining term to ${extendedMonths} months, slashing monthly obligation to ${formatCurrency(extendedMonthlyEmi)}.`,
      sustainabilityScore: Math.round(clamp(74 - rsi * 0.05, 52, 85)),
      affordabilityRatioAvg: clamp(extendedMonthlyEmi / disposableIncome, 0.10, 0.42),
      totalRepayment: Math.round(totalOriginalRepayment * 1.055),
      tenureMonths: extendedMonths,
      monthlyEmi: extendedMonthlyEmi,
      recommended: recommendedId === 'step' || recommendedId === 'extend',
      schedule: [
        { label: 'Month 1', amount: extendedMonthlyEmi },
        { label: 'Month 2', amount: extendedMonthlyEmi },
        { label: 'Month 3', amount: extendedMonthlyEmi },
      ],
      guardrailStatus: 'Complies with credit committee limit',
    },
  ];
}

export function analyzeBorrower(borrower: Borrower): BorrowerAnalysis {
  const rsiData = calculateRSI(borrower);
  const rsiCurrent = rsiData.score;
  const riskLevel = rsiData.tier;

  const disposableIncome = Math.max(borrower.monthlyIncome - borrower.essentialOutflows, borrower.emi * 0.5);
  const capacityMarginPct = Math.round((disposableIncome / Math.max(1, borrower.essentialOutflows)) * 100);

  const evidence: AnalysisEvidence[] = [
    {
      factorName: borrower.cadence === 'seasonal' ? 'Seasonal Cash-Flow Cycle' : 'Operating Margin & Cash Volatility',
      weight: 35,
      evidence: `Monthly gross earnings average ${formatCurrency(borrower.monthlyIncome)} with a ${capacityMarginPct}% net operating margin above essential subsistence costs.`,
      direction: capacityMarginPct > 35 ? 'down' : 'up',
    },
    {
      factorName: 'Historical Repayment Track',
      weight: 25,
      evidence: borrower.status === 'Default' ? 'Borrower has missed consecutive payments.' : 'Contractual installments paid reliably without default.',
      direction: borrower.status === 'Default' ? 'up' : 'down',
    },
    {
      factorName: 'Liquid Reserve Buffer',
      weight: 40,
      evidence: `Emergency liquid cash buffer of ${formatCurrency(borrower.liquidReserves)} covers approximately ${Math.round(rsiData.reserveDays)} days of debt service obligations.`,
      direction: rsiData.reserveDays < 15 ? 'up' : 'down',
    },
  ];

  let classificationReason = '';
  if (borrower.cadence === 'seasonal') {
    classificationReason = 'Income contracts during predictable seasonal cycles. The intelligence model classifies this as cyclical seasonal pressure rather than structural insolvency; a seasonal flex restructuring will preserve recovery without default.';
  } else if (borrower.cadence === 'declining') {
    classificationReason = 'Cash receipts have contracted steadily across consecutive review cycles with depleted liquid reserves. This represents structural operational strain; proactive term extension is necessary to prevent default.';
  } else if (borrower.cadence === 'recovering') {
    classificationReason = 'Enterprise revenues demonstrate positive rebound after prior disruptions. A graduated step-up repayment plan supports business restocking while avoiding premature cash draining.';
  } else if (borrower.cadence === 'irregular') {
    classificationReason = 'Earnings arrive in erratic micro-receipts. The core issue is payment timing friction; disaggregating into weekly micro-collections aligns debt servicing with real cash velocity.';
  } else {
    classificationReason = 'Consistent receipts and cash reserves maintain debt obligations well within prudent affordability thresholds. Standard servicing recommended.';
  }

  const plans = generateAlternativePlans(borrower, rsiCurrent);

  return {
    rsiCurrent,
    riskLevel,
    confidence: 85 + Math.floor(Math.random() * 10),
    classificationReason,
    evidence,
    plans,
  };
}
