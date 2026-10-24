import { getSupabaseClient, getSupabaseCredentials, saveCustomSupabaseConfig } from './supabase.js';
import { initialListings, initialOrders } from '../data.js';
import { loadDemoState, saveDemoState } from './persistence.js';
import { broadcastStateChange, subscribeStateSync } from './sync.js';

let dbStatus = {
  isConnected: false,
  provider: 'local', // 'supabase' | 'cloud-api' | 'local'
  label: 'Local Browser Database',
  lastSync: null,
};

export function getDbStatus() {
  const { url, key } = getSupabaseCredentials();
  if (url && key) {
    return {
      ...dbStatus,
      isConnected: true,
      provider: 'supabase',
      label: 'Supabase Cloud PostgreSQL',
    };
  }
  return dbStatus;
}

// Map frontend camelCase listing to Supabase snake_case
function listingToRow(l) {
  return {
    id: String(l.id),
    title: l.title,
    category: l.category,
    quantity: Number(l.quantity),
    unit: l.unit,
    price: Number(l.price),
    condition: l.condition || 'Sorted & Dry',
    area: l.area || 'Kopargaon',
    distance_km: Number(l.distanceKm || 3.5),
    seller: l.seller,
    description: l.description || '',
    image: l.image || '♻️',
    availability: l.availability || 'In Stock',
    updated_at: new Date().toISOString(),
  };
}

function rowToListing(r) {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    quantity: Number(r.quantity),
    unit: r.unit,
    price: Number(r.price),
    condition: r.condition,
    area: r.area,
    distanceKm: Number(r.distance_km || 3.5),
    seller: r.seller,
    description: r.description,
    image: r.image,
    availability: r.availability,
  };
}

// Map frontend camelCase order to Supabase snake_case
function orderToRow(o) {
  return {
    id: String(o.id),
    listing_id: o.listingId ? String(o.listingId) : null,
    listing_title: o.listingTitle,
    buyer: o.buyer || 'Local Buyer',
    seller: o.seller,
    quantity: Number(o.quantity),
    unit: o.unit,
    item_total: Number(o.itemTotal),
    delivery_fee: Number(o.deliveryFee || 40),
    commission: Number(o.commission || 0),
    destination: o.destination || 'Kopargaon Destination',
    distance_km: Number(o.distanceKm || 3.5),
    status: o.status,
    updated_at: new Date().toISOString(),
  };
}

function rowToOrder(r) {
  return {
    id: r.id,
    listingId: r.listing_id,
    listingTitle: r.listing_title,
    buyer: r.buyer,
    seller: r.seller,
    quantity: Number(r.quantity),
    unit: r.unit,
    itemTotal: Number(r.item_total),
    deliveryFee: Number(r.delivery_fee),
    commission: Number(r.commission),
    destination: r.destination,
    distanceKm: Number(r.distance_km),
    status: r.status,
  };
}

/**
 * Loads the initial database state:
 * 1. Checks Supabase if configured.
 * 2. Checks Vercel Serverless /api/db if deployed.
 * 3. Falls back to local persistent storage.
 */
export async function loadInitialDatabase() {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const [listingsRes, ordersRes] = await Promise.all([
        supabase.from('listings').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ]);

      if (!listingsRes.error && !ordersRes.error) {
        dbStatus = {
          isConnected: true,
          provider: 'supabase',
          label: 'Supabase Cloud PostgreSQL',
          lastSync: new Date().toISOString(),
        };

        let loadedListings = (listingsRes.data || []).map(rowToListing);
        let loadedOrders = (ordersRes.data || []).map(rowToOrder);

        // If Supabase table was just created and is empty, seed it with pilot data!
        if (loadedListings.length === 0) {
          const rowsToSeed = initialListings.map(listingToRow);
          await supabase.from('listings').insert(rowsToSeed);
          loadedListings = initialListings;
        }

        if (loadedOrders.length === 0) {
          const ordersToSeed = initialOrders.map(orderToRow);
          await supabase.from('orders').insert(ordersToSeed);
          loadedOrders = initialOrders;
        }

        saveDemoState({ listings: loadedListings, orders: loadedOrders });
        return { listings: loadedListings, orders: loadedOrders };
      }
    } catch (err) {
      console.warn('[Supabase load error, falling back to serverless/local]', err);
    }
  }

  // 2. Try Vercel Serverless Cloud DB
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const body = await res.json();
        if (body.data?.listings && body.data?.orders) {
          dbStatus = {
            isConnected: true,
            provider: 'cloud-api',
            label: 'Vercel Serverless Cloud DB',
            lastSync: body.updatedAt,
          };
          saveDemoState(body.data);
          return body.data;
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Fallback to Local Persistent Storage
  const local = loadDemoState();
  dbStatus = {
    isConnected: true,
    provider: 'local',
    label: 'Local Browser Database (Sync Active)',
    lastSync: new Date().toISOString(),
  };
  return local;
}

/**
 * Persists changes across all connected database layers:
 * - Supabase (if credentials configured)
 * - Vercel Serverless API (if hosted)
 * - LocalStorage + BroadcastChannel (for instantaneous multi-tab sync)
 */
export async function syncDatabaseState({ listings, orders }) {
  // Always save locally & broadcast for instant responsiveness
  saveDemoState({ listings, orders });
  broadcastStateChange({ listings, orders });
  dbStatus.lastSync = new Date().toISOString();

  // Sync to Supabase in background
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const listingRows = listings.map(listingToRow);
      const orderRows = orders.map(orderToRow);

      await Promise.allSettled([
        supabase.from('listings').upsert(listingRows, { onConflict: 'id' }),
        supabase.from('orders').upsert(orderRows, { onConflict: 'id' }),
      ]);
    } catch (err) {
      console.warn('[Supabase Sync Error]', err);
    }
  }

  // Sync to Vercel Serverless API in background
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    try {
      fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listings, orders }),
      }).catch(() => {});
    } catch {
      // ignore
    }
  }
}

/**
 * Sets up live real-time subscription:
 * - Listens for Supabase Realtime postgres_changes
 * - Listens for cross-tab BroadcastChannel & storage events
 * - Polls Vercel Serverless API on deployed environments
 */
export function subscribeToDatabase(onData) {
  if (typeof window === 'undefined') return () => {};

  const cleanups = [];

  // 1. Cross-tab & Storage Sync
  const unsubsSync = subscribeStateSync((incoming) => {
    if (incoming && (incoming.listings || incoming.orders)) {
      onData(incoming);
    }
  });
  cleanups.push(unsubsSync);

  // 2. Supabase Realtime Subscription
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const channel = supabase
        .channel('k2k-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
          const res = await supabase.from('orders').select('*').order('created_at', { ascending: false });
          if (!res.error && res.data) {
            onData({ orders: res.data.map(rowToOrder) });
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, async () => {
          const res = await supabase.from('listings').select('*').order('created_at', { ascending: false });
          if (!res.error && res.data) {
            onData({ listings: res.data.map(rowToListing) });
          }
        })
        .subscribe();

      cleanups.push(() => {
        supabase.removeChannel(channel);
      });
    } catch (err) {
      console.warn('[Supabase Realtime Subscription Error]', err);
    }
  }

  // 3. Periodic Cloud Poll for Vercel Multi-Device presentations
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !supabase) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/db');
        if (res.ok) {
          const body = await res.json();
          if (body.data?.listings && body.data?.orders) {
            onData(body.data);
          }
        }
      } catch {
        // ignore
      }
    }, 4000);
    cleanups.push(() => clearInterval(interval));
  }

  return () => {
    cleanups.forEach((fn) => {
      try {
        fn();
      } catch {
        // ignore
      }
    });
  };
}

export { saveCustomSupabaseConfig, getSupabaseCredentials };
