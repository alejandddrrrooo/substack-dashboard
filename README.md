# Substack Dashboard

Self-hosted analytics dashboard for any Substack publication. Dark-themed, responsive, and fully customizable.

![Overview](https://img.shields.io/badge/charts-Chart.js%204-blue) ![Server](https://img.shields.io/badge/server-Express%205-green) ![License](https://img.shields.io/badge/license-MIT-orange)

## Features

- **Overview dashboard** — KPI cards (subscribers, paid, ARR, open rate), trend charts, revenue sources
- **Posts dashboard** — Per-post revenue, views, signups, sortable table with search/filters, paid growth chart
- **Fully configurable** — Publication name, colors, which metrics/charts to show, table columns
- **API + static mode** — Runs as Express server locally, deploys as static site to Vercel/Netlify
- **Daily data ingestion** — POST snapshots via API, data merges by date

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/substack-dashboard.git
cd substack-dashboard
npm install
```

1. Edit `config.json` with your publication details
2. Copy `data.example.json` to `data.json` (or populate via API)
3. Run:

```bash
npm start
```

Open http://localhost:3456

## Configuration

All customization lives in `config.json`:

```json
{
  "publication": {
    "name": "Your Publication Name",
    "url": "https://your-substack.com",
    "description": "Your dashboard description"
  },
  "server": {
    "port": 3456
  },
  "theme": {
    "accentColor": "#f97316",
    "backgroundColor": "#0a0a0a",
    "cardBackground": "#111111",
    "borderColor": "#1a1a1a",
    "textPrimary": "#ffffff",
    "textSecondary": "#e0e0e0",
    "textMuted": "#666666"
  },
  "metrics": {
    "overview": {
      "totalSubscribers": true,
      "paidSubscribers": true,
      "annualizedRevenue": true,
      "openRate": true
    },
    "charts": {
      "subscribersOverTime": true,
      "revenueOverTime": true,
      "revenueSources": true,
      "openRateTrend": true
    },
    "posts": {
      "revenueByPost": true,
      "revenueBySection": true,
      "paidGrowth": true,
      "columns": ["title", "postDate", "sectionName", "audience", "views", "delivered", "opened", "openRate", "signups", "subscribes", "shares", "estimatedRevenue", "reactionCount"]
    }
  }
}
```

### Disabling metrics

Set any metric to `false` to hide it:

```json
"overview": {
  "annualizedRevenue": false
}
```

### Customizing table columns

Remove or reorder entries in `metrics.posts.columns`:

```json
"columns": ["title", "postDate", "views", "estimatedRevenue"]
```

Available columns: `title`, `postDate`, `sectionName`, `audience`, `views`, `delivered`, `opened`, `openRate`, `signups`, `subscribes`, `shares`, `estimatedRevenue`, `reactionCount`, `commentCount`, `clicks`, `clickThroughRate`

## Ingesting Data

POST snapshots to the API:

```bash
curl -X POST http://localhost:3456/api/snapshots \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-03-10","totalSubscribers":5000,"paidSubscribers":200}'
```

Snapshots are merged by date — you can POST overview data and post data separately and they'll combine.

## Deploying (Static)

For static deployment (Vercel, Netlify, GitHub Pages):

1. Copy `data.json` and `config.json` to `public/`
2. Deploy the `public/` folder

```bash
cp data.json public/data.json
cp config.json public/config.json
cd public && npx vercel --yes --prod
```

The HTML files automatically fall back to static `data.json` and `config.json` when the Express API isn't available.

## Data Schema

See `data.example.json` for the full snapshot schema. Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `totalSubscribers` | number | Total subscriber count |
| `paidSubscribers` | number | Paid subscriber count |
| `annualizedRevenue` | number | ARR in USD |
| `openRate` | number | 30-day open rate (%) |
| `recentPosts` | array | Recent posts with delivery stats |
| `revenueSources` | array | Revenue by acquisition channel |
| `allPosts` | array | All posts with full per-post stats |

## License

MIT
<!-- deployed -->
