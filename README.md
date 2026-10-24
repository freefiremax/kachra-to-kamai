# Kachra To Kamai

Kachra To Kamai is a React + Vite PWA prototype for an approved waste-to-value marketplace, initially scoped to Kopargaon, Maharashtra.

## Current status

The current build is a working **demo-mode vertical slice**. It persists sample listings, sample orders, and the selected demo role in the browser's local storage. It does not create real accounts, payment transactions, delivery jobs, uploads, or external records.

The production transition plan is documented in [`docs/PRODUCTION_PLAN.md`](docs/PRODUCTION_PLAN.md).

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal. The app runs in demo mode when `VITE_APP_MODE` is unset or set to `demo`.

## Checks

```bash
npm test
npm run build
```

## Environment

Copy `.env.example` to `.env.local` for local configuration. Do not commit `.env.local` or any secret values. Only publishable Supabase browser configuration belongs in `VITE_*` variables; server secrets must be configured in Vercel/Supabase/R2 server environments later.

## Important product boundaries

- Demo prices and delivery estimates are sample assumptions, not approved commercial policy.
- Prohibited and unapproved materials remain blocked.
- Seller acceptance is required before an order is treated as confirmed.
- No live payment, payout, GPS tracking, private document upload, or production delivery assignment is implemented yet.
