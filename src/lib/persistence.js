import { initialListings, initialOrders } from '../data.js';

const STORAGE_KEY = 'kachra-to-kamai-demo-state-v1';
const ROLE_KEY = 'kachra-to-kamai-demo-role-v1';

function isRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

export function loadDemoState() {
  if (typeof window === 'undefined') return { listings: initialListings, orders: initialOrders };

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { listings: initialListings, orders: initialOrders };
    const parsed = JSON.parse(stored);
    if (!isRecord(parsed) || !Array.isArray(parsed.listings) || !Array.isArray(parsed.orders)) {
      return { listings: initialListings, orders: initialOrders };
    }
    return { listings: parsed.listings, orders: parsed.orders };
  } catch {
    return { listings: initialListings, orders: initialOrders };
  }
}

export function saveDemoState(state) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Demo mode remains usable if browser storage is unavailable or full.
  }
}

export function loadDemoRole() {
  if (typeof window === 'undefined') return 'buyer';
  const role = window.localStorage.getItem(ROLE_KEY);
  return ['buyer', 'supplier', 'agent', 'admin'].includes(role) ? role : 'buyer';
}

export function saveDemoRole(role) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ROLE_KEY, role);
  } catch {
    // Demo role is not authoritative application data.
  }
}

export function resetDemoState() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(ROLE_KEY);
}
