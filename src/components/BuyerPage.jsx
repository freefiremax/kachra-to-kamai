import { useState } from 'react';
import { categoryRules } from '../data';
import { calculateOrderBreakdown } from '../lib/marketplace';
import { useTranslation } from '../lib/i18n';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function BuyerPage({
  listings,
  orders,
  onRequestBuy,
  onOpenPayModal,
  onConfirmReceipt,
  onViewSellerPortal,
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'orders'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [modalListing, setModalListing] = useState(null);
  const [reqQty, setReqQty] = useState('10');

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      !search ||
      [item.title, item.description, item.area, item.seller].some((val) =>
        val.toLowerCase().includes(search.toLowerCase())
      );
    return matchCat && matchSearch;
  });

  const pendingPaymentOrders = orders.filter((o) => o.status === 'seller_accepted');

  function openRequestModal(listing) {
    setModalListing(listing);
    setReqQty(String(Math.min(listing.quantity, listing.unit === 'items' ? 1 : 25)));
  }

  function handleSendRequest(e) {
    e.preventDefault();
    if (!modalListing) return;
    const q = Number(reqQty);
    if (!q || q <= 0 || q > modalListing.quantity) return;
    onRequestBuy(modalListing, q);
    setModalListing(null);
    setActiveTab('orders');
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* -------------------------------------------------------------
          1. BUYER PORTAL HERO BANNER
         ------------------------------------------------------------- */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-8 relative overflow-hidden bg-gradient-to-b from-[#f9fbf9] via-white to-white">
        <div className="relative z-10">
          {/* Cluster & Role Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>KHAREEDDAR HUB · BUYER MARKETPLACE</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-black text-[#0a3d24] tracking-tight leading-tight mb-3">
            Source Verified Scrap & <span className="text-[#e67e22]">Turn Waste Into Worth</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Browse verified local batches in Kopargaon, submit purchase requests directly to sellers, pay securely via escrow, and track direct doorstep delivery.
          </p>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 max-w-3xl">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-[#0a3d24]">{listings.length}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Active Batches</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-slate-800">{orders.length}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">My Orders</div>
            </div>

            {pendingPaymentOrders.length > 0 ? (
              <div
                onClick={() => setActiveTab('orders')}
                className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 shadow-xs cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <div className="text-2xl sm:text-3xl font-black text-[#e67e22] animate-pulse">
                  ⚡ {pendingPaymentOrders.length}
                </div>
                <div className="text-xs font-bold text-amber-800 mt-1">Payment Pending!</div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">100%</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">Escrow Secured</div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-[#0a3d24]">35-60%</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Avg. Cost Savings</div>
            </div>
          </div>

          {/* Tab Switcher Pills */}
          <div className="inline-flex p-1.5 rounded-full bg-slate-100 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'browse'
                  ? 'bg-[#0a3d24] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔍</span>
              <span>Browse Materials</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'browse' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {listings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-[#0a3d24] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📦</span>
              <span>My Purchases</span>
              {pendingPaymentOrders.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-amber-500 text-white animate-pulse">
                  {pendingPaymentOrders.length} to Pay
                </span>
              ) : (
                <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'orders' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {orders.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          2. TAB CONTENT: BROWSE MATERIALS
         ------------------------------------------------------------- */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search Bar & Category Filter Chips */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cotton stalks, cardboard, plastic crates, APMC surplus..."
                className="w-full py-3.5 pl-12 pr-10 rounded-full bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:border-[#0a3d24] focus:ring-2 focus:ring-emerald-900/10 transition-all placeholder:text-slate-400 font-medium"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#0a3d24] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Materials ({listings.length})
              </button>

              {Object.entries(categoryRules)
                .filter(([, cat]) => !cat.blocked)
                .map(([key, cat]) => {
                  const count = listings.filter((l) => l.category === key).length;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedCategory(key)}
                      className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedCategory === key
                          ? 'bg-[#0a3d24] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                      <span className="opacity-75">({count})</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <span className="text-4xl">🔍</span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">No matching materials found</h3>
              <p className="text-xs text-slate-500 mt-1">Try clearing your search or switching categories.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-full bg-[#0a3d24] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-500/80 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Icon, Category & Price */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                        {item.image || '📦'}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-[#0a3d24]">₹{item.price}</div>
                        <div className="text-xs font-semibold text-slate-400">/{item.unit}</div>
                      </div>
                    </div>

                    {/* Category & Location Badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/50">
                        {categoryRules[item.category]?.label || item.category}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <span>📍</span> {item.area} ({item.distanceKm} km)
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors mb-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Stock & Condition Chips */}
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        Stock: {item.quantity} {item.unit}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold">
                        {item.condition}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-500">
                      Seller: <strong className="text-slate-700">{item.seller}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => openRequestModal(item)}
                      className="px-5 py-2.5 rounded-full bg-[#0a3d24] hover:bg-[#062c19] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Buy / Request ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          3. TAB CONTENT: MY PURCHASES / ORDERS
         ------------------------------------------------------------- */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                My Purchase Orders
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Track your active consignments, complete escrow payments, and confirm doorstep receipt.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              + Browse More Materials
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <span className="text-4xl">🛒</span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">No purchase orders placed yet</h3>
              <p className="text-xs text-slate-500 mt-1">Browse available materials to send your first buy request!</p>
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="mt-4 px-5 py-2.5 rounded-full bg-[#0a3d24] text-white text-xs font-bold"
              >
                Explore Available Materials
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const total = order.itemTotal + order.deliveryFee;
                const isAwaitingPayment = order.status === 'seller_accepted';
                const isDelivered = order.status === 'delivered';
                const isCompleted = order.status === 'completed';

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-3xl border p-6 transition-all duration-300 ${
                      isAwaitingPayment
                        ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20'
                        : 'border-slate-200/90 shadow-xs hover:shadow-md'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-500">
                            ORDER #{order.id}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500 font-medium">
                            {order.createdAt || 'Recent'}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mt-1">
                          {order.listingTitle}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {order.quantity} {order.unit} from <strong className="text-slate-700">{order.seller}</strong> ➔ {order.destination}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Amount</div>
                        <div className="text-2xl font-black text-[#0a3d24]">{money.format(total)}</div>
                        <div className="text-[11px] text-slate-500">
                          Item: {money.format(order.itemTotal)} + Delivery: {money.format(order.deliveryFee)}
                        </div>
                      </div>
                    </div>

                    {/* Visual 4-Step Progress Ribbon */}
                    <div className="py-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center border-b border-slate-100">
                      <div className={`p-2 rounded-xl text-xs font-bold ${order.status ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'}`}>
                        <span>1. Request Sent</span>
                      </div>
                      <div className={`p-2 rounded-xl text-xs font-bold ${['seller_accepted', 'payment_simulated', 'agent_assigned', 'picked_up', 'delivered', 'completed'].includes(order.status) ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'}`}>
                        <span>2. Seller Accepted</span>
                      </div>
                      <div className={`p-2 rounded-xl text-xs font-bold ${['payment_simulated', 'agent_assigned', 'picked_up', 'delivered', 'completed'].includes(order.status) ? 'bg-emerald-50 text-emerald-800' : isAwaitingPayment ? 'bg-amber-100 text-amber-900 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
                        <span>3. Escrow Paid</span>
                      </div>
                      <div className={`p-2 rounded-xl text-xs font-bold ${['delivered', 'completed'].includes(order.status) ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'}`}>
                        <span>4. Received</span>
                      </div>
                    </div>

                    {/* Contextual Action Area */}
                    <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        {order.status === 'requested' && (
                          <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold bg-amber-50 px-3 py-1.5 rounded-full inline-flex">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                            <span>Waiting for seller to review and accept your buy request.</span>
                          </div>
                        )}
                        {isAwaitingPayment && (
                          <div className="flex items-center gap-2 text-xs text-amber-800 font-bold bg-amber-100 px-3 py-1.5 rounded-full inline-flex">
                            <span>⚡</span>
                            <span>Seller accepted! Pay into escrow to schedule doorstep pickup.</span>
                          </div>
                        )}
                        {['payment_simulated', 'agent_assigned', 'picked_up'].includes(order.status) && (
                          <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold bg-blue-50 px-3 py-1.5 rounded-full inline-flex">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span>Payment secured in escrow. Consignment is being loaded by delivery agent.</span>
                          </div>
                        )}
                        {isDelivered && (
                          <div className="flex items-center gap-2 text-xs text-purple-700 font-semibold bg-purple-50 px-3 py-1.5 rounded-full inline-flex">
                            <span>📦</span>
                            <span>Consignment delivered at destination! Please confirm receipt.</span>
                          </div>
                        )}
                        {isCompleted && (
                          <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-full inline-flex">
                            <span>✓</span>
                            <span>Order completed & funds settled! Material successfully recycled.</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {isAwaitingPayment && (
                          <button
                            type="button"
                            onClick={() => onOpenPayModal(order)}
                            className="px-6 py-2.5 rounded-full bg-[#0a3d24] hover:bg-[#062c19] text-white text-xs font-bold shadow-lg shadow-emerald-950/20 hover:shadow-xl transition-all cursor-pointer hover:scale-105"
                          >
                            Pay Securely via Escrow ({money.format(total)}) ➔
                          </button>
                        )}
                        {isDelivered && (
                          <button
                            type="button"
                            onClick={() => onConfirmReceipt(order.id)}
                            className="px-6 py-2.5 rounded-full bg-[#0a3d24] hover:bg-[#062c19] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                          >
                            Confirm Receipt & Release Escrow ➔
                          </button>
                        )}
                        {order.status === 'requested' && onViewSellerPortal && (
                          <button
                            type="button"
                            onClick={onViewSellerPortal}
                            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Switch to Seller Portal to Accept ➔
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          4. BUY REQUEST MODAL (Sleek Dialog)
         ------------------------------------------------------------- */}
      {modalListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-slideUp">
            
            {/* Modal Header */}
            <div className="px-6 pt-6 pb-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {modalListing.category}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  Request to Buy Material
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalListing(null)}
                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold border border-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-bold text-slate-900 text-base">{modalListing.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{modalListing.area} · Seller: {modalListing.seller}</p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-medium">Available Stock</div>
                  <div className="font-bold text-slate-800 mt-0.5">{modalListing.quantity} {modalListing.unit}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-medium">Unit Rate</div>
                  <div className="font-bold text-emerald-700 mt-0.5">₹{modalListing.price} / {modalListing.unit}</div>
                </div>
              </div>

              <form onSubmit={handleSendRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Quantity to Request ({modalListing.unit}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={modalListing.quantity}
                    value={reqQty}
                    onChange={(e) => setReqQty(e.target.value)}
                    required
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#0a3d24] font-semibold"
                  />
                </div>

                {/* Live Breakdown */}
                {(() => {
                  const q = Number(reqQty) || 0;
                  const bd = calculateOrderBreakdown({
                    price: modalListing.price,
                    quantity: q,
                    unit: modalListing.unit,
                    distanceKm: modalListing.distanceKm,
                    weightKg: modalListing.unit === 'kg' ? q : q * 10,
                  });
                  return (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Material Subtotal:</span>
                        <strong>{money.format(bd.itemTotal)}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Doorstep Delivery ({modalListing.distanceKm} km):</span>
                        <strong>{money.format(bd.deliveryFee)}</strong>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                        <span>Estimated Total:</span>
                        <span className="text-[#0a3d24] font-black">{money.format(bd.buyerTotal)}</span>
                      </div>
                    </div>
                  );
                })()}

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#0a3d24] hover:bg-[#062c19] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Send Buy Request to Seller ➔
                </button>

                <p className="text-[11px] text-center text-slate-500">
                  Seller must review & accept before payment is requested.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerPage;
