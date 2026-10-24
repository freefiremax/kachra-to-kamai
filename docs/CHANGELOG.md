# Kachra To Kamai — Changelog

This file is the **authoritative record of every project change**. It must be updated whenever a requirement, decision, workflow, UI, rule, architecture, schema, code, dependency, integration, configuration or deployment changes.

## Mandatory rule

**No project change is complete until its change is documented here in the same task.** Update all affected project documents at the same time. Never silently rewrite history; add a corrective entry when needed. Details are defined in `RULES.md`.

## Entry format

For every change, add a new entry at the top of the history using this template:

```markdown
## YYYY-MM-DD — Short change title
- **Type:** Requirement / Business / UI / Workflow / Architecture / Database / Security / Code / Dependency / Deployment / Documentation / Fix
- **Status:** Proposed / Approved / Implemented / Verified / Deferred
- **Reason:** Why the change was needed.
- **Changes:** Specific decisions or behaviour changed.
- **Files/components affected:** List exact files, modules, tables, APIs, screens or environment settings.
- **Validation:** Tests, review or manual checks performed; explicitly say if none were run.
- **Follow-up / migration:** Required next steps, data migration, compatibility considerations or `None`.
```

Do not mark a change `Implemented` or `Verified` unless that work or check actually occurred. A proposal is not a completed implementation.

---

## 2026-10-24 — Add lightweight CSS 3D visual enhancement layer
- **Type:** UI / Code / Accessibility / Documentation
- **Status:** Verified locally
- **Reason:** Improve the visual identity and perceived quality of the prototype without adding heavy 3D dependencies, changing business behaviour, or harming readability and mobile usability.
- **Changes:** Added reusable CSS 3D material objects for the hero, category cards, listing cards, listing details, order headers, empty state and decorative chips; added 3D order status orbs, delivery vehicle scene, depth-enhanced step markers and profile avatar; retained text labels as the source of truth; added reduced-motion handling and kept 3D decorations aria-hidden where appropriate.
- **Files/components affected:** `src/App.jsx`, `src/styles.css`, `docs/UI.md`, `docs/CHANGELOG.md`.
- **Validation:** `npm test` passed with 4 tests; `npm run build` passed with Vite 8.3.5; browser smoke verification passed on the running mobile viewport for home, order, role and 3D-enhanced visual states. Desktop visual verification remains limited to the production build because the built-in browser viewport was mobile-sized.
- **Follow-up / migration:** Review visual performance on representative low-end Android devices before considering heavier GLB/WebGL assets. No backend, data or migration change.

## 2026-10-24 — Harden demo runtime and define production transition plan
- **Type:** Code / Architecture / Security / Documentation / Dependency / Fix
- **Status:** Verified locally
- **Reason:** Make the prototype usable across refreshes and document a controlled path from the working sample flow to a secure production system without pretending that unresolved commercial or infrastructure decisions are complete.
- **Changes:** Added browser-local persistence for sample listings, orders and selected demo role; added quantity revalidation and stock reduction when a seller accepts a sample order; added runtime-mode/configuration detection; added safe `.env.example`, `.gitignore`, README setup guidance and a production transition plan; documented phased repository, environment, Supabase/Auth, RLS, server-authoritative marketplace, R2, delivery, sandbox payment, pilot and rollout gates; added persistence fallback coverage and a combined `npm run check` command.
- **Files/components affected:** `.gitignore`, `.env.example`, `README.md`, `package.json`, `src/App.jsx`, `src/styles.css`, `src/lib/persistence.js`, `src/lib/runtime.js`, `tests/persistence.test.js`, `docs/SYSTEM_ARCHITECTURE.md`, `docs/PRODUCTION_PLAN.md`, `docs/CHANGELOG.md`.
- **Validation:** `npm test` passed with 4 tests; `npm run build` passed with Vite 8.3.5; browser smoke verification passed for the running local app and runtime-status/profile view. No Supabase, R2, Vercel, authentication, live payment, external delivery assignment or production deployment was tested.
- **Follow-up / migration:** Create/connect the Git repository; provision isolated development/preview/production services; approve commercial rates, payment/settlement, verification, category compliance and dispute rules; implement Phase 1 database/auth/RLS before enabling production mode or real transactions.

## 2026-10-24 — Implement local sample-data marketplace vertical slice
- **Type:** Code / UI / Workflow / Architecture / Dependency / Documentation / Fix
- **Status:** Verified locally
- **Reason:** Begin implementation of the first approved milestone: a responsive, sample-data PWA that demonstrates the core marketplace journey without introducing live payments, real delivery operations, or unapproved commercial policy.
- **Changes:** Added a React + Vite + Tailwind prototype with install metadata and conservative shell caching; implemented yellow non-organic and green organic themes; added sample listings across approved agricultural, organic, recyclable, reusable and furniture categories; blocked restricted materials in listing creation and request flows; added listing discovery, search/filtering, detail view, buyer request, supplier listing, role-switched order progression, delivery-agent/admin demo actions, receipt confirmation, transparent sample delivery/commission breakdowns, empty/error states and accessibility-focused labels/focus styles; isolated demo pricing and validation logic; added automated tests for delivery estimates, fee separation and restricted/incomplete listings; corrected PostCSS configuration for the installed Tailwind version.
- **Files/components affected:** `package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `public/manifest.webmanifest`, `public/icon.svg`, `public/sw.js`, `src/main.jsx`, `src/App.jsx`, `src/data.js`, `src/lib/marketplace.js`, `src/styles.css`, `tests/marketplace.test.js`, `docs/SYSTEM_ARCHITECTURE.md`, `docs/CHANGELOG.md`.
- **Validation:** `npm test` passed with 3 tests; `npm run build` passed with Vite 8.3.5. No Supabase, R2, Vercel, authentication, live payment, external delivery assignment or production deployment was tested.
- **Follow-up / migration:** Connect the actual Git repository; replace local state with Supabase/Auth-backed records and server-side authorization; add R2 upload signing; define and approve commercial rate cards, order/refund rules, verification and payment settlement before live-like flows; add role/RLS, quantity-concurrency, upload-security and browser workflow tests.

## 2026-10-24 — Initial project documentation baseline
- **Type:** Documentation / Business / Architecture / UI / Workflow / Security
- **Status:** Approved baseline for planning; implementation not started
- **Reason:** Consolidate project decisions into a single consistent reference set before building the prototype.
- **Changes:** Established the product name **Kachra To Kamai**; multi-category marketplace vision; Kopargaon prototype area; own-vehicle delivery-agent network; seller-set material prices; seller-paid commission; buyer-paid delivery; delivery pricing based on distance, weight and vehicle type; additional bulk logistics charges; buyer payment through the platform intended; different verification by user/business/plant type; category-specific rejection rules; direct delivery default with multi-supplier pickup for confirmed bulk orders; prohibited hazardous/chemical/medicine categories; yellow non-organic and green organic UI; React + Vite PWA, Tailwind CSS, Vercel, Supabase PostgreSQL/Auth and Cloudflare R2; sample-data end-to-end demo target; Android packaging to be evaluated later.
- **Files/components affected:** `PRD.md`, `SYSTEM_OVERVIEW.md`, `SYSTEM_ARCHITECTURE.md`, `WORKFLOW.md`, `UI.md`, `RULES.md`, `CHANGELOG.md`.
- **Validation:** Documentation consistency review only. No application code, deployment, live payment, database schema or live transaction has been implemented or tested.
- **Follow-up / migration:** Finalise commission and agent rate cards, delivery pricing formula, payment gateway and settlement, order acceptance flow, rejection/refund policy, category-specific eligibility and compliance, verification requirements, detailed schema/API, maps provider, team/timeline and pilot participants.
