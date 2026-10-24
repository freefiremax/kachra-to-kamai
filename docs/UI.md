# Kachra To Kamai — UI and Design System

- **Document version:** 0.2.0
- **Status:** 3D-enhanced local prototype baseline
- **Last updated:** 2026-10-24

## 1. Brand and design direction

- **Product name:** Kachra To Kamai
- **Working tagline:** Waste se value. Value se kamai.
- **Experience:** Familiar quick-commerce simplicity: search, category browsing, listing cards, clear prices, request/cart actions and order status.
- **Reference:** Blinkit-inspired user experience, but use original layouts, icons, wording and brand assets. Do not copy another company's logo, distinctive illustrations or exact interface.
- **Tone:** Practical, trustworthy, local, straightforward and business-friendly. Avoid exaggerated sustainability claims.

## 2. Theme behaviour

### Non-organic theme — yellow
- Primary accent: **#FFD83D**
- Deep text: **#173D35** or accessible neutral/dark text
- Default for recyclable/reusable materials, furniture, non-organic surplus and other approved non-organic categories.

### Organic theme — green
- Primary accent: **#208347**
- White text on green primary buttons where contrast is sufficient.
- Use for organic waste, suitable surplus produce and agricultural-residue category flows.

### Shared visual foundations
- Main background: warm white / very light neutral.
- Cards: white with restrained borders and soft shadows only where useful.
- Text: dark charcoal/navy with clear hierarchy.
- Rounded cards and buttons, simple line icons, compact badges and consistent spacing.
- Use colour plus category text/icons to make category identity clear; don't rely on colour alone.

The colour should follow the **active category/context**. A mixed homepage may use a neutral layout with yellow as the default accent while the Organic category card remains green. Once the user enters an organic listing/category flow, the active primary theme switches to green.

## 3. Information architecture / primary navigation

Recommended mobile navigation:
1. Home
2. Categories / Search
3. Sell / List material
4. Orders
5. Profile

Navigation and screen permissions depend on the user's role. Delivery agents may have a dedicated job view. Admin pages are not exposed in ordinary user navigation.

## 3A. Lightweight 3D visual layer

The prototype uses CSS 3D rather than heavy WebGL models so the PWA remains responsive on mobile browsers. The 3D layer enhances, but does not replace, the existing information hierarchy.

### Enhanced elements

- Hero waste-to-value object and floating material chips.
- Category objects for agricultural residues, organic surplus, recyclables, reusable items and furniture.
- Listing-card material previews and listing-detail material view.
- Order timeline status orbs and a delivery vehicle scene.
- Supplier form step markers, profile avatar depth, and empty-state illustration.

### Safety and usability rules

- 3D elements are decorative and use `aria-hidden` where they do not convey unique information.
- The adjacent text remains the source of truth for material, price, quantity, status and role.
- No fake live GPS, verification, quality, payment or environmental claim is introduced by a visual.
- Motion is subtle and disabled/reduced under `prefers-reduced-motion`.
- 3D objects must not block buttons, inputs, focus rings, or status text on small screens.
- 3D is implemented with CSS and existing category icons for the prototype; external model downloads and WebGL are deferred until performance evidence supports them.

## 4. Required screens

### Public / shared
- Landing or home screen with Kopargaon prototype context.
- Location selection or delivery-area entry.
- Search and category browser.
- Listing details.
- Sign-in / registration / account recovery.

### Supplier
- Supplier dashboard.
- Create/edit listing.
- Photo upload and material details.
- Incoming buyer request.
- Seller accept/decline actions.
- Order and settlement history.

### Buyer
- Search results and category pages.
- Listing detail with price, quantity, condition and delivery estimate.
- Buyer request/order confirmation.
- Item, delivery and commission/fee breakdown where applicable.
- Order status and receipt confirmation.
- Report issue / dispute form.

### Delivery agent
- Agent profile and vehicle information.
- Available/assigned jobs.
- Job detail with pickup, destination, load and handling notes.
- Pickup confirmation.
- Delivery confirmation and evidence.
- Completed jobs and payout summary.

### Admin / operations
- Overview dashboard.
- User and verification review.
- Category and material eligibility management.
- Listing moderation.
- Orders and delivery assignment.
- Bulk requirements / supplier aggregation view.
- Disputes and payment/commission reconciliation.
- Impact report showing verified quantities and destinations.

## 5. Core page patterns

### Homepage
- Location/prototype area selector.
- Search bar with text such as “Search materials, surplus or by-products”.
- Clear “Buy material” and “List material” actions.
- Category tiles.
- Relevant listings, buyer requirements or nearby supply only where sample/real data exists.
- Organic category has green treatment; non-organic categories use yellow treatment.

### Listing card
- Image or neutral placeholder.
- Material/item name and category badge.
- Available quantity and unit.
- Seller-set price and pricing unit (e.g. per item, kg or tonne).
- Condition/grade, pickup area and availability.
- Clear action: “View details” or “Request”.
- Do not show “verified” unless verification has actually passed.

### Listing detail
- Image gallery, description and specification.
- Quantity available / quantity requested.
- Seller-set price and unit.
- Pickup area, category-specific handling note and eligibility status.
- Delivery estimate as an estimate, not a guarantee, until a route is confirmed.
- Buyer request CTA.

### Order confirmation
- Material subtotal.
- Quantity and price unit.
- Delivery charge and the factors used to calculate it where feasible.
- Commission/other charges shown to the relevant party.
- Total buyer payable.
- Delivery and rejection-policy summary for the selected category.
- Explicit demo/sandbox payment label during the hackathon.

### Order tracking
- Clear step status: Requested → Seller accepted → Payment status → Agent assigned → Picked up → Delivered → Receipt confirmed / Issue raised → Completed.
- Do not show fake live GPS tracking. Status-based tracking is sufficient for the initial prototype unless live location is actually implemented and approved.

## 6. Copy and trust patterns

Use direct labels such as:
- “Available quantity”
- “Price set by seller”
- “Estimated delivery charge”
- “Material condition”
- “Pickup location”
- “Buyer requirements”
- “Order status”
- “Receipt confirmed”

Avoid unsupported claims such as “100% recycled”, “zero waste”, “guaranteed quality”, “verified buyer” or “live tracking” unless the relevant evidence/feature exists.

## 7. Accessibility and responsive behaviour

- Mobile-first with comfortable tap targets.
- Visible focus styles and keyboard navigation.
- Labels for input controls; meaningful alt text for product/material images.
- Readable text and sufficient contrast for yellow/green buttons.
- Status must use text/icons as well as colour.
- Forms should preserve entered values when validation fails.
- Clear empty, loading, error and success states.
- Do not make users rely on colour perception to distinguish organic and non-organic categories.

## 8. Image and file handling in UI

- Listing photos upload to Cloudflare R2 through a secure server-authorised flow.
- Show progress, file-type/size errors and retry controls.
- Never display private verification documents through public links.
- Images need sensible size limits and thumbnail handling for fast listing views.

## 9. PWA requirements

- Installable PWA manifest with correct name, icons, theme colours and start URL.
- Test on common mobile viewport sizes and desktop browsers.
- Any offline behaviour must be intentional; don't allow stale cached stock/order data to be used as authoritative for transactions.
- Android packaging (TWA or Capacitor) is a later evaluation after the web app is stable.

## 10. UI acceptance checklist

- Yellow appears by default for non-organic active categories.
- Green appears when the user enters the organic category/flow.
- Mixed category browsing does not confuse users about active category.
- Supplier, buyer, delivery-agent and admin interfaces are distinguishable.
- Price, quantity, unit and delivery fee are clear before confirmation.
- Restricted categories cannot proceed to checkout.
- Demo/sandbox states are visually identified.
- No invented ratings, fake live tracking, fake verification badges or unsupported impact metrics appear.
- 3D objects enhance visual hierarchy without replacing readable labels or controls.
- 3D animation respects reduced-motion preferences and remains usable on mobile viewports.

## 11. Change tracking

Any brand, colour, component, navigation, screen, interaction, copy or accessibility change must update this file and `CHANGELOG.md` in the same task. See `RULES.md`.
