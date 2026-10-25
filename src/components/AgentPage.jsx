import { useState } from 'react';
import { useTranslation } from '../lib/i18n';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function AgentPage({
  orders,
  onAcceptDelivery,
  onPickUp,
  onDeliver,
  onViewBuyerPortal,
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'active' | 'completed'

  const availableOrders = orders.filter((o) => o.status === 'payment_simulated');
  const inProgressOrders = orders.filter(
    (o) => o.status === 'agent_assigned' || o.status === 'picked_up'
  );
  const completedOrders = orders.filter(
    (o) => o.status === 'delivered' || o.status === 'completed'
  );

  const totalAgentEarnings = [...inProgressOrders, ...completedOrders].reduce(
    (sum, o) => sum + (o.deliveryFee || 40),
    0
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* -------------------------------------------------------------
          1. FLEET HERO BANNER
         ------------------------------------------------------------- */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-8 relative overflow-hidden bg-gradient-to-b from-[#f8fbff] via-white to-white">
        <div className="relative z-10">
          {/* Cluster & Role Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-800 text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>DELIVERY FLEET PORTAL · SAARTHI RIDER HUB</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-black text-[#0a3d24] tracking-tight leading-tight mb-3">
            Point-to-Point Material Transit · <span className="text-[#e67e22]">Turn Waste Into Worth</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Pick up verified industrial batches and crop residues from sellers in Kopargaon, navigate optimized direct routes, and earn guaranteed per-trip payouts.
          </p>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 max-w-3xl">
            <div className={`p-4 rounded-2xl bg-white border shadow-xs ${availableOrders.length > 0 ? 'border-blue-400 ring-2 ring-blue-400/20' : 'border-slate-200/80'}`}>
              <div className="text-2xl sm:text-3xl font-black text-blue-700">
                {availableOrders.length > 0 ? `⚡ ${availableOrders.length}` : '0'}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-1">Available Pickups</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-slate-800">{inProgressOrders.length}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Active Runs</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-[#0a3d24]">{money.format(totalAgentEarnings)}</div>
              <div className="text-xs font-bold text-emerald-800 mt-1">Trip Kamai Earned</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-slate-800">{completedOrders.length}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Delivered Loads</div>
            </div>
          </div>

          {/* Tab Switcher Pills */}
          <div className="inline-flex p-1.5 rounded-full bg-slate-100 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('available')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'available'
                  ? 'bg-[#0a3d24] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⚡</span>
              <span>Available Pickups</span>
              {availableOrders.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-blue-500 text-white animate-pulse">
                  {availableOrders.length}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200 text-slate-700">0</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-[#0a3d24] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🚚</span>
              <span>Active Deliveries</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'active' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {inProgressOrders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'completed'
                  ? 'bg-[#0a3d24] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>✓</span>
              <span>Completed Jobs</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'completed' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {completedOrders.length}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          2. TAB 1: AVAILABLE PICKUPS
         ------------------------------------------------------------- */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Available Paid Consignments Ready for Transit
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Step 3 of value cycle: Buyer has paid into escrow. Accept consignment to load and drive.
              </p>
            </div>
            {onViewBuyerPortal && (
              <button
                type="button"
                onClick={onViewBuyerPortal}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Simulate Buyer Order ➔
              </button>
            )}
          </div>

          {availableOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <span className="text-4xl">🚚</span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">No pickups waiting right now</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Once a seller accepts a buy request and the buyer completes payment, consignments will appear here for driver assignment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border-2 border-blue-200/90 hover:border-blue-500 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                          Ready For Pickup
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{order.id}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-400">Your Payout: </span>
                        <span className="text-lg font-black text-emerald-700">+{money.format(order.deliveryFee || 40)}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      {order.listingTitle}
                    </h3>

                    {/* Point to Point Route Visualizer */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3 mb-5">
                      <div className="flex items-start gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Pickup Hub (Seller)</div>
                          <div className="text-xs font-bold text-slate-800">{order.seller}</div>
                        </div>
                      </div>

                      <div className="ml-1 pl-3 border-l-2 border-dashed border-slate-300 text-[11px] text-blue-700 font-semibold py-0.5">
                        📍 {order.distanceKm || 5} km direct transit in Kopargaon cluster
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#e67e22] mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Drop Point (Buyer Destination)</div>
                          <div className="text-xs font-bold text-slate-800">{order.destination}</div>
                        </div>
                      </div>
                    </div>

                    {/* Consignment Specs */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-5 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-slate-100 font-semibold">
                        Load: {order.quantity} {order.unit}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-100 font-semibold">
                        Vehicle: Mini-Truck / Tempo
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAcceptDelivery(order.id)}
                    className="w-full py-3 rounded-full bg-[#0a3d24] hover:bg-[#062c19] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🚚 Accept Delivery Consignment</span>
                    <span>➔</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          3. TAB 2: ACTIVE DELIVERIES
         ------------------------------------------------------------- */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Active Runs in Progress
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Consignments currently assigned to you for loading, transit, and doorstep drop-off.
            </p>
          </div>

          {inProgressOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <span className="text-4xl">🚚</span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">No active delivery runs right now</h3>
              <p className="text-xs text-slate-500 mt-1">Accept a paid pickup consignment from the Available tab to start a run.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inProgressOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border-2 border-emerald-500/70 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">ORDER #{order.id}</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {order.status === 'agent_assigned' ? '🚚 En Route to Seller' : '📦 In Transit to Destination'}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mt-1">{order.listingTitle}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pickup from {order.seller} ➔ Drop at {order.destination} ({order.quantity} {order.unit})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.status === 'agent_assigned' && (
                      <button
                        type="button"
                        onClick={() => onPickUp(order.id)}
                        className="px-6 py-3 rounded-full bg-[#0a3d24] hover:bg-[#062c19] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        📦 Confirm Material Loaded at Seller ➔
                      </button>
                    )}

                    {order.status === 'picked_up' && (
                      <button
                        type="button"
                        onClick={() => onDeliver(order.id)}
                        className="px-6 py-3 rounded-full bg-[#0a3d24] hover:bg-[#062c19] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        ✓ Confirm Delivery at Buyer Doorstep ➔
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------
          4. TAB 3: COMPLETED JOBS
         ------------------------------------------------------------- */}
      {activeTab === 'completed' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Delivered Consignments & Settled Earnings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Your historical log of completed runs and doorstep freight settlements.
            </p>
          </div>

          {completedOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <span className="text-4xl">📦</span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">No completed deliveries yet</h3>
              <p className="text-xs text-slate-500 mt-1">Deliver consignments to build your delivery earnings history.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-400">CONSIGNMENT #{order.id}</div>
                    <div className="font-bold text-slate-900 mt-0.5">{order.listingTitle}</div>
                    <div className="text-xs text-slate-500">{order.seller} ➔ {order.destination}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                      Settled
                    </div>
                    <div className="text-base font-black text-[#0a3d24]">+{money.format(order.deliveryFee || 40)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AgentPage;
