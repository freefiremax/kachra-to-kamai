import { useState } from 'react';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function AgentPage({
  orders,
  onAcceptDelivery,
  onPickUp,
  onDeliver,
  onViewBuyerPortal,
}) {
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'active' | 'completed'

  // Available consignments are paid orders waiting for driver pickup
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
    <div className="portal-page agent-portal">
      {/* Agent Banner */}
      <section className="portal-banner agent-theme">
        <div className="portal-banner-content">
          <div className="portal-tag">
            <span className="portal-dot blue" />
            <span>DELIVERY FLEET PORTAL · SAARTHI RIDER HUB</span>
          </div>
          <h1>
            Point-to-point scrap & material <span className="highlight-text">transit network</span>
          </h1>
          <p>
            Pick up verified industrial and farm residue batches directly from sellers, navigate direct Kopargaon routes, and earn transparent per-trip delivery payouts.
          </p>
          <div className="portal-metrics-row">
            <div className={`p-metric ${availableOrders.length > 0 ? 'urgent-metric' : ''}`}>
              <strong>{availableOrders.length}</strong>
              <span>Available Pickups</span>
            </div>
            <div className="p-metric">
              <strong>{inProgressOrders.length}</strong>
              <span>Active Runs</span>
            </div>
            <div className="p-metric">
              <strong>{money.format(totalAgentEarnings)}</strong>
              <span>Trip Payouts</span>
            </div>
            <div className="p-metric">
              <strong>{completedOrders.length}</strong>
              <span>Delivered Loads</span>
            </div>
          </div>
        </div>

        {/* Subnav */}
        <div className="portal-subnav">
          <button
            className={`subnav-btn ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            <span className="btn-icon">⚡</span>
            <span>Available for Pickup</span>
            {availableOrders.length > 0 ? (
              <span className="badge-pill urgent-pulse">{availableOrders.length} New</span>
            ) : (
              <span className="badge-pill">0</span>
            )}
          </button>
          <button
            className={`subnav-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <span className="btn-icon">🚚</span>
            <span>Active Deliveries</span>
            <span className="badge-pill">{inProgressOrders.length}</span>
          </button>
          <button
            className={`subnav-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <span className="btn-icon">✓</span>
            <span>Completed Jobs</span>
            <span className="badge-pill">{completedOrders.length}</span>
          </button>
        </div>
      </section>

      {/* Main Tab Views */}
      {activeTab === 'available' && (
        <div className="agent-available-view">
          <div className="section-header-box">
            <div>
              <h2>Available Paid Consignments Ready for Transit</h2>
              <p>Step 4 of process: Buyer has paid. Consignment is ready at seller location for driver pickup.</p>
            </div>
            {availableOrders.length === 0 && onViewBuyerPortal && (
              <button className="button button-ghost small" onClick={onViewBuyerPortal}>
                Check Buyer/Seller to generate paid order ➔
              </button>
            )}
          </div>

          {availableOrders.length === 0 ? (
            <div className="portal-empty-card">
              <span className="empty-emoji">🚚</span>
              <h3>No consignments currently awaiting pickup</h3>
              <p>
                As soon as a buyer completes payment for an accepted order, it will appear here for immediate fleet assignment.
              </p>
              <div className="empty-note">
                💡 <em>Flow reminder: Buyer requests ➔ Seller accepts ➔ Buyer clicks Pay ➔ Consignment appears here!</em>
              </div>
            </div>
          ) : (
            <div className="agent-jobs-grid">
              {availableOrders.map((order) => (
                <div key={order.id} className="agent-job-card">
                  <div className="job-header">
                    <div className="job-badge-row">
                      <span className="job-badge ready">READY FOR PICKUP</span>
                      <span className="job-id">Order #{order.id}</span>
                    </div>
                    <div className="job-payout">
                      <small>Your Delivery Earning</small>
                      <strong>{money.format(order.deliveryFee)}</strong>
                    </div>
                  </div>

                  <h3 className="job-title">{order.listingTitle}</h3>

                  <div className="job-route-box">
                    <div className="route-point">
                      <span className="dot dot-green" />
                      <div>
                        <small>Pickup Point (Seller)</small>
                        <strong>{order.seller}</strong>
                      </div>
                    </div>
                    <div className="route-line">
                      <span className="route-dist">📍 {order.distanceKm} km direct transit</span>
                    </div>
                    <div className="route-point">
                      <span className="dot dot-yellow" />
                      <div>
                        <small>Drop Point (Buyer Destination)</small>
                        <strong>{order.destination}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="job-meta-chips">
                    <span className="chip">Load: {order.quantity} {order.unit}</span>
                    <span className="chip">Est. Weight: {order.quantity} kg</span>
                    <span className="chip">Vehicle: Light Commercial / Mini-Truck</span>
                  </div>

                  <div className="job-action-row">
                    <button
                      className="button button-primary accept-job-btn"
                      onClick={() => {
                        onAcceptDelivery(order.id);
                        setActiveTab('active');
                      }}
                    >
                      <span className="truck-icon">🚚</span>
                      <span>Accept Delivery Consignment</span>
                      <span className="arr">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Tab */}
      {activeTab === 'active' && (
        <div className="agent-active-view">
          <div className="section-header-box">
            <div>
              <h2>Your Active Transit Consignments</h2>
              <p>Log pickup from seller hub and confirm arrival at buyer destination.</p>
            </div>
          </div>

          {inProgressOrders.length === 0 ? (
            <div className="portal-empty-card">
              <span className="empty-emoji">📦</span>
              <h3>No active transit runs right now</h3>
              <p>Switch to "Available for Pickup" to claim a delivery assignment.</p>
              <button className="button button-primary" onClick={() => setActiveTab('available')}>
                View Available Pickups
              </button>
            </div>
          ) : (
            <div className="agent-active-list">
              {inProgressOrders.map((order) => (
                <div key={order.id} className="active-consignment-card">
                  <div className="consign-head">
                    <div>
                      <span className="consign-tag">ACTIVE CONSIGNMENT</span>
                      <h3>{order.listingTitle} ({order.quantity} {order.unit})</h3>
                      <p>Order #{order.id} · Payout: <strong>{money.format(order.deliveryFee)}</strong></p>
                    </div>
                    <div className="consign-state-badge">
                      {order.status === 'agent_assigned' && (
                        <span className="status-badge assigned">En Route to Pickup Hub</span>
                      )}
                      {order.status === 'picked_up' && (
                        <span className="status-badge transit">Loaded & In Transit to Buyer</span>
                      )}
                    </div>
                  </div>

                  <div className="transit-steps-bar">
                    <div className={`t-step ${order.status === 'agent_assigned' || order.status === 'picked_up' ? 'done' : ''}`}>
                      <span className="t-icon">1</span>
                      <div className="t-text">
                        <strong>Dispatch Accepted</strong>
                        <small>Assigned to your vehicle</small>
                      </div>
                    </div>
                    <div className={`t-step ${order.status === 'picked_up' ? 'done' : ''}`}>
                      <span className="t-icon">2</span>
                      <div className="t-text">
                        <strong>Pickup from Seller</strong>
                        <small>{order.seller}</small>
                      </div>
                    </div>
                    <div className="t-step">
                      <span className="t-icon">3</span>
                      <div className="t-text">
                        <strong>Drop at Buyer Destination</strong>
                        <small>{order.destination}</small>
                      </div>
                    </div>
                  </div>

                  <div className="consign-actions">
                    {order.status === 'agent_assigned' && (
                      <button
                        className="button button-primary pickup-btn"
                        onClick={() => onPickUp(order.id)}
                      >
                        <span>📦 Confirm Material Picked Up from Seller</span>
                        <span className="arr">→</span>
                      </button>
                    )}

                    {order.status === 'picked_up' && (
                      <button
                        className="button button-primary deliver-btn"
                        onClick={() => {
                          onDeliver(order.id);
                          setActiveTab('completed');
                        }}
                      >
                        <span>✅ Confirm Drop & Delivery to Buyer</span>
                        <span className="arr">→</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Tab */}
      {activeTab === 'completed' && (
        <div className="agent-completed-view">
          <div className="section-header-box">
            <div>
              <h2>Delivered Consignments & Payout Ledger</h2>
              <p>Point-to-point routes successfully executed in Kopargaon region.</p>
            </div>
          </div>

          {completedOrders.length === 0 ? (
            <div className="portal-empty-card">
              <span className="empty-emoji">📜</span>
              <h3>No completed delivery runs yet</h3>
              <p>Complete your active deliveries to build your transit history and earnings log.</p>
            </div>
          ) : (
            <div className="agent-completed-table">
              {completedOrders.map((order) => (
                <div key={order.id} className="completed-job-row">
                  <div className="comp-left">
                    <span className="comp-check">✓</span>
                    <div>
                      <strong>{order.listingTitle} ({order.quantity} {order.unit})</strong>
                      <p>
                        {order.seller} ➔ {order.destination} ({order.distanceKm} km)
                      </p>
                    </div>
                  </div>
                  <div className="comp-right">
                    <div className="payout-amount">
                      <small>Trip Payout</small>
                      <strong>+{money.format(order.deliveryFee)}</strong>
                    </div>
                    <span className="comp-status-chip">Delivered Successfully</span>
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
