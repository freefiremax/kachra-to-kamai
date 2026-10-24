# Kachra To Kamai — Product Requirements Document (PRD)

- **Document version:** 0.1.0
- **Status:** Draft baseline for prototype planning
- **Last updated:** 2026-10-24
- **Project:** PRAGYAN 2K26 · Track 4 · PS 4-02
- **Prototype area:** Kopargaon, Maharashtra, India

## 1. Product summary

**Kachra To Kamai** is a multi-category marketplace that connects people and organizations with surplus, reusable, recyclable, or otherwise suitable waste/by-product materials to buyers who can use them. The platform coordinates order requests, pickup, delivery, and—where suitable—multi-supplier collection for bulk buyers or processing plants.

The long-term vision is pan-India. The first build is a responsive Progressive Web App (PWA) for a working end-to-end demo using sample data. The prototype should demonstrate the full transaction flow for the categories it allows, while blocking prohibited or not-yet-approved materials.

**Working tagline:** “Waste se value. Value se kamai.”

## 2. Problem statement and opportunity

Material suppliers can be fragmented across farms, homes, shops and industries. Buyers may need material in a particular quantity, condition, location, or quality grade. Collection and transport may cost more than low-value material is worth. A digital listing alone does not guarantee a viable buyer, suitable quality, economical delivery, or a beneficial final destination.

The project should address the PS 4-02 criteria with evidence: material availability, quality consistency, buyer demand, collection economics, and environmental additionality. The product must not claim that every recycled or recovered material is automatically sustainable.

## 3. Product goals

1. Provide one marketplace for approved categories of waste, surplus products, and by-products.
2. Let suppliers publish listings with enough detail for a buyer to assess suitability.
3. Let buyers browse listings or submit material requirements.
4. Support seller acceptance, delivery-cost calculation, delivery-agent assignment, pickup, delivery and receipt confirmation.
5. Support direct transactions and suitable bulk orders assembled from more than one supplier.
6. Calculate seller commission, buyer delivery charge, and bulk logistics charges transparently.
7. Record quantities, order status, costs, and destination so pilot impact can be measured.
8. Deliver a working end-to-end demo using sample data before enabling real transactions.

## 4. User roles

### 4.1 Supplier / seller
- Create and manage listings.
- Set the material price.
- Provide category, quantity, condition, photos, pickup location, and any relevant material specifications.
- Accept or decline buyer requests.
- Track pickup, delivery, and settlement status.

### 4.2 Buyer
- Browse and search eligible material listings.
- Filter by material category, quantity, condition, price and location where data is available.
- Place a request or order.
- Review item price, delivery charge and other applicable fees before confirming.
- Confirm receipt or raise a category-specific issue.

A user may eventually be able to act as both buyer and seller. Whether this is permitted in one account is an implementation decision to confirm; the data model should not unnecessarily prevent it.

### 4.3 Delivery agent / vehicle-owning partner
- Maintain a profile and eligible vehicle information.
- Receive delivery-job offers or assignments.
- Review pickup, drop-off, load and handling instructions.
- Update job status at pickup and delivery.
- Record proof of pickup/delivery and any discrepancy.
- Receive the agreed payment for completed work under the future agent rate card.

### 4.4 Administrator / operations
- Manage users, categories, listings, orders, material restrictions and disputes.
- Review business or processing-plant verification where required.
- Assign or reassign delivery jobs.
- Inspect payment, commission, refund, and operational records.
- View high-level supply, demand, logistics and pilot-impact metrics.

### 4.5 Business or processing-plant buyer
- Use buyer features with additional business/plant verification where appropriate.
- Specify required material, quantity, quality, delivery location, and schedule.
- Confirm bulk-order terms before collection starts.

## 5. Material scope

The intended marketplace covers these groups, subject to category-specific acceptance rules:

1. **Agricultural residues:** e.g., cotton stalks, soybean residues, sugarcane bagasse, groundnut shells and other suitable crop by-products.
2. **Organic waste and surplus produce:** e.g., suitable unsold vegetables and organic feedstock for an approved use.
3. **Recyclable materials:** e.g., suitable paper, cardboard, metals and accepted plastics.
4. **Reusable household and business items:** e.g., usable surplus products, packaging and furniture.
5. **Industrial by-products and offcuts:** only where the material and intended use are acceptable and handling is lawful.

### Restricted materials

Chemicals, medicines and other hazardous or prohibited materials must not be available for ordinary marketplace transactions. Special-care or regulated categories must remain blocked until their classification, legal requirements, authorised handlers, packaging, transport and acceptance controls are reviewed and approved. **Leftover paint is not automatically accepted**; the earlier paint example is only a concept example pending a material-specific safety and compliance decision.

## 6. Product behaviour and core requirements

### Listings
- A listing includes title, category, description, quantity and unit, seller-set price, condition/grade, photos, pickup area, availability and material-specific fields.
- The system must validate required fields and prevent prohibited categories from being ordered.
- Listing quantity and availability must be updated when an order is confirmed so that the same quantity is not oversold.

### Buyer discovery and requests
- Buyers can browse approved listings and/or post a requirement.
- The platform should match on category, quantity, condition/specification and delivery area when that information exists.
- A match is a recommendation, not a guarantee of quality or supply.

### Order and delivery
- Seller acceptance is required before a requested order is treated as confirmed, unless a future explicitly approved category supports instant purchase.
- Delivery cost must consider distance, weight and vehicle type. The exact rate card is not yet decided.
- The platform assigns eligible delivery agents using their own vehicles; agent compensation rules remain to be finalised.
- Direct supplier-to-buyer / supplier-to-plant delivery is the default. For bulk orders, a delivery route may collect from several suppliers and then go to the confirmed destination. The MVP assumes no company-owned warehouse.
- Order milestones must be recorded: requested, seller accepted, payment pending/confirmed (demo status where simulated), delivery assigned, picked up, delivered, received/issue raised, completed/cancelled/refunded as applicable.

### Organic and bulk handling
- Organic material can be matched to a direct buyer when a suitable buyer and use are available.
- If no direct buyer is available, the platform may explore a bulk offer to a suitable processing facility. The platform must not collect inventory speculatively without a destination and economics review.
- Bulk orders may combine compatible quantities from multiple suppliers, subject to quality, handling, route and buyer requirements.

### Payments and revenue
- The intended business model is seller-paid commission plus buyer-paid delivery.
- Bulk orders may include commission and an additional logistics/aggregation charge.
- The buyer is intended to pay through the platform. For the initial hackathon demo, payment can be simulated or use a payment-gateway sandbox; no live-money processing is assumed.
- Show item price, delivery fee, commission/other fees where relevant, and settlement status transparently. Commission percentages, taxes, gateway, settlement timing and refund mechanics are still open decisions.

### Quality, receipt and disputes
- Acceptance and rejection rules differ by material category.
- The order must record the agreed material specification and quantity before pickup.
- Buyer receipt confirmation should record accepted quantity/condition or a structured issue.
- Refund, return, re-delivery, disposal and cost-allocation rules must be finalised before real transactions.

### Verification
- Verification should differ for individuals, businesses and processing plants.
- The prototype may use clearly labelled sample verification records.
- Do not store identity documents in public file storage. Any necessary documents must be private, access-controlled, and only collected when needed.

## 7. UI and platform requirements

- Brand name: **Kachra To Kamai**.
- UX inspiration: quick-commerce simplicity (search, categories, cards, clear price, cart/request and status) without copying another company's logo, distinctive assets, or exact interface.
- Default non-organic category theme: yellow.
- Organic category theme: green.
- Theme must also use labels/icons, not colour alone.
- Responsive PWA, usable on mobile and desktop.
- Future Android packaging can be evaluated after the PWA works; it is not a prerequisite for the first demo.

## 8. Technical baseline

- Frontend: React + Vite PWA.
- Styling: Tailwind CSS.
- Hosting and server-side API: Vercel.
- Database: Supabase PostgreSQL.
- Authentication: Supabase Auth.
- File/object storage: Cloudflare R2.
- Android packaging: evaluate TWA or Capacitor later.

The selected technologies are the current project direction. Exact versions, package choices, database schema, deployment variables and payment provider are not yet locked.

## 9. Non-functional requirements

- **Security:** access control for roles and records; no private keys in frontend code; server-side validation for sensitive mutations.
- **Privacy:** collect only required personal and location data; restrict access to private user and verification details.
- **Reliability:** prevent duplicate order acceptance and overselling through server/database checks.
- **Auditability:** record significant order, delivery, payment and administrative status changes.
- **Accessibility:** readable text, keyboard-accessible controls, visible labels and sufficient contrast.
- **Performance:** optimise listing images and avoid loading every listing/photo at once.
- **Maintainability:** keep business rules and category eligibility centralised rather than scattered across UI components.

## 10. Demo acceptance criteria

The PRAGYAN demo is acceptable when, using labelled sample data:

1. A supplier can create a listing in an approved category.
2. A buyer can discover it and submit a request.
3. The seller can accept or decline.
4. The system can show an item-price and delivery-cost breakdown.
5. An admin can assign an eligible delivery agent/vehicle.
6. The agent can update pickup and delivery states.
7. The buyer can confirm receipt or record an issue.
8. The platform can show commission and agent-payment calculations as demo records.
9. A bulk scenario can collect compatible amounts from multiple suppliers for a confirmed buyer/plant.
10. Prohibited materials are blocked from purchase and assignment.
11. The system records enough data to report material quantity, delivery cost, destination and order outcome.
12. The application works as a responsive web app deployed to Vercel.

## 11. Measures for a future pilot

- Listings created and percentage with a completed transaction.
- Buyer requests fulfilled and repeat-order rate.
- Quantity listed, picked up, accepted and delivered by material category.
- Supplier net proceeds compared with an agreed baseline.
- Delivery cost per order and per kg/tonne.
- Material rejection, cancellation and dispute rates.
- Agent earnings per completed job and on-time delivery rate.
- Verified final destination and environmental impact against a stated baseline.

These are proposed metrics, not claimed results.

## 12. Risks and open decisions

- Commission percentage and bulk pricing model.
- Delivery-agent compensation and failed-job/cancellation policy.
- Distance/weight/vehicle rate card and minimum economically viable order.
- Payment gateway and settlement/refund workflow.
- Exact order-request versus instant-purchase rules.
- Category-specific inspection and rejection rules.
- Initial allowed-category list and regulatory review of each category.
- Verification requirements and privacy retention policy.
- API/database schema, mapping/geocoding provider, notification method and deployment environment variables.
- Team size, delivery date and real pilot partners around Kopargaon.

## 13. Change control

`CHANGELOG.md` is the authoritative history of project changes. Every change to requirements, business rules, UI, architecture, database, code, configuration, integrations, deployment, or project decisions must be recorded there in the same task. A change is not considered complete until its changelog entry is added. See `RULES.md` for the mandatory procedure.
