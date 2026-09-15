<div align="center">
  # CashPulse

  **Predictive risk intelligence. Proactive interventions — not reactive recoveries.**

  ![Version](https://img.shields.io/badge/version-v1-blue)
  ![Platform](https://img.shields.io/badge/platform-Web-informational)
  ![License](https://img.shields.io/badge/license-MIT-green)

  ---
  
  ## 🚀 [**CLICK HERE TO VIEW LIVE PROTOTYPE**](https://jugad-exe-manipal-hackathon-atlas.vercel.app/) 🚀
  *(No login required - Production Build)*
  
  ---
</div>

## Problem & Solution

**The Problem:** Traditional credit scoring models fail in emerging markets due to the lack of formal financial histories. This leaves vulnerable micro-enterprises trapped in default cycles when faced with sudden macroeconomic shocks or seasonal cash flow constraints. Existing legacy banking CRMs are purely reactive, focusing on debt recovery only *after* a default occurs.

**The Solution:** CashPulse bridges this gap by introducing the **Risk Stress Index (RSI)**, a dynamic, multi-factor scoring model that evaluates a borrower's resilience based on high-frequency operational data and seasonal cash flows. CashPulse shifts microfinance from reactive recovery to proactive intervention. It enables institutions to visualize portfolio exposure, stress-test economic shocks, and instantly restructure loans *before* a borrower defaults, ensuring sustainable growth and aligning with UN SDG 8.

---

CashPulse is a specialized risk management platform built for microfinance institutions (MFIs) operating in emerging markets. It moves away from static credit scores by monitoring high-frequency operational data, seasonal cash flows, and macro indicators to create a dynamic **Risk Stress Index (RSI)**.

A complete, local-first alternative to legacy banking CRMs, CashPulse lets you visualize portfolio exposure, stress-test economic shocks, and instantly restructure loans before defaults occur. 

> **Hackathon Release.** Developed by Team Jugad.exe for the Manipal Hackathon (Atlas). The platform is fully functional in-memory (no database required for the demo), complete with a mock ledger, compliance audit logs, and interactive AI dashboards.

## Where it fits

| | Legacy Banking CRMs | Standard Dashboards | CashPulse |
|---|---|---|---|
| **Approach** | Reactive recovery | Historical reporting | Proactive intervention |
| **Risk Scoring** | Static (FICO, Equifax) | None | Dynamic RSI (Cashflow + Seasonality) |
| **Scenario Testing** | Requires offline modeling | No | Real-time Sandbox & Heatmaps |
| **Setup Speed** | Months of integration | Days | Instant (In-memory browser state) |

The gap this fills: Traditional microfinance tools fail because borrowers in emerging markets lack formal financial histories. CashPulse uses continuous alternative data to predict stress months *before* they happen, allowing one-click loan restructuring.

## Key Features

- **Risk Stress Index (RSI) Engine**: Calculates a real-time risk score (0-100) combining Debt Service Coverage Ratio (DSCR), Free Operating Flow (FOF), and Reserve Days.
- **Dynamic Restructuring Engine**: Automatically recommends and simulates alternative repayment plans to save at-risk borrowers.
- **Stress Testing Sandbox**: Simulate macroeconomic shocks (e.g., inflation spikes) and instantly see the impact on default probability.
- **Origination Kanban**: Visual pipeline for processing new loan applications with AI-assisted review.
- **Basel-III Compliance**: Immutable audit log tracking all underwriting decisions, payments, and system configuration changes.

## Install

**Windows / macOS / Linux** — Terminal:

```bash
git clone https://github.com/IntellectDaksh/Jugad.exe---Manipal-Hackathon-Atlas-.git
cd Jugad.exe---Manipal-Hackathon-Atlas-
npm install
npm run dev
```

The application runs entirely locally in your browser. All state (borrowers, payments, audit logs) is stored in-memory during development to ensure a seamless hackathon evaluation experience. You can export/import state via the **Settings** tab.

**Production Build**:
```bash
npm run build
npm run preview
```

## Architecture

- **Core**: React 18 with TypeScript, Vite
- **Styling**: Tailwind CSS (custom glassmorphism & dark mode UI)
- **Visualizations**: Recharts for charts, Lucide React for iconography, Framer Motion for micro-animations
- **State**: Centralized React Context (no external database required for demo)

## Team Jugad.exe

Built with precision for the Manipal Hackathon (Atlas). If you encounter any bugs during evaluation, please open an issue or check the deployed Vercel link for the latest stable build.
