import { useMemo, useState } from 'react';
import { statusSteps } from '../data';
import { getStatusIndex } from '../lib/marketplace';
import { useTranslation } from '../lib/i18n';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function AdminPage({
  listings,
  orders,
  onResetData,
  onFastForwardOrder,
  onGenerateQuickDemoOrder,
  onOpenPortal,
}) {
  const { t } = useTranslation();
  const [filterStage, setFilterStage] = useState('all');

  // Compute Platform Metrics
  const metrics = useMemo(() => {
    let totalVolumeKg = 0;
    let totalGMV = 0;
    let totalCommission = 0;

    orders.forEach((o) => {
      const vol = o.unit === 'kg' ? o.quantity : o.quantity * 12;
      totalVolumeKg += vol;
      totalGMV += o.itemTotal + (o.deliveryFee || 0);
      totalCommission += o.commission || Math.round(o.itemTotal * 0.05);
    });

    return {
      totalOrders: orders.length,
      totalVolumeKg,
      totalGMV,
      totalCommission,
      activeListingsCount: listings.length,
      co2SavedKg: Math.round(totalVolumeKg * 1.8),
    };
  }, [listings, orders]);

  const filteredOrders = useMemo(() => {
    if (filterStage === 'all') return orders;
    return orders.filter((o) => o.status === filterStage);
  }, [orders, filterStage]);

  return (
    <div className="portal-page admin-portal">
      {/* Admin Banner */}
      <section className="portal-banner admin-theme glass-card">
        <div className="portal-banner-content">
          <div className="portal-tag">
            <span className="portal-dot purple" />
            <span>{t('opsTag')}</span>
          </div>
          <h1>
            {t('opsPortalTitle')} <span className="ktk-headline-orange">Turn Waste Into Worth</span>
          </h1>
          <p>
            Monitor real-time material flows across all four participant types: Buyers, Sellers, Delivery Saarthi Agents, and Regulatory Safety standards.
          </p>

          <div className="portal-metrics-row admin-metrics-grid">
            <div className="p-metric glass-panel">
              <strong>{metrics.totalOrders}</strong>
              <span>{t('transactionsCount')}</span>
            </div>
            <div className="p-metric glass-panel">
              <strong className="gradient-text-emerald">{metrics.totalVolumeKg} kg</strong>
              <span>{t('wasteDiverted')}</span>
            </div>
            <div className="p-metric glass-panel">
              <strong>{money.format(metrics.totalGMV)}</strong>
              <span>{t('platformGMV')}</span>
            </div>
            <div className="p-metric glass-panel highlight-metric">
              <strong className="gradient-text-purple">{money.format(metrics.totalCommission)}</strong>
              <span>{t('escrowCommission')}</span>
            </div>
            <div className="p-metric glass-panel">
              <strong className="text-emerald">~{metrics.co2SavedKg} kg</strong>
              <span>{t('co2Avoidance')}</span>
            </div>
          </div>
        </div>

        {/* Demo Fast-Action Toolbar */}
        <div className="admin-demo-toolbar glass-panel">
          <span className="toolbar-label">DEMO TELEMETRY CONTROLS:</span>
          <button className="button button-primary small glow-purple" onClick={onGenerateQuickDemoOrder}>
            <span>{t('generateDemoRequest')}</span>
          </button>
          <button className="button button-ghost small glass-btn" onClick={onResetData}>
            <span>{t('resetDemo')}</span>
          </button>
        </div>
      </section>

      {/* Visual Lifecycle Pipeline Board */}
      <section className="admin-pipeline-section">
        <div className="section-header-box">
          <div>
            <h2>{t('transactionFlowTitle')}</h2>
            <p>Live visibility across every state from initial buy request to confirmed receipt.</p>
          </div>
        </div>

        <div className="pipeline-columns-grid">
          {statusSteps.map(([statusKey, statusLabel], idx) => {
            const stageOrders = orders.filter((o) => o.status === statusKey);
            return (
              <div key={statusKey} className="pipeline-column glass-card">
                <div className="col-header">
                  <span className="col-step-num">{idx + 1}</span>
                  <div className="col-title-wrap">
                    <strong className="col-title">{statusLabel}</strong>
                    <span className="col-count glass-pill">{stageOrders.length}</span>
                  </div>
                </div>

                <div className="col-cards-wrap">
                  {stageOrders.length === 0 ? (
                    <div className="col-empty-placeholder">No orders at this stage</div>
                  ) : (
                    stageOrders.map((order) => (
                      <div key={order.id} className="col-order-card glass-panel">
                        <div className="c-card-top">
                          <span className="c-order-id">#{order.id}</span>
                          <span className="c-amount gradient-text">{money.format(order.itemTotal + order.deliveryFee)}</span>
                        </div>
                        <strong className="c-card-title">{order.listingTitle}</strong>
                        <p className="c-card-meta">
                          {order.quantity} {order.unit} · {order.seller}
                        </p>
                        <div className="c-card-actions">
                          <button
                            className="fast-forward-btn glass-btn"
                            onClick={() => onFastForwardOrder(order.id)}
                            title="Advance to next step for presentation demo"
                          >
                            <span>{t('fastForward')}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Operational Ledger & Inspection */}
      <section className="admin-ledger-section">
        <div className="section-header-box">
          <div>
            <h2>{t('orderLedgerTitle')}</h2>
            <p>Complete transparent ledger of marketplace activity.</p>
          </div>
          <div className="filter-pill-group">
            <button
              className={`pill-btn glass-pill ${filterStage === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStage('all')}
            >
              {t('all')} ({orders.length})
            </button>
            <button
              className={`pill-btn glass-pill ${filterStage === 'requested' ? 'active' : ''}`}
              onClick={() => setFilterStage('requested')}
            >
              Requested
            </button>
            <button
              className={`pill-btn glass-pill ${filterStage === 'seller_accepted' ? 'active' : ''}`}
              onClick={() => setFilterStage('seller_accepted')}
            >
              Accepted
            </button>
            <button
              className={`pill-btn glass-pill ${filterStage === 'payment_simulated' ? 'active' : ''}`}
              onClick={() => setFilterStage('payment_simulated')}
            >
              Paid
            </button>
            <button
              className={`pill-btn glass-pill ${filterStage === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStage('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="admin-ledger-table-wrap glass-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Material & Volume</th>
                <th>Seller</th>
                <th>Buyer & Drop</th>
                <th>Total</th>
                <th>Platform Fee</th>
                <th>Status</th>
                <th>Quick Jump</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>
                    <div>
                      <strong>{order.listingTitle}</strong>
                      <small className="block text-muted">{order.quantity} {order.unit}</small>
                    </div>
                  </td>
                  <td>{order.seller}</td>
                  <td>{order.destination}</td>
                  <td><strong>{money.format(order.itemTotal + order.deliveryFee)}</strong></td>
                  <td className="commission-cell">+{money.format(order.commission || 0)}</td>
                  <td>
                    <span className={`status-pill ${order.status}`}>
                      {statusSteps.find(([k]) => k === order.status)?.[1] || order.status}
                    </span>
                  </td>
                  <td>
                    <div className="jump-links">
                      {order.status === 'requested' && (
                        <button className="jump-btn glass-btn" onClick={() => onOpenPortal('seller')}>
                          Open Seller ➔
                        </button>
                      )}
                      {order.status === 'seller_accepted' && (
                        <button className="jump-btn pay glow-amber" onClick={() => onOpenPortal('buyer')}>
                          Open Buyer ➔
                        </button>
                      )}
                      {order.status === 'payment_simulated' && (
                        <button className="jump-btn agent glow-blue" onClick={() => onOpenPortal('agent')}>
                          Open Fleet ➔
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button className="jump-btn glass-btn" onClick={() => onOpenPortal('buyer')}>
                          Confirm Receipt ➔
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
