import { runtime } from '../lib/runtime';

export function PortalHeader({
  activePortal,
  onSelectPortal,
  pendingRequestsCount,
  availablePickupsCount,
  pendingBuyerPaymentsCount,
}) {
  return (
    <header className="main-portal-header">
      <div className="header-brand-wrap">
        <button
          className="brand-btn"
          onClick={() => onSelectPortal('presenter')}
          title="Kachra To Kamai - Circular Material Marketplace"
        >
          <span className="brand-logo-icon">♻</span>
          <div className="brand-names">
            <span className="brand-title">Kachra To Kamai</span>
            <span className="brand-subtitle">Waste se value · Value se kamai</span>
          </div>
        </button>

        <span className="hub-badge">
          <span className="dot dot-green" /> {runtime.region}
        </span>
      </div>

      {/* 4 Dedicated User Portal Tabs + Presenter Stage */}
      <nav className="portal-switcher-nav" aria-label="Participant portals">
        <button
          className={`portal-nav-btn buyer ${activePortal === 'buyer' ? 'active' : ''}`}
          onClick={() => onSelectPortal('buyer')}
        >
          <span className="p-icon">🛒</span>
          <span className="p-label">Buyer Portal</span>
          {pendingBuyerPaymentsCount > 0 && (
            <span className="p-alert-badge urgent">{pendingBuyerPaymentsCount} Pay</span>
          )}
        </button>

        <button
          className={`portal-nav-btn seller ${activePortal === 'seller' ? 'active' : ''}`}
          onClick={() => onSelectPortal('seller')}
        >
          <span className="p-icon">📦</span>
          <span className="p-label">Seller Portal</span>
          {pendingRequestsCount > 0 && (
            <span className="p-alert-badge">{pendingRequestsCount}</span>
          )}
        </button>

        <button
          className={`portal-nav-btn agent ${activePortal === 'agent' ? 'active' : ''}`}
          onClick={() => onSelectPortal('agent')}
        >
          <span className="p-icon">🚚</span>
          <span className="p-label">Delivery Fleet</span>
          {availablePickupsCount > 0 && (
            <span className="p-alert-badge agent-badge">{availablePickupsCount}</span>
          )}
        </button>

        <button
          className={`portal-nav-btn admin ${activePortal === 'admin' ? 'active' : ''}`}
          onClick={() => onSelectPortal('admin')}
        >
          <span className="p-icon">⚙️</span>
          <span className="p-label">Admin Ops</span>
        </button>

        <div className="nav-divider" />

        <button
          className={`portal-nav-btn presenter-btn ${activePortal === 'presenter' ? 'active' : ''}`}
          onClick={() => onSelectPortal('presenter')}
          title="View all 4 participant interfaces side-by-side on one screen"
        >
          <span className="p-icon">🎭</span>
          <span className="p-label">4-in-1 Presenter Stage</span>
        </button>
      </nav>
    </header>
  );
}
