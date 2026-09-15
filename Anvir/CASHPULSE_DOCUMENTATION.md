# CashPulse: Dynamic Commercial Microloan Repayment & Cash-Flow Planning System

## 1. Title + Tagline
**CashPulse** — An institutional microloan underwriting and dynamic restructuring platform that aligns debt servicing with real-world, seasonal cash-flow velocities to eliminate default risk and predatory lending.

---

## 2. Overview / Summary
CashPulse is a commercial microfinance intelligence prototype built for credit officers, branch managers, and portfolio risk underwriters. Traditional microfinance often forces rigid, equal monthly installments on micro-entrepreneurs whose revenues fluctuate cyclically, creating artificial defaults, coercive collections, and predatory refinancing loops. CashPulse resolves this by calculating an algorithmic Repayment Stress Index (RSI) across 6-month predictive horizons using empirical revenue cadences, seasonal lean shocks, and liquid reserves. When credit stress spikes, the platform instantly synthesizes sustainable restructuring term sheets—such as seasonal flex holidays, tenure extensions, or weekly amortizations—guaranteeing both lender net present value (NPV) and borrower solvency under UN Sustainable Development Goal 8. The prototype is fully interactive, features client-side PDF memorandum generation, supports real-time multi-device cloud synchronization, and persists all institutional modifications to an immutable audit trail.

---

## 3. Screens / Sections Map
- **Navigation & Branch Control Sidebar**: Branch portfolio selector, pool establishment, tab routing, system status indicators, regulatory data backups, and multi-device cloud controls.
- **Top Executive Action Bar**: Operating jurisdiction breadcrumb, active borrower counter, and high-frequency underwriting modal triggers.
- **Credit Facility Ledger Screen (Primary Hub)**: Portfolio risk telemetry KPI cards, global keyword search console, view mode switcher, filter presets, and interactive borrower ledger table.
- **Credit Cards Dossier Screen (Alternative Grid)**: Card-based visual ledger emphasizing 6-month micro-stress forecast strips and visual debt-burden metrics.
- **Borrower Deep-Dive & Restructuring Dossier (Slide-Over Drawer)**: Comprehensive credit file containing AI diagnostics, 3-factor underwriting evidence, forward cash-flow trajectories, a live sensitivity sandbox, and restructuring term sheet generators.
- **Macro Risk & SDG 8 Governance Screen**: Portfolio vulnerability seasonal heatmap and an automated early-warning intervention queue.
- **Audit & Compliance Trail Screen**: Immutable regulatory changelog recording timestamped entries for every facility approval, baseline adjustment, restructuring, or deletion.
- **Underwrite New Facility Modal**: Multi-field financial onboarding dialog for capturing loan facilities, cash flow cadences, and seasonal dip patterns.
- **Edit Credit Facility Modal**: Full facility maintenance dialog allowing baseline amendments or permanent facility liquidations.
- **Multi-Device Cloud Sync Dialog**: Cloud database configuration sheet for shared room identifiers, sync verification, and live collaboration links.
- **Establish Credit Pool Modal**: Administrative dialog for spinning up isolated operating branches or regional microfinance pools.
- **Data Ledger Import Dialog**: Raw JSON restoration interface for backup rehydration and testing.

---

## 4. Core Features

### Global Search & Keyword Discovery Console
- **What it is**: An instant, deep search bar positioned prominently above the credit ledger.
- **What it does / how it behaves**: Filters ledger rows and credit cards in real-time as you type across borrower names, trade sectors, regional clusters, loan amounts, repayment patterns, seasonal months, and underwriting notes. It highlights matching terms in bright gold tags and renders a contextual snippet tag if a match occurs within nested notes.
- **Why it exists**: Allows credit managers handling hundreds of accounts to instantly isolate specific trades, lean harvest windows, or individual clients in seconds.

### Search Preset Filter Chips
- **What it is**: A horizontal row of one-click quick-filtering chips adjacent to the search input.
- **What it does / how it behaves**: Clicking a chip (e.g., *Vegetable Vendor*, *Sugarcane Farmer*, *Gig Courier*, *Kirana Retail*, *Seasonal Dips*, *Critical (≥65)*, *Watchlist*, or *All Facilities*) populates the search query, highlights the active chip in dark slate, and filters the ledger immediately.
- **Why it exists**: Provides zero-typing access to common high-risk borrower clusters and seasonal agricultural archetypes.

### Clear Search Button (`✕`)
- **What it is**: A dedicated reset button embedded directly inside the right side of the search input.
- **What it does / how it behaves**: Appears only when text exists in the search bar; clicking it empties the search input, resets all preset chips to *All Facilities*, restores the full ledger, and refocuses the cursor.
- **Why it exists**: Saves users from manually backspacing queries when clearing complex filters.

### Keyboard Shortcut (`/` and `Escape`)
- **What it is**: Global keyboard listeners for search focus and drawer dismissal.
- **What it does / how it behaves**: Pressing `/` anywhere on the page immediately focuses and selects the search bar text; pressing `Escape` clears active search inputs or dismisses any open modal sheet.
- **Why it exists**: Accelerates desk productivity for banking officers navigating dense ledgers without touching a mouse.

### View Mode Switcher (Table vs. Cards)
- **What it is**: A segmented two-button icon toggle located in the search bar toolbar.
- **What it does / how it behaves**: Toggles the display between the tabular Bank Ledger Table (optimized for rapid data density) and the Credit File Cards Grid (optimized for visual risk scanning). The active mode receives a highlighted white background with subtle elevation.
- **Why it exists**: Caters to different operational preferences between high-density credit auditing and qualitative risk reviews.

### Ledger Sorting Dropdown
- **What it is**: A styled select menu offering four distinct ordering algorithms.
- **What it does / how it behaves**: Reorders active borrowers by Repayment Stress Index descending, Repayment Stress Index ascending, Monthly EMI descending, or Borrower Legal Name alphabetical. Selection persists across tab switches and search operations.
- **Why it exists**: Enables instant prioritization of the most distressed loans requiring immediate committee intervention.

### Institutional KPI Telemetry Cards
- **What it is**: Four summary metric blocks sitting at the top of the Ledger screen.
- **What it does / how it behaves**: Aggregates the active branch portfolio in real time, displaying counts for Impaired/Critical accounts (RSI ≥ 65), Watchlist accounts (RSI 40–64), Capital Performing accounts (RSI < 40), and Total Deployed Principal Exposure alongside portfolio average stress.
- **Why it exists**: Gives executive branch managers a 5-second health overview of total capital at risk before inspecting individual accounts.

### Repayment Stress Index (RSI) Algorithmic Engine
- **What it is**: A 0–100 proprietary stress rating system evaluated for each facility.
- **What it does / how it behaves**: Synthesizes debt-service ratio (EMI vs. disposable income), liquid reserve coverage (days of survival buffer), historical delinquency ratios, cash-flow volatility penalties, and cyclical seasonal multipliers. Ratings are classified into Stable (green, 0–39), Watch (amber, 40–64), and Critical (crimson, 65–100).
- **Why it exists**: Replaces subjective loan officer intuition with mathematically provable risk indexing tailored to unbanked cash-flow patterns.

### Bank Ledger Table
- **What it is**: The primary operational grid displaying active borrower accounts.
- **What it does / how it behaves**: Shows Account ID, Borrower Name & Trade, Operating Location, Principal Amount, Monthly EMI, RSI Rating badge, Remaining Maturity, Restructuring Status, and a "Dossier →" action button. Clicking any row slides open the full Borrower Deep-Dive drawer.
- **Why it exists**: Serves as the central daily workspace for commercial loan officers tracking active amortizations.

### Credit Cards Grid
- **What it is**: An alternative visual gallery presenting borrowers as credit index cards.
- **What it does / how it behaves**: Each card renders the borrower identity, a colored stress bar indicator, key financial stats, and a mini 6-month forecast strip with monthly RSI pills and lean dip flags. Clicking any card opens the deep-dive dossier.
- **Why it exists**: Provides loan officers with an intuitive visual dashboard during borrower field interviews.

### Keyword Highlighting (`.kw-highlight`)
- **What it is**: Dynamic inline text-matching marks in both table and card views.
- **What it does / how it behaves**: Wraps any character sequence matching the active search query inside a styled amber highlight badge (`<mark class="kw-highlight">`), dynamically updating as the user types.
- **Why it exists**: Immediately directs the user's eye to the exact reason a specific record matched their search query.

### Context Snippet Tag (`.search-snippet-tag`)
- **What it is**: An auxiliary contextual note badge rendered below a borrower's occupation.
- **What it does / how it behaves**: When a search match occurs inside private underwriting notes or seasonal lean months rather than the borrower's name, this badge surfaces an excerpt with the highlighted match.
- **Why it exists**: Eliminates confusion by explaining non-obvious search matches without forcing the user to open the dossier.

### Operating Facility / Branch Switcher
- **What it is**: A select dropdown situated in the upper sidebar.
- **What it does / how it behaves**: Switches the active credit ledger between available regional pools (e.g., Mysuru Field Unit vs. Dharwad Agri & Dairy Cluster). All KPIs, tables, and analytics instantly re-render against the selected branch's borrowers.
- **Why it exists**: Enables multi-branch administration within a single dashboard instance.

### Establish Credit Pool Modal
- **What it is**: A modal form for creating new regional lending pools.
- **What it does / how it behaves**: Captures Pool Title, Operating Cluster/Jurisdiction, and Facility Mandate, creating a new portfolio in persistent storage and immediately setting it active.
- **Why it exists**: Allows institutions to compartmentalize distinct lending schemes, geography clusters, or donor-funded facilities.

### Underwrite Borrower Form & Modal
- **What it is**: An institutional onboarding modal capturing 11 underwriting fields.
- **What it does / how it behaves**: Collects legal name, enterprise, cluster, loan principal, scheduled EMI, tenure, monthly revenues, basic outflows, cash-flow pattern (Seasonal, Irregular, Stable, Declining, Recovering), comma-separated lean months, and underwriting notes. Upon submission, it prevents default browser reloads, computes RSI, commits to storage, appends to the audit log, and notifies the user via toast.
- **Why it exists**: Enforces systematic, structured onboarding of microfinance facilities.

### Edit Facility Modal
- **What it is**: A maintenance modal launched from the credit dossier.
- **What it does / how it behaves**: Pre-populates all 11 underwriting fields with the active borrower's data, allowing loan officers to adjust income baselines, correct tenure, change lean months, or modify repayment schedules. Saving commits changes, updates the cloud database, and recalculates real-time risk scores.
- **Why it exists**: Ensures loan officers can modify underwriting terms as micro-enterprises grow or face economic disruption.

### Delete Account Action
- **What it is**: A danger-styled button located inside the Edit Facility modal.
- **What it does / how it behaves**: Prompts for confirmation and permanently removes the facility file from the portfolio, logs the closure in the regulatory audit log, closes all open drawers, and updates KPIs.
- **Why it exists**: Allows purging defaulted, fully settled, or erroneously entered facilities.

### Borrower Deep-Dive Slide-Over Drawer
- **What it is**: A comprehensive, right-aligned slide-over dossier occupying 780px of screen width.
- **What it does / how it behaves**: Slides smoothly into view when any borrower row or card is clicked, presenting AI diagnostic summaries, financial parameter matrices, weighted evidence factor cards, forward 6-month debt trajectory charts, an interactive sensitivity sandbox, and restructuring recommendations. Pressing `Escape` or clicking the backdrop or close button (`✕`) dismisses it.
- **Why it exists**: Centralizes all diagnostic and restructuring capabilities without navigating away from the active ledger.

### AI Credit Diagnostic Narrative Banner
- **What it is**: A callout container at the top of the borrower dossier.
- **What it does / how it behaves**: Displays an algorithm confidence percentage (e.g., `94% Precision`) and a human-readable diagnostic paragraph explaining whether cash distress is cyclical (monsoon delays) or structural (business contraction).
- **Why it exists**: Provides underwriters with clear rationale for credit committee presentations.

### Diagnostic Metrics Matrix
- **What it is**: A 4-card KPI strip inside the borrower dossier.
- **What it does / how it behaves**: Displays current RSI (with colored risk level), Free Operating Cash Flow (Revenue minus Baseline Outflows), Capacity Margin Percentage, and Liquid Reserve Buffer measured in days of household survival.
- **Why it exists**: Quantifies fundamental liquidity and debt-servicing buffer at a glance.

### 3-Factor Underwriting Evidence Cards
- **What it is**: Three diagnostic cards analyzing the primary drivers of loan performance.
- **What it does / how it behaves**: Breaks down Cash-Flow Cadence & Volatility (weight: 35%), Historical Repayment Track (weight: 25%), and Liquid Reserve Buffer (weight: 25%) with green upward or red downward indicators.
- **Why it exists**: Demystifies the black-box RSI calculation for transparent compliance auditing.

### 6-Month Forward Debt-Servicing Trajectory Table
- **What it is**: An interactive 6-month projection card sequence in the dossier.
- **What it does / how it behaves**: Projects disposable income against scheduled debt service across the upcoming half-year, visually highlighting lean dip months with crimson borders and calculating projected monthly RSI scores.
- **Why it exists**: Identifies liquidity shortfalls 60–90 days before they manifest as missed payments.

### What-If Sensitivity Simulation Sandbox
- **What it is**: An interactive stress-testing panel embedded in the dossier.
- **What it does / how it behaves**: Features two sliders: Gross Income Shock (-50% to +50%) and Essential Outflow Shock (+₹0 to +₹10,000/mo). Adjusting sliders recomputes projected disposable income, surfaces simulated RSI scores, calculates projected cash shortfalls, and dynamically modifies restructuring recommendations in real time.
- **Why it exists**: Allows risk officers to simulate economic shocks (e.g., fuel price hikes, crop blight) before committing to a restructuring term sheet.

### Reset Simulation Button
- **What it is**: A ghost-style text button within the sensitivity sandbox header.
- **What it does / how it behaves**: Resets both simulation sliders to zero and restores baseline underwriting figures.
- **Why it exists**: Quickly reverts sandbox experiments without reloading the drawer.

### Restructuring Strategy Recommendation Engine
- **What it is**: An automated term-sheet generator positioned at the bottom of the dossier.
- **What it does / how it behaves**: Evaluates borrower cash patterns and generates tailored term sheets: *Seasonal Flex Holidays* (temporary interest-only pauses during lean months), *Graduated Step-Up Schedules* (reduced amortizations during inventory rebuilds), *Tenure Extensions* (stretching maturity to lower monthly servicing), or *Weekly Micro-Amortizations* (splitting monthly payments into weekly payouts for gig workers). Each plan card lists monthly EMI, tenure, Sustainability Score (0–100), and Lender NPV Recovery Ratio.
- **Why it exists**: Replaces aggressive debt collection with mathematically sound restructuring that protects bank capital while preventing borrower insolvency.

### Apply Restructuring Plan Button
- **What it is**: A primary action button on each restructuring alternative card.
- **What it does / how it behaves**: Commits the chosen restructuring plan to the borrower's active record, adjusts scheduled EMI, flags the borrower as "Restructured" across the ledger, updates portfolio risk KPIs, logs the action to the audit trail, and pushes changes to the cloud.
- **Why it exists**: Enables instant execution of approved credit restructurings in a single click.

### Official Credit Facility PDF Export Generator
- **What it is**: A client-side PDF export button (`#btn-download-pdf`) located in the dossier header.
- **What it does / how it behaves**: Uses `html2pdf.js` to construct an off-screen, clean-room institutional memorandum featuring official CashPulse bank letterheads, borrower account summaries, risk tier ratings, cash-flow diagnostic matrices, 6-month trajectory tables, approved restructuring covenants, and regulatory signature signoff blocks, downloading directly to the user's device as a print-ready PDF file.
- **Why it exists**: Produces formal documentation required for physical credit committee meetings and regulatory compliance archives.

### Print Facility Sheet Action
- **What it is**: A secondary print button (`#btn-print-facility`) adjacent to the PDF download button.
- **What it does / how it behaves**: Invokes browser print styling (`@media print`), hiding all navigation, sidebars, and interactive buttons to output clean physical copies.
- **Why it exists**: Supports traditional branch environments reliant on paper credit files.

### Macro Risk & Cluster Vulnerability Heatmap
- **What it is**: A visual month-by-month risk matrix located in the Analytics view.
- **What it does / how it behaves**: Displays all 12 calendar months with colored count tiles indicating how many active facilities suffer lean cash-flow contractions in that specific month, with severity shading ranging from neutral slate to critical crimson.
- **Why it exists**: Alerts bank treasurers to systemic liquidity crunches across regional agricultural harvest calendars.

### Early Warning Intervention Queue
- **What it is**: A priority action queue within the Macro Risk view.
- **What it does / how it behaves**: Filters and lists every borrower in the portfolio exhibiting RSI ≥ 55 or approaching projected seasonal shortfalls, complete with a direct "Restructure" button that launches their dossier.
- **Why it exists**: Enables preemptive outreach to struggling borrowers before formal delinquencies trigger regulatory impairment.

### Immutable Regulatory Audit Log View
- **What it is**: A dedicated administrative changelog view (`#view-audit`).
- **What it does / how it behaves**: Renders a chronological stream of institutional actions (initial demo loads, borrower underwriting, facility modifications, applied restructurings, and deletions) with action titles, detailed summaries, and localized timestamps.
- **Why it exists**: Satisfies banking compliance standards by maintaining an audit trail of all manual and automated loan modifications.

### Clear Audit Trail Action
- **What it is**: A danger-styled action button inside the Audit Log view.
- **What it does / how it behaves**: Clears historical audit records from local storage after prompting for user confirmation.
- **Why it exists**: Allows resetting compliance logs during sandbox demonstrations or testing cycles.

### Export Regulatory JSON Ledger
- **What it is**: A sidebar utility button (`#btn-export-json`).
- **What it does / how it behaves**: Serializes all active portfolios, borrowers, and audit logs into a formatted JSON file and triggers a browser download.
- **Why it exists**: Facilitates offline cold-storage backups and inter-branch data migration.

### Import JSON Backup Modal
- **What it is**: A sidebar utility button and modal dialog (`#btn-import-json`).
- **What it does / how it behaves**: Accepts pasted CashPulse JSON backup payloads, validates structure, restores portfolios and audit logs into active storage, and refreshes all views.
- **Why it exists**: Enables rapid rehydration of verified test datasets or historical portfolios.

### Reset Demonstration Data Action
- **What it is**: A sidebar utility button (`#btn-reset-demo`).
- **What it does / how it behaves**: Prompts for confirmation and resets local storage back to the default empirical baseline portfolios (Mysuru Central Mandi and Dharwad Dairy clusters).
- **Why it exists**: Allows evaluators to return to a clean, known demonstration state after experimenting.

### Lightweight Multi-Device Cloud Database Sync Engine
- **What it is**: An asynchronous cloud synchronization subsystem connecting browsers via an ultra-light REST object endpoint.
- **What it does / how it behaves**: Pushes local modifications (underwriting, edits, restructurings) in the background via debounced REST PUT requests, and polls the cloud object store every 6 seconds or on window focus. When remote edits are detected from another computer, it silently merges data and refreshes the ledger.
- **Why it exists**: Solves the isolation problem of client-side prototypes, ensuring multiple bankers on different laptops see live updates simultaneously without complex server backends.

### Multi-Device Cloud Sync Modal & Room Configuration
- **What it is**: A configuration dialog launched from the sidebar sync badge.
- **What it does / how it behaves**: Displays cloud connection health, public database key (`ff808181a067127101a09aa348a80920`), last synchronized timestamp, an editable Shared Room ID input, a "Sync Cloud Now ☁" manual trigger, and a "Copy Shared Link 🔗" button that copies a parameterized room link to the clipboard.
- **Why it exists**: Empowers team members to collaborate in private or shared credit rooms simply by sharing a URL.

### Live Cloud Sync Status Indicator
- **What it is**: A status badge in the lower sidebar featuring a colored pulse dot.
- **What it does / how it behaves**: Dynamically toggles between three states: pulsing blue dot with "Cloud Syncing...", solid emerald dot with "Cloud Synced ☁", or amber dot with "Local Storage (Offline)".
- **Why it exists**: Provides instant, ambient reassurance of data safety and multi-device connection status.

### Toast Notification System
- **What it is**: A transient notification banner floating in the bottom-right viewport.
- **What it does / how it behaves**: Displays brief confirmation feedback (e.g., `Approved account for Lakshmi!`, `Copied shared multi-device link!`) along with contextual emojis, automatically dismissing after 3.4 seconds.
- **Why it exists**: Confirms successful asynchronous operations without interrupting user workflow.

---

## 5. States & Edge Cases

| State / Edge Case | Behavior & Presentation |
| :--- | :--- |
| **Search Query Empty State** | Ledger table displays a centered card: *"No credit accounts match [query]"*, explains possible search criteria, and presents a one-click *"Clear Search Query"* button. |
| **Filtered Category Empty State** | Ledger displays *"No credit facilities match the current search or filter criteria"* when a filter pill isolates zero accounts. |
| **Empty Early Warning Queue** | Renders an emerald success banner: *"✓ All active accounts in this facility are operating within safe credit covenants."* |
| **Empty Audit Log State** | Displays a centered muted card: *"No audit log entries recorded."* |
| **Cloud Sync In-Flight State** | Status badge dot pulses blue; text reads *"Cloud Syncing..."*; action buttons temporarily throttle rapid re-clicks. |
| **Cloud Offline / Network Error State** | Pulse dot turns amber; text shifts to *"Local Storage (Offline)"*; prototype falls back transparently to local storage without throwing blocking alerts. |
| **Remote Update Received State** | Background polling detects newer remote timestamp; silently updates local storage, re-renders the ledger, and triggers a toast: *"Cloud updated: Synced real-time changes across devices."* |
| **First-Time User Experience** | Automatically seeds local storage with Mysuru and Dharwad empirical baseline portfolios, ensuring the interface is never blank on initial launch. |
| **Returning User Experience** | Detects existing local storage or remote cloud ledger data and immediately restores custom borrowers, edits, and audit logs. |
| **Form Validation Failure State** | Browser native validation blocks submission if required fields are missing or numbers fall outside positive integer boundaries. |

---

## 6. Interactions & Micro-details
- **Micro-animations**: Smooth cubic-bezier transitions (`150ms ease`) on button hover, table row elevation, and filter chip state changes.
- **Slide-Over Drawer Motion**: The credit dossier drawer utilizes hardware-accelerated translateX transforms with a dimmed backdrop fade-in (`rgba(15, 23, 42, 0.45)`).
- **Keyword Highlight Pop**: Matched search characters render with a 2px padding, subtle 2px border radius, and contrasting dark-amber text (`#854d0e`) against a soft yellow ground (`#fef08a`).
- **Interactive Slider Scrubbing**: Adjusting What-If sliders instantly recalculates RSI figures and updates text labels (e.g., `+15%` or `+₹2,500 / mo`) on every input frame without lag.
- **Table Row Hover State**: Hovering over any borrower row applies a subtle slate-50 tint and shifts the cursor to a pointer.
- **Card Stress Track Animation**: Stress meter bars animate width smoothly on load and after sandbox adjustments using CSS transition widths.
- **Tone & Microcopy**: Professional, tier-1 institutional banking terminology (e.g., *"Underwrite Facility"*, *"Regulatory Ledger"*, *"Lender NPV Floor"*, *"Amortization"*, *"Cluster Jurisdiction"*).
- **Toast Feedback Styling**: Minimalist floating dark pills with crisp white typography and micro-emoji icons.

---

## 7. Design & Style
- **Visual Language & Aesthetic Direction**: Tier-1 institutional bank corporate minimalism. Designed to evoke Bloomberg Terminal precision, Stripe-level typography, and executive regulatory compliance.
- **Color Palette**:
  - *Brand Blue (`#2563eb`, `#1d4ed8`)*: Primary actions, facility underwriting triggers, active tabs, and AI diagnostic highlights.
  - *Slate Grayscale (`#0f172a`, `#1e293b`, `#334155`, `#64748b`, `#f8fafc`)*: Slate-900 for executive headers, Slate-600 for body copy, Slate-400 for secondary metadata, and Slate-50 for subtle table/card backgrounds.
  - *Hairline Borders (`#e2e8f0`, `#cbd5e1`)*: Strict 1px borders defining ledgers, cards, and modal dialogs with zero garish drop-shadows.
  - *Risk Crimson (`#ef4444`, `#fef2f2`, `#991b1b`)*: Critical RSI (≥65) badges, impaired telemetry, and lean season shortfall flags.
  - *Risk Amber (`#f59e0b`, `#fffbeb`, `#92400e`)*: Watchlist RSI (40–64) badges, pending sync states, and keyword search highlight backgrounds.
  - *Risk Emerald (`#10b981`, `#ecfdf5`, `#065f46`)*: Capital Performing RSI (<40) badges, safe capacity indicators, and verified sync indicators.
- **Typography**:
  - *Headings & Body UI*: `Inter`, sans-serif (weights: 400, 500, 600, 700) for clean legibility and modern banking feel.
  - *Financial & Telemetry Data*: `IBM Plex Mono`, monospace (weights: 400, 500, 600, 700) for numeric alignment, currency figures, account IDs, and timestamps.
- **Spacing & Layout Grid Philosophy**: Strict 8px grid system with consistent component paddings (12px, 16px, 24px) creating an orderly, uncluttered information hierarchy.
- **Iconography Style**: Crisp, lightweight SVG vector line icons (2px stroke, square round-caps) matching Lucide / Feather icon conventions.
- **Imagery & Illustrations**: Zero decorative illustrations, cartoons, or generic placeholders; strictly data visualizations, telemetry meters, and clean typography.
- **Dark/Light Mode**: Light executive daytime banking theme with high-contrast slate surfaces, ensuring daylight readability in field-office environments.

---

## 8. User Flows

### Flow 1: Global Keyword Search & Borrower Review
1. User lands on the **Credit Facility Ledger** screen.
2. User presses `/` on their keyboard (or clicks the search bar).
3. User types `Vegetable` (or clicks the preset chip *Vegetable Vendor*).
4. Ledger instantly filters to Lakshmi, highlighting every instance of `Vegetable` in amber and displaying match count: *Showing 1 of 6 Accounts*.
5. User reviews Lakshmi's ₹48,000 principal, 68 RSI Critical badge, and notes snippet.
6. User clicks `✕` or presses `Escape` to clear the query and restore the complete portfolio.

### Flow 2: Stress Diagnostics, Sensitivity Testing & Restructuring
1. Loan officer locates an impaired account (e.g., Raju, Smallholder Sugarcane Farmer, RSI: 78).
2. Officer clicks **Dossier →**; the 780px slide-over drawer opens smoothly.
3. Officer inspects the AI Diagnostic Narrative, identifying pre-harvest cash shortfalls during June–September.
4. Officer expands the **What-If Sandbox** and drags the *Gross Income Shock* slider to -20%.
5. Simulated stress escalates to 88 RSI with an immediate ₹2,100 projected monthly deficit.
6. Officer scrolls to the **Restructuring Strategy Engine** and selects the generated *Seasonal Flex Plan* (₹2,100 interest-only amortization during July–August; tenure +3 months; Sustainability: 92/100; Lender NPV: 98.4%).
7. Officer clicks **Apply Approved Term Sheet**; the plan commits, the ledger updates to *Restructured*, and an entry appends to the Audit Log.

### Flow 3: Facility Parameter Modification
1. Loan officer opens an existing borrower dossier.
2. Officer clicks the **Edit Facility** button in the dossier header.
3. Modal sheet opens pre-filled with the borrower's underwriting parameters.
4. Officer amends scheduled monthly EMI from ₹5,980 to ₹4,200 and adds an underwriting remark.
5. Officer clicks **Save Changes**; the system commits to local and cloud databases, recalculates real-time RSI, and logs the amendment.

### Flow 4: Credit Committee PDF Export
1. Loan officer opens an active borrower file.
2. Officer clicks **Download PDF** in the dossier header.
3. A non-blocking toast displays: *"Generating official credit facility PDF..."*.
4. `html2pdf.js` renders a clean-room institutional memorandum with letterhead, diagnostic tables, forward trajectory forecasts, approved restructuring covenants, and signoff blocks.
5. PDF saves directly to the officer's downloads folder as `CashPulse_Facility_Report_[Name]_[ID].pdf`.

### Flow 5: Multi-Device Team Collaboration Setup
1. Officer on Laptop A clicks **Sync ☁** or the sync indicator in the sidebar footer.
2. The Multi-Device Cloud Sync configuration modal opens.
3. Officer clicks **Copy Shared Link 🔗**; system copies `https://cashpulsebank.netlify.app/?room=cashpulse_live_cluster_04` to clipboard.
4. Officer sends link to a colleague on Laptop B.
5. Colleague opens link; Laptop B immediately initializes with the same room ID, pulls the live database, and any subsequent edits on either laptop synchronize across both screens within 6 seconds.

---

## 9. Technical Notes
- **Architecture**: Completely self-contained client-side web application built with vanilla ECMAScript modules, semantic HTML5, and vanilla CSS. Zero npm dependencies, bundlers, or heavy frameworks required to execute.
- **State & Data Layer (`storage.js` / `app.js`)**: Encapsulates persistence using browser `localStorage` under `cashpulse_portfolios_v1` and `cashpulse_audit_trail_v1`, supplemented by an internal pub/sub event bus that triggers automatic UI re-renders on state mutations.
- **Lightweight Cloud Database Backend**: Connects to a public REST object store (`https://api.restful-api.dev/objects/ff808181a067127101a09aa348a80920`) via native asynchronous browser `fetch()`. Transmits tiny JSON payloads (~7 KB) containing active portfolios and the recent audit log, with automated background polling and debounced saving.
- **Financial Math Engine (`domain.js` / `app.js`)**: Implements debt-service ratio (DSR), volatility multipliers, reserve survival runaways, NPV recovery calculations, and term-sheet amortization schedules client-side.
- **PDF Generation Engine**: Integrates `html2pdf.bundle.min.js` (incorporating `html2canvas` and `jsPDF`), constructing a clean-room DOM tree before rendering to prevent UI clipping.
- **Hosting & Deployment**: Configured for static hosting on Netlify (`https://cashpulsebank.netlify.app`) or standard local web servers (`python3 -m http.server 3000`).

---

## 10. Accessibility & Responsiveness
- **Desktop First**: Primary layout targets desktop monitors, laptop screens, and tablet workstations (1024px–1920px) typically found on bank underwriting desks.
- **Responsive Fluidity**: Page containers use flexbox and CSS auto-fit grid layouts that collapse telemetry cards from 4 columns to 2 columns on intermediate viewports.
- **Color Contrast Ratios**: All risk text badges and button labels strictly maintain WCAG AA contrast (e.g., `#991b1b` on `#fef2f2`, `#065f46` on `#ecfdf5`).
- **Keyboard Navigation**: Form inputs, modals, search shortcuts (`/`), and escape handlers (`Escape`) support full keyboard navigation without mouse dependence.
- **Print Stylesheet (`@media print`)**: Dedicated print rules suppress navigation bars, modal close buttons, and sliders, formatting reports to clean monochrome A4 layouts.
- **Mobile Considerations**: On screens under 768px, horizontal table overflow is accommodated with smooth touch scrolling, and slide-over drawers expand to 100% viewport width.

---

## 11. Known Limitations / What's Not Built Yet
- **Simulated Cloud Store**: The multi-device cloud sync relies on a public REST JSON object endpoint suitable for prototypes and demos, rather than an authenticated private PostgreSQL / Redis backend.
- **Mocked Credit Bureau Integration**: Historical repayment delinquency counts are self-reported or loaded from empirical demonstration baselines rather than a live CIBIL / Experian API pipe.
- **Single Currency Localization**: Currency symbols and number formats are hardcoded to Indian Rupees (INR, ₹) based on the Mysuru and Dharwad empirical baseline data.
- **Client-Side Storage Ceilings**: Relying on browser `localStorage` limits maximum portfolio scale to approximately 5 MB of JSON text (roughly 1,500 borrower records).
- **Authentication & RBAC**: The prototype runs without login credentials or role-based access control; any user on the URL can underwrite, edit, or delete accounts.

---

## 12. Closing Summary
CashPulse transforms rigid, high-stress microfinance lending into a proactive, cash-flow-aligned partnership between banks and micro-entrepreneurs. By combining empirical seasonal risk indexing with instant term-sheet restructuring and real-time multi-device cloud collaboration, the prototype proves that financial institutions can eliminate default spikes and predatory refinancing loops while fully protecting lender capital.
