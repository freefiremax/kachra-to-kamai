import { runtime } from '../lib/runtime';

export function PortalHeader({
  activePortal,
  onSelectPortal,
  pendingRequestsCount,
  availablePickupsCount,
  pendingBuyerPaymentsCount,
}) {
  return (
    <>
      {/* Top Glassmorphic Navigation Bar */}
      <header className="main-portal-header">
        <div className="header-brand-wrap">
          <button
            className="brand-btn"
            onClick={() => onSelectPortal('presenter')}
            title="Kachra To Kamai - Circular Marketplace"
            aria-label="Kachra To Kamai Home"
          >
            <div className="brand-logo-icon">
              <span className="logo-symbol">♻</span>
              <span className="logo-sparkle" />
            </div>
            <div className="brand-names">
              <span className="brand-title">
                Kachra<span className="brand-accent">To</span>Kamai
              </span>
              <span className="brand-subtitle">Waste se value · Value se kamai</span>
            </div>
          </button>

          <div className="hub-badge" title="Active Pilot Cluster">
            <span className="dot dot-live" />
            <span className="hub-text">{runtime.region}</span>
          </div>
        </div>

        {/* Desktop / Tablet Portal Switcher Segment */}
        <nav className="portal-switcher-nav desktop-switcher" aria-label="Portal Navigation">
          <button
            className={`portal-nav-btn buyer ${activePortal === 'buyer' ? 'active' : ''}`}
            onClick={() => onSelectPortal('buyer')}
          >
            <span className="p-icon">🛒</span>
            <span className="p-label">Buyer</span>
            {pendingBuyerPaymentsCount > 0 && (
              <span className="p-alert-badge urgent">{pendingBuyerPaymentsCount} Pay</span>
            )}
          </button>

          <button
            className={`portal-nav-btn seller ${activePortal === 'seller' ? 'active' : ''}`}
            onClick={() => onSelectPortal('seller')}
          >
            <span className="p-icon">📦</span>
            <span className="p-label">Seller</span>
            {pendingRequestsCount > 0 && (
              <span className="p-alert-badge">{pendingRequestsCount}</span>
            )}
          </button>

          <button
            className={`portal-nav-btn agent ${activePortal === 'agent' ? 'active' : ''}`}
            onClick={() => onSelectPortal('agent')}
          >
            <span className="p-icon">🚚</span>
            <span className="p-label">Fleet</span>
            {availablePickupsCount > 0 && (
              <span className="p-alert-badge agent-badge">{availablePickupsCount}</span>
            )}
          </button>

          <button
            className={`portal-nav-btn admin ${activePortal === 'admin' ? 'active' : ''}`}
            onClick={() => onSelectPortal('admin')}
          >
            <span className="p-icon">⚙️</span>
            <span className="p-label">Ops</span>
          </button>

          <div className="nav-divider" />

          <button
            className={`portal-nav-btn presenter-btn ${activePortal === 'presenter' ? 'active' : ''}`}
            onClick={() => onSelectPortal('presenter')}
            title="4-in-1 Live Simultaneous Stage"
          >
            <span className="p-icon">🎭</span>
            <span className="p-label">4-in-1 Stage</span>
            <span className="live-sparkle" />
          </button>
        </nav>
      </header>

      {/* Mobile Floating Glassmorphic Bottom Navigation Dock */}
      <nav className="mobile-bottom-dock" aria-label="Mobile Bottom Navigation">
        <button
          className={`dock-btn ${activePortal === 'buyer' ? 'active' : ''}`}
          onClick={() => onSelectPortal('buyer')}
        >
          <div className="dock-icon-wrap">
            <span className="dock-icon">🛒</span>
            {pendingBuyerPaymentsCount > 0 && (
              <span className="dock-dot urgent" />
            )}
          </div>
          <span className="dock-label">Buyer</span>
        </button>

        <button
          className={`dock-btn ${activePortal === 'seller' ? 'active' : ''}`}
          onClick={() => onSelectPortal('seller')}
        >
          <div className="dock-icon-wrap">
            <span className="dock-icon">📦</span>
            {pendingRequestsCount > 0 && (
              <span className="dock-badge">{pendingRequestsCount}</span>
            )}
          </div>
          <span className="dock-label">Seller</span>
        </button>

        <button
          className={`dock-btn ${activePortal === 'agent' ? 'active' : ''}`}
          onClick={() => onSelectPortal('agent')}
        >
          <div className="dock-icon-wrap">
            <span className="dock-icon">🚚</span>
            {availablePickupsCount > 0 && (
              <span className="dock-badge agent">{availablePickupsCount}</span>
            )}
          </div>
          <span className="dock-label">Fleet</span>
        </button>

        <button
          className={`dock-btn ${activePortal === 'admin' ? 'active' : ''}`}
          onClick={() => onSelectPortal('admin')}
        >
          <div className="dock-icon-wrap">
            <span className="dock-icon">⚙️</span>
          </div>
          <span className="dock-label">Ops</span>
        </button>

        <button
          className={`dock-btn presenter-dock-btn ${activePortal === 'presenter' ? 'active' : ''}`}
          onClick={() => onSelectPortal('presenter')}
        >
          <div className="dock-icon-wrap">
            <span className="dock-icon">🎭</span>
            <span className="dock-sparkle" />
          </div>
          <span className="dock-label">4-in-1</span>
        </button>
      </nav>
    </>
  );
}
