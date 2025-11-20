# RadarScan

A modern URL security scanner powered by Cloudflare Radar. Scan any URL for security threats, analyze network behavior, and generate comprehensive PDF reports.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         RadarScan                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      React SPA Frontend                          │
│  • Vite + React + TypeScript                                     │
│  • Tailwind CSS v4                                               │
│  • Real-time WebSocket updates                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Cloudflare Workers Backend                     │
│  • API Routes (/api/*)                                           │
│  • WebSocket Handler (/ws/*)                                     │
│  • PDF Download Route                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Durable  │  │ Workflows│  │    D1    │
        │ Objects  │  │          │  │ Database │
        │          │  │          │  │          │
        │ Session  │  │  Scan    │  │ Session  │
        │ Manager  │  │ Workflow │  │  State   │
        └──────────┘  └──────────┘  └──────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │Cloudflare│  │    R2    │  │  Resend  │
        │  Radar   │  │  Bucket  │  │   API    │
        │   API    │  │          │  │          │
        │          │  │   PDF    │  │  Email   │
        │URL Scan  │  │ Storage  │  │ Delivery │
        └──────────┘  └──────────┘  └──────────┘
```

## Features

- Real-time URL security scanning via Cloudflare Radar API
- Comprehensive PDF reports with detailed security analysis
- Email delivery of scan reports
- WebSocket-based live progress updates
- Session persistence and recovery
- Modern, responsive UI with Cloudflare orange theme

## Prerequisites

- Node.js 18+
- Cloudflare account with Workers enabled
- Cloudflare API token with Radar API access
- Resend API key for email functionality

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/acme-studios/radar-url-scanner.git
cd radar-url-scanner
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Cloudflare Resources

Create the required Cloudflare resources:

```bash
# Create D1 database
npx wrangler d1 create radar-scanner-db

# Create R2 bucket
npx wrangler r2 bucket create radar-scan-reports

# Initialize D1 schema
npx wrangler d1 execute radar-scanner-db --file=./schema.sql
```

### 4. Configure Environment Variables

Copy the example files and fill in your credentials:

```bash
cp wrangler.jsonc.example wrangler.jsonc
cp .dev.vars.example .dev.vars
```

Edit `wrangler.jsonc`:
- Replace `<DATABASE_ID>` with your D1 database ID
- Replace `<CLOUDFLARE_ACCOUNT_ID>` with your Cloudflare account ID
- Replace `<APP_URL>` with your deployment URL (or `http://localhost:5173` for dev)

Edit `.dev.vars`:
```env
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
RESEND_API_KEY=your_resend_api_key
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run build
npx wrangler deploy
```

## Project Structure

```
radar-url-scanner/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── lib/               # Utilities
│   └── index.css          # Tailwind styles
├── worker/                # Cloudflare Workers backend
│   ├── durable-objects/   # Session management
│   ├── workflows/         # Scan workflow logic
│   ├── services/          # PDF generation, email
│   └── index.ts          # Main worker entry
├── public/               # Static assets
├── schema.sql           # D1 database schema
└── wrangler.jsonc       # Cloudflare configuration
```

## API Endpoints

- `POST /api/scan` - Create new scan session
- `GET /api/session/:id` - Get session status
- `GET /ws/:sessionId` - WebSocket connection for real-time updates
- `GET /api/download/:sessionId` - Download PDF report
- `POST /api/send-email` - Send report via email

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite 7
- Tailwind CSS v4
- Jost font family

**Backend:**
- Cloudflare Workers
- Durable Objects
- Workflows
- D1 Database
- R2 Storage

**External Services:**
- Cloudflare Radar API
- Resend API

## Security

All sensitive credentials are stored as environment variables and never committed to the repository. The `.gitignore` file excludes:
- `.dev.vars` (local secrets)
- `wrangler.jsonc` (contains account IDs)
- `.env` files

## License

MIT
