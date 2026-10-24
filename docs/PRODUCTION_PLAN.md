# Kachra To Kamai — Production Transition Plan

- **Plan version:** 0.1.0
- **Date:** 2026-10-24
- **Status:** Proposed execution plan; production deployment has not occurred
- **Current runtime:** React/Vite demo mode with browser-local sample state

## 1. What “working” means at each stage

### Current: demonstrable prototype

The app currently supports a complete sample-data journey:

1. Browse approved sample listings.
2. Open listing details and request a quantity.
3. Create a supplier listing with validation.
4. Move a sample order through seller acceptance, simulated payment, assignment, pickup, delivery and receipt.
5. Persist the sample session in the browser so refreshes do not erase the demo.

This is not a production transaction system. Local browser state is not authoritative, there is no real authentication, and no external payment, upload or delivery action is created.

## 2. Production target architecture

Keep the approved stack:

- React + Vite PWA on Vercel.
- Supabase Auth for identity and sessions.
- Supabase PostgreSQL for marketplace records, order snapshots, events, ledgers and audit records.
- Cloudflare R2 for listing images and private permitted documents through server-issued short-lived URLs.
- Vercel server-side routes for validation, authorization, price calculations, upload signing, payment verification and admin operations.

The browser may use a publishable Supabase key for appropriately protected reads, but privileged writes must be server-authorized and/or protected by tested RLS policies. No service-role, R2 secret, payment secret or private document URL may reach browser code.

## 3. Delivery phases and gates

### Phase 0 — Repository and environments

**Goal:** establish repeatable development and preview environments.

- Create/connect the Git repository and protect the main branch.
- Add Vercel preview and production projects.
- Create separate Supabase development, preview and production projects or equivalent isolated environments.
- Configure `.env.local` only from `.env.example`; keep secrets in the deployment provider.
- Add CI checks for `npm test` and `npm run build`.

**Exit gate:** a clean checkout installs and passes tests/build without private credentials.

### Phase 1 — Database and authentication

**Goal:** replace local demo state with authenticated, server-backed records.

- Add migrations for profiles, roles, categories, material rules, listings, listing images, buyer requirements, orders, order events, delivery agents, vehicles, delivery jobs, payments, commission ledger, disputes and audit logs.
- Enable RLS on all browser-reachable tables.
- Test ownership and role policies for supplier, buyer, delivery agent and admin workflows.
- Add authenticated onboarding and account recovery.
- Preserve the possibility of multiple roles per account unless a later approved decision changes it.

**Exit gate:** a user can sign in, see only permitted records, create/edit only owned listings, and cannot perform another role's protected action.

### Phase 2 — Server-authoritative marketplace

**Goal:** make listing, request, acceptance and stock changes trustworthy.

- Add server-side request validation using a single category-rule module.
- Recalculate item totals, delivery estimates and commissions on the server.
- Snapshot price, quantity, condition, category and delivery terms when the order is accepted.
- Use an atomic transaction or database function to prevent overselling.
- Require an idempotency key for order creation and other retry-sensitive mutations.
- Record append-only order events with actor and timestamp.
- Keep restricted categories blocked in business logic, not merely hidden in UI.

**Exit gate:** concurrency, duplicate-submit, stale-quantity and role-violation tests pass.

### Phase 3 — Secure files and operational delivery

**Goal:** support real listing evidence and delivery operations without exposing secrets.

- Add server-issued R2 upload URLs with MIME, size, filename and ownership checks.
- Store only R2 object keys and metadata in PostgreSQL.
- Keep verification documents private and separately authorized.
- Add delivery-agent and vehicle verification states.
- Add admin assignment of eligible agents/vehicles.
- Record pickup/delivery proof and quantity discrepancy.
- Keep tracking status-based until live location is intentionally designed and tested.

**Exit gate:** upload abuse, unauthorized download, incorrect vehicle assignment and invalid status-transition tests pass.

### Phase 4 — Sandbox payments and reconciliation

**Goal:** demonstrate a provider-backed but non-live payment flow.

- Select a payment provider only after the gateway, settlement, refund and tax requirements are approved.
- Use sandbox credentials in preview and clearly label simulated/sandbox state.
- Create payment intents server-side.
- Verify webhooks with provider signatures and idempotency protection.
- Never store raw card details.
- Reconcile buyer payable, seller commission, seller settlement, delivery charge and agent payout in separate ledger entries.

**Exit gate:** repeated callbacks do not duplicate payments, refunds or payouts; failed payments do not create delivery jobs.

### Phase 5 — Pilot readiness

**Goal:** operate a limited, evidence-based Kopargaon pilot.

- Approve an initial allowed-category list and category-specific safety/compliance review.
- Finalize supplier/buyer/plant/agent verification requirements and retention periods.
- Finalize delivery rate cards, agent compensation, failed-job policy, order acceptance, cancellation, rejection, refund and dispute rules.
- Add support contact, privacy notice, terms, consent and incident-response procedure.
- Establish monitoring, audit review, backups and restore drills.
- Use real pilot partners only after destination, quality and delivery economics are understood.

**Exit gate:** operational owner signs off on legal/compliance, money movement, access control, data retention and support procedures.

### Phase 6 — Controlled production launch

**Goal:** launch narrowly and safely.

- Start with Kopargaon and approved categories only.
- Keep an admin approval path for new categories and bulk destinations.
- Use staged rollout and a rollback plan.
- Monitor order failures, disputes, rejection rate, delivery cost, agent completion and security alerts.
- Do not expand geography or enable live money movement based only on a successful UI demo.

## 4. Decisions required before live transactions

These remain open and must not be invented in code:

- Commission percentage or fixed-rate schedule.
- Delivery rate card, minimum economics and vehicle classes.
- Agent payout and failed-pickup/cancellation compensation.
- Payment gateway, tax treatment, settlement timing and refund/chargeback rules.
- Instant purchase versus request-and-accept categories.
- Category-specific inspection, rejection, return, disposal and dispute outcomes.
- Individual, business, plant and delivery-agent verification requirements.
- Maps/distance provider and notification channel.
- R2 public/private asset policy and document retention.
- Pilot partners, support owner, launch date and operating hours.

## 5. Security release checklist

- [ ] No secret is present in frontend bundles, Git history, logs or committed environment files.
- [ ] RLS policies are enabled and tested for every browser-reachable table.
- [ ] Server authorization checks role, ownership, category eligibility and current state.
- [ ] Order totals and availability are server-derived and atomic.
- [ ] Sensitive mutations and webhooks are idempotent.
- [ ] R2 uploads/downloads are short-lived, authorized and validated.
- [ ] Private verification documents are not public assets.
- [ ] Audit events exclude secrets and unnecessary personal data.
- [ ] Backups, restore tests, monitoring and incident contacts exist.
- [ ] Privacy, terms, refund and dispute documents match actual behaviour.

## 6. Current implementation gap

The current code intentionally stops before backend integration because Supabase, R2, Vercel, payment-provider and commercial policy decisions are not configured or approved. The browser-local adapter is a reversible development boundary. The next implementation milestone should be Phase 0 plus Phase 1 in a real repository with a development Supabase project.
