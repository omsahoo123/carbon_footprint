# EcoCarbon – Professional Carbon Footprint Tracker

EcoCarbon is a high-fidelity, professional carbon tracker engineered to promote environmental accountability, awareness, and lifestyle adjustment in line with modern sustainability standards. This application allows users to monitor their personal daily carbon expenditures across key lifestyle vectors, complete with rich visualization, active eco-challenges, streaks, and community comparisons.

---

## 1. Chosen Vertical: Carbon Footprint Tracking (Individual & Domestic Focus)

Understanding, tracking, and curbing greenhouse gas emissions is one of the most critical challenges of our decade. EcoCarbon tackles this by transforming abstract statistics into immediate, understandable individual targets. 
* **Target Audience**: Environmentally conscious individuals, households, and organizations seeking a structured, data-driven daily journal.
* **Core Goal**: Keep daily greenhouse gas expenditures beneath the safe Paris Accord guideline of **8.0 kg CO₂** per person.

---

## 2. Approach and Logic

The platform is designed with a **desktop-first, responsive, screen-constrained modular React architecture** coupled with **Tailwind CSS utility styling**. Our implementation rests on several design and logic principles:

### A. Modular Architecture
The app's logic is cleanly isolated to ensure maintainability, rapid rendering cycles, and optimal bundle size:
* **State Management**: Orchestrated cleanly at the top-level React core (`App.tsx`) to serve as a single source of truth for dashboard analytics, activity logs, challenges, and leaderboard standings.
* **Component Partitioning**:
  * `Dashboard.tsx`: High-level summaries, dynamic daily guidelines, and interactive trend widgets over a 7-day floating window.
  * `LogActivity.tsx`: Interactive, multi-category selection form featuring custom mathematical previews of greenhouse impact before logging.
  * `Insights.tsx`: Rich SVG donut visualizations, sector-by-sector ratio breakdowns, and customized automated paths to personal reduction.
  * `Leaderboard.tsx`: Engagement loops featuring 7-day streak progress tracking and localized rankings.

### B. Aesthetic Conception ("Forest & Slate" Theme)
To promote focus, calm, and scientific authority, the UI rejects standard generic templates in favor of:
* **Unified Visual Language**: Off-white canvases (`#F8FAFB`), deep pine accents (`#1B4332`), and vivid moss greens (`#2D6A4F` & `#52B788`).
* **High Contrast & Negative Space**: Generous layout padding and micro-borders (`#E2E8F0`) with subtle shadows ensure highly scannable grid clusters.
* **Typography Hierarchy**: Pairings using **Inter** as a primary interface font, displaying clear tracking and stark weights across headers and code elements.

---

## 3. How the Solution Works

### I. Real-time Logging Engine
When logging daily events inside `LogActivity.tsx`, users select from five distinct lifestyle categories:
1. **Transport**: Calculates distance (in kilometers) against standard vehicle combustion factors.
2. **Food**: Translates traditional intake classification (e.g., carbon-heavy red meats vs. plant-based meals) multiplied by dish volume.
3. **Home Energy**: Computes emissions from electricity usage (kWh), natural gas (m³), or heating oil (Litres).
4. **Air Travel**: Handles medium/long-haul airline passenger indices.
5. **Shopping**: Weights emissions from high-carbon physical manufacturing sectors (consumer electronics, textile clothes, generic parcels).

Before submission, a **live calculation preview** updates on-the-fly, allowing a user to see the exact footprint impact and make sustainable corrections before saving.

### II. Analytical Dashboards & Trends
* **Interactive Trend Chart**: Employs a custom, lightweight modular column visualization tracking current-to-past emissions. Columns change color dynamically based on state targets: safe green, moderate orange, or warning red.
* **Emissions Breakdown & Ratio Donut**: Sector vectors render instantly via custom SVG trigonometry. Dissecting the percentage distribution helps users expose hidden contributors immediately.
* **Automated Smart Insights**: Programmatic checks monitor user habits to surface targeted suggestions (e.g., recommending a train transit alternative when transport averages dominate).

### III. Active Gamification Loop
* **7-Day Streak Tracker**: Counts consecutive logging days to foster long-term habit retention.
* **Carbon Reduction Challenges**: Present options to "Accept" or "Complete" customized eco-friendly tasks (e.g., using public transit, buying local non-plastic fresh produce), rewarding users with virtual carbon offsets.
* **Local Leaderboard**: Ranks the current user against a localized group of simulated peers, creating healthy social gamification loops where the *lowest emissions win*.

---

## 4. Key Assumptions and Emission Coefficients

Calculations reflect globally recognized ecological lifecycle literature and standard guidelines:

### A. General Standards
* **Max Daily Safe Target**: **8.0 kg CO₂ / day** (Aligned with Paris Pact global individual guidelines).
* **Global Daily Average Reference**: **12.5 kg CO₂ / day** (Used for standard comparison metrics).
* **Weekly Safe Target**: **56.0 kg CO₂ / week**.

### B. Conversion Constants (kg CO₂ per unit)
The application assumes the following greenhouse lifecycle emission integers:

| Category | Input Option | Coefficient | Unit | Description |
| :--- | :--- | :---: | :---: | :--- |
| **Transport** | Gas/Petrol Car | `0.180` | kg CO₂ / km | Standard ICE engine average combustion |
| | Tesla / Electric EV | `0.035` | kg CO₂ / km | Standard grid energy manufacturing matrix |
| | Transit Bus | `0.060` | kg CO₂ / km | Scaled passenger occupancy average |
| | Train | `0.025` | kg CO₂ / km | Medium-distance electric rail index |
| | Motorcycle | `0.110` | kg CO₂ / km | Light combustion average |
| **Food** | Red Meats (Beef/Lamb) | `7.200` | kg CO₂ / portion | High livestock farming and processing |
| | White Meats (Pork/Poultry) | `2.400` | kg CO₂ / portion | Medium grain feed lifecycle |
| | Fish / Seafood | `1.600` | kg CO₂ / portion | Marine capture and farm distribution |
| | Vegetarian | `0.800` | kg CO₂ / portion | Dairy processing and logistics |
| | Vegan | `0.150` | kg CO₂ / portion | Highly efficient plant-based footprint |
| **Energy** | Electricity | `0.380` | kg CO₂ / kWh | Dynamic grid average composition |
| | Natural Gas | `1.850` | kg CO₂ / m³ | Fuel combustion heating indices |
| | Heizöl / Heating Oil | `2.680` | kg CO₂ / Litre | High-density petroleum combustion |
| **Air Travel** | Passenger Flights | `0.255` | kg CO₂ / km | High-altitude kerosene emissions |
| **Shopping** | Cotton Clothes / Shoes | `12.500` | kg CO₂ / item | Industrial clothing manufacturing footprint |
| | Consumer Electronics | `35.000` | kg CO₂ / item | Raw rare-earth extraction and assembly |
| | Home / General Parcel | `4.200` | kg CO₂ / item | Plastic wrapping and courier packaging |
