import { useState } from 'react';
import { categoryRules } from '../data';
import { useTranslation } from '../lib/i18n';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function SellerPage({
  listings,
  orders,
  onAcceptRequest,
  onDeclineRequest,
  onOpenNewListingModal,
  onViewBuyerPortal,
}) {
  const { t } = useTranslation();
  const [filterTab, setFilterTab] = useState('requests'); // 'requests' | 'inventory' | 'history'

  const pendingRequests = orders.filter((o) => o.status === 'requested');
  const activeOrders = orders.filter((o) => o.status !== 'requested' && o.status !== 'completed');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const totalKamaiEarned = orders
    .filter((o) => o.status === 'payment_simulated' || o.status === 'agent_assigned' || o.status === 'picked_up' || o.status === 'delivered' || o.status === 'completed')
    .reduce((sum, o) => sum + (o.itemTotal - (o.commission || 0)), 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* -------------------------------------------------------------
          1. SELLER PORTAL HERO BANNER
         ------------------------------------------------------------- */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-8 relative overflow-hidden bg-gradient-to-b from-[#fffdfa] via-white to-white">
        <div className="relative z-10">
          {/* Cluster & Role Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>SELLER & SUPPLIER PORTAL · VIKRETA DASHBOARD</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-black text-[#0a3d24] tracking-tight leading-tight mb-3">
            Monetize Farm & Industrial Scrap · <span className="text-[#e67e22]">Turn Waste Into Worth</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Receive purchase requests directly from local buyers in Kopargaon, approve consignments in 1-tap, and get verified bank payouts upon pickup.
          </p>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 max-w-3xl">
            <div className={`p-4 rounded-2xl bg-white border shadow-xs ${pendingRequests.length > 0 ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200/80'}`}>
              <div className="text-2xl sm:text-3xl font-black text-[#e67e22]">
                {pendingRequests.length > 0 ? `⚡ ${pendingRequests.length}` : '0'}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-1">New Requests to Accept</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-slate-800">{activeOrders.length}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Orders in Pipeline</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-[#0a3d24]">{money.format(totalKamaiEarned)}</div>
              <div className="text-xs font-bold text-emerald-800 mt-1">Net Seller Kamai</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-slate-800">{listings.length}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Active Listings</div>
            </div>
          </div>

          {/* Quick Tabs & CTA Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="inline-flex p-1.5 rounded-full bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setFilterTab('requests')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  filterTab === 'requests'
                    ? 'bg-[#0a3d24] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📩</span>
                <span>Incoming Requests</span>
                {pendingRequests.length > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[11px] bg-amber-500 text-white animate-pulse">
                    {pendingRequests.length}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200 text-slate-700">0</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('inventory')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  filterTab === 'inventory'
                    ? 'bg-[#0a3d24] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📋</span>
                <span>My Inventory</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] ${filterTab === 'inventory' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {listings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('history')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  filterTab === 'history'
                    ? 'bg-[#0a3d24] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🚚</span>
                <span>Pipeline & Payouts</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] ${filterTab === 'history' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {activeOrders.length + completedOrders.length}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenNewListingModal}
              className="px-6 py-3 rounded-full bg-[#0a3d24] hover:bg-[#062c19] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5"
            >
              + List New Scrap
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          2. TAB 1: INCOMING REQUESTS VIEW
         ------------------------------------------------------------- */}
      {filterTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Incoming Material Buy Requests
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Step 2 of value cycle: Review buyer offers and click <strong>Accept Request</strong> so the buyer can pay into escrow.
              </p>
            </div>

            {onViewBuyerPortal && (
              <button
                type="button"
                onClick={onViewBuyerPortal}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                + Submit Test Request as Buyer ➔
              </button>
            )}
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <span className="text-4xl">📩</span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">All requests cleared!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No pending requests right now. New purchase requests from local buyers will appear here in real time.
              </p>
              {onViewBuyerPortal && (
                <button
                  type="button"
                  onClick={onViewBuyerPortal}
                  className="mt-4 px-5 py-2.5 rounded-full bg-[#0a3d24] text-white text-xs font-bold"
                >
                  Create a Demo Buy Request ➔
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.map((order) => {
                const commission = order.commission || Math.round(order.itemTotal * 0.05);
                const sellerNet = order.itemTotal - commission;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border-2 border-amber-300 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 animate-pulse">
                          Buy Request #{order.id}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {order.createdAt || 'Just now'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors mb-4">
                        {order.listingTitle}
                      </h3>

                      {/* Buyer Details & Request Info */}
                      <div className="space-y-3 mb-5">
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400">Buyer Profile</div>
                            <div className="font-bold text-slate-800">{order.buyer}</div>
                          </div>
                          <span className="text-slate-400 text-sm">📍</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] uppercase font-bold text-slate-400">Volume</div>
                            <div className="font-black text-slate-800 text-sm mt-0.5">
                              {order.quantity} {order.unit}
                            </div>
                          </div>

                          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60">
                            <div className="text-[10px] uppercase font-bold text-amber-800">Net Kamai</div>
                            <div className="font-black text-[#e67e22] text-sm mt-0.5">
                              {money.format(sellerNet)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <button
                        type="button"
                        onClick={() => onAcceptRequest(order.id)}
                        className="w-full py-3 rounded-full bg-[#0a3d24] hover:bg-[#062c19] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>✓ Accept Request & Alert Buyer</span>
                        <span>➔</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeclineRequest(order.id)}
                        className="w-full py-2 rounded-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Decline Offer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          3. TAB 2: MY INVENTORY VIEW
         ------------------------------------------------------------- */}
      {filterTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                My Listed Materials & Scrap Lots
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Currently published batches visible to verified buyers across Kopargaon.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenNewListingModal}
              className="px-5 py-2.5 rounded-full bg-[#0a3d24] text-white text-xs font-bold shadow-sm"
            >
              + List Another Material
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                      {item.image || '📦'}
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#0a3d24]">₹{item.price}</div>
                      <div className="text-xs text-slate-400 font-semibold">/{item.unit}</div>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.category}
                  </span>

                  <h3 className="font-bold text-slate-900 text-base mt-2 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-slate-400 font-medium text-[11px]">Remaining</div>
                    <div className="font-bold text-slate-800">{item.quantity} {item.unit}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                    Active in Hub
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          4. TAB 3: PIPELINE & PAYOUTS VIEW
         ------------------------------------------------------------- */}
      {filterTab === 'history' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Order Pipeline & Bank Payouts
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Track consignments from escrow payment to driver pickup and direct bank settlement.
            </p>
          </div>

          {[...activeOrders, ...completedOrders].length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <span className="text-4xl">🚚</span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">No active shipments in pipeline</h3>
              <p className="text-xs text-slate-500 mt-1">Accept incoming requests to start order fulfilment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...activeOrders, ...completedOrders].map((order) => {
                const commission = order.commission || Math.round(order.itemTotal * 0.05);
                const sellerNet = order.itemTotal - commission;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">ORDER #{order.id}</span>
                        <span className="text-xs text-slate-300">·</span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          {order.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mt-1">{order.listingTitle}</h3>
                      <p className="text-xs text-slate-500">
                        {order.quantity} {order.unit} for buyer {order.buyer}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-400 font-semibold uppercase">Net Seller Kamai</div>
                      <div className="text-2xl font-black text-[#e67e22]">{money.format(sellerNet)}</div>
                      <div className="text-[11px] text-slate-400">
                        Gross: {money.format(order.itemTotal)} (minus {money.format(commission)} 5% fee)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SellerPage;
