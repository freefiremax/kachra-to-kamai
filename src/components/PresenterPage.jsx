import { useState } from 'react';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function PresenterPage({
  listings,
  orders,
  onRequestBuy,
  onAcceptRequest,
  onOpenPayModal,
  onAcceptDelivery,
  onPickUp,
  onDeliver,
  onConfirmReceipt,
  onSwitchPortal,
  onGenerateQuickDemoOrder,
}) {
  const [selectedQuickListing, setSelectedQuickListing] = useState(listings[0]?.id || '');
  const [mobileActiveQuad, setMobileActiveQuad] = useState('all'); // 'all' | 'buyer' | 'seller' | 'agent' | 'admin'

  // Derived counts
  const pendingRequests = orders.filter((o) => o.status === 'requested');
  const awaitingPayment = orders.filter((o) => o.status === 'seller_accepted');
  const readyForPickup = orders.filter((o) => o.status === 'payment_simulated');
  const inTransit = orders.filter((o) => o.status === 'agent_assigned' || o.status === 'picked_up');
  const delivered = orders.filter((o) => o.status === 'delivered');
  const completed = orders.filter((o) => o.status === 'completed');

  function handleQuickRequest() {
    const item = listings.find((l) => l.id === selectedQuickListing) || listings[0];
    if (!item) return;
    onRequestBuy(item, Math.min(item.quantity, 25));
  }

  return (
    <div className="presenter-container">
      {/* Presentation Control Header */}
      <div className="presenter-banner glass-card">
        <div className="presenter-banner-left">
          <div className="live-demo-badge">
            <span className="live-pulse" />
            <span>LIVE 4-PERSONA COLLABORATIVE STAGE</span>
          </div>
          <h1>
            Full Circular Lifecycle <span className="gradient-text">Live Demonstration</span>
          </h1>
          <p>
            Watch all 4 participant interfaces on one screen. Actions in any quadrant immediately trigger live updates across the whole network.
          </p>
        </div>

        <div className="presenter-banner-right">
          <button className="button button-primary quick-sim-btn glass-btn" onClick={onGenerateQuickDemoOrder}>
            <span className="btn-glow" />
            <span>⚡ Generate Test Buy Request</span>
          </button>
        </div>
      </div>

      {/* 4-Step Interactive Flow Progress Ribbon */}
      <div className="flow-ribbon glass-panel">
        <div className={`flow-ribbon-step ${pendingRequests.length > 0 ? 'active-pulse' : ''}`}>
          <div className="step-badge-wrap">
            <span className="step-num">01</span>
            <span className="step-role buyer">🛒 Buyer</span>
          </div>
          <strong>Send Buy Request</strong>
          <small>{pendingRequests.length} pending acceptance</small>
        </div>
        <div className="ribbon-arrow">➔</div>

        <div className={`flow-ribbon-step ${awaitingPayment.length > 0 ? 'active-pulse' : ''}`}>
          <div className="step-badge-wrap">
            <span className="step-num">02</span>
            <span className="step-role seller">📦 Seller</span>
          </div>
          <strong>Accept Request</strong>
          <small>{awaitingPayment.length} ready for payment</small>
        </div>
        <div className="ribbon-arrow">➔</div>

        <div className={`flow-ribbon-step ${readyForPickup.length > 0 ? 'active-pulse' : ''}`}>
          <div className="step-badge-wrap">
            <span className="step-num">03</span>
            <span className="step-role buyer">💳 Buyer</span>
          </div>
          <strong>Pay Now (Escrow)</strong>
          <small>{readyForPickup.length} paid · dispatch ready</small>
        </div>
        <div className="ribbon-arrow">➔</div>

        <div className={`flow-ribbon-step ${inTransit.length > 0 || delivered.length > 0 ? 'active-pulse' : ''}`}>
          <div className="step-badge-wrap">
            <span className="step-num">04</span>
            <span className="step-role agent">🚚 Fleet</span>
          </div>
          <strong>Pickup & Deliver</strong>
          <small>{inTransit.length + delivered.length} in transit / drop</small>
        </div>
      </div>

      {/* Mobile-only Quadrant Tab Segment */}
      <div className="presenter-mobile-tabs">
        <span className="mobile-tabs-label">Focus View:</span>
        <div className="mobile-tabs-pill-row">
          <button
            className={`m-tab-pill ${mobileActiveQuad === 'all' ? 'active' : ''}`}
            onClick={() => setMobileActiveQuad('all')}
          >
            All 4
          </button>
          <button
            className={`m-tab-pill ${mobileActiveQuad === 'buyer' ? 'active' : ''}`}
            onClick={() => setMobileActiveQuad('buyer')}
          >
            🛒 Buyer
          </button>
          <button
            className={`m-tab-pill ${mobileActiveQuad === 'seller' ? 'active' : ''}`}
            onClick={() => setMobileActiveQuad('seller')}
          >
            📦 Seller {pendingRequests.length > 0 && `(${pendingRequests.length})`}
          </button>
          <button
            className={`m-tab-pill ${mobileActiveQuad === 'agent' ? 'active' : ''}`}
            onClick={() => setMobileActiveQuad('agent')}
          >
            🚚 Fleet {readyForPickup.length > 0 && `(${readyForPickup.length})`}
          </button>
          <button
            className={`m-tab-pill ${mobileActiveQuad === 'admin' ? 'active' : ''}`}
            onClick={() => setMobileActiveQuad('admin')}
          >
            ⚙️ Ops
          </button>
        </div>
      </div>

      {/* 4-Quadrant Simultaneous Grid */}
      <div className="presenter-quad-grid">
        {/* QUADRANT 1: BUYER */}
        {(mobileActiveQuad === 'all' || mobileActiveQuad === 'buyer') && (
          <div className="quadrant-card quad-buyer glass-card">
            <div className="quad-header">
              <div className="quad-title">
                <span className="quad-icon">🛒</span>
                <div>
                  <strong>1. Buyer Portal</strong>
                  <small>Browse materials & send buy requests</small>
                </div>
              </div>
              <button className="zoom-btn glass-pill" onClick={() => onSwitchPortal('buyer')}>
                Fullpage ↗
              </button>
            </div>

            <div className="quad-body">
              {/* Quick Request Bar */}
              <div className="quick-buy-box glass-panel">
                <label>Select Item to Buy:</label>
                <div className="quick-select-row">
                  <select
                    value={selectedQuickListing}
                    onChange={(e) => setSelectedQuickListing(e.target.value)}
                    className="quick-select"
                  >
                    {listings.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.image} {item.title} ({money.format(item.price)}/{item.unit})
                      </option>
                    ))}
                  </select>
                  <button className="button button-primary small" onClick={handleQuickRequest}>
                    Send Request ➔
                  </button>
                </div>
              </div>

              {/* Buyer's Orders with Pay Button */}
              <div className="quad-orders-list">
                <span className="quad-subhead">Buyer's Active Orders:</span>
                {orders.length === 0 ? (
                  <p className="quad-empty">No orders yet. Click "Send Request" above!</p>
                ) : (
                  orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="mini-order-row glass-panel">
                      <div className="m-order-info">
                        <strong>#{order.id} - {order.listingTitle}</strong>
                        <small>{order.quantity} {order.unit} · {money.format(order.itemTotal + order.deliveryFee)}</small>
                      </div>

                      {order.status === 'requested' && (
                        <span className="status-badge requested">Waiting Seller</span>
                      )}

                      {order.status === 'seller_accepted' && (
                        <button
                          className="button button-primary tiny pulse-btn glow-amber"
                          onClick={() => onOpenPayModal(order)}
                        >
                          💳 Pay {money.format(order.itemTotal + order.deliveryFee)}
                        </button>
                      )}

                      {order.status === 'payment_simulated' && (
                        <span className="status-badge paid">💰 Paid</span>
                      )}

                      {order.status === 'agent_assigned' && (
                        <span className="status-badge transit">🚚 Agent En Route</span>
                      )}

                      {order.status === 'picked_up' && (
                        <span className="status-badge transit">📦 In Transit</span>
                      )}

                      {order.status === 'delivered' && (
                        <button
                          className="button button-primary tiny"
                          onClick={() => onConfirmReceipt(order.id)}
                        >
                          Confirm Receipt ✓
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <span className="status-badge completed">✓ Completed</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* QUADRANT 2: SELLER */}
        {(mobileActiveQuad === 'all' || mobileActiveQuad === 'seller') && (
          <div className="quadrant-card quad-seller glass-card">
            <div className="quad-header">
              <div className="quad-title">
                <span className="quad-icon">📦</span>
                <div>
                  <strong>2. Seller Portal</strong>
                  <small>Review & accept incoming requests</small>
                </div>
              </div>
              <button className="zoom-btn glass-pill" onClick={() => onSwitchPortal('seller')}>
                Fullpage ↗
              </button>
            </div>

            <div className="quad-body">
              <span className="quad-subhead">
                Incoming Buy Requests ({pendingRequests.length}):
              </span>

              {pendingRequests.length === 0 ? (
                <div className="quad-empty-box glass-panel">
                  <p>No incoming requests awaiting acceptance.</p>
                  <small>Send a buy request in Quadrant 1 to see it appear here!</small>
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div key={req.id} className="mini-request-card glass-panel">
                    <div className="m-req-top">
                      <strong>#{req.id} · {req.listingTitle}</strong>
                      <span className="payout-tag">
                        Kamai: {money.format(req.itemTotal - (req.commission || 0))}
                      </span>
                    </div>
                    <p className="m-req-info">
                      {req.quantity} {req.unit} requested by {req.buyer}
                    </p>
                    <div className="m-req-actions">
                      <button
                        className="button button-primary small accept-btn glow-green"
                        onClick={() => onAcceptRequest(req.id)}
                      >
                        ✓ Accept Request ➔
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Seller's other active orders */}
              {awaitingPayment.length > 0 && (
                <div className="mini-note-box glass-panel">
                  <span>⏳ {awaitingPayment.length} order(s) accepted! Awaiting buyer payment in Quadrant 1.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QUADRANT 3: DELIVERY FLEET */}
        {(mobileActiveQuad === 'all' || mobileActiveQuad === 'agent') && (
          <div className="quadrant-card quad-agent glass-card">
            <div className="quad-header">
              <div className="quad-title">
                <span className="quad-icon">🚚</span>
                <div>
                  <strong>3. Delivery Fleet</strong>
                  <small>Pick up paid consignments & deliver</small>
                </div>
              </div>
              <button className="zoom-btn glass-pill" onClick={() => onSwitchPortal('agent')}>
                Fullpage ↗
              </button>
            </div>

            <div className="quad-body">
              <span className="quad-subhead">
                Available Paid Pickups ({readyForPickup.length}):
              </span>

              {readyForPickup.length === 0 && inTransit.length === 0 ? (
                <div className="quad-empty-box glass-panel">
                  <p>No consignments currently ready for transit.</p>
                  <small>Once a buyer clicks "Pay", the consignment immediately appears here!</small>
                </div>
              ) : (
                <>
                  {readyForPickup.map((order) => (
                    <div key={order.id} className="mini-agent-job glass-panel">
                      <div className="m-job-details">
                        <strong>#{order.id} · {order.listingTitle}</strong>
                        <small>
                          {order.seller} ➔ {order.destination} ({order.distanceKm} km)
                        </small>
                      </div>
                      <button
                        className="button button-primary tiny glow-blue"
                        onClick={() => onAcceptDelivery(order.id)}
                      >
                        🚚 Accept (+{money.format(order.deliveryFee)})
                      </button>
                    </div>
                  ))}

                  {inTransit.map((order) => (
                    <div key={order.id} className="mini-agent-active glass-panel">
                      <div className="active-head">
                        <strong>#{order.id} In Transit</strong>
                        <span className="status-badge transit">{order.status}</span>
                      </div>
                      {order.status === 'agent_assigned' && (
                        <button
                          className="button button-primary tiny full-width"
                          onClick={() => onPickUp(order.id)}
                        >
                          📦 Confirm Picked Up from Seller
                        </button>
                      )}
                      {order.status === 'picked_up' && (
                        <button
                          className="button button-primary tiny full-width"
                          onClick={() => onDeliver(order.id)}
                        >
                          ✅ Mark Delivered to Buyer
                        </button>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* QUADRANT 4: ADMIN / OPS */}
        {(mobileActiveQuad === 'all' || mobileActiveQuad === 'admin') && (
          <div className="quadrant-card quad-admin glass-card">
            <div className="quad-header">
              <div className="quad-title">
                <span className="quad-icon">⚙️</span>
                <div>
                  <strong>4. Operations Dashboard</strong>
                  <small>Real-time telemetry & circular KPIs</small>
                </div>
              </div>
              <button className="zoom-btn glass-pill" onClick={() => onSwitchPortal('admin')}>
                Fullpage ↗
              </button>
            </div>

            <div className="quad-body">
              <div className="mini-admin-stats">
                <div className="m-stat glass-panel">
                  <small>Volume</small>
                  <strong>
                    {orders.reduce((acc, o) => acc + (o.unit === 'kg' ? o.quantity : o.quantity * 10), 0)} kg
                  </strong>
                </div>
                <div className="m-stat glass-panel">
                  <small>GMV</small>
                  <strong>
                    {money.format(orders.reduce((acc, o) => acc + o.itemTotal + (o.deliveryFee || 0), 0))}
                  </strong>
                </div>
                <div className="m-stat glass-panel">
                  <small>Escrow Fee</small>
                  <strong>
                    {money.format(orders.reduce((acc, o) => acc + (o.commission || 0), 0))}
                  </strong>
                </div>
              </div>

              <div className="pipeline-bars glass-panel">
                <span className="quad-subhead">Live Order Distribution:</span>
                <div className="pipe-count-row">
                  <span>1. Requested: <strong>{pendingRequests.length}</strong></span>
                  <span>2. Accepted: <strong>{awaitingPayment.length}</strong></span>
                </div>
                <div className="pipe-count-row">
                  <span>3. Paid: <strong>{readyForPickup.length}</strong></span>
                  <span>4. In Transit: <strong>{inTransit.length}</strong></span>
                </div>
                <div className="pipe-count-row">
                  <span>5. Delivered: <strong>{delivered.length}</strong></span>
                  <span>6. Completed: <strong>{completed.length}</strong></span>
                </div>
              </div>

              <div className="admin-quick-note">
                <span>📍 Verified Circular Pilot: <strong>Kopargaon, Maharashtra</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
