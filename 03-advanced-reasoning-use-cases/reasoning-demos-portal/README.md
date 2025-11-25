# Reasoning Demos Portal

A production-ready React single-page application showcasing advanced reasoning model capabilities across 6 interactive demonstrations. Built with Vite, TypeScript, and a dark-blue aesthetic.

![Reasoning Demos Portal](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## Features

- **6 Interactive Demos**: Each demonstrating different reasoning capabilities
- **Dark Blue Theme**: Professional, easy-on-the-eyes design with CSS variables
- **Responsive Layout**: Sidebar navigation, header, and content areas
- **Real-time Simulations**: Compare conventional vs reasoning model approaches
- **LLM-backed Advisory**: Temporal demo now calls GPT-4o-mini vs GPT-5-mini and surfaces prompt/response pairs
- **Temporal Edge Explainer**: One-click GPT-5-mini analysis that critiques both outputs and highlights the reasoning advantage
- **Model Comparison**: Side-by-side analysis of strategy differences
- **Keyboard Shortcuts**: Quick navigation and actions
- **Export Functionality**: Download simulation results as JSON
- **Animations**: Smooth transitions using Framer Motion

## Demos

### 1. Temporal Reasoning – Personal Savings Coach ✅
Calendar-aware financial planning with timing constraints, buffer management, and goal optimization. Features:
- Pre-configured persona (Emre, Istanbul)
- Conventional vs Reasoning strategy comparison
- Timeline visualization with balance tracking
- KPI dashboard (overdrafts, goal progress, buffer range)
- Detailed advisory panel with strategy recommendations

### 2. Multi-constraint Reasoning & Planning
*Coming Soon* - Complex payment scheduling under fees, limits, and preferences

### 3. What-if Simulations
*Coming Soon* - Scenario analysis with salary delays, expense spikes, and bonuses

### 4. Empathetic Communication
*Coming Soon* - Tone-aware responses preserving user values

### 5. Social Negotiation
*Coming Soon* - Payment plan renegotiation with BNPL providers

### 6. Advanced Recommender Systems
*Coming Soon* - Temporal-threshold card/offer selection with explainability

## Tech Stack

- **React 18.2** + **TypeScript 5.2**
- **Vite 5.0** - Fast build tool
- **React Router 6** - Client-side routing
- **Zustand** - Lightweight state management
- **React Query** - Async state and caching
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icon library

## Design Tokens

```css
--bg: #0b1220          /* Background */
--bg-elev: #0f1a2b     /* Elevated background */
--card: #122038        /* Card background */
--primary: #1e3a8a     /* Primary blue */
--accent: #2563eb      /* Accent blue */
--text: #e5e7eb        /* Text color */
--muted: #9aa4b2       /* Muted text */
--radius: 0.75rem      /* Border radius */
```

## Quick Start

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

### Enabling Azure-backed advice

The Temporal Savings demo can now hit live Azure OpenAI agents (GPT-4o-mini for the conventional view and GPT-5-mini for the reasoning view).

1. From the repo root (`agent-framework-ozg`), create a `.env` file with your Azure credentials:
   ```bash
   AZURE_OPENAI_ENDPOINT="https://<your-resource>.openai.azure.com/"
   AZURE_OPENAI_API_KEY="..."
   AZURE_OPENAI_API_VERSION="2024-08-01-preview"
   ```
2. Install the Python dependencies once (includes FastAPI + the agent framework):
   ```bash
   pip install -r requirements.txt
   ```
3. Start the API server from `03-reasoning-models`:
   ```bash
   uvicorn reasoning_api:app --reload
   ```
4. In another terminal run `yarn dev` (or `npm run dev`) from `reasoning-demos-portal`.

Vite proxies `/api/*` calls to `http://127.0.0.1:8000` by default. If your API lives elsewhere, set `VITE_API_BASE="https://your-host"` (and `VITE_API_PROXY` for local dev) before starting Vite.

After both models have been triggered inside the Temporal Savings demo, use the **Explain GPT-5's edge** button to ask GPT-5-mini for a narrated comparison of the two outputs.

### Build for Production

```bash
# Build the project
npm run build
# or
yarn build

# Preview production build
npm run preview
# or
yarn preview
```

## Project Structure

```
reasoning-demos-portal/
├── src/
│   ├── components/
│   │   ├── layout/           # Layout components (Sidebar, Header, Layout)
│   │   ├── ui/               # Reusable UI components (Button, Card, Badge)
│   │   └── demos/            # Demo-specific components (ModelDiffDrawer)
│   ├── pages/                # Route pages for each demo
│   ├── lib/                  # Utilities and simulation logic
│   ├── stores/               # Zustand stores
│   ├── data/                 # Mock data and fixtures
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Main app with routing
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles with design tokens
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.ts            # Vite config
├── tailwind.config.js        # Tailwind config
└── README.md                 # This file
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `g` | Go home (navigate to landing page) |
| `r` | Run simulation (when on demo page) |
| `d` | Open Model Diff drawer |

*Note: Shortcuts are disabled when typing in input fields*

## Future Enhancements

- [ ] localStorage persistence for last config
- [ ] CSV export for timeline data
- [ ] Print-ready summary pages (A4)
- [ ] Complete remaining 5 demos with full functionality
- [ ] Unit tests with Vitest (10+ tests on timeline utilities)

---

Built with ❤️ using React + Vite + TypeScript
