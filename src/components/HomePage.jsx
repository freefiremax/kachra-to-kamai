import { useState } from 'react';
import { categoryRules } from '../data';
import { BrandLogo } from './BrandLogo';

export function HomePage({
  listings,
  orders,
  onNavigate,
  onOpenNewListing,
  onRequestBuy,
  onOpenGetStarted,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Category list
  const categories = [
    {
      id: 'all',
      name: 'All Materials',
      icon: '♻️',
      desc: 'Browse entire waste inventory',
    },
    {
      id: 'agricultural',
      name: 'Agricultural Residues',
      icon: '🌾',
      desc: 'Cotton stalks, wheat straw, bagasse & biomass',
      avgPrice: '₹6 - ₹9 / kg',
      badge: 'High Demand',
    },
    {
      id: 'recyclable',
      name: 'Paper & Cardboard',
      icon: '📦',
      desc: 'Corrugated boxes, office paper & craft scrap',
      avgPrice: '₹12 - ₹15 / kg',
      badge: 'Daily Pickup',
    },
    {
      id: 'organic',
      name: 'Organic Surplus',
      icon: '🥬',
      desc: 'APMC fresh produce, vegetable peelings & compost feed',
      avgPrice: '₹5 - ₹8 / kg',
      badge: 'Same-day',
    },
    {
      id: 'reusable',
      name: 'Reusable & Industrial',
      icon: '🔁',
      desc: 'Wooden pallets, metal barrels & packaging',
      avgPrice: '₹150 - ₹500 / unit',
      badge: 'Ready to Reuse',
    },
  ];

  // Filtered listings for the featured section
  const featuredListings = listings.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="home-page-container w-full bg-white text-slate-800">
      {/* -------------------------------------------------------------
          1. HERO SECTION (Exact Match to User Reference Screenshot)
         ------------------------------------------------------------- */}
      <section className="ktk-hero-section">
        <div className="ktk-hero-container">
          <div className="ktk-hero-grid">
            
            {/* Left Column: Hero Content */}
            <div className="ktk-hero-left">
              {/* Region & Status Pill */}
              <div className="ktk-cluster-pill">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Kopargaon Circular Waste Pilot · 100% Traceable</span>
              </div>

              {/* Big Bold Headline matching screenshot */}
              <h1 className="ktk-hero-headline">
                <span className="ktk-headline-dark">Turn Waste</span>
                <span className="ktk-headline-orange">Into Worth</span>
              </h1>

              {/* Subtitle */}
              <p className="ktk-hero-sub">
                A marketplace to buy and sell recyclable and agricultural waste. Connect, recycle and create value together.
              </p>

              {/* Action Buttons matching screenshot */}
              <div className="ktk-hero-actions">
                <button
                  type="button"
                  onClick={() => onNavigate('buyer')}
                  className="ktk-hero-btn-primary"
                >
                  Browse Listings
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('seller')}
                  className="ktk-hero-btn-secondary"
                >
                  Sell Waste
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="ktk-hero-stats">
                <div>
                  <div className="ktk-stat-val text-[#0a3d24]">₹1.85L+</div>
                  <div className="ktk-stat-lbl">Farmer & Seller Kamai</div>
                </div>
                <div>
                  <div className="ktk-stat-val text-[#e67e22]">4,200+ kg</div>
                  <div className="ktk-stat-lbl">Waste Diverted</div>
                </div>
                <div>
                  <div className="ktk-stat-val text-emerald-700">100%</div>
                  <div className="ktk-stat-lbl">Escrow Protected</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual composition */}
            <div className="ktk-hero-right">
              <div className="ktk-hero-visual-card">
                
                {/* Hero Circular Image (Waste Turned Into Worth) */}
                <img
                  src="/hero-recycle.jpg"
                  alt="Kachra To Kamai - Circular recycling of compost, paper, and plastic"
                  className="ktk-hero-img"
                />

                {/* Floating Interactive Live Cards */}
                <div className="ktk-floating-card-1 animate-bounce-subtle">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-lg">
                    🌾
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Cotton Stalks</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">420 kg · ₹6/kg</div>
                  </div>
                </div>

                <div className="ktk-floating-card-2 animate-bounce-subtle-delay">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-lg">
                    📦
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Cardboard Lots</div>
                    <div className="text-[11px] text-amber-600 font-semibold">180 kg · Ready for Pickup</div>
                  </div>
                </div>
              </div>

              {/* Quick Mobile View Drawer Toggle Button */}
              <button
                type="button"
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className="hidden xl:flex absolute -right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-slate-700 p-2.5 rounded-2xl border border-slate-200 shadow-md text-xs font-bold items-center gap-2 transition-all hover:scale-105"
                title="Toggle Mobile Mockup (as seen in screenshot)"
              >
                <span className="text-base">📱</span>
                <span className="writing-mode-vertical">Mobile App View</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          MOBILE APP PREVIEW MODAL / DRAWER (Matching the phone in user image)
         ------------------------------------------------------------- */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-slate-900 p-4 rounded-[42px] shadow-2xl border-4 border-slate-800 max-w-xs w-full">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />

            {/* Simulated Phone Screen */}
            <div className="bg-white rounded-[32px] overflow-hidden p-4 h-[580px] flex flex-col justify-between text-slate-900">
              <div>
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <BrandLogo size="small" showSubtitle={false} />
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Kopargaon
                  </span>
                </div>

                {/* Mobile Search */}
                <div className="mt-3 relative">
                  <input
                    type="text"
                    placeholder="Search scrap, stalks, plastic..."
                    className="w-full text-xs bg-slate-100 border border-slate-200 rounded-full py-2 px-3 pl-8 focus:outline-emerald-600"
                  />
                  <span className="absolute left-2.5 top-2 text-xs text-slate-400">🔍</span>
                </div>

                {/* Mobile Categories Chips */}
                <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-semibold">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-800 text-white whitespace-nowrap">All</span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap">Organic</span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap">Paper</span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap">Plastic</span>
                </div>

                {/* Mobile Items List */}
                <div className="mt-3 space-y-2 overflow-y-auto max-h-[340px] pr-1">
                  {listings.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl p-1.5 bg-white rounded-lg shadow-2xs">{item.image || '📦'}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</div>
                          <div className="text-[10px] text-slate-500">{item.area}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-emerald-700">₹{item.price}/{item.unit}</div>
                        <div className="text-[10px] text-slate-400">{item.quantity} {item.unit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowMobilePreview(false);
                    onNavigate('buyer');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#0a3d24] text-white text-xs font-bold text-center"
                >
                  Open Buyer Marketplace
                </button>
              </div>
            </div>

            {/* Close Mobile Preview Button */}
            <button
              type="button"
              onClick={() => setShowMobilePreview(false)}
              className="mt-3 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl font-bold transition-colors"
            >
              Close Phone Mockup
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          2. WASTE STREAMS & CATEGORIES (Visual Cards)
         ------------------------------------------------------------- */}
      <section className="py-16 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              CIRCULAR STREAMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Explore Waste by Stream
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Every residue has a valuable second life. Discover current batches available for industrial, agricultural, and artisanal reuse.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.filter((c) => c.id !== 'all').map((cat) => {
              const count = listings.filter((l) => l.category === cat.id).length;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    onNavigate('buyer');
                  }}
                  className="group relative bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-500 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl p-3 rounded-2xl bg-slate-50 group-hover:bg-emerald-50 transition-colors">
                        {cat.icon}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/50">
                        {cat.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Available Batches</div>
                      <div className="text-sm font-bold text-slate-900">{count} Active Lots</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-medium">Avg. Value</div>
                      <div className="text-xs font-bold text-emerald-700">{cat.avgPrice}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          3. FEATURED LIVE MARKETPLACE LISTINGS
         ------------------------------------------------------------- */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
                <span>🔥</span>
                <span>READY FOR PICKUP</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
                Featured Live Materials
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Verified stock in Kopargaon ready for immediate procurement.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {['all', 'agricultural', 'recyclable', 'organic'].map((tabKey) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setSelectedCategory(tabKey)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === tabKey
                      ? 'bg-[#0a3d24] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tabKey === 'all'
                    ? 'All'
                    : tabKey === 'agricultural'
                    ? 'Agricultural'
                    : tabKey === 'recyclable'
                    ? 'Paper & Cardboard'
                    : 'Organic'}
                </button>
              ))}
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/80 shadow-xs hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-3xl p-2.5 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform">
                      {item.image || '📦'}
                    </span>
                    <div className="text-right">
                      <span className="text-xl font-black text-[#0a3d24]">₹{item.price}</span>
                      <span className="text-xs text-slate-500 font-medium">/{item.unit}</span>
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mb-2">
                    {item.category}
                  </span>

                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <span>📍</span> {item.area}
                    </span>
                    <span className="font-bold text-slate-700">
                      {item.quantity} {item.unit} left
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onRequestBuy) onRequestBuy(item, Math.min(item.quantity, 20));
                        onNavigate('buyer');
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#0a3d24] hover:bg-[#062c19] text-white text-xs font-bold transition-colors text-center shadow-xs cursor-pointer"
                    >
                      Request Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('buyer')}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => onNavigate('buyer')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm transition-all shadow-xs"
            >
              <span>View All {listings.length} Materials in Kopargaon</span>
              <span>→</span>
            </button>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          4. HOW IT WORKS: THE 4-STEP VALUE CYCLE
         ------------------------------------------------------------- */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              CIRCULAR LOGISTICS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              From Kachra to Kamai in 4 Simple Steps
            </h2>
            <p className="text-slate-600 text-base mt-2">
              We connect waste generators with recyclers and coordinate doorstep delivery with local fleet drivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0a3d24] font-black text-xl flex items-center justify-center mb-5">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900">List or Discover</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Sellers publish agricultural residue or sorted scrap in 30 seconds. Buyers browse verified local batches with guaranteed transparent pricing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700">
                Role: Seller & Buyer
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#e67e22] font-black text-xl flex items-center justify-center mb-5">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900">1-Tap Match & Accept</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  The buyer sends a purchase request. The seller reviews and accepts in one tap, reserving the material batch securely.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-amber-700">
                Role: Seller Approval
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 font-black text-xl flex items-center justify-center mb-5">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900">Escrow & Fleet Dispatch</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Buyer pays into secure escrow. Local delivery agents receive instant pickup notification, drive to the farm or store, and load the consignment.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-700">
                Role: Fleet Driver & Escrow
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 font-black text-xl flex items-center justify-center mb-5">
                  04
                </div>
                <h3 className="text-lg font-bold text-slate-900">Verified Kamai Payout</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Buyer confirms doorstep receipt. Escrow automatically disburses earnings to the seller and driver. Waste transforms into genuine value.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-purple-700">
                Role: Instant Payout
              </div>
            </div>

          </div>

          {/* Interactive Presentation Stage Teaser */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0a3d24] via-[#0f4f30] to-[#0a3d24] text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="text-center lg:text-left">
              <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                LIVE DEMO MODE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-2">
                Want to see the entire 4-way transaction in real time?
              </h3>
              <p className="text-sm text-emerald-100/90 mt-1 max-w-xl">
                Launch the 4-in-1 Stage to watch Buyer, Seller, Delivery Agent, and Admin Ops interact simultaneously on one screen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('presenter')}
              className="px-6 py-3.5 rounded-full bg-[#e67e22] hover:bg-[#d35400] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all whitespace-nowrap cursor-pointer hover:scale-105"
            >
              Launch 4-in-1 Live Stage 🎭
            </button>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          5. ABOUT & IMPACT STORY (The Mission in Kopargaon)
         ------------------------------------------------------------- */}
      <section id="about" className="py-16 lg:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                OUR MISSION
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
                Why Kachra To Kamai?
              </h2>
              <p className="text-slate-600 text-base mt-4 leading-relaxed">
                Across agricultural belts like Kopargaon and industrial corridors across Maharashtra, tons of dry cotton stalks, cardboard cartons, and recyclable byproducts are either dumped, burned, or sold at unfair distress prices.
              </p>
              <p className="text-slate-600 text-base mt-3 leading-relaxed">
                <strong>Kachra To Kamai</strong> creates a transparent, technology-backed circular marketplace where:
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 text-lg">✓</span>
                  <p className="text-sm text-slate-700">
                    <strong>Farmers</strong> earn supplementary income (kamai) from crop residue instead of resorting to stubble burning.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 text-lg">✓</span>
                  <p className="text-sm text-slate-700">
                    <strong>Recyclers & Buyers</strong> get reliable, verified supply batches delivered to their factory gates.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 text-lg">✓</span>
                  <p className="text-sm text-slate-700">
                    <strong>Local Drivers</strong> receive profitable local delivery trips with zero downtime.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 text-lg">✓</span>
                  <p className="text-sm text-slate-700">
                    <strong>Environment</strong> benefits from reduced air pollution and diverted landfill burden.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  PILOT CLUSTER METRICS
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">
                  Kopargaon Community Impact
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs">
                    <div className="text-3xl font-black text-[#0a3d24]">4,200 kg</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Total Residue Diverted</div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs">
                    <div className="text-3xl font-black text-[#e67e22]">₹1,85,000</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Earnings to Sellers</div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs">
                    <div className="text-3xl font-black text-emerald-700">12 Hubs</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Villages Connected</div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs">
                    <div className="text-3xl font-black text-blue-700">100%</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Escrow Payout Success</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-800">Cluster Status: Healthy & Active</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('buyer')}
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    Join Pilot →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          6. FOOTER
         ------------------------------------------------------------- */}
      <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">♻️</span>
                <span className="text-2xl font-black text-white">
                  Kachra<span className="text-emerald-400">To</span><span className="text-amber-400">Kamai</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Turn Waste Into Worth. Connecting farmers, shops, and recyclers into a modern circular economy in Kopargaon, Maharashtra.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Pilot: Kopargaon Hub</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <button type="button" onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('buyer')} className="hover:text-emerald-400 transition-colors">
                    Browse Listings
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('seller')} className="hover:text-emerald-400 transition-colors">
                    Sell Waste
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('agent')} className="hover:text-emerald-400 transition-colors">
                    Fleet Delivery
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Platform Roles
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <button type="button" onClick={() => onNavigate('presenter')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <span>🎭</span> 4-in-1 Stage
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onNavigate('admin')} className="hover:text-emerald-400 transition-colors">
                    Admin Ops
                  </button>
                </li>
                <li>
                  <a href="#about" className="hover:text-emerald-400 transition-colors">
                    About Mission
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Kachra To Kamai. Turn Waste Into Worth. Built for sustainable circular recycling.
          </div>
        </div>
      </footer>

    </div>
  );
}

export default HomePage;
