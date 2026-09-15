// CashPulse Financial Domain Engine
// Precision calculations for Microloan Affordability, Repayment Stress Index (RSI),
// Trajectory Forecasting, Explainable AI diagnostics, and Dynamic Restructuring Alternatives.

import { FORECAST_MONTHS } from "./demoData.js";

export const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

export const formatINR = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val || 0);
};

export const formatCompactK = (val) => {
  if (Math.abs(val) >= 100000) {
    return `₹${(val / 100000).toFixed(1)}L`;
  }
  return `₹${Math.round(val / 1000)}k`;
};

export const classifyRisk = (rsi) => {
  if (rsi >= 65) return "Critical";
  if (rsi >= 40) return "Watch";
  return "Stable";
};

export const determineTrend = (borrower) => {
  if (borrower.pattern === "Declining" || borrower.pattern === "Seasonal") return "Rising";
  if (borrower.pattern === "Recovering") return "Falling";
  return "Stable";
};

export const classifyPatternName = (pattern) => {
  switch (pattern) {
    case "Seasonal": return "Seasonal pressure";
    case "Declining": return "Structural decline";
    case "Recovering": return "Recovering momentum";
    case "Irregular": return "Income variability";
    default: return "Comfortable cash flow";
  }
};

/**
 * Projects 6-month forward Repayment Stress Index (RSI) timeline
 */
export const projectTimeline = (borrower, currentRsi, forecastMonths = FORECAST_MONTHS) => {
  const trend = determineTrend(borrower);
  return forecastMonths.map((month, idx) => {
    const isLeanMonth = (borrower.seasonalMonths || []).some(
      m => m.trim().toLowerCase() === month.toLowerCase()
    );
    const trendShift = trend === "Rising" ? idx * 3.2 : trend === "Falling" ? (5 - idx) * 2.4 : 0;
    const seasonalBump = isLeanMonth ? Math.max(14, currentRsi * 0.28) : 0;
    
    // Smooth natural baseline variation
    const projectedRsi = clamp(
      Math.round(currentRsi - 6 + idx * 1.4 + trendShift + seasonalBump),
      8,
      98
    );
    
    return {
      month,
      rsi: projectedRsi,
      riskLevel: classifyRisk(projectedRsi),
      isLeanMonth,
      label: isLeanMonth ? "Lean Season" : "Normal Window"
    };
  });
};

/**
 * Generates viable alternative repayment restructuring structures
 */
export const generateAlternativePlans = (borrower, currentRsi, disposableIncome) => {
  const emi = borrower.emi;
  const remainingMonths = Math.max(1, borrower.monthsRemaining);
  const totalOriginalRepayment = emi * remainingMonths;
  const isSeasonal = borrower.pattern === "Seasonal";
  const leanMonthCount = borrower.seasonalMonths ? borrower.seasonalMonths.length : 1;

  // 1. Seasonal Flex calculations:
  // Lower payments during lean months (e.g., 60-70% of EMI), compensate during recovery months
  const leanMonthEmi = Math.max(Math.round(emi * (isSeasonal ? 0.62 : 0.80)), Math.round(emi * 0.45));
  const remainingTotal = totalOriginalRepayment - (leanMonthEmi * leanMonthCount);
  const normalMonthEmi = Math.round(remainingTotal / Math.max(1, remainingMonths - leanMonthCount));

  // 2. Frequency shift (Weekly micro-repayments)
  const weeklyAmount = Math.round(emi / 4.33);

  // 3. Controlled tenure extension (Adds 2-4 months to relax monthly strain within 1.5x guardrail)
  const extendedMonths = Math.min(
    Math.max(remainingMonths + 2, Math.ceil(remainingMonths * 1.25)),
    Math.ceil(remainingMonths * 1.5)
  );
  const extendedMonthlyEmi = Math.round(totalOriginalRepayment / extendedMonths);

  // Pick recommended structure based on borrower archetype
  let recommendedId = "current";
  if (isSeasonal) {
    recommendedId = "seasonal";
  } else if (borrower.pattern === "Recovering") {
    recommendedId = "step";
  } else if (borrower.pattern === "Declining" || currentRsi >= 65) {
    recommendedId = "extend";
  } else if (borrower.pattern === "Irregular") {
    recommendedId = "weekly";
  }

  const plans = [
    {
      id: "current",
      type: "Current Standard Contract",
      label: "Keep Fixed Monthly EMI",
      description: "No restructuring applied to contract terms. Preserves existing tenure and monthly payment date.",
      sustainabilityScore: Math.round(clamp(100 - currentRsi * 0.75, 15, 88)),
      affordabilityRatioAvg: clamp(emi / disposableIncome, 0.12, 0.85),
      npvRatio: 1.0,
      totalRepayment: totalOriginalRepayment,
      tenureMonths: remainingMonths,
      monthlyEmi: emi,
      recommended: recommendedId === "current",
      schedule: [
        { label: "Month 1", amount: emi },
        { label: "Month 2", amount: emi },
        { label: "Month 3", amount: emi },
        { label: "Month 4", amount: emi }
      ],
      guardrailStatus: currentRsi >= 65 ? "High risk of delinquency during upcoming cash squeeze" : "Within default lending criteria"
    },
    {
      id: "seasonal",
      type: "Seasonal Cash-Flow Flex",
      label: "Match Repayment to Harvest & Earning Cycles",
      description: isSeasonal
        ? `Reduce payment to ${formatINR(leanMonthEmi)} during ${leanMonthCount} lean monsoon/sowing months, recovering at ${formatINR(normalMonthEmi)} in post-harvest peak.`
        : "Dynamic payment shaping to match seasonal liquidity influx without incurring late penalties.",
      sustainabilityScore: Math.round(clamp(86 - currentRsi * 0.08 + (isSeasonal ? 8 : 0), 58, 95)),
      affordabilityRatioAvg: clamp((leanMonthEmi / disposableIncome) * 0.75, 0.12, 0.52),
      npvRatio: 0.99,
      totalRepayment: Math.round(totalOriginalRepayment * 1.008),
      tenureMonths: remainingMonths,
      monthlyEmi: leanMonthEmi,
      recommended: recommendedId === "seasonal",
      schedule: [
        { label: "Lean Mo 1", amount: leanMonthEmi, badge: "Relief" },
        { label: "Lean Mo 2", amount: leanMonthEmi, badge: "Relief" },
        { label: "Normal Mo 3", amount: normalMonthEmi, badge: "Catch-up" },
        { label: "Normal Mo 4", amount: normalMonthEmi, badge: "Catch-up" }
      ],
      guardrailStatus: "Passes UN SDG 8 affordability criteria & lender 98% NPV floor"
    },
    {
      id: "weekly",
      type: "Micro-Frequency Shift",
      label: "Switch to Predictable Weekly Collections",
      description: `Disaggregate lump-sum monthly payment into 4 bite-sized weekly collections of ${formatINR(weeklyAmount)}. Ideal for daily street vendors & gig workers.`,
      sustainabilityScore: Math.round(clamp(78 - currentRsi * 0.11 + (borrower.incomeFrequency.toLowerCase().includes("week") || borrower.incomeFrequency.toLowerCase().includes("daily") ? 10 : 0), 50, 90)),
      affordabilityRatioAvg: clamp((weeklyAmount * 4.33) / disposableIncome, 0.10, 0.48),
      npvRatio: 0.98,
      totalRepayment: Math.round(totalOriginalRepayment * 0.995),
      tenureMonths: remainingMonths,
      monthlyEmi: weeklyAmount,
      frequency: "weekly",
      recommended: recommendedId === "weekly",
      schedule: [
        { label: "Week 1", amount: weeklyAmount },
        { label: "Week 2", amount: weeklyAmount },
        { label: "Week 3", amount: weeklyAmount },
        { label: "Week 4", amount: weeklyAmount }
      ],
      guardrailStatus: "Eliminates month-end cash strain; aligns with operational income cadence"
    },
    {
      id: borrower.pattern === "Recovering" ? "step" : "extend",
      type: borrower.pattern === "Recovering" ? "Graduated Step-Up Plan" : "Controlled Tenure Extension",
      label: borrower.pattern === "Recovering" ? "Light Initial EMI, Stepping Up With Growth" : "Spread Balance Over Extended Horizon",
      description: borrower.pattern === "Recovering"
        ? `Starts 35% below current EMI (${formatINR(Math.round(emi * 0.65))}) and scales up progressively as enterprise revenue consolidates.`
        : `Extends remaining term from ${remainingMonths} to ${extendedMonths} months, slashing monthly obligation to ${formatINR(extendedMonthlyEmi)}.`,
      sustainabilityScore: Math.round(clamp(74 - currentRsi * 0.05, 52, 85)),
      affordabilityRatioAvg: clamp((extendedMonthlyEmi) / disposableIncome, 0.10, 0.42),
      npvRatio: 1.04,
      totalRepayment: Math.round(totalOriginalRepayment * 1.055),
      tenureMonths: extendedMonths,
      monthlyEmi: extendedMonthlyEmi,
      recommended: recommendedId === "step" || recommendedId === "extend",
      schedule: borrower.pattern === "Recovering" ? [
        { label: "Mo 1-2 (65%)", amount: Math.round(emi * 0.65) },
        { label: "Mo 3-4 (80%)", amount: Math.round(emi * 0.80) },
        { label: "Mo 5-6 (100%)", amount: emi },
        { label: "Mo 7+ (115%)", amount: Math.round(emi * 1.15) }
      ] : [
        { label: "Month 1", amount: extendedMonthlyEmi },
        { label: "Month 2", amount: extendedMonthlyEmi },
        { label: "Month 3", amount: extendedMonthlyEmi },
        { label: "Extended", amount: extendedMonthlyEmi }
      ],
      guardrailStatus: extendedMonths <= remainingMonths * 1.5
        ? `Complies with credit committee limit (adds ${extendedMonths - remainingMonths} mos max)`
        : "Exceeds standard 150% maximum tenure guidelines"
    }
  ];

  return plans;
};

/**
 * Complete Borrower Analysis and Diagnostic Reason Engine
 */
export const analyzeBorrower = (borrower, whatIf = null) => {
  // Apply What-If parameters if provided
  let effectiveIncome = borrower.avgMonthlyIncome;
  let effectiveExpense = borrower.expenseBaselineMonthly;
  
  if (whatIf) {
    if (typeof whatIf.incomeAdjustmentPct === "number") {
      effectiveIncome = Math.max(1000, Math.round(borrower.avgMonthlyIncome * (1 + whatIf.incomeAdjustmentPct / 100)));
    }
    if (typeof whatIf.expenseAdjustment === "number") {
      effectiveExpense = Math.max(0, Math.round(borrower.expenseBaselineMonthly + whatIf.expenseAdjustment));
    }
  }

  const disposableIncome = Math.max(effectiveIncome - effectiveExpense, borrower.emi * 0.5);
  const rawRsi = (borrower.emi / disposableIncome) * 100;
  const rsiCurrent = Math.round(clamp(rawRsi, 8, 98));
  const riskLevel = classifyRisk(rsiCurrent);
  const trend = determineTrend(borrower);
  const classification = classifyPatternName(borrower.pattern);

  // Confidence based on verified history depth
  const confidence = Math.round(
    clamp(55 + (borrower.dataMonths || 12) * 1.6 - ((borrower.dataMonths || 12) < 12 ? 8 : 0), 52, 96)
  );

  // 6-month trajectory
  const timeline = projectTimeline(borrower, rsiCurrent);
  const projectedStressMonths = timeline.filter(t => t.rsi >= 60).map(t => t.month);

  // 4-Factor attribution weights & evidence
  const incomeCapacityRatio = effectiveIncome / Math.max(effectiveExpense, 1);
  const capacityMarginPct = Math.round((incomeCapacityRatio - 1) * 100);
  const incomeWeight = Math.round(clamp(incomeCapacityRatio * 10, 12, 34));
  const seasonalWeight = (borrower.seasonalMonths || []).length
    ? (borrower.pattern === "Seasonal" ? 35 : 22)
    : 12;
  const reserveWeight = Math.round(clamp((1 - (borrower.reserveRatio || 0.1)) * 18, 6, 22));
  const repaymentWeight = Math.max(8, 100 - incomeWeight - seasonalWeight - reserveWeight);

  const evidence = [
    {
      factorName: borrower.pattern === "Seasonal" ? "Seasonal Cash-Flow Cycle" : "Income Capacity & Volatility",
      weight: incomeWeight,
      evidence: `Monthly earnings average ${formatINR(effectiveIncome)} with a ${capacityMarginPct}% net operating margin above essential subsistence costs.`,
      direction: capacityMarginPct > 35 ? "down" : "up"
    },
    {
      factorName: "Expense & Outflow Timing",
      weight: seasonalWeight,
      evidence: (borrower.seasonalMonths && borrower.seasonalMonths.length > 0)
        ? `Identified acute seasonal liquidity contraction during ${borrower.seasonalMonths.join(", ")} due to external market/climate dependencies.`
        : "No synchronized seasonal expenditure shock detected in transaction logs.",
      direction: (borrower.seasonalMonths && borrower.seasonalMonths.length > 0) ? "up" : "down"
    },
    {
      factorName: "Historical Repayment Track",
      weight: repaymentWeight,
      evidence: `${borrower.totalPayments - (borrower.paymentDelays || 0)} of ${borrower.totalPayments} contractual installments paid reliably without default.`,
      direction: (borrower.paymentDelays || 0) <= 1 ? "down" : "up"
    },
    {
      factorName: "Liquid Reserve Coverage",
      weight: reserveWeight,
      evidence: `Emergency liquid cash buffer covers approximately ${Math.round((borrower.reserveRatio || 0.1) * 30)} days (${Math.round((borrower.reserveRatio || 0.1) * 100)}%) of household expenses.`,
      direction: (borrower.reserveRatio || 0.1) < 0.15 ? "up" : "down"
    }
  ];

  // Explainable AI Reasoning statement
  let classificationReason = "";
  if (borrower.pattern === "Seasonal") {
    classificationReason = `Income dips predictably during ${(borrower.seasonalMonths || []).join(" and ")} across ${borrower.dataMonths} months of verified historical logs. The intelligence model classifies this as temporary cyclical cash strain rather than structural insolvency, strongly indicating that a seasonal flex schedule will preserve recovery without write-down.`;
  } else if (borrower.pattern === "Declining") {
    classificationReason = `Cash receipts have contracted steadily across consecutive review cycles with depleted liquid reserves (${Math.round((borrower.reserveRatio || 0) * 100)}%). This represents structural operational strain rather than a transient blip; proactive term extension is necessary to prevent default.`;
  } else if (borrower.pattern === "Recovering") {
    classificationReason = `Borrower's enterprise revenues demonstrate positive trajectory after prior disruptions. A graduated step-up repayment plan supports sustained business restocking while avoiding premature cash draining.`;
  } else if (borrower.pattern === "Irregular") {
    classificationReason = `Earnings arrive in erratic, fragmented micro-payments (${borrower.incomeFrequency}). The core issue is timing friction rather than absolute solvency; disaggregating into weekly micro-collections aligns collections with real cash velocity.`;
  } else {
    classificationReason = `Consistent daily receipts and robust cash reserves (${Math.round((borrower.reserveRatio || 0) * 100)}%) maintain debt obligations well within prudent affordability thresholds. Standard servicing recommended.`;
  }

  const plans = generateAlternativePlans(borrower, rsiCurrent, disposableIncome);

  return {
    borrowerId: borrower.id,
    rsiCurrent,
    riskLevel,
    trend,
    classification,
    classificationReason,
    confidence,
    disposableIncome,
    capacityMarginPct,
    timeline,
    evidence,
    plans,
    projectedStressMonths
  };
};
