# Kachra To Kamai — Project and Business Rules

- **Document version:** 0.1.0
- **Status:** Mandatory baseline rules; individual commercial values may remain TBD
- **Last updated:** 2026-10-24

This document contains project rules. A numeric rate, provider, policy or workflow described as **TBD** is not final and must not be invented by implementation.

## 1. Mandatory changelog rule

**Every project change MUST be recorded in `CHANGELOG.md`. This is non-negotiable.**

A change includes (but is not limited to):
- Business decision, requirement, assumption or scope change.
- UI, branding, colour, screen or interaction change.
- Workflow, role, status, validation or acceptance-rule change.
- Database schema, API, architecture, dependency or technology change.
- Security, privacy, category restriction or compliance change.
- Code change, bug fix, refactor or test change.
- Environment variable, integration, hosting or deployment change.
- A decision to add, remove or defer a feature.

Required process:
1. Identify which requirements/documents/code are affected.
2. Make the change.
3. Update all affected documentation in the same task.
4. Append a dated entry to `CHANGELOG.md` before the task is considered complete.
5. State what changed, why, files/components affected, validation performed, and any migration or follow-up required.
6. If a requested change is not implemented, log it as proposed/deferred only when it becomes a project decision or an explicit tracked request; never record it as completed.
7. Do not rewrite history silently. Correct an earlier changelog entry with a new corrective entry rather than deleting the original record.
8. If no files or project artefacts have actually changed, do not claim that a completed code/document change was logged.

**Definition of done:** no project change is complete until its changelog entry and affected documentation are updated.

## 2. Scope and product rules

1. Product name is **Kachra To Kamai**.
2. Prototype area is **Kopargaon, Maharashtra**. Pan-India is the long-term vision, not the current operating footprint.
3. The product is a multi-category marketplace for approved surplus, reusable, recyclable, organic and suitable agricultural/industrial by-product materials.
4. A listing does not guarantee a buyer, material acceptance, profit or environmental benefit.
5. Seller sets material price.
6. Seller pays platform commission; buyer pays delivery charges.
7. Bulk industrial transactions may include both commission and logistics/aggregation charges.
8. Delivery charge calculation must consider distance, weight and vehicle type. The exact rate card is TBD.
9. Delivery is handled by platform-managed agents/partners using their own vehicles; the platform pays them. The payout formula and cancellation compensation are TBD.
10. Direct supplier-to-buyer/plant delivery is the default. Bulk jobs may use a multi-pickup route for a confirmed destination. No company-owned warehouse is assumed for the MVP.
11. Organic waste should be matched to a suitable direct buyer where possible. Bulk processing-plant delivery requires a confirmed suitable destination and an economics/quality check.
12. Sellers, buyers and processing plants have differentiated verification requirements; exact document lists are TBD.
13. The prototype must support a complete sample-data flow for approved categories. Prohibited categories must remain blocked even in the demo.

## 3. Category and safety rules

1. Category eligibility must be enforced in server-side/business logic, not solely hidden in the UI.
2. Chemicals, medicines and other hazardous/prohibited materials are excluded from ordinary marketplace transactions.
3. Leftover paint is not automatically permitted. Keep it blocked until the exact product/category and applicable handling/compliance requirements are reviewed.
4. Regulated categories may only be enabled after documented review of applicable rules, required authorisations, eligible handlers/transport, packaging, destination and recordkeeping.
5. The platform must not create payment or delivery jobs for prohibited listings/orders.
6. Material descriptions must distinguish edible surplus produce from waste intended for processing; intended use and safe handling matter.
7. Do not describe material as “verified”, “safe”, “certified” or “quality-checked” unless the specific check has actually been completed and recorded.
8. The buyer's intended destination must be appropriate for the material. Do not represent delivery to a facility as proof of environmental additionality by itself.

## 4. Marketplace and pricing rules

1. Price unit must be explicit (e.g., per item, kg or tonne).
2. The platform must snapshot agreed item price, quantity, condition/specification and relevant delivery terms on order confirmation.
3. Delivery fee should be displayed separately from material price.
4. Commission, delivery and bulk-logistics fees must be itemised to avoid double charging.
5. Exact commission percentages, minimum fees, taxes, payment gateway and settlement timing are TBD.
6. Do not confirm an order for more than available quantity.
7. Concurrent purchase requests must not result in overselling.
8. Price/fee calculations must be repeated or validated on the server; never trust a total supplied by the frontend.
9. Where the delivered cost is economically unreasonable, show the estimate and allow the order to be revised or declined instead of forcing delivery.
10. Bulk aggregation must be tied to confirmed demand; the MVP must not collect large amounts speculatively without a destination.

## 5. Order and delivery rules

1. Seller acceptance is required before an order is confirmed, unless a future category-specific instant-purchase feature is explicitly approved and logged.
2. Delivery agent/vehicle must meet job requirements for load, distance and material handling.
3. Each important transition must record actor and timestamp.
4. Pickup and delivery quantity discrepancies must be recordable.
5. Buyer receipt must be confirmed or an issue must be raised before the order is marked complete.
6. Category-specific rejection, cancellation, return, disposal, refund and cost allocation rules are required before real transactions. Until finalised, use conservative demo-only outcomes and label them clearly.
7. Agent payment must be derived from the approved rate card; no hard-coded arbitrary payout amounts should be treated as policy.
8. Do not claim live GPS tracking unless it has been implemented and tested. Status-based tracking is the MVP default.

## 6. Payment rules

1. The intended model has buyer payment through the platform, seller commission, buyer-paid delivery, and possible bulk logistics charges.
2. Hackathon demo payments should be simulated or use a payment provider's sandbox until the live payment gateway and settlement rules are approved.
3. Simulated payments must be labelled as simulated.
4. Payment success must be verified server-side through the payment provider in live mode. Never accept a frontend-only success flag as proof of payment.
5. Do not store raw card details.
6. Refund, chargeback, payout and settlement policy/provider are TBD and must be documented before live transactions.

## 7. Security and privacy rules

1. Never commit secrets, API keys, access tokens, passwords or `.env` files containing secrets.
2. Never expose Cloudflare R2 secret credentials, Supabase service-role keys or payment secret keys to browser code.
3. Use role/ownership authorization for every sensitive action and test Supabase RLS policies.
4. Use server-issued, short-lived presigned URLs or an equivalent authorised path for R2 uploads/downloads.
5. Keep identity, business and verification documents private; store only what is necessary and restrict access.
6. Validate and size-limit uploads; use random object keys and restrict allowed MIME types.
7. Collect only required personal/location information; avoid placing private data in logs.
8. Administrative override, commission changes, material eligibility changes and payment reconciliation must be restricted and audited.
9. Keep development, preview and production settings separate.

## 8. Technical rules

1. Frontend: React + Vite PWA.
2. Styling: Tailwind CSS.
3. Hosting and server-side API: Vercel.
4. Database: Supabase PostgreSQL.
5. Authentication: Supabase Auth.
6. File storage: Cloudflare R2.
7. Android packaging is later work; evaluate TWA or Capacitor after the PWA is stable.
8. Structured transaction data belongs in PostgreSQL; files/images belong in R2. Store object keys/metadata in the database.
9. Critical business decisions must not live only in UI components.
10. Use migrations for schema changes and test backward compatibility where relevant.
11. Add automated or documented checks for prohibited categories, authorization, quantity availability and price calculation.
12. Do not add a major dependency or replace an agreed technology without updating impacted documentation and `CHANGELOG.md`.

## 9. UI rules

1. Brand name: Kachra To Kamai.
2. Non-organic active categories use yellow as their primary accent.
3. Organic active category/flows use green as their primary accent.
4. Use labels/icons as well as colour to communicate category.
5. Quick-commerce UX is inspiration only; do not copy another brand's logo or exact distinctive UI.
6. Never show fake ratings, fake verification badges, unsupported quality claims or invented impact numbers.
7. Show clear material quantity/unit, seller price and delivery fee before confirmation.
8. Provide readable mobile layouts, labelled controls, keyboard focus and accessible contrast.

## 10. Evidence and impact rules

1. Published research is a benchmark, not proof of the platform's own impact.
2. Clearly label assumptions, sample/demo data and observed pilot data separately.
3. Record the unit and source for each financial/impact metric.
4. Do not double-count seller earnings, avoided cost and material sale value.
5. Environmental claims require a stated baseline, verified material quantity/destination and a defensible calculation that accounts for transport/processing where relevant.
6. Never promise that every material listed is profitable or environmentally beneficial.

## 11. Required project documents

Keep these documents coherent:
- `PRD.md`
- `SYSTEM_OVERVIEW.md`
- `SYSTEM_ARCHITECTURE.md`
- `WORKFLOW.md`
- `UI.md`
- `RULES.md`
- `CHANGELOG.md`

If a decision affects multiple documents, update every affected file in the same task. `CHANGELOG.md` is authoritative for when and why those changes occurred.
