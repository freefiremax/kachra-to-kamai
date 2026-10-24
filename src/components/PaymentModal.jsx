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
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && !processing && onClose()}
    >
      <div className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="pay-dialog-title">
        <button className="modal-close" onClick={onClose} disabled={processing} aria-label="Close payment modal">
          ✕
        </button>

        {completed ? (
          <div className="payment-success-card">
            <div className="success-pulse-check">✓</div>
            <h2>Payment Successful!</h2>
            <p className="success-amount">{money.format(totalAmount)} paid to Kachra To Kamai Escrow</p>
            <div className="success-meta">
              <span>Txn Ref: <strong>TXN-{Date.now().toString().slice(-8)}</strong></span>
              <span>Status: <strong>Confirmed · Ready for Dispatch</strong></span>
            </div>
            <p className="success-note">
              🚚 Delivery agent has been notified and consignment is scheduled for pickup.
            </p>
          </div>
        ) : (
          <div className="payment-content">
            <div className="payment-header">
              <span className="payment-shield">🔒 SECURE ESCROW PAYMENT</span>
              <h2 id="pay-dialog-title">Complete Purchase</h2>
              <p className="payment-subtitle">{order.listingTitle} ({order.quantity} {order.unit})</p>
            </div>

            <div className="payment-amount-hero">
              <span className="amount-label">Amount Payable</span>
              <strong className="amount-val">{money.format(totalAmount)}</strong>
              <small className="amount-breakdown">
                Material: {money.format(order.itemTotal)} + Transit: {money.format(order.deliveryFee)}
              </small>
            </div>

            <div className="payment-method-tabs">
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
                <span>Cards / NetBanking</span>
              </button>
              <button
                type="button"
                className={`method-tab ${method === 'cod' ? 'active' : ''}`}
                onClick={() => setMethod('cod')}
              >
                <span className="tab-icon">🤝</span>
                <span>Pay on Dispatch</span>
              </button>
            </div>

            {method === 'upi' && (
              <div className="method-details upi-box">
                <div className="qr-sim">
                  <div className="qr-box">
                    <span className="qr-glyph">▣</span>
                    <span className="qr-tag">SCAN & PAY WITH ANY UPI APP</span>
                  </div>
                  <div className="upi-app-badges">
                    <span className="app-badge gpay">GPay</span>
                    <span className="app-badge phonepe">PhonePe</span>
                    <span className="app-badge paytm">Paytm</span>
                    <span className="app-badge bhim">BHIM</span>
                  </div>
                </div>
                <div className="vpa-field">
                  <span className="vpa-label">Simulated UPI ID:</span>
                  <span className="vpa-id">buyer@okhdfcbank</span>
                </div>
              </div>
            )}

            {method === 'card' && (
              <div className="method-details card-box">
                <div className="sim-card-chip">
                  <div className="chip-row">
                    <span>💳 Visa / Rupay</span>
                    <span className="bank-name">State Bank of India</span>
                  </div>
                  <p className="card-number">•••• •••• •••• 4092</p>
                  <div className="card-foot">
                    <span>Demo Buyer</span>
                    <span>EXP: 09/29</span>
                  </div>
                </div>
              </div>
            )}

            {method === 'cod' && (
              <div className="method-details cod-box">
                <p>
                  🔒 Escrow hold is registered. Funds will be verified and held until the delivery agent completes material handover at your address.
                </p>
              </div>
            )}

            <div className="payment-actions">
              <button
                type="button"
                className="button button-primary full-width pay-cta-btn"
                onClick={handlePay}
                disabled={processing}
              >
                {processing ? (
                  <span className="spinner-row">
                    <span className="spinner-dots" /> Verifying & Processing Payment...
                  </span>
                ) : (
                  <>
                    <span>Pay {money.format(totalAmount)} Instantly</span>
                    <span className="arrow">→</span>
                  </>
                )}
              </button>
              <button type="button" className="button button-ghost full-width" onClick={onClose} disabled={processing}>
                Cancel
              </button>
            </div>

            <p className="payment-guarantee">
              🛡️ Protected by <strong>Kachra To Kamai Escrow</strong>. Seller gets credited only after successful dispatch.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
