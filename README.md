# LoveLab — La Lumière Command Center

Marketing intelligence dashboard for **LoveLab Antwerp**. Live Google Ads + Meta Ads data with AI-powered recommendations powered by Claude.

## Features

- **Live Dashboard** — Combined KPIs from Google Ads and Meta Ads, auto-refreshes every 5 minutes
- **AI Advisor** — Claude-powered chat that knows LoveLab's brand, all 7 collections, pricing, and live ad performance
- **Brand Health Score** — Composite score computed from live advertising metrics
- **Campaign Deep Dive** — Side-by-side Google + Meta campaign performance
- **Collection Portfolio** — Ad readiness scores for all collections (Cuty through Classy)
- **Market Strategy** — B2C entry plans for France, Belgium, Italy, Germany, UK, UAE
- **Ad Copy Generator** — AI-generated ad copy in French, English, Dutch, German, Italian

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/lovelab-command-center.git
cd lovelab-command-center
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your actual API credentials:

| Variable | Where to get it |
|---|---|
| `GOOGLE_ADS_CLIENT_ID` | Google Cloud Console → APIs & Services → Credentials |
| `GOOGLE_ADS_CLIENT_SECRET` | Same as above |
| `GOOGLE_ADS_REFRESH_TOKEN` | OAuth2 flow (you already have this from your MCP setup) |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Google Ads API Center |
| `GOOGLE_ADS_CUSTOMER_ID` | Your Google Ads account ID (no dashes): `7523003664` |
| `META_ACCESS_TOKEN` | Meta Business Suite → System User Token |
| `META_AD_ACCOUNT_ID` | Your Meta ad account: `act_510481432933248` |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

**Important:** Add all environment variables in Vercel Dashboard → Settings → Environment Variables.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── google-ads/     # Google Ads API endpoint
│   │   ├── meta-ads/       # Meta Marketing API endpoint
│   │   ├── ai-chat/        # Claude AI chat endpoint
│   │   └── brand-health/   # Brand health score calculator
│   ├── layout.tsx          # App shell with sidebar
│   └── page.tsx            # Main dashboard
├── components/
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── Topbar.tsx          # Top bar with live status
│   ├── MetricCard.tsx      # KPI metric cards
│   └── AiChat.tsx          # AI chat component
├── lib/
│   ├── google-ads.ts       # Google Ads API client
│   ├── meta-ads.ts         # Meta Ads API client
│   └── ai-advisor.ts       # Claude AI with LoveLab context
└── data/
    └── brand.ts            # Brand knowledge base (collections, markets, personas)
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **AI:** Anthropic Claude API (claude-sonnet-4-5)
- **Ads:** Google Ads API v17, Meta Marketing API v21.0
- **Deployment:** Vercel
- **Language:** TypeScript

## Brand Design Rules

- Primary color: `#6B3FA0` (ink-plum) — **NO pink in UI**
- Accent: `#C9A96E` (gold)
- Headings: Playfair Display
- Body: Inter

---

Built with La Lumière ✦ for LoveLab Antwerp
