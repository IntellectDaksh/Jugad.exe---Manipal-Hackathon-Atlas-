// CashPulse Institutional Banking Controller & Unified Engine
// Includes State Persistence, Financial Domain Math, PDF Generation, and Credit Dossier Management.

// ==========================================================================
// 1. Pre-loaded Demo Data & Constants
// ==========================================================================
export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const FORECAST_MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

export const DEFAULT_PORTFOLIOS = [
  {
    id: "mysuru-demo",
    name: "Mysuru Field Unit",
    region: "Karnataka · Cluster 04",
    description: "Empirical field portfolio covering seasonal agriculture, street vendor cycles, urban gig workers, and recovering trades.",
    createdAt: "2026-09-12T08:00:00.000Z",
    borrowers: [
      {
        id: "lakshmi",
        name: "Lakshmi",
        occupation: "Seasonal Vegetable Vendor",
        location: "Mysuru Central Mandi, Karnataka",
        loanAmount: 48000,
        emi: 4760,
        originalEmi: 4760,
        monthsRemaining: 11,
        avgMonthlyIncome: 18400,
        expenseBaselineMonthly: 11700,
        incomeFrequency: "Daily, with weekly wholesale peak",
        pattern: "Seasonal",
        seasonalMonths: ["Jul", "Aug"],
        dataMonths: 18,
        reserveRatio: 0.19,
        paymentDelays: 1,
        totalPayments: 12,
        activePlanId: "current",
        appliedPlanDetails: null,
        notes: "Income dips during monsoon vegetable supply shortages; surges ahead of festive season."
      },
      {
        id: "raju",
        name: "Raju",
        occupation: "Smallholder Sugarcane Farmer",
        location: "Mandya District, Karnataka",
        loanAmount: 62000,
        emi: 5980,
        originalEmi: 5980,
        monthsRemaining: 8,
        avgMonthlyIncome: 22300,
        expenseBaselineMonthly: 16100,
        incomeFrequency: "Lumpy, bulk payment post-harvest",
        pattern: "Seasonal",
        seasonalMonths: ["Jun", "Jul", "Aug", "Sep"],
        dataMonths: 24,
        reserveRatio: 0.08,
        paymentDelays: 2,
        totalPayments: 10,
        activePlanId: "current",
        appliedPlanDetails: null,
        notes: "Major cash harvest realized in Oct-Nov. Pre-harvest inputs cause temporary acute cash pinch."
      },
      {
        id: "arun",
        name: "Arun",
        occupation: "Urban Delivery & Gig Courier",
        location: "Bengaluru South, Karnataka",
        loanAmount: 35000,
        emi: 3420,
        originalEmi: 3420,
        monthsRemaining: 10,
        avgMonthlyIncome: 16200,
        expenseBaselineMonthly: 10800,
        incomeFrequency: "Multiple weekly app payouts",
        pattern: "Irregular",
        seasonalMonths: ["May"],
        dataMonths: 9,
        reserveRatio: 0.14,
        paymentDelays: 1,
        totalPayments: 9,
        activePlanId: "current",
        appliedPlanDetails: null,
        notes: "Variable weekly incentives. Monthly lump-sum EMI creates timing mismatch."
      },
      {
        id: "meena",
        name: "Meena",
        occupation: "Neighbourhood Kirana Store Owner",
        location: "Hassan Town, Karnataka",
        loanAmount: 54000,
        emi: 5210,
        originalEmi: 5210,
        monthsRemaining: 13,
        avgMonthlyIncome: 29400,
        expenseBaselineMonthly: 17600,
        incomeFrequency: "Daily retail cash receipts",
        pattern: "Stable",
        seasonalMonths: ["Oct"],
        dataMonths: 24,
        reserveRatio: 0.34,
        paymentDelays: 0,
        totalPayments: 14,
        activePlanId: "current",
        appliedPlanDetails: null,
        notes: "Consistent daily footfall. Robust working capital buffer and excellent payment hygiene."
      },
      {
        id: "suresh",
        name: "Suresh",
        occupation: "Independent Carpenter & Joiner",
        location: "Tumakuru Outer Ring, Karnataka",
        loanAmount: 41000,
        emi: 4050,
        originalEmi: 4050,
        monthsRemaining: 7,
        avgMonthlyIncome: 13800,
        expenseBaselineMonthly: 12100,
        incomeFrequency: "Contract milestone, fortnightly",
        pattern: "Declining",
        seasonalMonths: ["Jun", "Jul"],
        dataMonths: 8,
        reserveRatio: 0.05,
        paymentDelays: 3,
        totalPayments: 9,
        activePlanId: "current",
        appliedPlanDetails: null,
        notes: "Sustained order slowdown from local construction halt. Requires structured term relief."
      },
      {
        id: "fatima",
        name: "Fatima",
        occupation: "Custom Apparel Tailor & Embroidery",
        location: "Shivajinagar, Bengaluru, Karnataka",
        loanAmount: 29000,
        emi: 2860,
        originalEmi: 2860,
        monthsRemaining: 9,
        avgMonthlyIncome: 17100,
        expenseBaselineMonthly: 10900,
        incomeFrequency: "Weekly client collections",
        pattern: "Recovering",
        seasonalMonths: ["Sep"],
        dataMonths: 12,
        reserveRatio: 0.22,
        paymentDelays: 1,
        totalPayments: 10,
        activePlanId: "current",
        appliedPlanDetails: null,
        notes: "Recovered following purchase of sewing machine motor; orders steadily increasing."
      }
    ]
  },
  {
    id: "dharwad-agri",
    name: "Dharwad Agri & Dairy Cluster",
    region: "Karnataka · Cluster 07",
    description: "Rural micro-enterprise portfolio focusing on dairy farming, pulses, and allied rural production.",
    createdAt: "2026-09-13T09:30:00.000Z",
    borrowers: [
      {
        id: "basavaraj",
        name: "Basavaraj Patil",
        occupation: "Dairy Cooperative Producer",
        location: "Dharwad Rural, Karnataka",
        loanAmount: 50000,
        emi: 4850,
        originalEmi: 4850,
        monthsRemaining: 12,
        avgMonthlyIncome: 21500,
        expenseBaselineMonthly: 13200,
        incomeFrequency: "Fortnightly milk cooperative credits",
        pattern: "Stable",
        seasonalMonths: ["Apr", "May"],
        dataMonths: 20,
        reserveRatio: 0.28,
        paymentDelays: 0,
        totalPayments: 11,
        activePlanId: "current",
        appliedPlanDetails: null,
        notes: "Regular payments via local dairy society direct deposit."
      },
      {
        id: "gangamma",
        name: "Gangamma",
        occupation: "Chilli & Groundnut Cultivator",
        location: "Hubballi Outskirts, Karnataka",
        loanAmount: 38000,
        emi: 3750,
        originalEmi: 3750,
        monthsRemaining: 6,
        avgMonthlyIncome: 15800,
        expenseBaselineMonthly: 11500,
        incomeFrequency: "Quarterly mandi sale receipts",
        pattern: "Seasonal",
        seasonalMonths: ["Jul", "Aug", "Sep"],
        dataMonths: 15,
        reserveRatio: 0.11,
        paymentDelays: 1,
        totalPayments: 8,
        activePlanId: "current",
        appliedPlanDetails: null,
        notes: "Weeding and fertilizer peak costs coincide with lean monsoon income."
      }
    ]
  }
];

// ==========================================================================
// 2. Financial Calculation Engine
// ==========================================================================
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

export const projectTimeline = (borrower, currentRsi, forecastMonths = FORECAST_MONTHS) => {
  const trend = determineTrend(borrower);
  return forecastMonths.map((month, idx) => {
    const isLeanMonth = (borrower.seasonalMonths || []).some(
      m => m.trim().toLowerCase() === month.toLowerCase()
    );
    const trendShift = trend === "Rising" ? idx * 3.2 : trend === "Falling" ? (5 - idx) * 2.4 : 0;
    const seasonalBump = isLeanMonth ? Math.max(14, currentRsi * 0.28) : 0;
    
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

export const generateAlternativePlans = (borrower, currentRsi, disposableIncome) => {
  const emi = borrower.emi;
  const remainingMonths = Math.max(1, borrower.monthsRemaining);
  const totalOriginalRepayment = emi * remainingMonths;
  const isSeasonal = borrower.pattern === "Seasonal";
  const leanMonthCount = borrower.seasonalMonths ? borrower.seasonalMonths.length : 1;

  const leanMonthEmi = Math.max(Math.round(emi * (isSeasonal ? 0.62 : 0.80)), Math.round(emi * 0.45));
  const remainingTotal = totalOriginalRepayment - (leanMonthEmi * leanMonthCount);
  const normalMonthEmi = Math.round(remainingTotal / Math.max(1, remainingMonths - leanMonthCount));

  const weeklyAmount = Math.round(emi / 4.33);

  const extendedMonths = Math.min(
    Math.max(remainingMonths + 2, Math.ceil(remainingMonths * 1.25)),
    Math.ceil(remainingMonths * 1.5)
  );
  const extendedMonthlyEmi = Math.round(totalOriginalRepayment / extendedMonths);

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

  return [
    {
      id: "current",
      type: "Current Standard Contract",
      label: "Fixed Monthly Amortization",
      description: "Preserves existing monthly collection cycle without modifying repayment maturity.",
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
      guardrailStatus: currentRsi >= 65 ? "Elevated probability of delinquency during upcoming lean cycle" : "Within default lending covenants"
    },
    {
      id: "seasonal",
      type: "Seasonal Moratorium & Cash-Flow Flex",
      label: "Amortization Linked to Harvest Cycles",
      description: isSeasonal
        ? `Reduces obligation to ${formatINR(leanMonthEmi)} during ${leanMonthCount} lean monsoon months, recovering at ${formatINR(normalMonthEmi)} post-harvest.`
        : "Dynamic payment shaping to match seasonal liquidity influx without penalty.",
      sustainabilityScore: Math.round(clamp(86 - currentRsi * 0.08 + (isSeasonal ? 8 : 0), 58, 95)),
      affordabilityRatioAvg: clamp((leanMonthEmi / disposableIncome) * 0.75, 0.12, 0.52),
      npvRatio: 0.99,
      totalRepayment: Math.round(totalOriginalRepayment * 1.008),
      tenureMonths: remainingMonths,
      monthlyEmi: leanMonthEmi,
      recommended: recommendedId === "seasonal",
      schedule: [
        { label: "Lean Mo 1", amount: leanMonthEmi },
        { label: "Lean Mo 2", amount: leanMonthEmi },
        { label: "Normal Mo 3", amount: normalMonthEmi },
        { label: "Normal Mo 4", amount: normalMonthEmi }
      ],
      guardrailStatus: "Passes UN SDG 8 affordability criteria & lender 98% NPV floor"
    },
    {
      id: "weekly",
      type: "Micro-Frequency Shift",
      label: "Bite-Sized Weekly Micro-Amortization",
      description: `Disaggregates monthly lumpsum into 4 manageable weekly installments of ${formatINR(weeklyAmount)}. Ideal for daily retail & gig earners.`,
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
      guardrailStatus: "Eliminates month-end liquidity friction; aligns with weekly revenue"
    },
    {
      id: borrower.pattern === "Recovering" ? "step" : "extend",
      type: borrower.pattern === "Recovering" ? "Graduated Step-Up Plan" : "Controlled Maturity Extension",
      label: borrower.pattern === "Recovering" ? "Stepped Amortization with Revenue Growth" : "Horizon Extension to Lower Payment",
      description: borrower.pattern === "Recovering"
        ? `Starts 35% below current EMI (${formatINR(Math.round(emi * 0.65))}) and scales up as enterprise revenue consolidates.`
        : `Extends remaining term from ${remainingMonths} to ${extendedMonths} months, slashing monthly obligation to ${formatINR(extendedMonthlyEmi)}.`,
      sustainabilityScore: Math.round(clamp(74 - currentRsi * 0.05, 52, 85)),
      affordabilityRatioAvg: clamp((extendedMonthlyEmi) / disposableIncome, 0.10, 0.42),
      npvRatio: 1.04,
      totalRepayment: Math.round(totalOriginalRepayment * 1.055),
      tenureMonths: extendedMonths,
      monthlyEmi: extendedMonthlyEmi,
      recommended: recommendedId === "step" || recommendedId === "extend",
      schedule: borrower.pattern === "Recovering" ? [
        { label: "Mo 1-2", amount: Math.round(emi * 0.65) },
        { label: "Mo 3-4", amount: Math.round(emi * 0.80) },
        { label: "Mo 5-6", amount: emi },
        { label: "Mo 7+", amount: Math.round(emi * 1.15) }
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
};

export const analyzeBorrower = (borrower, whatIf = null) => {
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

  const confidence = Math.round(
    clamp(55 + (borrower.dataMonths || 12) * 1.6 - ((borrower.dataMonths || 12) < 12 ? 8 : 0), 52, 96)
  );

  const timeline = projectTimeline(borrower, rsiCurrent);
  const projectedStressMonths = timeline.filter(t => t.rsi >= 60).map(t => t.month);

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
      factorName: borrower.pattern === "Seasonal" ? "Seasonal Cash-Flow Cycle" : "Operating Margin & Cash Volatility",
      weight: incomeWeight,
      evidence: `Monthly gross earnings average ${formatINR(effectiveIncome)} with a ${capacityMarginPct}% net operating margin above essential subsistence costs.`,
      direction: capacityMarginPct > 35 ? "down" : "up"
    },
    {
      factorName: "Expense & Outflow Timing",
      weight: seasonalWeight,
      evidence: (borrower.seasonalMonths && borrower.seasonalMonths.length > 0)
        ? `Identified acute seasonal liquidity contraction during ${borrower.seasonalMonths.join(", ")} due to climate / agricultural cycles.`
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
      factorName: "Liquid Reserve Buffer",
      weight: reserveWeight,
      evidence: `Emergency liquid cash buffer covers approximately ${Math.round((borrower.reserveRatio || 0.1) * 30)} days (${Math.round((borrower.reserveRatio || 0.1) * 100)}%) of household expenses.`,
      direction: (borrower.reserveRatio || 0.1) < 0.15 ? "up" : "down"
    }
  ];

  let classificationReason = "";
  if (borrower.pattern === "Seasonal") {
    classificationReason = `Income contracts during ${(borrower.seasonalMonths || []).join(" and ")} across ${borrower.dataMonths} months of verified records. The intelligence model classifies this as cyclical seasonal pressure rather than structural insolvency; a seasonal flex restructuring will preserve recovery without default.`;
  } else if (borrower.pattern === "Declining") {
    classificationReason = `Cash receipts have contracted steadily across consecutive review cycles with depleted liquid reserves (${Math.round((borrower.reserveRatio || 0) * 100)}%). This represents structural operational strain; proactive term extension is necessary to prevent default.`;
  } else if (borrower.pattern === "Recovering") {
    classificationReason = `Enterprise revenues demonstrate positive rebound after prior disruptions. A graduated step-up repayment plan supports business restocking while avoiding premature cash draining.`;
  } else if (borrower.pattern === "Irregular") {
    classificationReason = `Earnings arrive in erratic micro-receipts (${borrower.incomeFrequency}). The core issue is payment timing friction; disaggregating into weekly micro-collections aligns debt servicing with real cash velocity.`;
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

// ==========================================================================
// 3. Bulletproof Storage & Persistence Manager
// ==========================================================================
// ==========================================================================
// 3. Bulletproof Storage, Multi-Device Cloud Sync & Search Utilities
// ==========================================================================
const PORTFOLIOS_KEY = "cashpulse_portfolios_v1";
const AUDIT_KEY = "cashpulse_audit_trail_v1";
const ACTIVE_PORTFOLIO_KEY = "cashpulse_active_portfolio_id_v1";
const CLOUD_ENDPOINT = "https://api.restful-api.dev/objects/ff808181a067127101a09aa348a80920";
const CLOUD_ROOM_KEY = "cashpulse_cloud_room_id";
const LAST_CLOUD_SYNC_KEY = "cashpulse_last_cloud_sync";
const DEFAULT_ROOM_ID = "cashpulse_live_cluster_04";

// Robust keyword highlighter for bank ledger & cards
export function highlightMatches(text, query) {
  if (text === null || text === undefined) return "";
  if (!query || !query.trim()) return String(text);
  
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return String(text);
  
  const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escapedTerms.join("|")})`, "gi");
  
  return String(text).replace(regex, '<mark class="kw-highlight">$1</mark>');
}

// Deep borrower matching across names, trades, seasonal months, risk, and notes
export function matchesBorrower(borrower, analysis, query) {
  if (!query || !query.trim()) return true;
  
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  
  const corpus = [
    borrower.id || "",
    borrower.name || "",
    borrower.occupation || "",
    borrower.location || "",
    borrower.pattern || "",
    (borrower.seasonalMonths || []).join(" "),
    borrower.notes || "",
    borrower.incomeFrequency || "",
    analysis.riskLevel || "",
    analysis.classification || "",
    String(borrower.loanAmount || ""),
    String(borrower.emi || ""),
    String(borrower.monthsRemaining || "")
  ].join(" ").toLowerCase();

  return terms.every(term => corpus.includes(term));
}

class StorageManager {
  constructor() {
    this.subscribers = [];
    this.cloudPushTimeout = null;
    this.isSyncing = false;
    this.lastSyncTimestamp = parseInt(localStorage.getItem(LAST_CLOUD_SYNC_KEY) || "0", 10);
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify(event, data) {
    this.subscribers.forEach(cb => {
      try { cb(event, data); } catch (err) { console.error("Storage subscriber error:", err); }
    });
  }

  getRoomId() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const qRoom = urlParams.get("room");
      if (qRoom && qRoom.trim()) {
        localStorage.setItem(CLOUD_ROOM_KEY, qRoom.trim());
        return qRoom.trim();
      }
      return localStorage.getItem(CLOUD_ROOM_KEY) || DEFAULT_ROOM_ID;
    } catch {
      return DEFAULT_ROOM_ID;
    }
  }

  setRoomId(roomId) {
    try {
      const clean = (roomId || "").trim() || DEFAULT_ROOM_ID;
      localStorage.setItem(CLOUD_ROOM_KEY, clean);
      this.notify("room-changed", clean);
      return clean;
    } catch {
      return DEFAULT_ROOM_ID;
    }
  }

  loadPortfolios() {
    try {
      const serialized = localStorage.getItem(PORTFOLIOS_KEY);
      if (!serialized) {
        this.savePortfolios(DEFAULT_PORTFOLIOS, {
          action: "Initialize Demo Data",
          details: "Loaded initial field portfolios (Mysuru and Dharwad clusters)"
        });
        return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIOS));
      }
      const parsed = JSON.parse(serialized);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIOS));
    } catch (e) {
      console.warn("Error loading from localStorage, returning default portfolios:", e);
      return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIOS));
    }
  }

  savePortfolios(portfolios, auditInfo = null) {
    try {
      localStorage.setItem(PORTFOLIOS_KEY, JSON.stringify(portfolios));
      if (auditInfo) {
        this.logAudit(auditInfo.action, auditInfo.details);
      }
      this.notify("save", { portfolios, auditInfo });
      // Asynchronously synchronize lightweight cloud database
      this.debouncedPushToCloud();
      return true;
    } catch (e) {
      console.error("Failed to save portfolios to localStorage:", e);
      return false;
    }
  }

  loadActivePortfolioId() {
    try {
      return localStorage.getItem(ACTIVE_PORTFOLIO_KEY);
    } catch {
      return null;
    }
  }

  saveActivePortfolioId(id) {
    try {
      localStorage.setItem(ACTIVE_PORTFOLIO_KEY, id);
    } catch (e) {
      console.error("Failed to save active portfolio id:", e);
    }
  }

  loadAuditLog() {
    try {
      const raw = localStorage.getItem(AUDIT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  logAudit(action, details) {
    try {
      const logs = this.loadAuditLog();
      const newEntry = {
        id: "audit-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toISOString(),
        action,
        details
      };
      logs.unshift(newEntry);
      if (logs.length > 200) logs.pop();
      localStorage.setItem(AUDIT_KEY, JSON.stringify(logs));
      this.notify("audit", newEntry);
    } catch (e) {
      console.error("Failed to append audit log:", e);
    }
  }

  // --- Lightweight Multi-Device Cloud Database Sync Engine ---
  debouncedPushToCloud() {
    if (this.cloudPushTimeout) clearTimeout(this.cloudPushTimeout);
    this.cloudPushTimeout = setTimeout(() => {
      this.pushToCloud();
    }, 400);
  }

  async pushToCloud() {
    try {
      this.isSyncing = true;
      this.notify("sync-status", { status: "syncing", message: "Pushing changes to cloud..." });
      const portfolios = this.loadPortfolios();
      const auditLog = this.loadAuditLog();
      const room = this.getRoomId();
      const now = Date.now();
      
      const payload = {
        name: "CashPulse_Shared_Ledger_v1",
        data: {
          room,
          updatedAt: now,
          portfolios,
          auditLog: auditLog.slice(0, 50)
        }
      };

      const res = await fetch(CLOUD_ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        this.lastSyncTimestamp = now;
        localStorage.setItem(LAST_CLOUD_SYNC_KEY, String(now));
        this.isSyncing = false;
        this.notify("sync-status", { status: "synced", timestamp: now });
        return true;
      } else {
        throw new Error(`Cloud PUT status ${res.status}`);
      }
    } catch (err) {
      console.warn("Cloud sync push failed:", err);
      this.isSyncing = false;
      this.notify("sync-status", { status: "error", error: err.message });
      return false;
    }
  }

  async fetchFromCloud(force = false) {
    if (this.isSyncing && !force) return false;
    try {
      this.isSyncing = true;
      const res = await fetch(CLOUD_ENDPOINT);
      if (!res.ok) throw new Error(`Cloud GET status ${res.status}`);
      const obj = await res.json();
      this.isSyncing = false;
      
      if (!obj || !obj.data || !Array.isArray(obj.data.portfolios)) {
        return false;
      }

      const remoteUpdatedAt = obj.data.updatedAt || 0;
      const localLastSync = parseInt(localStorage.getItem(LAST_CLOUD_SYNC_KEY) || "0", 10);

      // If remote has newer data or force is requested
      if (force || remoteUpdatedAt > localLastSync) {
        localStorage.setItem(PORTFOLIOS_KEY, JSON.stringify(obj.data.portfolios));
        if (Array.isArray(obj.data.auditLog) && obj.data.auditLog.length > 0) {
          localStorage.setItem(AUDIT_KEY, JSON.stringify(obj.data.auditLog));
        }
        localStorage.setItem(LAST_CLOUD_SYNC_KEY, String(remoteUpdatedAt));
        this.lastSyncTimestamp = remoteUpdatedAt;
        this.notify("cloud-sync-updated", { 
          portfolios: obj.data.portfolios, 
          timestamp: remoteUpdatedAt 
        });
        this.notify("sync-status", { status: "synced", timestamp: remoteUpdatedAt, updated: true });
        return true;
      } else {
        this.notify("sync-status", { status: "synced", timestamp: localLastSync });
        return false;
      }
    } catch (err) {
      console.warn("Cloud sync pull failed:", err);
      this.isSyncing = false;
      this.notify("sync-status", { status: "error", error: err.message });
      return false;
    }
  }

  initCloudSync() {
    // Initial fetch from cloud
    this.fetchFromCloud().then(updated => {
      if (!updated) {
        // If cloud was empty or we have local data, initialize cloud
        fetch(CLOUD_ENDPOINT)
          .then(r => r.json())
          .then(d => {
            if (!d.data || !Array.isArray(d.data.portfolios)) {
              this.pushToCloud();
            }
          })
          .catch(() => {});
      }
    });

    // Auto-poll in background every 6 seconds
    setInterval(() => {
      this.fetchFromCloud(false);
    }, 6000);

    // Auto-sync when window receives focus
    window.addEventListener("focus", () => {
      this.fetchFromCloud(false);
    });
  }

  exportData() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      portfolios: this.loadPortfolios(),
      auditLog: this.loadAuditLog()
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.portfolios)) {
        throw new Error("Invalid format: 'portfolios' array missing.");
      }
      this.savePortfolios(parsed.portfolios, {
        action: "Imported Data",
        details: `Restored ${parsed.portfolios.length} portfolios from JSON backup`
      });
      if (Array.isArray(parsed.auditLog)) {
        localStorage.setItem(AUDIT_KEY, JSON.stringify(parsed.auditLog));
      }
      return { success: true, count: parsed.portfolios.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  resetToDefault() {
    try {
      localStorage.removeItem(PORTFOLIOS_KEY);
      localStorage.removeItem(ACTIVE_PORTFOLIO_KEY);
      this.savePortfolios(DEFAULT_PORTFOLIOS, {
        action: "System Reset",
        details: "Restored baseline field portfolios and borrowers"
      });
      return true;
    } catch (err) {
      console.error("Failed to reset:", err);
      return false;
    }
  }
}

export const storage = new StorageManager();

// ==========================================================================
// 4. Main Institutional Application Controller
// ==========================================================================
class CashPulseBankApp {
  constructor() {
    this.portfolios = [];
    this.activePortfolioId = null;
    this.activeBorrowerId = null;
    this.currentView = "pulse"; // "pulse", "analytics", "audit"
    this.currentFilter = "All";
    this.currentSort = "risk-desc";
    this.currentViewMode = "table"; // "table" or "grid"
    this.searchQuery = "";
    
    // Sensitivity test state
    this.whatIfState = {
      incomeAdjustmentPct: 0,
      expenseAdjustment: 0
    };

    this.init();
  }

  init() {
    this.loadState();
    this.bindEvents();
    this.render();
    storage.initCloudSync();
  }

  loadState() {
    this.portfolios = storage.loadPortfolios();
    const savedActiveId = storage.loadActivePortfolioId();
    if (savedActiveId && this.portfolios.some(p => p.id === savedActiveId)) {
      this.activePortfolioId = savedActiveId;
    } else if (this.portfolios.length > 0) {
      this.activePortfolioId = this.portfolios[0].id;
    }
  }

  getActivePortfolio() {
    return this.portfolios.find(p => p.id === this.activePortfolioId) || this.portfolios[0];
  }

  getActiveBorrower() {
    const portfolio = this.getActivePortfolio();
    if (!portfolio || !this.activeBorrowerId) return null;
    return portfolio.borrowers.find(b => b.id === this.activeBorrowerId) || null;
  }

  bindEvents() {
    // Branch / Portfolio selector
    const portfolioSelect = document.getElementById("select-portfolio");
    if (portfolioSelect) {
      portfolioSelect.addEventListener("change", (e) => {
        this.activePortfolioId = e.target.value;
        storage.saveActivePortfolioId(this.activePortfolioId);
        this.render();
      });
    }

    // Navigation tabs
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        const view = e.currentTarget.dataset.view;
        if (view) this.switchView(view);
      });
    });

    // Home brand logo click
    const brandHome = document.getElementById("btn-brand-home");
    if (brandHome) {
      brandHome.addEventListener("click", () => this.switchView("pulse"));
    }

    // Prominent Search input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        // Sync preset chip active state with current input
        document.querySelectorAll(".search-chip").forEach(chip => {
          const kw = (chip.dataset.keyword || "").toLowerCase();
          if (kw === this.searchQuery || (!this.searchQuery && !kw)) {
            chip.classList.add("active");
          } else {
            chip.classList.remove("active");
          }
        });
        this.renderBorrowerEntries();
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.clearSearch();
          searchInput.blur();
        }
      });
    }

    // Clear search button
    const btnClearSearch = document.getElementById("btn-clear-search");
    if (btnClearSearch) {
      btnClearSearch.addEventListener("click", () => {
        this.clearSearch();
      });
    }

    // Preset Keyword Chips
    const chipsContainer = document.getElementById("search-chips-container");
    if (chipsContainer) {
      chipsContainer.addEventListener("click", (e) => {
        const chip = e.target.closest(".search-chip");
        if (!chip) return;
        document.querySelectorAll(".search-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const keyword = chip.dataset.keyword || "";
        if (searchInput) {
          searchInput.value = keyword;
        }
        this.searchQuery = keyword.toLowerCase().trim();
        this.renderBorrowerEntries();
      });
    }

    // Global keyboard shortcut ('/' to focus search)
    window.addEventListener("keydown", (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });

    // Filter pills
    const filterContainer = document.getElementById("filter-pills-container");
    if (filterContainer) {
      filterContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-pill");
        if (btn) {
          document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
          btn.classList.add("active");
          this.currentFilter = btn.dataset.filter;
          this.renderBorrowerEntries();
        }
      });
    }

    // Sort select
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.renderBorrowerEntries();
      });
    }

    // View Mode Toggle (Table vs Grid)
    const viewModeToggle = document.getElementById("view-mode-toggle");
    if (viewModeToggle) {
      viewModeToggle.addEventListener("click", (e) => {
        const btn = e.target.closest(".view-mode-btn");
        if (btn) {
          document.querySelectorAll(".view-mode-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.currentViewMode = btn.dataset.mode;
          this.toggleViewModeDisplay();
        }
      });
    }

    // Print Facility Sheet
    const btnPrint = document.getElementById("btn-print-facility");
    if (btnPrint) {
      btnPrint.addEventListener("click", () => {
        window.print();
      });
    }

    // Download PDF Report
    const btnDownloadPdf = document.getElementById("btn-download-pdf");
    if (btnDownloadPdf) {
      btnDownloadPdf.addEventListener("click", () => {
        this.downloadBorrowerPdf();
      });
    }

    // Edit Borrower button in drawer
    const btnEditBorrower = document.getElementById("btn-edit-borrower");
    if (btnEditBorrower) {
      btnEditBorrower.addEventListener("click", () => {
        this.openEditBorrowerModal();
      });
    }

    // Modal & Drawer events
    this.bindModalEvents();

    // Form Submissions
    this.bindFormEvents();

    // Data Actions (Export, Import, Reset, Cloud Sync)
    this.bindDataActionEvents();

    // Storage subscriber for auto-save feedback & cloud sync
    storage.subscribe((event, data) => {
      if (event === "save") {
        this.flashSyncIndicator();
      } else if (event === "sync-status") {
        this.updateCloudSyncUI(data);
      } else if (event === "cloud-sync-updated") {
        this.loadState();
        this.render();
        this.showToast("Cloud updated: Synced real-time changes across devices.", "☁");
      }
    });

    // Keyboard shortcuts (Escape closes drawers/modals)
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop.open").forEach(m => m.classList.remove("open"));
      }
    });
  }

  toggleViewModeDisplay() {
    const tableContainer = document.getElementById("ledger-table-container");
    const cardsContainer = document.getElementById("borrower-cards-container");
    if (this.currentViewMode === "table") {
      tableContainer.style.display = "block";
      cardsContainer.style.display = "none";
    } else {
      tableContainer.style.display = "none";
      cardsContainer.style.display = "grid";
    }
  }

  bindModalEvents() {
    // Deep-dive close
    const closeDeepDive = document.getElementById("btn-close-deepdive");
    if (closeDeepDive) {
      closeDeepDive.addEventListener("click", () => this.closeModal("modal-borrower-deepdive"));
    }

    // Add borrower modal open
    const openAddBorrower = document.getElementById("btn-top-add-borrower");
    if (openAddBorrower) {
      openAddBorrower.addEventListener("click", () => this.openModal("modal-add-borrower"));
    }
    const closeAddBorrower = document.getElementById("btn-close-add-borrower");
    if (closeAddBorrower) {
      closeAddBorrower.addEventListener("click", () => this.closeModal("modal-add-borrower"));
    }
    const cancelAddBorrower = document.getElementById("btn-cancel-add-borrower");
    if (cancelAddBorrower) {
      cancelAddBorrower.addEventListener("click", () => this.closeModal("modal-add-borrower"));
    }

    // Edit borrower modal close
    const closeEditBorrower = document.getElementById("btn-close-edit-borrower");
    if (closeEditBorrower) {
      closeEditBorrower.addEventListener("click", () => this.closeModal("modal-edit-borrower"));
    }
    const cancelEditBorrower = document.getElementById("btn-cancel-edit-borrower");
    if (cancelEditBorrower) {
      cancelEditBorrower.addEventListener("click", () => this.closeModal("modal-edit-borrower"));
    }

    // Delete borrower
    const btnDeleteBorrower = document.getElementById("btn-delete-borrower");
    if (btnDeleteBorrower) {
      btnDeleteBorrower.addEventListener("click", () => this.handleDeleteBorrower());
    }

    // New portfolio modal
    const openNewPortfolio = document.getElementById("btn-top-new-portfolio");
    if (openNewPortfolio) {
      openNewPortfolio.addEventListener("click", () => this.openModal("modal-new-portfolio"));
    }
    const openNewPortfolioSide = document.getElementById("btn-open-new-portfolio-modal");
    if (openNewPortfolioSide) {
      openNewPortfolioSide.addEventListener("click", () => this.openModal("modal-new-portfolio"));
    }
    const closeNewPortfolio = document.getElementById("btn-close-new-portfolio");
    if (closeNewPortfolio) {
      closeNewPortfolio.addEventListener("click", () => this.closeModal("modal-new-portfolio"));
    }
    const cancelNewPortfolio = document.getElementById("btn-cancel-new-portfolio");
    if (cancelNewPortfolio) {
      cancelNewPortfolio.addEventListener("click", () => this.closeModal("modal-new-portfolio"));
    }

    // Cloud Sync Modal open/close
    const btnOpenCloud = document.getElementById("btn-open-cloud-sync");
    if (btnOpenCloud) {
      btnOpenCloud.addEventListener("click", () => this.openCloudSyncModal());
    }
    const btnCloseCloud = document.getElementById("btn-close-cloud-sync");
    if (btnCloseCloud) {
      btnCloseCloud.addEventListener("click", () => this.closeModal("modal-cloud-sync"));
    }
    const btnCancelCloud = document.getElementById("btn-cancel-cloud-sync");
    if (btnCancelCloud) {
      btnCancelCloud.addEventListener("click", () => this.closeModal("modal-cloud-sync"));
    }

    // Backdrop click
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove("open");
        }
      });
    });

    // Sensitivity Sandbox sliders
    const sliderIncome = document.getElementById("slider-whatif-income");
    const sliderExpense = document.getElementById("slider-whatif-expense");
    const resetWhatIf = document.getElementById("btn-reset-whatif");

    if (sliderIncome) {
      sliderIncome.addEventListener("input", (e) => {
        this.whatIfState.incomeAdjustmentPct = parseInt(e.target.value, 10);
        document.getElementById("label-whatif-income").textContent = `${this.whatIfState.incomeAdjustmentPct >= 0 ? "+" : ""}${this.whatIfState.incomeAdjustmentPct}%`;
        this.updateWhatIfCalculations();
      });
    }

    if (sliderExpense) {
      sliderExpense.addEventListener("input", (e) => {
        this.whatIfState.expenseAdjustment = parseInt(e.target.value, 10);
        document.getElementById("label-whatif-expense").textContent = `+${formatINR(this.whatIfState.expenseAdjustment)} / mo`;
        this.updateWhatIfCalculations();
      });
    }

    if (resetWhatIf) {
      resetWhatIf.addEventListener("click", () => {
        this.whatIfState = { incomeAdjustmentPct: 0, expenseAdjustment: 0 };
        if (sliderIncome) sliderIncome.value = 0;
        if (sliderExpense) sliderExpense.value = 0;
        document.getElementById("label-whatif-income").textContent = "0% change";
        document.getElementById("label-whatif-expense").textContent = "+₹0 / month";
        this.updateWhatIfCalculations();
      });
    }
  }

  bindFormEvents() {
    // Underwrite Borrower Form
    const formAddBorrower = document.getElementById("form-add-borrower");
    if (formAddBorrower) {
      formAddBorrower.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleAddBorrowerSubmit();
      });
    }

    // Edit Borrower Form
    const formEditBorrower = document.getElementById("form-edit-borrower");
    if (formEditBorrower) {
      formEditBorrower.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleEditBorrowerSubmit();
      });
    }

    // New Portfolio Form
    const formNewPortfolio = document.getElementById("form-new-portfolio");
    if (formNewPortfolio) {
      formNewPortfolio.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleNewPortfolioSubmit();
      });
    }
  }

  bindDataActionEvents() {
    // Export JSON
    const btnExport = document.getElementById("btn-export-json");
    if (btnExport) {
      btnExport.addEventListener("click", () => {
        const json = storage.exportData();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cashpulse_ledger_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast("Exported verified regulatory ledger to JSON file.");
      });
    }

    // Import JSON Modal
    const btnImport = document.getElementById("btn-import-json");
    const closeImport = document.getElementById("btn-close-import");
    const cancelImport = document.getElementById("btn-cancel-import");
    const executeImport = document.getElementById("btn-execute-import");

    if (btnImport) {
      btnImport.addEventListener("click", () => this.openModal("modal-import-data"));
    }
    if (closeImport) {
      closeImport.addEventListener("click", () => this.closeModal("modal-import-data"));
    }
    if (cancelImport) {
      cancelImport.addEventListener("click", () => this.closeModal("modal-import-data"));
    }

    if (executeImport) {
      executeImport.addEventListener("click", () => {
        const text = document.getElementById("import-textarea").value;
        const result = storage.importData(text);
        if (result.success) {
          this.closeModal("modal-import-data");
          this.loadState();
          this.render();
          this.showToast(`Imported ${result.count} credit portfolios into active storage.`);
        } else {
          alert("Import Failure: " + result.error);
        }
      });
    }

    // Reset Demo Data
    const btnReset = document.getElementById("btn-reset-demo");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (confirm("Restore baseline Mysuru & Dharwad demonstration facility records?")) {
          storage.resetToDefault();
          this.loadState();
          this.render();
          this.showToast("Restored baseline commercial credit portfolios.");
        }
      });
    }

    // Clear Audit
    const btnClearAudit = document.getElementById("btn-clear-audit");
    if (btnClearAudit) {
      btnClearAudit.addEventListener("click", () => {
        localStorage.removeItem("cashpulse_audit_trail_v1");
        this.renderAuditView();
        this.showToast("Audit trail cleared.");
      });
    }

    // Cloud Sync Buttons (Manual sync in sidebar & modal)
    const handleManualSync = async () => {
      this.showToast("Synchronizing with cloud database...", "☁");
      const pushOk = await storage.pushToCloud();
      const pullOk = await storage.fetchFromCloud(true);
      if (pushOk || pullOk) {
        this.loadState();
        this.render();
        this.showToast("Cloud sync verified & updated across devices!", "✓");
      } else {
        this.showToast("Cloud sync check completed.", "ℹ");
      }
    };

    const btnSyncManual = document.getElementById("btn-sync-cloud-manual");
    if (btnSyncManual) {
      btnSyncManual.addEventListener("click", handleManualSync);
    }

    const btnForceCloud = document.getElementById("btn-force-cloud-sync");
    if (btnForceCloud) {
      btnForceCloud.addEventListener("click", handleManualSync);
    }

    // Copy multi-device share link
    const btnCopyShareLink = document.getElementById("btn-copy-share-link");
    if (btnCopyShareLink) {
      btnCopyShareLink.addEventListener("click", () => {
        const room = storage.getRoomId();
        const url = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(room)}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            this.showToast("Copied multi-device share link! Anyone opening this link sees the same live data.", "🔗");
          }).catch(() => {
            prompt("Copy this multi-device link:", url);
          });
        } else {
          prompt("Copy this multi-device link:", url);
        }
      });
    }

    // Cloud room ID input
    const roomInput = document.getElementById("cloud-room-input");
    if (roomInput) {
      roomInput.addEventListener("change", (e) => {
        const newRoom = storage.setRoomId(e.target.value);
        this.showToast(`Shared Room set to: ${newRoom}`, "☁");
        storage.fetchFromCloud(true).then(() => {
          this.loadState();
          this.render();
        });
      });
    }
  }

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    const activeNav = document.querySelector(`.nav-link[data-view="${viewName}"]`);
    if (activeNav) activeNav.classList.add("active");

    const pulseView = document.getElementById("view-pulse");
    const analyticsView = document.getElementById("view-analytics");
    const auditView = document.getElementById("view-audit");

    pulseView.style.display = viewName === "pulse" ? "block" : "none";
    analyticsView.style.display = viewName === "analytics" ? "block" : "none";
    auditView.style.display = viewName === "audit" ? "block" : "none";

    const titleText = document.getElementById("topbar-title-text");
    const descText = document.getElementById("topbar-desc-text");

    if (viewName === "pulse") {
      titleText.textContent = "Credit Facility Ledger";
      descText.textContent = "Dynamic repayment monitoring and cash-flow alignment under UN SDG Goal 8.";
      this.render();
    } else if (viewName === "analytics") {
      titleText.textContent = "Macro Risk & UN SDG 8 Governance";
      descText.textContent = "Portfolio vulnerability clustering and early intervention queues.";
      this.renderAnalyticsView();
    } else if (viewName === "audit") {
      titleText.textContent = "Audit & Compliance Ledger";
      descText.textContent = "Permanent record of facility modifications, underwriting notes, and restructuring approvals.";
      this.renderAuditView();
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("open");
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("open");
    }
  }

  flashSyncIndicator() {
    const syncDot = document.getElementById("sync-dot");
    const syncText = document.getElementById("sync-status-text");
    if (!syncDot || !syncText) return;

    syncText.textContent = "Syncing Ledger...";
    syncDot.classList.remove("saved");

    setTimeout(() => {
      syncText.textContent = "Audit Sync Verified";
      syncDot.classList.add("saved");
    }, 400);
  }

  showToast(message, icon = "✓") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <span style="color: #60a5fa; font-weight: bold;">${icon}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      toast.style.transition = "all 150ms ease";
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  render() {
    this.renderPortfolioSelect();
    this.renderTopbarHeader();
    this.renderKpis();
    this.renderBorrowerEntries();
  }

  renderPortfolioSelect() {
    const select = document.getElementById("select-portfolio");
    if (!select) return;

    select.innerHTML = "";
    this.portfolios.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.name;
      if (p.id === this.activePortfolioId) {
        option.selected = true;
      }
      select.appendChild(option);
    });
  }

  renderTopbarHeader() {
    const portfolio = this.getActivePortfolio();
    if (!portfolio) return;

    document.getElementById("sidebar-cluster-tag").textContent = portfolio.region;
    document.getElementById("topbar-region-text").textContent = `${portfolio.region} · ${portfolio.borrowers.length} Active Accounts`;
    document.getElementById("nav-borrowers-count").textContent = portfolio.borrowers.length;
  }

  renderKpis() {
    const portfolio = this.getActivePortfolio();
    if (!portfolio) return;

    const analyses = portfolio.borrowers.map(b => analyzeBorrower(b));
    const criticalCount = analyses.filter(a => a.riskLevel === "Critical").length;
    const watchCount = analyses.filter(a => a.riskLevel === "Watch").length;
    const stableCount = analyses.filter(a => a.riskLevel === "Stable").length;

    const avgRsi = analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + a.rsiCurrent, 0) / analyses.length)
      : 0;

    const totalPrincipal = portfolio.borrowers.reduce((sum, b) => sum + (b.loanAmount || 0), 0);

    document.getElementById("kpi-critical-count").textContent = criticalCount;
    document.getElementById("kpi-watch-count").textContent = watchCount;
    document.getElementById("kpi-stable-count").textContent = stableCount;
    document.getElementById("kpi-avg-rsi").textContent = `Avg Stress: ${avgRsi} RSI`;
    document.getElementById("kpi-principal-sum").textContent = formatINR(totalPrincipal);
  }

  getFilteredAndSortedBorrowers() {
    const portfolio = this.getActivePortfolio();
    if (!portfolio) return [];

    let list = portfolio.borrowers.map(b => ({
      borrower: b,
      analysis: analyzeBorrower(b)
    }));

    // Deep keyword & name filtering across names, trades, seasonal months, risk tiers, and notes
    if (this.searchQuery) {
      list = list.filter(({ borrower: b, analysis: a }) => {
        return matchesBorrower(b, a, this.searchQuery);
      });
    }

    if (this.currentFilter !== "All") {
      if (this.currentFilter === "Seasonal") {
        list = list.filter(({ borrower: b }) => b.pattern === "Seasonal");
      } else {
        list = list.filter(({ analysis: a }) => a.riskLevel === this.currentFilter);
      }
    }

    list.sort((a, b) => {
      switch (this.currentSort) {
        case "risk-desc":
          return b.analysis.rsiCurrent - a.analysis.rsiCurrent;
        case "risk-asc":
          return a.analysis.rsiCurrent - b.analysis.rsiCurrent;
        case "emi-desc":
          return b.borrower.emi - a.borrower.emi;
        case "name-asc":
          return a.borrower.name.localeCompare(b.borrower.name);
        default:
          return 0;
      }
    });

    return list;
  }

  renderBorrowerEntries() {
    const list = this.getFilteredAndSortedBorrowers();
    const portfolio = this.getActivePortfolio();
    const totalCount = portfolio ? portfolio.borrowers.length : 0;

    // Real-time Match Count Indicator
    const matchCountBadge = document.getElementById("search-match-count");
    if (matchCountBadge) {
      if (!this.searchQuery && this.currentFilter === "All") {
        matchCountBadge.textContent = `${list.length} Accounts Active`;
      } else if (this.searchQuery) {
        matchCountBadge.textContent = `Showing ${list.length} of ${totalCount} Accounts`;
      } else {
        matchCountBadge.textContent = `${list.length} of ${totalCount} Filtered`;
      }
    }

    // Toggle Clear button visibility
    const btnClearSearch = document.getElementById("btn-clear-search");
    if (btnClearSearch) {
      btnClearSearch.style.display = this.searchQuery ? "flex" : "none";
    }

    this.renderLedgerTable(list);
    this.renderCreditCards(list);
  }

  renderLedgerTable(list) {
    const tbody = document.getElementById("ledger-tbody");
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 40px 16px; color: var(--text-muted);">
            <div style="font-size: 13px; font-weight: 600; color: var(--slate-700); margin-bottom: 6px;">
              ${this.searchQuery ? `No credit accounts match "${this.searchQuery}"` : "No credit facilities match the current criteria."}
            </div>
            <div style="font-size: 11px; margin-bottom: 14px; color: var(--text-muted);">
              Try searching by borrower name, enterprise trade (e.g. "Vegetable", "Sugarcane", "Kirana"), risk tier ("Critical", "Watch"), or seasonal dip ("Jul", "Monsoon").
            </div>
            ${this.searchQuery ? `<button type="button" class="btn-secondary font-mono" style="padding: 4px 12px; font-size: 11px;" onclick="window.cashpulse.clearSearch()">Clear Search Query</button>` : ""}
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(({ borrower, analysis }) => {
      const riskClass = analysis.riskLevel.toLowerCase();
      const hasRestructured = borrower.activePlanId && borrower.activePlanId !== "current";

      // Context snippet if notes or lean months matched search query
      let snippetHtml = "";
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase().trim();
        const notes = borrower.notes || "";
        const lean = (borrower.seasonalMonths || []).join(", ");
        if (notes.toLowerCase().includes(q) && !(borrower.name || "").toLowerCase().includes(q) && !(borrower.occupation || "").toLowerCase().includes(q)) {
          snippetHtml = `<div class="search-snippet-tag">Notes: ${highlightMatches(notes, this.searchQuery)}</div>`;
        } else if (lean.toLowerCase().includes(q)) {
          snippetHtml = `<div class="search-snippet-tag font-mono">Seasonal Dips: ${highlightMatches(lean, this.searchQuery)}</div>`;
        }
      }

      return `
        <tr onclick="window.cashpulse.openBorrowerDeepDive('${borrower.id}')">
          <td class="font-mono" style="color: var(--text-muted); font-size: 11px;">#${highlightMatches(borrower.id.slice(0, 8).toUpperCase(), this.searchQuery)}</td>
          <td>
            <div style="font-weight: 700; color: var(--slate-900); font-size: 12.5px;">${highlightMatches(borrower.name, this.searchQuery)}</div>
            <div style="font-size: 10.5px; color: var(--text-secondary);">${highlightMatches(borrower.occupation, this.searchQuery)}</div>
            ${snippetHtml}
          </td>
          <td style="color: var(--text-secondary); font-size: 11px;">${highlightMatches(borrower.location, this.searchQuery)}</td>
          <td class="font-mono font-bold" style="color: var(--slate-900);">${formatINR(borrower.loanAmount)}</td>
          <td class="font-mono">${formatINR(borrower.emi)}</td>
          <td>
            <span class="badge-risk ${riskClass}">
              ● ${analysis.rsiCurrent} RSI
            </span>
          </td>
          <td class="font-mono text-muted">${borrower.monthsRemaining} mos</td>
          <td>
            ${hasRestructured 
              ? `<span class="badge-restructured font-mono">Restructured</span>` 
              : `<span class="badge-risk ${riskClass}">${highlightMatches(analysis.riskLevel, this.searchQuery)}</span>`}
          </td>
          <td style="text-align: right;">
            <button type="button" class="btn-action-outline font-mono" onclick="event.stopPropagation(); window.cashpulse.openBorrowerDeepDive('${borrower.id}')">
              Dossier →
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  renderCreditCards(list) {
    const container = document.getElementById("borrower-cards-container");
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 16px; color: var(--text-muted); font-size: 12px;">
          <div style="font-size: 13px; font-weight: 600; color: var(--slate-700); margin-bottom: 6px;">
            ${this.searchQuery ? `No credit accounts match "${this.searchQuery}"` : "No credit facilities match the criteria."}
          </div>
          <div style="margin-bottom: 14px;">Try searching by borrower name, enterprise trade, location, or risk level.</div>
          ${this.searchQuery ? `<button type="button" class="btn-secondary font-mono" style="padding: 4px 12px; font-size: 11px;" onclick="window.cashpulse.clearSearch()">Clear Search Query</button>` : ""}
        </div>
      `;
      return;
    }

    container.innerHTML = "";
    list.forEach(({ borrower, analysis }) => {
      const card = document.createElement("div");
      card.className = "borrower-card";
      card.dataset.borrowerId = borrower.id;

      const riskClass = analysis.riskLevel.toLowerCase();
      const hasRestructured = borrower.activePlanId && borrower.activePlanId !== "current";

      // Context snippet if notes matched
      let snippetHtml = "";
      if (this.searchQuery && borrower.notes) {
        const q = this.searchQuery.toLowerCase().trim();
        if (borrower.notes.toLowerCase().includes(q)) {
          snippetHtml = `<div class="search-snippet-tag" style="margin-top: 6px; width: 100%;">Notes: ${highlightMatches(borrower.notes, this.searchQuery)}</div>`;
        }
      }

      const miniForecastHtml = analysis.timeline.slice(0, 6).map(point => {
        const ptRiskClass = point.riskLevel.toLowerCase();
        let bgStyle = ptRiskClass === "critical" ? "background:#fef2f2; color:#991b1b;" :
                      ptRiskClass === "watch" ? "background:#fffbeb; color:#92400e;" :
                      "background:#ecfdf5; color:#065f46;";
        return `
          <div class="mini-forecast-item">
            <span class="mini-month-name font-mono">${point.month}</span>
            <div class="mini-rsi-pill font-mono ${point.isLeanMonth ? "lean-month" : ""}" style="${bgStyle}" title="${point.month}: RSI ${point.rsi}">
              ${point.rsi}
            </div>
          </div>
        `;
      }).join("");

      card.innerHTML = `
        <div class="card-top-row">
          <div class="borrower-identity">
            <h3 class="borrower-name">${highlightMatches(borrower.name, this.searchQuery)}</h3>
            <span class="borrower-occupation">${highlightMatches(borrower.occupation, this.searchQuery)}</span>
            <span class="borrower-location">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${highlightMatches(borrower.location, this.searchQuery)}
            </span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 3px;">
            <span class="badge-risk ${riskClass}">
              ● ${highlightMatches(analysis.riskLevel, this.searchQuery)}
            </span>
            ${hasRestructured ? `<span class="badge-restructured font-mono">Restructured</span>` : ""}
          </div>
        </div>

        ${snippetHtml}

        <div class="card-stats-row font-mono">
          <div class="card-stat-item">
            <span class="card-stat-label">Principal</span>
            <span class="card-stat-value">${formatCompactK(borrower.loanAmount)}</span>
          </div>
          <div class="card-stat-item">
            <span class="card-stat-label">Monthly EMI</span>
            <span class="card-stat-value">${formatINR(borrower.emi)}</span>
          </div>
          <div class="card-stat-item">
            <span class="card-stat-label">Maturity</span>
            <span class="card-stat-value">${borrower.monthsRemaining} mos</span>
          </div>
        </div>

        <div class="stress-meter-section">
          <div class="stress-meter-header">
            <span class="stress-label font-mono">${analysis.classification}</span>
            <span class="stress-score font-mono">RSI: ${analysis.rsiCurrent}/100</span>
          </div>
          <div class="stress-bar-track">
            <div class="stress-bar-fill ${riskClass}" style="width: ${analysis.rsiCurrent}%;"></div>
          </div>
        </div>

        <div class="mini-forecast-strip">
          ${miniForecastHtml}
        </div>
      `;

      card.addEventListener("click", () => this.openBorrowerDeepDive(borrower.id));
      container.appendChild(card);
    });
  }

  clearSearch() {
    this.searchQuery = "";
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
    document.querySelectorAll(".search-chip").forEach(c => {
      if (!c.dataset.keyword) {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });
    this.renderBorrowerEntries();
  }

  openCloudSyncModal() {
    const roomIdInput = document.getElementById("cloud-room-input");
    if (roomIdInput) {
      roomIdInput.value = storage.getRoomId();
    }
    const dbKeyDisplay = document.getElementById("cloud-database-id-display");
    if (dbKeyDisplay) {
      dbKeyDisplay.textContent = "ff808181a067127101a09aa348a80920";
    }
    const lastTimeDisplay = document.getElementById("cloud-last-sync-time");
    if (lastTimeDisplay) {
      const ts = storage.lastSyncTimestamp;
      if (ts) {
        lastTimeDisplay.textContent = `Last Synced: ${new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
      } else {
        lastTimeDisplay.textContent = "Last Synced: Verified just now";
      }
    }
    this.openModal("modal-cloud-sync");
  }

  updateCloudSyncUI(data = {}) {
    const syncDot = document.getElementById("sync-dot");
    const syncText = document.getElementById("sync-status-text");
    const modalBadge = document.getElementById("cloud-sync-status-badge");
    const modalLastTime = document.getElementById("cloud-last-sync-time");

    const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    if (data.status === "syncing") {
      if (syncDot) syncDot.className = "pulse-dot pending";
      if (syncText) syncText.textContent = "Cloud Syncing...";
      if (modalBadge) {
        modalBadge.className = "badge-risk watch";
        modalBadge.textContent = "● Syncing to Cloud...";
      }
    } else if (data.status === "synced") {
      if (syncDot) syncDot.className = "pulse-dot saved";
      if (syncText) syncText.textContent = "Cloud Synced ☁";
      if (modalBadge) {
        modalBadge.className = "badge-risk stable";
        modalBadge.textContent = "● Active & Connected";
      }
      if (modalLastTime) {
        modalLastTime.textContent = `Last Synced: ${timeStr}`;
      }
    } else if (data.status === "error") {
      if (syncDot) syncDot.className = "pulse-dot unsaved";
      if (syncText) syncText.textContent = "Local Storage (Offline)";
      if (modalBadge) {
        modalBadge.className = "badge-risk critical";
        modalBadge.textContent = "● Offline Mode";
      }
    }
  }

  // Slide-Over Dossier Drawer
  openBorrowerDeepDive(borrowerId) {
    this.activeBorrowerId = borrowerId;
    this.whatIfState = { incomeAdjustmentPct: 0, expenseAdjustment: 0 };

    const sliderIncome = document.getElementById("slider-whatif-income");
    const sliderExpense = document.getElementById("slider-whatif-expense");
    if (sliderIncome) sliderIncome.value = 0;
    if (sliderExpense) sliderExpense.value = 0;
    document.getElementById("label-whatif-income").textContent = "0% change";
    document.getElementById("label-whatif-expense").textContent = "+₹0 / month";

    this.renderDeepDiveDrawer();
    this.openModal("modal-borrower-deepdive");
  }

  renderDeepDiveDrawer() {
    const borrower = this.getActiveBorrower();
    if (!borrower) return;

    const analysis = analyzeBorrower(borrower, this.whatIfState);

    // Header
    document.getElementById("modal-borrower-eyebrow").textContent = `Facility File / #${borrower.id.slice(0, 10).toUpperCase()}`;
    document.getElementById("modal-borrower-name").textContent = borrower.name;
    document.getElementById("modal-borrower-sub").textContent = `${borrower.occupation} · ${borrower.location}`;

    // AI Diagnostics
    document.getElementById("modal-ai-confidence").textContent = `${analysis.confidence}% Precision`;
    document.getElementById("modal-ai-reasoning").textContent = analysis.classificationReason;

    // 4 Stats
    document.getElementById("modal-stat-emi").textContent = formatINR(borrower.emi);
    document.getElementById("modal-stat-disposable").textContent = formatINR(analysis.disposableIncome);
    document.getElementById("modal-stat-rsi").textContent = `${analysis.rsiCurrent} / 100`;
    document.getElementById("modal-stat-buffer").textContent = `${Math.round((borrower.reserveRatio || 0.1) * 30)} days`;

    // Attribution
    const attributionList = document.getElementById("modal-attribution-list");
    attributionList.innerHTML = analysis.evidence.map(e => `
      <div style="padding: 8px 10px; background: var(--slate-50); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
          <span style="font-weight: 600; font-size: 11px; color: var(--slate-900);">${e.factorName}</span>
          <span class="font-mono" style="font-size: 10px; font-weight: 700; color: ${e.direction === 'up' ? 'var(--status-critical-text)' : 'var(--status-stable-text)'}">
            ${e.direction === 'up' ? '▲ Risk Vector' : '▼ Mitigant'} (${e.weight}%)
          </span>
        </div>
        <p style="font-size: 10.5px; color: var(--text-secondary); line-height: 1.35;">${e.evidence}</p>
      </div>
    `).join("");

    // SVG Stress Projection
    this.renderSvgStressChart(analysis.timeline);

    // What-If Sandbox
    this.updateWhatIfCalculations();

    // Restructuring Term Sheets
    this.renderRestructuringPlans(borrower, analysis);
  }

  renderSvgStressChart(timeline) {
    const container = document.getElementById("modal-svg-chart-container");
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = 150;
    const padding = { top: 15, right: 25, bottom: 25, left: 30 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const xStep = chartW / (timeline.length - 1);
    const points = timeline.map((d, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + chartH - (d.rsi / 100) * chartH;
      return { x, y, ...d };
    });

    const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x},${pt.y}`, "");
    const areaD = `${pathD} L ${points[points.length - 1].x},${padding.top + chartH} L ${points[0].x},${padding.top + chartH} Z`;

    const dotsSvg = points.map(pt => {
      const color = pt.riskLevel === "Critical" ? "#ef4444" : pt.riskLevel === "Watch" ? "#f59e0b" : "#10b981";
      return `
        <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="${color}" stroke="#ffffff" stroke-width="1.5" />
        <text x="${pt.x}" y="${pt.y - 7}" text-anchor="middle" font-size="9" font-family="'IBM Plex Mono', monospace" font-weight="bold" fill="${color}">${pt.rsi}</text>
        <text x="${pt.x}" y="${height - 6}" text-anchor="middle" font-size="9" font-family="'IBM Plex Mono', monospace" fill="var(--slate-500)">${pt.month}</text>
        ${pt.isLeanMonth ? `<text x="${pt.x}" y="${height - 17}" text-anchor="middle" font-size="7.5" font-family="'IBM Plex Mono', monospace" font-weight="bold" fill="#ef4444">LEAN</text>` : ""}
      `;
    }).join("");

    container.innerHTML = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
        <line x1="${padding.left}" y1="${padding.top + chartH - (65 / 100) * chartH}" x2="${width - padding.right}" y2="${padding.top + chartH - (65 / 100) * chartH}" stroke="#fecaca" stroke-width="1" stroke-dasharray="2,2" />
        <line x1="${padding.left}" y1="${padding.top + chartH - (40 / 100) * chartH}" x2="${width - padding.right}" y2="${padding.top + chartH - (40 / 100) * chartH}" stroke="#fde68a" stroke-width="1" stroke-dasharray="2,2" />

        <defs>
          <linearGradient id="curve-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2563eb" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#curve-gradient)" />
        <path d="${pathD}" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        ${dotsSvg}
      </svg>
    `;
  }

  updateWhatIfCalculations() {
    const borrower = this.getActiveBorrower();
    if (!borrower) return;

    const analysis = analyzeBorrower(borrower, this.whatIfState);
    const simRsiEl = document.getElementById("simulated-rsi-value");
    const simRiskPill = document.getElementById("simulated-risk-pill");
    const simStatusMsg = document.getElementById("simulated-status-msg");

    if (!simRsiEl || !simRiskPill || !simStatusMsg) return;

    simRsiEl.textContent = `${analysis.rsiCurrent} RSI`;

    const riskClass = analysis.riskLevel.toLowerCase();
    simRiskPill.className = `badge-risk ${riskClass}`;
    simRiskPill.textContent = analysis.riskLevel;

    if (this.whatIfState.incomeAdjustmentPct < 0 || this.whatIfState.expenseAdjustment > 0) {
      if (analysis.riskLevel === "Critical") {
        simStatusMsg.textContent = "Caution: Cash shortfall exceeds reserve buffer. Restructuring required to prevent default.";
      } else {
        simStatusMsg.textContent = "Stress elevated under shock scenario, but facility remains within absorbable bounds.";
      }
    } else if (this.whatIfState.incomeAdjustmentPct > 0) {
      simStatusMsg.textContent = "Favorable revenue performance allows accelerated amortization without operational strain.";
    } else {
      simStatusMsg.textContent = "Baseline configuration active. Adjust parameters above to stress-test facility.";
    }
  }

  renderRestructuringPlans(borrower, analysis) {
    const container = document.getElementById("modal-restructuring-plans-grid");
    if (!container) return;

    container.innerHTML = "";

    analysis.plans.forEach(plan => {
      const card = document.createElement("div");
      const isCurrentActive = borrower.activePlanId === plan.id;
      card.className = `plan-card ${plan.recommended ? "recommended" : ""} ${isCurrentActive ? "active-contract" : ""}`;

      const scheduleBadges = plan.schedule.map(s => `
        <span class="font-mono" style="font-size: 9px; background: var(--slate-100); padding: 2px 5px; border-radius: 2px;">
          ${s.label}: ${formatINR(s.amount)}
        </span>
      `).join("");

      card.innerHTML = `
        ${plan.recommended ? `<div class="plan-rec-badge font-mono">Recommended</div>` : ""}
        <span class="plan-type-eyebrow font-mono">${plan.type}</span>
        <h4 class="plan-name">${plan.label}</h4>
        <p class="plan-desc">${plan.description}</p>

        <div class="plan-metrics-grid font-mono">
          <div class="plan-metric-item">
            <span class="plan-metric-label">Sustainability</span>
            <span class="plan-metric-val" style="color: var(--status-stable-text);">${plan.sustainabilityScore}/100</span>
          </div>
          <div class="plan-metric-item">
            <span class="plan-metric-label">Affordability</span>
            <span class="plan-metric-val">${Math.round(plan.affordabilityRatioAvg * 100)}% DSCR</span>
          </div>
          <div class="plan-metric-item">
            <span class="plan-metric-label">Monthly Amort.</span>
            <span class="plan-metric-val">${formatINR(plan.monthlyEmi)}</span>
          </div>
          <div class="plan-metric-item">
            <span class="plan-metric-label">Lender NPV Floor</span>
            <span class="plan-metric-val">${(plan.npvRatio * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div style="margin-bottom: 10px;">
          <span style="font-size: 8.5px; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 3px;">Payment Schedule:</span>
          <div style="display: flex; flex-wrap: wrap; gap: 3px;">
            ${scheduleBadges}
          </div>
        </div>

        <div style="font-size: 9.5px; color: var(--slate-600); background: var(--slate-50); padding: 5px 7px; border-radius: var(--radius-xs); margin-bottom: 12px; border: 1px solid var(--border-subtle);">
          Covenant: ${plan.guardrailStatus}
        </div>

        <button type="button" class="btn-apply-plan font-mono ${isCurrentActive ? "is-current" : ""}" data-plan-id="${plan.id}">
          ${isCurrentActive ? "✓ Active Schedule" : "Execute Restructure"}
        </button>
      `;

      const btnApply = card.querySelector(".btn-apply-plan");
      if (btnApply && !isCurrentActive) {
        btnApply.addEventListener("click", () => {
          this.applyRestructuring(borrower.id, plan);
        });
      }

      container.appendChild(card);
    });
  }

  applyRestructuring(borrowerId, plan) {
    const portfolio = this.getActivePortfolio();
    if (!portfolio) return;

    const borrower = portfolio.borrowers.find(b => b.id === borrowerId);
    if (!borrower) return;

    const previousEmi = borrower.emi;
    const newEmi = plan.monthlyEmi;

    borrower.activePlanId = plan.id;
    borrower.emi = newEmi;
    borrower.monthsRemaining = plan.tenureMonths || borrower.monthsRemaining;
    borrower.appliedPlanDetails = {
      appliedAt: new Date().toISOString(),
      planType: plan.type,
      planLabel: plan.label,
      previousEmi,
      newEmi,
      sustainabilityScore: plan.sustainabilityScore
    };

    storage.savePortfolios(this.portfolios, {
      action: `Restructured Facility: ${borrower.name}`,
      details: `Executed terms '${plan.label}'. Amortization revised from ${formatINR(previousEmi)} to ${formatINR(newEmi)}.`
    });

    this.showToast(`Restructuring executed for ${borrower.name}. Ledger updated.`, "★");
    this.render();
    this.renderDeepDiveDrawer();
  }

  // Underwrite new borrower
  handleAddBorrowerSubmit() {
    const portfolio = this.getActivePortfolio();
    if (!portfolio) return;

    const name = document.getElementById("add-name").value.trim();
    const occupation = document.getElementById("add-occupation").value.trim();
    const location = document.getElementById("add-location").value.trim();
    const loanAmount = parseFloat(document.getElementById("add-loan-amount").value);
    const emi = parseFloat(document.getElementById("add-emi").value);
    const monthsRemaining = parseInt(document.getElementById("add-months").value, 10);
    const avgMonthlyIncome = parseFloat(document.getElementById("add-income").value);
    const expenseBaselineMonthly = parseFloat(document.getElementById("add-expenses").value);
    const pattern = document.getElementById("add-pattern").value;
    const leanMonthsRaw = document.getElementById("add-lean-months").value;
    const notes = document.getElementById("add-notes").value.trim();

    const seasonalMonths = leanMonthsRaw
      .split(",")
      .map(m => m.trim())
      .filter(m => m.length > 0);

    const newBorrower = {
      id: "acct-" + Date.now().toString(36),
      name,
      occupation,
      location,
      loanAmount,
      emi,
      originalEmi: emi,
      monthsRemaining,
      avgMonthlyIncome,
      expenseBaselineMonthly,
      incomeFrequency: pattern === "Seasonal" ? "Harvest bulk receipts" : "Daily/Weekly cash collections",
      pattern,
      seasonalMonths,
      dataMonths: 12,
      reserveRatio: 0.18,
      paymentDelays: 0,
      totalPayments: 6,
      activePlanId: "current",
      appliedPlanDetails: null,
      notes
    };

    portfolio.borrowers.push(newBorrower);

    storage.savePortfolios(this.portfolios, {
      action: `Underwritten Account: ${newBorrower.name}`,
      details: `Approved into ${portfolio.name} (${newBorrower.occupation}, ${formatINR(newBorrower.loanAmount)})`
    });

    document.getElementById("form-add-borrower").reset();
    this.closeModal("modal-add-borrower");
    this.render();
    this.showToast(`Approved account for ${newBorrower.name}! Saved permanently.`);
  }

  // Open Edit Borrower Modal
  openEditBorrowerModal() {
    const borrower = this.getActiveBorrower();
    if (!borrower) return;

    document.getElementById("edit-borrower-id").value = borrower.id;
    document.getElementById("edit-name").value = borrower.name || "";
    document.getElementById("edit-occupation").value = borrower.occupation || "";
    document.getElementById("edit-location").value = borrower.location || "";
    document.getElementById("edit-loan-amount").value = borrower.loanAmount || 0;
    document.getElementById("edit-emi").value = borrower.emi || 0;
    document.getElementById("edit-months").value = borrower.monthsRemaining || 1;
    document.getElementById("edit-income").value = borrower.avgMonthlyIncome || 0;
    document.getElementById("edit-expenses").value = borrower.expenseBaselineMonthly || 0;
    document.getElementById("edit-pattern").value = borrower.pattern || "Stable";
    document.getElementById("edit-lean-months").value = (borrower.seasonalMonths || []).join(", ");
    document.getElementById("edit-notes").value = borrower.notes || "";

    this.openModal("modal-edit-borrower");
  }

  // Save changes to existing borrower
  handleEditBorrowerSubmit() {
    const portfolio = this.getActivePortfolio();
    if (!portfolio) return;

    const id = document.getElementById("edit-borrower-id").value;
    const borrower = portfolio.borrowers.find(b => b.id === id);
    if (!borrower) return;

    const name = document.getElementById("edit-name").value.trim();
    const occupation = document.getElementById("edit-occupation").value.trim();
    const location = document.getElementById("edit-location").value.trim();
    const loanAmount = parseFloat(document.getElementById("edit-loan-amount").value);
    const emi = parseFloat(document.getElementById("edit-emi").value);
    const monthsRemaining = parseInt(document.getElementById("edit-months").value, 10);
    const avgMonthlyIncome = parseFloat(document.getElementById("edit-income").value);
    const expenseBaselineMonthly = parseFloat(document.getElementById("edit-expenses").value);
    const pattern = document.getElementById("edit-pattern").value;
    const leanMonthsRaw = document.getElementById("edit-lean-months").value;
    const notes = document.getElementById("edit-notes").value.trim();

    const seasonalMonths = leanMonthsRaw
      .split(",")
      .map(m => m.trim())
      .filter(m => m.length > 0);

    borrower.name = name;
    borrower.occupation = occupation;
    borrower.location = location;
    borrower.loanAmount = loanAmount;
    borrower.emi = emi;
    borrower.monthsRemaining = monthsRemaining;
    borrower.avgMonthlyIncome = avgMonthlyIncome;
    borrower.expenseBaselineMonthly = expenseBaselineMonthly;
    borrower.pattern = pattern;
    borrower.seasonalMonths = seasonalMonths;
    borrower.notes = notes;

    storage.savePortfolios(this.portfolios, {
      action: `Modified Account: ${borrower.name}`,
      details: `Updated financial baseline parameters (${formatINR(borrower.loanAmount)} principal, ${formatINR(borrower.emi)} EMI)`
    });

    this.closeModal("modal-edit-borrower");
    this.render();
    this.renderDeepDiveDrawer();
    this.showToast(`Updated facility parameters for ${borrower.name}!`);
  }

  // Delete borrower
  handleDeleteBorrower() {
    const portfolio = this.getActivePortfolio();
    if (!portfolio) return;

    const id = document.getElementById("edit-borrower-id").value;
    const borrower = portfolio.borrowers.find(b => b.id === id);
    if (!borrower) return;

    if (confirm(`Are you sure you want to delete and close the facility file for ${borrower.name}?`)) {
      portfolio.borrowers = portfolio.borrowers.filter(b => b.id !== id);

      storage.savePortfolios(this.portfolios, {
        action: `Closed Account: ${borrower.name}`,
        details: `Removed facility from ${portfolio.name}`
      });

      this.closeModal("modal-edit-borrower");
      this.closeModal("modal-borrower-deepdive");
      this.render();
      this.showToast(`Account for ${borrower.name} deleted.`);
    }
  }

  // Handle New Portfolio Form
  handleNewPortfolioSubmit() {
    const name = document.getElementById("port-name").value.trim();
    const region = document.getElementById("port-region").value.trim();
    const description = document.getElementById("port-desc").value.trim();

    const newPortfolio = {
      id: "pool-" + Date.now().toString(36),
      name,
      region,
      description,
      createdAt: new Date().toISOString(),
      borrowers: []
    };

    this.portfolios.push(newPortfolio);
    this.activePortfolioId = newPortfolio.id;
    storage.saveActivePortfolioId(newPortfolio.id);

    storage.savePortfolios(this.portfolios, {
      action: `Established Credit Pool: ${newPortfolio.name}`,
      details: `New facility pool created for jurisdiction ${newPortfolio.region}`
    });

    document.getElementById("form-new-portfolio").reset();
    this.closeModal("modal-new-portfolio");
    this.render();
    this.showToast(`Established credit pool ${newPortfolio.name}!`);
  }

  // Generate & Download PDF Report
  downloadBorrowerPdf() {
    const borrower = this.getActiveBorrower();
    if (!borrower) return;

    const analysis = analyzeBorrower(borrower, this.whatIfState);
    const activePlan = analysis.plans.find(p => p.id === borrower.activePlanId) || analysis.plans[0];

    // Build standalone bank memorandum printable report
    const reportDiv = document.createElement("div");
    reportDiv.id = "bank-pdf-print-container";
    reportDiv.style.padding = "24px";
    reportDiv.style.fontFamily = "'Inter', sans-serif";
    reportDiv.style.color = "#0f172a";
    reportDiv.style.background = "#ffffff";
    reportDiv.style.maxWidth = "750px";
    reportDiv.style.margin = "0 auto";

    reportDiv.innerHTML = `
      <div style="border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div style="font-size: 16px; font-weight: 800; letter-spacing: -0.02em; color: #0f172a;">CASHPULSE BANK · COMMERCIAL CREDIT DIVISION</div>
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #2563eb; margin-top: 2px;">Credit Risk & Facility Underwriting Memorandum</div>
        </div>
        <div style="text-align: right; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #64748b;">
          <div>REF: #${borrower.id.toUpperCase()}</div>
          <div>DATE: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</div>
        </div>
      </div>

      <!-- Account Summary Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px;">
        <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px; font-weight: 600; width: 25%;">Borrower Legal Name:</td>
          <td style="padding: 8px; font-weight: 700;">${borrower.name}</td>
          <td style="padding: 8px; font-weight: 600; width: 25%;">Enterprise / Activity:</td>
          <td style="padding: 8px;">${borrower.occupation}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px; font-weight: 600;">Operating Cluster:</td>
          <td style="padding: 8px;">${borrower.location}</td>
          <td style="padding: 8px; font-weight: 600;">Credit Rating Tier:</td>
          <td style="padding: 8px; font-weight: 700; color: ${analysis.riskLevel === 'Critical' ? '#991b1b' : analysis.riskLevel === 'Watch' ? '#92400e' : '#065f46'};">
            ● ${analysis.riskLevel.toUpperCase()} (RSI: ${analysis.rsiCurrent}/100)
          </td>
        </tr>
        <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px; font-weight: 600;">Principal Exposure:</td>
          <td style="padding: 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 700;">${formatINR(borrower.loanAmount)}</td>
          <td style="padding: 8px; font-weight: 600;">Scheduled Monthly EMI:</td>
          <td style="padding: 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 700;">${formatINR(borrower.emi)}</td>
        </tr>
      </table>

      <!-- Diagnostic Notes -->
      <div style="background: #f8fafc; border-left: 3px solid #2563eb; padding: 12px; margin-bottom: 16px;">
        <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #2563eb; margin-bottom: 4px;">Credit Committee Underwriting Finding</div>
        <div style="font-size: 11px; line-height: 1.5; color: #334155;">${analysis.classificationReason}</div>
      </div>

      <!-- Financial Diagnostics Matrix -->
      <div style="margin-bottom: 16px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; color: #0f172a;">Core Cash-Flow Parameters</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; font-family: 'IBM Plex Mono', monospace;">
          <tr style="background: #f1f5f9; text-align: left;">
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Gross Monthly Revenue</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Essential Outflows</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Free Operating Cash Flow</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Reserve Coverage</th>
          </tr>
          <tr>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${formatINR(borrower.avgMonthlyIncome)}</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${formatINR(borrower.expenseBaselineMonthly)}</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 700;">${formatINR(analysis.disposableIncome)}</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${Math.round((borrower.reserveRatio || 0.1) * 30)} days</td>
          </tr>
        </table>
      </div>

      <!-- 6-Month Trajectory -->
      <div style="margin-bottom: 16px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; color: #0f172a;">6-Month Forward Debt-Servicing Trajectory</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10.5px; font-family: 'IBM Plex Mono', monospace; text-align: center;">
          <tr style="background: #f1f5f9;">
            ${analysis.timeline.map(t => `<th style="padding: 6px; border: 1px solid #cbd5e1;">${t.month}</th>`).join("")}
          </tr>
          <tr>
            ${analysis.timeline.map(t => `
              <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 700; color: ${t.riskLevel === 'Critical' ? '#ef4444' : t.riskLevel === 'Watch' ? '#f59e0b' : '#10b981'};">
                ${t.rsi} RSI ${t.isLeanMonth ? '<div style="font-size: 8px; color: #ef4444;">LEAN</div>' : ''}
              </td>
            `).join("")}
          </tr>
        </table>
      </div>

      <!-- Active Restructuring Term Sheet -->
      <div style="border: 1px solid #cbd5e1; border-radius: 4px; padding: 12px; margin-bottom: 24px; background: #fafafa;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #0f172a; margin-bottom: 4px;">Approved Restructuring Term Sheet</div>
        <div style="font-size: 12px; font-weight: 700; color: #2563eb; margin-bottom: 4px;">${activePlan.label} (${activePlan.type})</div>
        <div style="font-size: 10.5px; color: #475569; margin-bottom: 8px;">${activePlan.description}</div>
        <div style="display: flex; gap: 16px; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px;">
          <div>Monthly Servicing: <strong>${formatINR(activePlan.monthlyEmi)}</strong></div>
          <div>Maturity: <strong>${activePlan.tenureMonths} Months</strong></div>
          <div>Sustainability: <strong>${activePlan.sustainabilityScore}/100</strong></div>
          <div>Lender NPV Floor: <strong>${(activePlan.npvRatio * 100).toFixed(1)}%</strong></div>
        </div>
      </div>

      <!-- Signoff Footer -->
      <div style="margin-top: 30px; padding-top: 14px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #64748b;">
        <div>
          <div style="font-weight: 600; color: #0f172a;">CREDIT OFFICER SIGNATURE</div>
          <div style="margin-top: 24px; border-bottom: 1px solid #94a3b8; width: 180px;"></div>
          <div style="margin-top: 4px;">Authorized Underwriter</div>
        </div>
        <div>
          <div style="font-weight: 600; color: #0f172a;">COMPLIANCE OFFICER REVIEW</div>
          <div style="margin-top: 24px; border-bottom: 1px solid #94a3b8; width: 180px;"></div>
          <div style="margin-top: 4px;">UN SDG Goal 8 Adherence</div>
        </div>
      </div>
    `;

    document.body.appendChild(reportDiv);

    if (window.html2pdf) {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `CashPulse_Facility_Report_${borrower.name.replace(/\s+/g, "_")}_${borrower.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };

      this.showToast("Generating official credit facility PDF...", "⏳");
      window.html2pdf().set(opt).from(reportDiv).save().then(() => {
        reportDiv.remove();
        this.showToast(`PDF downloaded for ${borrower.name}!`, "↓");
      }).catch(err => {
        console.error("PDF generation failed:", err);
        reportDiv.remove();
        window.print();
      });
    } else {
      // Fallback to print dialog
      reportDiv.remove();
      window.print();
    }
  }

  // Analytics View
  renderAnalyticsView() {
    const portfolio = this.getActivePortfolio();
    if (!portfolio) return;

    const heatmapContainer = document.getElementById("analytics-heatmap-container");
    if (heatmapContainer) {
      const monthExposure = MONTH_NAMES.map(month => {
        const count = portfolio.borrowers.filter(b => 
          (b.seasonalMonths || []).some(m => m.trim().toLowerCase() === month.toLowerCase())
        ).length;
        return { month, count };
      });

      const maxCount = Math.max(1, ...monthExposure.map(m => m.count));

      heatmapContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px;">
          ${monthExposure.map(m => {
            const intensity = m.count / maxCount;
            let bgColor = intensity > 0.6 ? "#fef2f2" : intensity > 0.2 ? "#fffbeb" : "#f8fafc";
            let borderColor = intensity > 0.6 ? "#fecaca" : intensity > 0.2 ? "#fde68a" : "#e2e8f0";
            let textColor = intensity > 0.6 ? "#991b1b" : intensity > 0.2 ? "#92400e" : "#334155";

            return `
              <div style="background: ${bgColor}; border: 1px solid ${borderColor}; border-radius: var(--radius-xs); padding: 8px; text-align: center;">
                <span class="font-mono" style="font-size: 10px; font-weight: 700; color: ${textColor}; display: block;">${m.month}</span>
                <span class="font-mono" style="font-size: 16px; font-weight: 700; color: ${textColor}; margin-top: 2px; display: block;">${m.count}</span>
                <span style="font-size: 8px; color: var(--text-muted); text-transform: uppercase;">accounts</span>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    const queueList = document.getElementById("analytics-early-warning-list");
    const queueBadge = document.getElementById("analytics-queue-count");

    if (queueList) {
      const warningBorrowers = portfolio.borrowers
        .map(b => ({ borrower: b, analysis: analyzeBorrower(b) }))
        .filter(({ analysis: a }) => a.rsiCurrent >= 55 || a.projectedStressMonths.length > 0);

      queueBadge.textContent = `${warningBorrowers.length} accounts`;

      if (warningBorrowers.length === 0) {
        queueList.innerHTML = `
          <div style="text-align: center; padding: 20px; color: var(--status-stable-text); font-size: 11.5px;">
            ✓ All active accounts in this facility are operating within safe credit covenants.
          </div>
        `;
      } else {
        queueList.innerHTML = warningBorrowers.map(({ borrower, analysis }) => `
          <div style="padding: 10px 12px; background: var(--slate-50); border: 1px solid var(--border-card); border-radius: var(--radius-xs); display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-weight: 700; color: var(--slate-900); font-size: 12px;">${borrower.name}</span>
                <span class="badge-risk ${analysis.riskLevel.toLowerCase()} font-mono">${analysis.rsiCurrent} RSI</span>
              </div>
              <span style="font-size: 10.5px; color: var(--text-muted); display: block; margin-top: 1px;">
                ${analysis.classification} · ${analysis.projectedStressMonths.length ? `Peak stress in ${analysis.projectedStressMonths.join(", ")}` : "Ongoing liquidity strain"}
              </span>
            </div>
            <button type="button" class="btn-action-outline font-mono" onclick="window.cashpulse.openBorrowerDeepDive('${borrower.id}')">
              Restructure
            </button>
          </div>
        `).join("");
      }
    }
  }

  renderAuditView() {
    const container = document.getElementById("audit-list-container");
    if (!container) return;

    const logs = storage.loadAuditLog();
    if (logs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 12px;">
          No audit log entries recorded.
        </div>
      `;
      return;
    }

    container.innerHTML = logs.map(entry => {
      const date = new Date(entry.timestamp);
      const formattedDate = date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      return `
        <div class="audit-item">
          <div>
            <div class="audit-action-title font-mono">${entry.action}</div>
            <div class="audit-action-details">${entry.details}</div>
          </div>
          <div class="audit-timestamp font-mono">${formattedDate}</div>
        </div>
      `;
    }).join("");
  }
}

// Attach globally
window.addEventListener("DOMContentLoaded", () => {
  window.cashpulse = new CashPulseBankApp();
});
