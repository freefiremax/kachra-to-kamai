import { useState } from 'react';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function PaymentModal({ order, onClose, onSuccess }) {
  const [method, setMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const totalAmount = order.itemTotal + order.deliveryFee;

  function handlePay() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        onSuccess(order.id);
      }, 1100);
    }, 900);
  }

  return (
    <div
      className="modal-backdrop glass-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && !processing && onClose()}
    >
      <div className="payment-modal glass-modal" role="dialog" aria-modal="true" aria-labelledby="pay-dialog-title">
        {/* Mobile Swipe / Drag Handle */}
        <div className="modal-drag-handle" />

        <button className="modal-close" onClick={onClose} disabled={processing} aria-label="Close payment modal">
          ✕
        </button>

        {completed ? (
          <div className="payment-success-card">
            <div className="success-pulse-check">
              <span>✓</span>
              <div className="pulse-ring" />
            </div>
            <h2>Payment Verified!</h2>
            <p className="success-amount">{money.format(totalAmount)} Secured in Escrow</p>
            <div className="success-meta glass-panel">
              <div className="s-meta-row">
                <span>Transaction Ref:</span>
                <strong>TXN-{Date.now().toString().slice(-8)}</strong>
              </div>
              <div className="s-meta-row">
                <span>Escrow Guarantee:</span>
                <strong className="text-emerald">Active · 100% Protected</strong>
              </div>
            </div>
            <p className="success-note">
              🚚 Delivery agent has been notified and consignment is scheduled for immediate pickup in Kopargaon.
            </p>
          </div>
        ) : (
          <div className="payment-content">
            <div className="payment-header">
              <div className="payment-shield">
                <span className="shield-icon">🛡️</span>
                <span>K2K SECURE ESCROW PROTOCOL</span>
              </div>
              <h2 id="pay-dialog-title">Instant Payment</h2>
              <p className="payment-subtitle">{order.listingTitle} ({order.quantity} {order.unit})</p>
            </div>

            <div className="payment-amount-hero glass-panel">
              <span className="amount-label">Total Payable</span>
              <strong className="amount-val gradient-num">{money.format(totalAmount)}</strong>
              <small className="amount-breakdown">
                Material: {money.format(order.itemTotal)} + Transit: {money.format(order.deliveryFee)}
              </small>
            </div>

            <div className="payment-method-tabs glass-pills">
              <button
                type="button"
                className={`method-tab ${method === 'upi' ? 'active' : ''}`}
                onClick={() => setMethod('upi')}
              >
                <span className="tab-icon">⚡</span>
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                className={`method-tab ${method === 'card' ? 'active' : ''}`}
                onClick={() => setMethod('card')}
              >
                <span className="tab-icon">💳</span>
                <span>Card</span>
              </button>
              <button
                type="button"
                className={`method-tab ${method === 'cod' ? 'active' : ''}`}
                onClick={() => setMethod('cod')}
              >
                <span className="tab-icon">🤝</span>
                <span>On Dispatch</span>
              </button>
            </div>

            {method === 'upi' && (
              <div className="method-details upi-box glass-panel">
                <div className="qr-sim">
                  <div className="qr-box">
                    <span className="qr-glyph">▣</span>
                    <div className="qr-scanner-line" />
                    <span className="qr-tag">SCAN VIA ANY UPI APP</span>
                  </div>
                  <div className="upi-app-badges">
                    <span className="app-badge gpay">Google Pay</span>
                    <span className="app-badge phonepe">PhonePe</span>
                    <span className="app-badge paytm">Paytm</span>
                    <span className="app-badge bhim">BHIM UPI</span>
                  </div>
                </div>
                <div className="vpa-field">
                  <span className="vpa-label">Simulated UPI VPA:</span>
                  <span className="vpa-id">buyer@okhdfcbank</span>
                </div>
              </div>
            )}

            {method === 'card' && (
              <div className="method-details card-box">
                <div className="sim-card-chip holographic-card">
                  <div className="chip-row">
                    <span>💳 RuPay / Visa Platinum</span>
                    <span className="bank-name">State Bank of India</span>
                  </div>
                  <div className="card-chip-graphic" />
                  <p className="card-number">•••• •••• •••• 4092</p>
                  <div className="card-foot">
                    <span>DEMO BUYER</span>
                    <span>EXP 09/29</span>
                  </div>
                </div>
              </div>
            )}

            {method === 'cod' && (
              <div className="method-details cod-box glass-panel">
                <p>
                  🔒 Escrow hold is registered on file. Payment is released to supplier only once verified doorstep handover occurs in Kopargaon.
                </p>
              </div>
            )}

            <div className="payment-actions">
              <button
                type="button"
                className="button button-primary full-width pay-cta-btn glow-cta"
                onClick={handlePay}
                disabled={processing}
              >
                {processing ? (
                  <span className="spinner-row">
                    <span className="spinner-dots" /> Securing Escrow Transaction...
                  </span>
                ) : (
                  <>
                    <span>Pay {money.format(totalAmount)} Instantly</span>
                    <span className="arrow">➔</span>
                  </>
                )}
              </button>
              <button type="button" className="button button-ghost full-width" onClick={onClose} disabled={processing}>
                Cancel
              </button>
            </div>

            <p className="payment-guarantee">
              🛡️ Protected by <strong>Kachra To Kamai Escrow</strong>. Seller gets settlement only after delivery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
