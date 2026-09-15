# CashPulse: The Intelligent Microfinance Risk Platform

CashPulse is a specialized risk management platform designed for microfinance institutions (MFIs) operating in emerging markets. Developed by Team Jugad.exe for the Manipal Hackathon (Atlas), this application provides deep, real-time insights into borrower health, portfolio exposure, and systemic risks.

## Core Philosophy

Traditional credit scoring often fails in emerging markets due to the lack of formal financial histories. CashPulse bridges this gap by introducing the **Risk Stress Index (RSI)**—a dynamic, multi-factor scoring model that evaluates a borrower's resilience based on high-frequency operational data, seasonal cash flows, and macroeconomic indicators. 

By continuously monitoring these factors, CashPulse shifts risk management from reactive recovery to proactive intervention, aligning with UN SDG 8 (Decent Work and Economic Growth) by protecting vulnerable micro-enterprises from default cycles.

## Key Features

1. **Risk Stress Index (RSI) Engine**
   - Calculates a real-time risk score (0-100) combining Debt Service Coverage Ratio (DSCR), Free Operating Flow (FOF), and Reserve Days.
   - Automatically categorizes borrowers into Performing, Watchlist, or Critical tiers based on configurable thresholds.

2. **Origination Hub (Kanban)**
   - Visual pipeline for processing new loan applications.
   - Integrated AI Review stage provides preliminary risk assessments based on alternative data (e.g., mobile money flows, SMS consent).

3. **Macro Analytics & Heatmaps**
   - **Portfolio Analytics:** Recharts-powered dashboards showing capital at risk by cluster, sector allocation, and 6-month historical risk trends.
   - **Seasonal Heatmap:** Visualizes expected cash flow constraints across different trade categories, enabling proactive loan restructuring before seasonal downturns.

4. **Stress Testing Sandbox**
   - Allows risk officers to simulate macroeconomic shocks (e.g., supply chain disruptions causing revenue drops, or inflation causing expense spikes).
   - Instantly visualizes the impact on the portfolio's RSI distribution and default probability.

5. **Dynamic Credit Pools**
   - Organize capital by jurisdiction (e.g., Nairobi, Mombasa) and mandate (e.g., Agriculture, Retail).
   - Automated migration logic assigns borrowers to appropriate pools, tracking exposure against pool capacity limits in real-time.

6. **Basel-III Compliance & Audit**
   - Immutable audit log tracking all underwriting decisions, restructurings, and system configuration changes.
   - Mock PDF generation for regulatory reporting, displaying simulated Capital Adequacy and Liquidity Coverage Ratios.

7. **Proactive Intervention Workflow**
   - **Borrower Dossier:** Deep dive into individual accounts with AI-generated summaries and repayment schedules.
   - **One-Click Restructuring:** Apply flexible EMI schedules or term extensions directly from the dashboard for at-risk accounts.

## Technical Architecture

- **Frontend Framework:** React 18 with TypeScript, built via Vite.
- **Styling:** Tailwind CSS (with advanced glassmorphism and modern UI paradigms).
- **Icons & Visualization:** Lucide React for iconography, Recharts for data visualization, and Framer Motion for micro-animations.
- **State Management:** React Context API with a centralized, immutable store managing mock data entities.
- **Routing:** Custom lightweight routing using `window.history` for seamless modal navigation and view switching.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Jugad.exe---Manipal-Hackathon-Atlas-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to the local server address provided by Vite (typically `http://localhost:5173`).

### Building for Production

To create an optimized production build:
```bash
npm run build
```
This command compiles the application into the `dist` directory, optimizing chunks and applying minification.

## Configuration (Settings)

The platform includes a robust settings panel allowing you to:
- Adjust RSI thresholds for Critical and Watchlist tiers.
- Configure alert routing (Email/SMS simulation).
- Modify localization settings (Currency, Language).
- Export or import the entire ledger state as JSON for backup and migration.

## Team

**Jugad.exe** 
Created for the Manipal Hackathon (Atlas).
