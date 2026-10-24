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
    <div className="portal-page agent-portal">
      {/* Agent Banner */}
      <section className="portal-banner agent-theme glass-card">
        <div className="portal-banner-content">
          <div className="portal-tag">
            <span className="portal-dot blue" />
            <span>{t('fleetTag')}</span>
          </div>
          <h1>
            {t('fleetPortalTitle')} <span className="gradient-text-blue">{t('transitAndLogistics', 'transit & logistics network')}</span>
          </h1>
          <p>{t('fleetPortalSub')}</p>
          <div className="portal-metrics-row">
            <div className={`p-metric glass-panel ${availableOrders.length > 0 ? 'urgent-metric pulse-subtle' : ''}`}>
              <strong>{availableOrders.length}</strong>
              <span>{t('availablePickups')}</span>
            </div>
            <div className="p-metric glass-panel">
              <strong>{inProgressOrders.length}</strong>
              <span>{t('activeRuns')}</span>
            </div>
            <div className="p-metric glass-panel highlight-metric">
              <strong className="gradient-text-blue">{money.format(totalAgentEarnings)}</strong>
              <span>{t('tripPayouts')}</span>
            </div>
            <div className="p-metric glass-panel">
              <strong>{completedOrders.length}</strong>
              <span>{t('deliveredLoads')}</span>
            </div>
          </div>
        </div>

        {/* Subnav */}
        <div className="portal-subnav glass-pills">
          <button
            className={`subnav-btn ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            <span className="btn-icon">⚡</span>
            <span>{t('availableForPickup')}</span>
            {availableOrders.length > 0 ? (
              <span className="badge-pill urgent-pulse">{availableOrders.length}</span>
            ) : (
              <span className="badge-pill">0</span>
            )}
          </button>
          <button
            className={`subnav-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <span className="btn-icon">🚚</span>
            <span>{t('activeDeliveries')}</span>
            <span className="badge-pill">{inProgressOrders.length}</span>
          </button>
          <button
            className={`subnav-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <span className="btn-icon">✓</span>
            <span>{t('completedJobs')}</span>
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
              <button className="button button-ghost small glass-btn" onClick={onViewBuyerPortal}>
                Check Buyer/Seller to generate paid order ➔
              </button>
            )}
          </div>

          {availableOrders.length === 0 ? (
            <div className="portal-empty-card glass-card">
              <span className="empty-emoji">🚚</span>
              <h3>No consignments currently awaiting pickup</h3>
              <p>
                As soon as a buyer completes payment for an accepted order, it will appear here for immediate fleet assignment.
              </p>
              <div className="empty-note glass-panel">
                💡 <em>Flow reminder: Buyer requests ➔ Seller accepts ➔ Buyer clicks Pay ➔ Consignment appears here!</em>
              </div>
            </div>
          ) : (
            <div className="agent-jobs-grid">
              {availableOrders.map((order) => (
                <div key={order.id} className="agent-job-card glass-card glow-blue-panel">
                  <div className="job-header">
                    <div className="job-badge-row">
                      <span className="job-badge glass-pill">READY FOR PICKUP</span>
                      <span className="job-id">Order #{order.id}</span>
                    </div>
                    <div className="job-payout glass-panel">
                      <small>{t('yourPayout')}</small>
                      <strong className="gradient-text-emerald">+{money.format(order.deliveryFee)}</strong>
                    </div>
                  </div>

                  <h3 className="job-title">{order.listingTitle}</h3>

                  <div className="job-route-box glass-panel">
                    <div className="route-point">
                      <span className="dot dot-green" />
                      <div>
                        <small>{t('pickupPoint')}</small>
                        <strong>{order.seller}</strong>
                      </div>
                    </div>
                    <div className="route-line">
                      <span className="route-dist">📍 {order.distanceKm} km direct transit</span>
                    </div>
                    <div className="route-point">
                      <span className="dot dot-yellow" />
                      <div>
                        <small>{t('dropPoint')}</small>
                        <strong>{order.destination}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="job-meta-chips">
                    <span className="chip glass-pill">Load: {order.quantity} {order.unit}</span>
                    <span className="chip glass-pill">Weight: ~{order.quantity} kg</span>
                    <span className="chip glass-pill">Vehicle: Mini-Truck</span>
                  </div>

                  <div className="job-action-row">
                    <button
                      className="button button-primary accept-job-btn glow-blue"
                      onClick={() => {
                        onAcceptDelivery(order.id);
                        setActiveTab('active');
                      }}
                    >
                      <span className="truck-icon">🚚</span>
                      <span>{t('acceptDelivery')}</span>
                      <span className="arr">➔</span>
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
            <div className="portal-empty-card glass-card">
              <span className="empty-emoji">📦</span>
              <h3>No active transit runs right now</h3>
              <p>Switch to "Available for Pickup" to claim a delivery assignment.</p>
              <button className="button button-primary glow-blue" onClick={() => setActiveTab('available')}>
                View Available Pickups
              </button>
            </div>
          ) : (
            <div className="agent-active-list">
              {inProgressOrders.map((order) => (
                <div key={order.id} className="active-consignment-card glass-card">
                  <div className="consign-head">
                    <div>
                      <span className="consign-tag glass-pill">ACTIVE CONSIGNMENT</span>
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
                    <div className={`t-step glass-panel ${order.status === 'agent_assigned' || order.status === 'picked_up' ? 'done' : ''}`}>
                      <span className="t-icon">1</span>
                      <div className="t-text">
                        <strong>Dispatch Assigned</strong>
                        <small>Ready for route</small>
                      </div>
                    </div>
                    <div className={`t-step glass-panel ${order.status === 'picked_up' ? 'done' : ''}`}>
                      <span className="t-icon">2</span>
                      <div className="t-text">
                        <strong>Pickup from Seller</strong>
                        <small>{order.seller}</small>
                      </div>
                    </div>
                    <div className="t-step glass-panel">
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
                        className="button button-primary pickup-btn glow-blue"
                        onClick={() => onPickUp(order.id)}
                      >
                        <span>📦 {t('confirmPickup')}</span>
                        <span className="arr">➔</span>
                      </button>
                    )}

                    {order.status === 'picked_up' && (
                      <button
                        className="button button-primary deliver-btn glow-green"
                        onClick={() => {
                          onDeliver(order.id);
                          setActiveTab('completed');
                        }}
                      >
                        <span>✅ {t('confirmDrop')}</span>
                        <span className="arr">➔</span>
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
            <div className="portal-empty-card glass-card">
              <span className="empty-emoji">📜</span>
              <h3>No completed delivery runs yet</h3>
              <p>Complete your active deliveries to build your transit history and earnings log.</p>
            </div>
          ) : (
            <div className="agent-completed-table">
              {completedOrders.map((order) => (
                <div key={order.id} className="completed-job-row glass-card">
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
                    <div className="payout-amount glass-panel">
                      <small>Trip Payout</small>
                      <strong className="gradient-text-emerald">+{money.format(order.deliveryFee)}</strong>
                    </div>
                    <span className="comp-status-chip glass-pill">Delivered</span>
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
