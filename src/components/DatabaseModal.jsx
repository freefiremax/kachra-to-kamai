import { useState } from 'react';
import { getDbStatus, getSupabaseCredentials, saveCustomSupabaseConfig } from '../lib/db';

export function DatabaseModal({ onClose, onConfigSaved, listingsCount, ordersCount }) {
  const currentCreds = getSupabaseCredentials();
  const dbStatus = getDbStatus();

  const [url, setUrl] = useState(currentCreds.url);
  const [key, setKey] = useState(currentCreds.key);
  const [savedSuccess, setSavedSuccess] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    saveCustomSupabaseConfig(url, key);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onConfigSaved) onConfigSaved();
      onClose();
    }, 900);
  }

  function handleReset() {
    saveCustomSupabaseConfig('', '');
    setUrl('');
    setKey('');
    if (onConfigSaved) onConfigSaved();
  }

  return (
    <div className="modal-backdrop glass-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal glass-modal db-modal" role="dialog" aria-labelledby="db-modal-title">
        <div className="modal-drag-handle" />
        <button className="modal-close" onClick={onClose} aria-label="Close database modal">✕</button>

        <div className="db-modal-content">
          <div className="db-modal-head">
            <div className="db-icon-circle">
              <span className="db-symbol">🗄️</span>
              <span className="db-ping" />
            </div>
            <div>
              <h2 id="db-modal-title">Database & Cloud Sync</h2>
              <p className="db-modal-sub">Real-time marketplace persistence across all participant portals</p>
            </div>
          </div>

          <div className="db-status-banner glass-panel">
            <div className="status-row">
              <span className="status-indicator">
                <span className="status-dot green" />
                <strong>Database Status:</strong>
              </span>
              <span className="status-badge-val text-emerald">
                {dbStatus.provider === 'supabase' ? '🟢 Supabase PostgreSQL Active' : '⚡ Live Cloud Sync Active'}
              </span>
            </div>

            <div className="db-meta-grid">
              <div className="db-meta-card">
                <small>Connected Storage</small>
                <strong>{dbStatus.label}</strong>
              </div>
              <div className="db-meta-card">
                <small>Marketplace Records</small>
                <strong>{listingsCount} Listings · {ordersCount} Orders</strong>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="db-config-form">
            <div className="form-subhead">
              <h3>Connect Supabase PostgreSQL (Optional)</h3>
              <p>Enter your Supabase project credentials to store all data directly in your cloud PostgreSQL database.</p>
            </div>

            <label className="field-group">
              <span className="field-label">Project URL (VITE_SUPABASE_URL)</span>
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="portal-input glass-input"
              />
            </label>

            <label className="field-group">
              <span className="field-label">Anon / Public API Key (VITE_SUPABASE_PUBLISHABLE_KEY)</span>
              <input
                type="text"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="portal-input glass-input font-mono text-xs"
              />
            </label>

            {savedSuccess && (
              <div className="db-saved-alert">
                <span>✓</span> Database credentials saved! Reconnecting...
              </div>
            )}

            <div className="db-actions-row">
              <button type="submit" className="button button-primary glow-green">
                <span>Connect & Save Database</span>
              </button>
              {(url || key) && (
                <button type="button" className="button button-ghost glass-btn" onClick={handleReset}>
                  Clear Credentials
                </button>
              )}
            </div>
          </form>

          <div className="db-sql-hint glass-panel">
            <div className="hint-head">
              <span>💡</span>
              <strong>Quick Supabase SQL Setup:</strong>
            </div>
            <p>
              Schema migration is ready at <code className="code-tag">supabase/migrations/20261024_initial_schema.sql</code>. Simply copy & paste it into your Supabase SQL editor to create all tables and RLS policies!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
