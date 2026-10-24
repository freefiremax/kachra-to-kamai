# Kachra To Kamai — System Overview

- **Document version:** 0.1.0
- **Status:** Draft baseline
- **Last updated:** 2026-10-24

## 1. Purpose

Kachra To Kamai is a marketplace and logistics-coordination system for approved surplus, reusable, recyclable, organic and agricultural/industrial by-product materials. It connects suppliers with individual, business, and processing-plant buyers and records the transaction from listing to delivery outcome.

## 2. Business model at a glance

- Seller sets the material price.
- Seller pays a platform commission.
- Buyer pays delivery charges calculated from distance, weight and vehicle type.
- Bulk industrial transactions may include commission plus additional logistics/aggregation charges.
- Delivery agents use their own vehicles and are paid according to a rate card that remains to be finalised.
- The default operating model is direct delivery. A bulk delivery can include multiple supplier pickups en route to a confirmed buyer or plant.
- The platform should not purchase and store material speculatively in the MVP.

## 3. Main actors

| Actor | Main responsibilities |
|---|---|
| Supplier | List material, set price, provide accurate quantity/condition, accept requests, prepare material for pickup. |
| Buyer | Search/request material, review price and delivery cost, accept terms, inspect receipt, raise a valid issue. |
| Delivery agent | Use registered vehicle, accept jobs, collect and deliver material, record status and proof. |
| Business / processing plant | Submit material requirements and receive bulk orders; complete additional verification where needed. |
| Admin / operations | Manage eligibility, users, listings, assignments, disputes, transaction records and reporting. |
| Payment provider | Future external service for collecting buyer payment and supporting settlement/refunds; provider is not selected. |

## 4. Primary journeys

### A. Standard marketplace order
1. Supplier creates listing.
2. Buyer discovers the listing and requests the material.
3. Seller accepts/declines.
4. Platform estimates delivery using distance, weight and vehicle type.
5. Buyer reviews final cost and completes demo/sandbox payment.
6. A suitable delivery agent is assigned.
7. Agent records pickup and delivery.
8. Buyer confirms receipt or raises an issue.
9. Platform records commission, delivery expense and transaction outcome.

### B. Organic material: direct buyer
1. Supplier lists eligible organic material and its condition/quantity.
2. Platform matches the listing with a buyer who has an appropriate use.
3. Buyer and seller agree to terms.
4. Delivery is arranged and the buyer confirms receipt.

### C. Bulk collection for a plant
1. A plant posts a verified requirement for a type, grade, quantity and delivery area.
2. Platform identifies compatible eligible suppliers.
3. Operations checks material quality, amount, schedule and delivered-cost economics.
4. Supplier terms are confirmed.
5. A vehicle/route is assigned to collect from more than one supplier if required.
6. Material is delivered to the named plant.
7. The plant confirms accepted quantity and any discrepancy.
8. Payment, commissions, logistics charges and destination records are reconciled.

### D. Restricted material
1. Listing category and material details are checked.
2. If prohibited or not approved for the platform, publication or order creation is blocked.
3. The user receives a clear message. No delivery job or payment should be initiated.

## 5. Data domains

- Identity and role profiles
- Verification status
- Material categories and category rules
- Listings and listing images
- Buyer requirements
- Orders and order line items
- Delivery jobs, agents, vehicles, route and status events
- Payment intents/transactions and refunds
- Seller commissions, delivery charges and agent payouts
- Receipt inspections, rejections and disputes
- Admin/audit events
- Impact measurement and confirmed destination

The exact database schema is to be defined in a separate implementation task.

## 6. Product and colour behaviour

- Brand: **Kachra To Kamai**.
- Organic-category screens use the green theme.
- Non-organic screens use the yellow theme.
- A mixed marketplace can retain a neutral base layout while category cards signal their category; once a user enters an organic category or organic listing, the active primary theme changes to green.
- Category identity must also be conveyed with text/icons, not colour alone.
- Use quick-commerce patterns (search, categories, listing cards, clear prices, cart/request, order status) as UX inspiration without copying another brand's logo or exact interface.

## 7. Technology baseline

| Layer | Selected technology | Responsibility |
|---|---|---|
| Frontend | React + Vite PWA | Responsive supplier, buyer, agent and admin experiences. |
| Styling | Tailwind CSS | Shared design system and yellow/green theme variants. |
| Hosting | Vercel | Web deployment and server-side API routes/functions. |
| Database | Supabase PostgreSQL | Structured marketplace and transaction data. |
| Authentication | Supabase Auth | Sign-in/session foundation; role-specific authorization must be enforced separately. |
| File storage | Cloudflare R2 | Listing photos and permitted uploaded files. |
| Android | TWA or Capacitor to evaluate later | Optional packaging after the PWA is stable. |

## 8. Prototype boundary

The first goal is a working end-to-end demo with sample data, not a nationwide live service. The demo should exercise all approved categories using sample orders, but prohibited categories remain blocked. Payment can be simulated or run in sandbox mode. Actual supplier access, buyer demand, transport pricing and environmental outcomes must be validated before claims about business viability are made.

## 9. Principles

1. Buyer demand should be established before bulk collection begins.
2. Do not promise delivery where cost or vehicle/material compatibility is unknown.
3. Keep regulated/hazardous material outside normal flows until explicitly approved.
4. Keep financial calculations visible and auditable.
5. Keep photos/files in R2 and structured transaction data in PostgreSQL.
6. Do not expose secrets or allow a user to mutate another user's records.
7. Log every project change in `CHANGELOG.md`.

## 10. Related documents

- `PRD.md` — product requirements and acceptance criteria.
- `SYSTEM_ARCHITECTURE.md` — technical architecture and data boundaries.
- `WORKFLOW.md` — detailed operating flows.
- `UI.md` — visual system, screens and interactions.
- `RULES.md` — business, security, development and change-control rules.
- `CHANGELOG.md` — authoritative change history; mandatory for every project change.
