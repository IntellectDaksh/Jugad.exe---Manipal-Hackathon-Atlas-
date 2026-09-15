import fs from 'fs';

const anvirData = [
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
        reserveRatio: 0.19, // ~19% of monthly expense in savings
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
        notes: "Sustained order slowdown from local real estate halts. Requires structured term relief."
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

let generatedCode = `\n// --- Anvir Ported Data ---\n`;

anvirData.forEach(pool => {
  generatedCode += `pools.push({\n  id: '${pool.id}',\n  title: '${pool.name}',\n  jurisdiction: '${pool.region}',\n  mandate: '${pool.description.replace(/'/g, "\\'")}',\n  createdAt: '${pool.createdAt}',\n});\n`;
  pool.borrowers.forEach(b => {
    let reserves = Math.round(b.expenseBaselineMonthly * b.reserveRatio);
    let status = 'Active';
    if (b.paymentDelays >= 2) status = 'Critical';
    else if (b.paymentDelays == 1) status = 'Watch';

    let cadence = 'stable';
    if (b.pattern === 'Seasonal') cadence = 'seasonal';
    if (b.pattern === 'Declining') cadence = 'declining';
    if (b.pattern === 'Recovering') cadence = 'recovering';
    if (b.pattern === 'Irregular') cadence = 'irregular';

    generatedCode += `borrowers.push(makeBorrower('${b.name}', '${b.occupation}', '${b.location}', '${pool.id}', ${b.loanAmount}, ${b.emi}, ${b.monthsRemaining}, ${b.avgMonthlyIncome}, ${b.expenseBaselineMonthly}, '${cadence}', ${reserves}, '${status}', '${b.notes.replace(/'/g, "\\'")}'));\n`;
  });
});

const mockDataPath = './src/lib/mockData.ts';
let mockDataFile = fs.readFileSync(mockDataPath, 'utf8');

mockDataFile = mockDataFile.replace(/export \{ pools, borrowers, auditLog \};/, generatedCode + '\nexport { pools, borrowers, auditLog };');

fs.writeFileSync(mockDataPath, mockDataFile);
console.log('Successfully ported Anvir data to mockData.ts');
