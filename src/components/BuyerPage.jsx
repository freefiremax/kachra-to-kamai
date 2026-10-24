import { useState } from 'react';
import { categoryRules, statusSteps } from '../data';
import { calculateOrderBreakdown } from '../lib/marketplace';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function BuyerPage({
  listings,
  orders,
  onRequestBuy,
  onOpenPayModal,
  onConfirmReceipt,
  onViewSellerPortal,
}) {
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
    <div className="portal-page buyer-portal">
      {/* Portal Hero Banner */}
      <section className="portal-banner buyer-theme glass-card">
        <div className="portal-banner-content">
          <div className="portal-tag">
            <span className="portal-dot green" />
            <span>BUYER PORTAL · KHAREEDDAR HUB</span>
          </div>
          <h1>
            Source verified scrap, surplus & <span className="gradient-text-emerald">circular materials</span>
          </h1>
          <p>
            Browse verified local batches in Kopargaon, submit purchase requests directly to sellers, pay securely via escrow, and track direct doorstep delivery.
          </p>
          <div className="portal-metrics-row">
            <div className="p-metric glass-panel">
              <strong>{listings.length}</strong>
              <span>Active Batches</span>
            </div>
            <div className="p-metric glass-panel">
              <strong>{orders.length}</strong>
              <span>My Orders</span>
            </div>
            {pendingPaymentOrders.length > 0 && (
              <div className="p-metric highlight-metric glass-panel pulse-subtle" onClick={() => setActiveTab('orders')}>
                <strong>⚡ {pendingPaymentOrders.length}</strong>
                <span>Payment Awaiting Action!</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Tab Switcher */}
        <div className="portal-subnav glass-pills">
          <button
            className={`subnav-btn ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            <span className="btn-icon">🔍</span>
            <span>Browse Materials</span>
            <span className="badge-pill">{listings.length}</span>
          </button>
          <button
            className={`subnav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="btn-icon">📦</span>
            <span>My Purchases</span>
            {pendingPaymentOrders.length > 0 ? (
              <span className="badge-pill urgent-pulse">{pendingPaymentOrders.length} to Pay</span>
            ) : (
              <span className="badge-pill">{orders.length}</span>
            )}
          </button>
        </div>
      </section>

      {/* Main Tab Content */}
      {activeTab === 'browse' && (
        <div className="buyer-browse-view">
          {/* Controls: Search & Categories */}
          <div className="browse-filter-bar">
            <div className="search-input-wrap glass-panel">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cotton stalks, cardboard, plastic crates, scrap..."
                className="portal-search-input"
              />
              {search && (
                <button className="clear-search" onClick={() => setSearch('')}>✕</button>
              )}
            </div>

            <div className="category-pills-row">
              <button
                className={`cat-pill glass-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Materials
              </button>
              {Object.entries(categoryRules)
                .filter(([, cat]) => !cat.blocked)
                .map(([key, cat]) => (
                  <button
                    key={key}
                    className={`cat-pill glass-pill ${selectedCategory === key ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(key)}
                  >
                    <span>{cat.icon}</span> {cat.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Listings Grid */}
          <div className="portal-listing-grid">
            {filteredListings.map((item) => (
              <article key={item.id} className="portal-listing-card glass-card">
                <div className="card-top">
                  <div className="item-icon-avatar glass-panel">{item.image}</div>
                  <div className="item-info">
                    <span className="item-cat-label">
                      {categoryRules[item.category]?.icon} {categoryRules[item.category]?.label}
                    </span>
                    <h3 className="item-title">{item.title}</h3>
                    <span className="item-location">📍 {item.area} · {item.distanceKm} km</span>
                  </div>
                </div>

                <p className="item-desc">{item.description}</p>

                <div className="item-tags">
                  <span className="tag-chip glass-pill">Stock: {item.quantity} {item.unit}</span>
                  <span className="tag-chip condition glass-pill">{item.condition}</span>
                </div>

                <div className="card-bottom">
                  <div className="item-pricing">
                    <span className="price-num">{money.format(item.price)}</span>
                    <span className="price-unit">/{item.unit === 'items' ? 'item' : item.unit}</span>
                  </div>
                  <button
                    className="button button-primary buy-request-btn glow-green"
                    onClick={() => openRequestModal(item)}
                  >
                    <span>Buy / Request</span>
                    <span className="arr">➔</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="buyer-orders-view">
          <div className="orders-section-head">
            <div>
              <h2>My Material Purchase Orders</h2>
              <p>Simple 3-step cycle: 1. Request ➔ 2. Seller Accepts ➔ 3. Pay & Receive Delivery</p>
            </div>
            <button className="button button-ghost glass-btn" onClick={() => setActiveTab('browse')}>
              + Browse More Materials
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="portal-empty-card glass-card">
              <span className="empty-emoji">🛒</span>
              <h3>No purchase orders placed yet</h3>
              <p>Browse our verified scrap and circular listings to send your first purchase request!</p>
              <button className="button button-primary glow-green" onClick={() => setActiveTab('browse')}>
                Explore Available Materials
              </button>
            </div>
          ) : (
            <div className="buyer-orders-list">
              {orders.map((order) => {
                const total = order.itemTotal + order.deliveryFee;
                return (
                  <div key={order.id} className={`buyer-order-card glass-card ${order.status === 'seller_accepted' ? 'action-required' : ''}`}>
                    <div className="order-summary-row">
                      <div className="summary-left">
                        <span className="order-id-tag">Order #{order.id}</span>
                        <h3>{order.listingTitle}</h3>
                        <p className="order-route">
                          {order.quantity} {order.unit} from <strong>{order.seller}</strong> ➔ {order.destination}
                        </p>
                      </div>

                      <div className="summary-right">
                        <div className="order-price-box glass-panel">
                          <span className="label">Total Amount</span>
                          <strong className="total gradient-text">{money.format(total)}</strong>
                          <small>Material: {money.format(order.itemTotal)} + Delivery: {money.format(order.deliveryFee)}</small>
                        </div>
                      </div>
                    </div>

                    {/* Prominent Flow Action Bar */}
                    <div className="order-flow-action-bar">
                      {order.status === 'requested' && (
                        <div className="flow-step-box awaiting-box glass-panel">
                          <div className="step-status-text">
                            <span className="status-badge requested">⏳ Request Sent to Seller</span>
                            <p>Waiting for seller (<strong>{order.seller}</strong>) to accept your buy request.</p>
                          </div>
                          {onViewSellerPortal && (
                            <button
                              className="button button-ghost small glass-btn"
                              onClick={onViewSellerPortal}
                              title="Switch to Seller Portal to simulate accepting"
                            >
                              Open Seller Portal ➔
                            </button>
                          )}
                        </div>
                      )}

                      {order.status === 'seller_accepted' && (
                        <div className="flow-step-box pay-now-box glass-panel glow-amber-panel">
                          <div className="step-status-text">
                            <span className="status-badge accepted">✅ Seller Accepted Your Request!</span>
                            <p>The seller agreed to sell <strong>{order.quantity} {order.unit}</strong>. Please complete payment to dispatch delivery.</p>
                          </div>
                          <button
                            className="button button-primary glowing-pay-btn glow-amber"
                            onClick={() => onOpenPayModal(order)}
                          >
                            <span className="pay-icon">💳</span>
                            <span>PAY {money.format(total)} NOW</span>
                            <span className="arr">➔</span>
                          </button>
                        </div>
                      )}

                      {order.status === 'payment_simulated' && (
                        <div className="flow-step-box paid-box glass-panel">
                          <div className="step-status-text">
                            <span className="status-badge paid">💰 Payment Done · Escrow Protected</span>
                            <p>Order is paid! Delivery fleet notified for dispatch in Kopargaon.</p>
                          </div>
                          <span className="agent-dispatch-pill glass-pill">🚚 Awaiting Fleet Pickup</span>
                        </div>
                      )}

                      {order.status === 'agent_assigned' && (
                        <div className="flow-step-box transit-box glass-panel">
                          <div className="step-status-text">
                            <span className="status-badge transit">🚚 Delivery Agent Assigned</span>
                            <p>Agent assigned and moving toward seller hub for material pickup.</p>
                          </div>
                        </div>
                      )}

                      {order.status === 'picked_up' && (
                        <div className="flow-step-box transit-box glass-panel">
                          <div className="step-status-text">
                            <span className="status-badge transit">📦 In Transit to Your Address</span>
                            <p>Material verified and loaded on vehicle. Approaching destination.</p>
                          </div>
                        </div>
                      )}

                      {order.status === 'delivered' && (
                        <div className="flow-step-box deliver-confirm-box glass-panel">
                          <div className="step-status-text">
                            <span className="status-badge delivered">📍 Consignment Delivered!</span>
                            <p>Delivery agent has dropped the material at your destination.</p>
                          </div>
                          <button
                            className="button button-primary glow-green"
                            onClick={() => onConfirmReceipt(order.id)}
                          >
                            ✓ Confirm Material Receipt
                          </button>
                        </div>
                      )}

                      {order.status === 'completed' && (
                        <div className="flow-step-box complete-box glass-panel">
                          <div className="step-status-text">
                            <span className="status-badge completed">🎉 Completed & Confirmed</span>
                            <p>Material received and verified. Seller settlement released successfully.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress Dots */}
                    <div className="order-timeline-dots">
                      {statusSteps.map(([key, label], idx) => {
                        const currentIdx = statusSteps.findIndex(([k]) => k === order.status);
                        const isDone = idx <= currentIdx;
                        const isCurrent = key === order.status;
                        return (
                          <div key={key} className={`dot-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                            <span className="dot-circle">{isDone ? '✓' : idx + 1}</span>
                            <span className="dot-label">{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Listing Detail & Request Modal */}
      {modalListing && (
        <div className="modal-backdrop glass-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setModalListing(null)}>
          <div className="modal glass-modal" role="dialog">
            <div className="modal-drag-handle" />
            <button className="modal-close" onClick={() => setModalListing(null)}>✕</button>
            <div className="modal-media-panel glass-panel">
              <span className="modal-large-icon">{modalListing.image}</span>
              <span className="modal-float-chip glass-pill">{categoryRules[modalListing.category]?.label}</span>
            </div>
            <div className="modal-body-panel">
              <div className="modal-body-scroll">
                <h2>{modalListing.title}</h2>
                <p className="modal-desc">{modalListing.description}</p>
                <div className="detail-grid">
                  <div className="detail-item glass-panel">
                    <small>Available Stock</small>
                    <strong>{modalListing.quantity} {modalListing.unit}</strong>
                  </div>
                  <div className="detail-item glass-panel">
                    <small>Unit Rate</small>
                    <strong>{money.format(modalListing.price)} / {modalListing.unit}</strong>
                  </div>
                  <div className="detail-item glass-panel">
                    <small>Pickup Area</small>
                    <strong>{modalListing.area}</strong>
                  </div>
                  <div className="detail-item glass-panel">
                    <small>Distance</small>
                    <strong>{modalListing.distanceKm} km</strong>
                  </div>
                </div>

                <form onSubmit={handleSendRequest} className="request-form">
                  <label className="field-group">
                    <span className="field-label">Quantity to Request ({modalListing.unit})</span>
                    <input
                      type="number"
                      min="1"
                      max={modalListing.quantity}
                      value={reqQty}
                      onChange={(e) => setReqQty(e.target.value)}
                      required
                      className="portal-input glass-input"
                    />
                  </label>

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
                      <div className="breakdown glass-panel">
                        <div className="breakdown-row">
                          <span>Material Subtotal</span>
                          <strong>{money.format(bd.itemTotal)}</strong>
                        </div>
                        <div className="breakdown-row">
                          <span>Doorstep Delivery ({modalListing.distanceKm} km)</span>
                          <strong>{money.format(bd.deliveryFee)}</strong>
                        </div>
                        <div className="breakdown-total">
                          <span>Estimated Total</span>
                          <strong>{money.format(bd.buyerTotal)}</strong>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="modal-actions-bar">
                    <button type="submit" className="button button-primary full-width glow-green">
                      <span>Send Buy Request to Seller</span>
                      <span>➔</span>
                    </button>
                  </div>
                  <small className="form-help-text">
                    Seller must review & accept before payment is requested.
                  </small>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
