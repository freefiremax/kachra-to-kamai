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
      <div className="presenter-banner">
        <div className="presenter-banner-left">
          <span className="live-demo-badge">
            <span className="live-pulse" /> LIVE 4-PERSONA SIMULTANEOUS STAGE
          </span>
          <h1>End-to-End Circular Transaction Lifecycle</h1>
          <p>
            Experience all 4 user perspectives simultaneously on one screen. Click an action in one quadrant to watch state ripple instantly across all users!
          </p>
        </div>

        <div className="presenter-banner-right">
          <button className="button button-primary quick-sim-btn" onClick={onGenerateQuickDemoOrder}>
            <span>⚡ Generate Test Buy Request</span>
          </button>
        </div>
      </div>

      {/* 4-Step Interactive Flow Progress Ribbon */}
      <div className="flow-ribbon">
        <div className={`flow-ribbon-step ${pendingRequests.length > 0 ? 'active-pulse' : ''}`}>
          <span className="step-num">Step 1</span>
          <span className="step-role">🛒 Buyer</span>
          <strong>Send Buy Request</strong>
          <small>{pendingRequests.length} pending seller review</small>
        </div>
        <div className="ribbon-arrow">➔</div>

        <div className={`flow-ribbon-step ${awaitingPayment.length > 0 ? 'active-pulse' : ''}`}>
          <span className="step-num">Step 2</span>
          <span className="step-role">📦 Seller</span>
          <strong>Accept Request</strong>
          <small>{awaitingPayment.length} accepted & waiting pay</small>
        </div>
        <div className="ribbon-arrow">➔</div>

        <div className={`flow-ribbon-step ${readyForPickup.length > 0 ? 'active-pulse' : ''}`}>
          <span className="step-num">Step 3</span>
          <span className="step-role">💳 Buyer</span>
          <strong>Pay Now (Escrow)</strong>
          <small>{readyForPickup.length} paid & ready for fleet</small>
        </div>
        <div className="ribbon-arrow">➔</div>

        <div className={`flow-ribbon-step ${inTransit.length > 0 || delivered.length > 0 ? 'active-pulse' : ''}`}>
          <span className="step-num">Step 4</span>
          <span className="step-role">🚚 Delivery Agent</span>
          <strong>Pickup & Deliver</strong>
          <small>{inTransit.length + delivered.length} in transit/delivered</small>
        </div>
      </div>

      {/* 4-Quadrant Simultaneous Grid */}
      <div className="presenter-quad-grid">
        {/* QUADRANT 1: BUYER */}
        <div className="quadrant-card quad-buyer">
          <div className="quad-header">
            <div className="quad-title">
              <span className="quad-icon">🛒</span>
              <div>
                <strong>1. Buyer Portal (Khareeddar)</strong>
                <small>Browse scrap & send buy requests</small>
              </div>
            </div>
            <button className="zoom-btn" onClick={() => onSwitchPortal('buyer')}>
              Open Fullpage ↗
            </button>
          </div>

          <div className="quad-body">
            {/* Quick Request Bar */}
            <div className="quick-buy-box">
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
                  <div key={order.id} className="mini-order-row">
                    <div>
                      <strong>#{order.id} - {order.listingTitle}</strong>
                      <small>{order.quantity} {order.unit} · {money.format(order.itemTotal + order.deliveryFee)}</small>
                    </div>

                    {order.status === 'requested' && (
                      <span className="status-badge requested">Waiting Seller</span>
                    )}

                    {order.status === 'seller_accepted' && (
                      <button
                        className="button button-primary tiny pulse-btn"
                        onClick={() => onOpenPayModal(order)}
                      >
                        💳 Pay {money.format(order.itemTotal + order.deliveryFee)} Now
                      </button>
                    )}

                    {order.status === 'payment_simulated' && (
                      <span className="status-badge paid">💰 Paid!</span>
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

        {/* QUADRANT 2: SELLER */}
        <div className="quadrant-card quad-seller">
          <div className="quad-header">
            <div className="quad-title">
              <span className="quad-icon">📦</span>
              <div>
                <strong>2. Seller Portal (Vikreta)</strong>
                <small>Review & accept incoming requests</small>
              </div>
            </div>
            <button className="zoom-btn" onClick={() => onSwitchPortal('seller')}>
              Open Fullpage ↗
            </button>
          </div>

          <div className="quad-body">
            <span className="quad-subhead">
              Incoming Buy Requests ({pendingRequests.length}):
            </span>

            {pendingRequests.length === 0 ? (
              <div className="quad-empty-box">
                <p>No incoming requests awaiting acceptance.</p>
                <small>Send a buy request in Quadrant 1 to see it appear here!</small>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.id} className="mini-request-card">
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
                      className="button button-primary small accept-btn"
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
              <div className="mini-note-box">
                <span>⏳ {awaitingPayment.length} order(s) accepted! Awaiting buyer payment in Quadrant 1.</span>
              </div>
            )}
          </div>
        </div>

        {/* QUADRANT 3: DELIVERY AGENT */}
        <div className="quadrant-card quad-agent">
          <div className="quad-header">
            <div className="quad-title">
              <span className="quad-icon">🚚</span>
              <div>
                <strong>3. Delivery Fleet (Saarthi Agent)</strong>
                <small>Pick up paid consignments & deliver</small>
              </div>
            </div>
            <button className="zoom-btn" onClick={() => onSwitchPortal('agent')}>
              Open Fullpage ↗
            </button>
          </div>

          <div className="quad-body">
            <span className="quad-subhead">
              Available Paid Pickups ({readyForPickup.length}):
            </span>

            {readyForPickup.length === 0 && inTransit.length === 0 ? (
              <div className="quad-empty-box">
                <p>No consignments currently ready for transit.</p>
                <small>Once a buyer clicks "Pay", the consignment immediately appears here!</small>
              </div>
            ) : (
              <>
                {readyForPickup.map((order) => (
                  <div key={order.id} className="mini-agent-job">
                    <div>
                      <strong>#{order.id} · {order.listingTitle}</strong>
                      <small>
                        {order.seller} ➔ {order.destination} ({order.distanceKm} km)
                      </small>
                    </div>
                    <button
                      className="button button-primary tiny"
                      onClick={() => onAcceptDelivery(order.id)}
                    >
                      🚚 Accept (+{money.format(order.deliveryFee)})
                    </button>
                  </div>
                ))}

                {inTransit.map((order) => (
                  <div key={order.id} className="mini-agent-active">
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

        {/* QUADRANT 4: ADMIN / OPS */}
        <div className="quadrant-card quad-admin">
          <div className="quad-header">
            <div className="quad-title">
              <span className="quad-icon">⚙️</span>
              <div>
                <strong>4. Operations & Platform Oversight</strong>
                <small>Real-time telemetry & circular KPIs</small>
              </div>
            </div>
            <button className="zoom-btn" onClick={() => onSwitchPortal('admin')}>
              Open Fullpage ↗
            </button>
          </div>

          <div className="quad-body">
            <div className="mini-admin-stats">
              <div className="m-stat">
                <small>Total Volume</small>
                <strong>
                  {orders.reduce((acc, o) => acc + (o.unit === 'kg' ? o.quantity : o.quantity * 10), 0)} kg
                </strong>
              </div>
              <div className="m-stat">
                <small>Platform GMV</small>
                <strong>
                  {money.format(orders.reduce((acc, o) => acc + o.itemTotal + (o.deliveryFee || 0), 0))}
                </strong>
              </div>
              <div className="m-stat">
                <small>5% Commission</small>
                <strong>
                  {money.format(orders.reduce((acc, o) => acc + (o.commission || 0), 0))}
                </strong>
              </div>
            </div>

            <div className="pipeline-bars">
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
              <span>📍 Prototype scoped to <strong>Kopargaon, Maharashtra</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
