import { useState } from 'react';
import { categoryRules } from '../data';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function SellerPage({
  listings,
  orders,
  onAcceptRequest,
  onDeclineRequest,
  onOpenNewListingModal,
  onViewBuyerPortal,
}) {
  const [filterTab, setFilterTab] = useState('requests'); // 'requests' | 'inventory' | 'history'

  const pendingRequests = orders.filter((o) => o.status === 'requested');
  const activeOrders = orders.filter((o) => o.status !== 'requested' && o.status !== 'completed');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const totalKamaiEarned = orders
    .filter((o) => o.status === 'payment_simulated' || o.status === 'agent_assigned' || o.status === 'picked_up' || o.status === 'delivered' || o.status === 'completed')
    .reduce((sum, o) => sum + (o.itemTotal - (o.commission || 0)), 0);

  return (
    <div className="portal-page seller-portal">
      {/* Seller Hero Banner */}
      <section className="portal-banner seller-theme">
        <div className="portal-banner-content">
          <div className="portal-tag">
            <span className="portal-dot orange" />
            <span>SELLER & SUPPLIER PORTAL · VIKRETA DASHBOARD</span>
          </div>
          <h1>
            Monetize industrial waste, agricultural residue & <span className="highlight-text">surplus materials</span>
          </h1>
          <p>
            Receive direct purchase requests from verified local buyers in Kopargaon, approve consignments with 1-click, and get secure bank payouts upon pickup.
          </p>
          <div className="portal-metrics-row">
            <div className={`p-metric ${pendingRequests.length > 0 ? 'urgent-metric' : ''}`}>
              <strong>{pendingRequests.length}</strong>
              <span>New Requests to Accept</span>
            </div>
            <div className="p-metric">
              <strong>{activeOrders.length}</strong>
              <span>Orders In Pipeline</span>
            </div>
            <div className="p-metric">
              <strong>{money.format(totalKamaiEarned)}</strong>
              <span>Net Seller Kamai</span>
            </div>
            <div className="p-metric">
              <strong>{listings.length}</strong>
              <span>Active Listings</span>
            </div>
          </div>
        </div>

        {/* Quick Tabs & CTA */}
        <div className="portal-subnav-row">
          <div className="portal-subnav">
            <button
              className={`subnav-btn ${filterTab === 'requests' ? 'active' : ''}`}
              onClick={() => setFilterTab('requests')}
            >
              <span className="btn-icon">📩</span>
              <span>Incoming Buy Requests</span>
              {pendingRequests.length > 0 ? (
                <span className="badge-pill urgent-pulse">{pendingRequests.length} Pending</span>
              ) : (
                <span className="badge-pill">0</span>
              )}
            </button>
            <button
              className={`subnav-btn ${filterTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setFilterTab('inventory')}
            >
              <span className="btn-icon">📋</span>
              <span>My Material Inventory</span>
              <span className="badge-pill">{listings.length}</span>
            </button>
            <button
              className={`subnav-btn ${filterTab === 'history' ? 'active' : ''}`}
              onClick={() => setFilterTab('history')}
            >
              <span className="btn-icon">🚚</span>
              <span>Fulfillment & Payouts</span>
              <span className="badge-pill">{activeOrders.length + completedOrders.length}</span>
            </button>
          </div>

          <button className="button button-primary new-listing-cta" onClick={onOpenNewListingModal}>
            <span>+ List New Scrap Material</span>
          </button>
        </div>
      </section>

      {/* Main Content Areas */}
      {filterTab === 'requests' && (
        <div className="seller-requests-view">
          <div className="section-header-box">
            <div>
              <h2>Incoming Material Buy Requests</h2>
              <p>Step 2 of process: Review buyer offers and click <strong>Accept Request</strong> so the buyer can pay.</p>
            </div>
            {onViewBuyerPortal && (
              <button className="button button-ghost small" onClick={onViewBuyerPortal}>
                + Submit Test Request as Buyer ➔
              </button>
            )}
          </div>

          {pendingRequests.length === 0 ? (
            <div className="portal-empty-card">
              <span className="empty-emoji">✨</span>
              <h3>All caught up! No pending requests</h3>
              <p>When buyers submit a buy request for any of your listed items, it will instantly appear right here.</p>
              <div className="empty-actions">
                <button className="button button-ghost" onClick={onViewBuyerPortal}>
                  Switch to Buyer Portal to Create a Request ➔
                </button>
              </div>
            </div>
          ) : (
            <div className="seller-requests-grid">
              {pendingRequests.map((order) => {
                const sellerPayout = order.itemTotal - (order.commission || 0);
                return (
                  <div key={order.id} className="seller-request-card">
                    <div className="req-header">
                      <div className="req-header-left">
                        <span className="req-badge">BUY REQUEST</span>
                        <span className="req-id">Order #{order.id}</span>
                      </div>
                      <span className="req-time">{order.createdAt || 'Just now'}</span>
                    </div>

                    <div className="req-body">
                      <h3>{order.listingTitle}</h3>
                      <div className="req-meta-grid">
                        <div className="meta-box">
                          <small>Buyer Profile</small>
                          <strong>{order.buyer || 'Verified Buyer'}</strong>
                          <span>📍 {order.destination}</span>
                        </div>
                        <div className="meta-box">
                          <small>Requested Volume</small>
                          <strong className="qty-highlight">{order.quantity} {order.unit}</strong>
                          <span>Distance: {order.distanceKm} km</span>
                        </div>
                        <div className="meta-box kamai-box">
                          <small>Net Payout to You</small>
                          <strong className="kamai-num">{money.format(sellerPayout)}</strong>
                          <span>Gross: {money.format(order.itemTotal)} (-5% comm.)</span>
                        </div>
                      </div>
                    </div>

                    <div className="req-actions">
                      <button
                        className="button button-primary accept-btn"
                        onClick={() => onAcceptRequest(order.id)}
                      >
                        <span className="check-icon">✓</span>
                        <span>Accept Request & Alert Buyer</span>
                        <span className="arr">→</span>
                      </button>
                      <button
                        className="button button-ghost decline-btn"
                        onClick={() => onDeclineRequest(order.id)}
                      >
                        Decline
                      </button>
                    </div>

                    <div className="req-footer-tip">
                      💡 Upon acceptance, the buyer receives an instant notification to complete payment before pickup is scheduled.
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Inventory Tab */}
      {filterTab === 'inventory' && (
        <div className="seller-inventory-view">
          <div className="section-header-box">
            <div>
              <h2>Listed Waste & Surplus Materials</h2>
              <p>Active consignments advertised to local buyers in Kopargaon region.</p>
            </div>
            <button className="button button-primary small" onClick={onOpenNewListingModal}>
              + Add New Listing
            </button>
          </div>

          <div className="seller-inventory-grid">
            {listings.map((item) => (
              <div key={item.id} className="inventory-card">
                <div className="inv-top">
                  <span className="inv-icon">{item.image}</span>
                  <div>
                    <span className="inv-cat">{categoryRules[item.category]?.label}</span>
                    <h3 className="inv-title">{item.title}</h3>
                  </div>
                </div>
                <p className="inv-desc">{item.description}</p>
                <div className="inv-details">
                  <div className="inv-stat">
                    <small>Stock In Hub</small>
                    <strong>{item.quantity} {item.unit}</strong>
                  </div>
                  <div className="inv-stat">
                    <small>Asking Price</small>
                    <strong>{money.format(item.price)}/{item.unit}</strong>
                  </div>
                  <div className="inv-stat">
                    <small>Location</small>
                    <strong>{item.area}</strong>
                  </div>
                </div>
                <div className="inv-status-chip">
                  <span className="dot dot-green" />
                  <span>{item.availability || 'Live on marketplace'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fulfillment & History Tab */}
      {filterTab === 'history' && (
        <div className="seller-history-view">
          <div className="section-header-box">
            <div>
              <h2>Order Fulfillment & Dispatch Pipeline</h2>
              <p>Track accepted orders from buyer payment through delivery agent pickup and settlement.</p>
            </div>
          </div>

          {activeOrders.length === 0 && completedOrders.length === 0 ? (
            <div className="portal-empty-card">
              <span className="empty-emoji">🚚</span>
              <h3>No accepted orders yet</h3>
              <p>Once you accept an incoming buy request, you will see its fulfillment and delivery status here.</p>
            </div>
          ) : (
            <div className="seller-order-list">
              {[...activeOrders, ...completedOrders].map((order) => {
                const sellerPayout = order.itemTotal - (order.commission || 0);
                return (
                  <div key={order.id} className="seller-pipeline-card">
                    <div className="pipe-left">
                      <div className="pipe-id">
                        <strong>Order #{order.id}</strong>
                        <span>{order.createdAt}</span>
                      </div>
                      <h3>{order.listingTitle} ({order.quantity} {order.unit})</h3>
                      <p className="pipe-route">
                        Pickup: <strong>{order.seller}</strong> ➔ Destination: <strong>{order.destination}</strong>
                      </p>
                    </div>

                    <div className="pipe-mid">
                      <div className="pipe-status-indicator">
                        {order.status === 'seller_accepted' && (
                          <div className="status-badge accepted">
                            <span>⏳ Awaiting Buyer Payment</span>
                            <small>Buyer must click "Pay" to release delivery fleet</small>
                          </div>
                        )}
                        {order.status === 'payment_simulated' && (
                          <div className="status-badge paid">
                            <span>💰 Payment Received (Escrow Hold)</span>
                            <small>Ready for delivery agent pickup</small>
                          </div>
                        )}
                        {order.status === 'agent_assigned' && (
                          <div className="status-badge transit">
                            <span>🚚 Delivery Agent Dispatched</span>
                            <small>Agent is on route to collect from your hub</small>
                          </div>
                        )}
                        {order.status === 'picked_up' && (
                          <div className="status-badge transit">
                            <span>📦 Picked Up by Agent</span>
                            <small>In transit to buyer destination</small>
                          </div>
                        )}
                        {order.status === 'delivered' && (
                          <div className="status-badge delivered">
                            <span>📍 Delivered to Buyer</span>
                            <small>Awaiting buyer confirmation</small>
                          </div>
                        )}
                        {order.status === 'completed' && (
                          <div className="status-badge completed">
                            <span>✅ Completed & Settled</span>
                            <small>Funds transferred to your bank account</small>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pipe-right">
                      <div className="payout-pill">
                        <small>Seller Settlement</small>
                        <strong>{money.format(sellerPayout)}</strong>
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
