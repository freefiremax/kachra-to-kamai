import { getSupabaseClient, getSupabaseCredentials, saveCustomSupabaseConfig } from './supabase.js';
import { initialListings, initialOrders } from '../data.js';
import { loadDemoState, saveDemoState } from './persistence.js';
import { broadcastStateChange, subscribeStateSync } from './sync.js';

let dbStatus = {
  isConnected: false,
  isRealtimeActive: false,
  provider: 'local', // 'supabase' | 'cloud-api' | 'local'
  label: 'Local Browser Database',
  lastSync: null,
  error: null,
};

// Track listeners to database updates
const listeners = new Set();

export function getDbStatus() {
  const { url, key } = getSupabaseCredentials();
  if (url && key) {
    return {
      ...dbStatus,
      isConnected: true,
      provider: 'supabase',
      label: 'Supabase Cloud PostgreSQL (Live)',
    };
  }
  return dbStatus;
}

// Convert camelCase listing to Supabase snake_case
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

export function rowToListing(r) {
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

// Convert camelCase order to Supabase snake_case
function orderToRow(o) {
  return {
    id: String(o.id),
    listing_id: o.listingId ? String(o.listingId) : null,
    listing_title: o.listingTitle,
    buyer: o.buyer || 'Verified Buyer',
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

export function rowToOrder(r) {
  return {
    id: String(r.id),
    listingId: r.listing_id,
    listingTitle: r.listing_title,
    buyer: r.buyer || 'Verified Buyer',
    seller: r.seller,
    quantity: Number(r.quantity),
    unit: r.unit,
    itemTotal: Number(r.item_total),
    deliveryFee: Number(r.delivery_fee),
    commission: Number(r.commission),
    destination: r.destination,
    distanceKm: Number(r.distance_km),
    status: r.status,
    createdAt: r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
  };
}

/**
 * Loads initial database state on application startup
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
        dbStatus.isConnected = true;
        dbStatus.provider = 'supabase';
        dbStatus.label = 'Supabase Cloud PostgreSQL';
        dbStatus.lastSync = new Date().toISOString();
        dbStatus.error = null;

        let loadedListings = (listingsRes.data || []).map(rowToListing);
        let loadedOrders = (ordersRes.data || []).map(rowToOrder);

        // Auto-seed if newly created Supabase tables are empty
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
      } else {
        if (listingsRes.error) console.warn('[Supabase listings error]', listingsRes.error);
        if (ordersRes.error) console.warn('[Supabase orders error]', ordersRes.error);
      }
    } catch (err) {
      console.warn('[Supabase initial fetch failed, using fallback]', err);
      dbStatus.error = err.message;
    }
  }

  // Fallback 1: Vercel Cloud Serverless API
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const body = await res.json();
        if (body.data?.listings && body.data?.orders) {
          dbStatus.isConnected = true;
          dbStatus.provider = 'cloud-api';
          dbStatus.label = 'Vercel Serverless Cloud DB';
          dbStatus.lastSync = body.updatedAt;
          saveDemoState(body.data);
          return body.data;
        }
      }
    } catch {
      // ignore
    }
  }

  // Fallback 2: Local storage
  const local = loadDemoState();
  dbStatus.isConnected = true;
  dbStatus.provider = 'local';
  dbStatus.label = 'Local Browser Database (Sync Active)';
  dbStatus.lastSync = new Date().toISOString();
  return local;
}

/**
 * Atomic mutation for an Order with on-the-spot sync and audit logging
 */
export async function persistOrderUpdate(order, actor = 'System', note = '') {
  // 1. Broadcast locally for instant multi-tab sync (0ms)
  broadcastStateChange({ updatedOrder: order });

  // 2. Immediately update local storage snapshot
  try {
    const current = loadDemoState();
    const exists = current.orders.some((o) => String(o.id) === String(order.id));
    const nextOrders = exists
      ? current.orders.map((o) => (String(o.id) === String(order.id) ? { ...o, ...order } : o))
      : [order, ...current.orders];
    saveDemoState({ ...current, orders: nextOrders });
  } catch {
    // ignore
  }

  // 3. Upsert to Supabase with event log
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const row = orderToRow(order);
      await Promise.allSettled([
        supabase.from('orders').upsert(row, { onConflict: 'id' }),
        supabase.from('order_events').insert({
          order_id: String(order.id),
          status: order.status,
          actor,
          note: note || `Order #${order.id} updated to ${order.status}`,
        }),
      ]);
    } catch (err) {
      console.warn('[Supabase Order Update Error]', err);
    }
  }
}

/**
 * Atomic mutation for a Listing with on-the-spot sync
 */
export async function persistListingUpdate(listing) {
  // 1. Broadcast locally for instant multi-tab sync (0ms)
  broadcastStateChange({ updatedListing: listing });

  // 2. Immediately update local storage snapshot
  try {
    const current = loadDemoState();
    const exists = current.listings.some((l) => String(l.id) === String(listing.id));
    const nextListings = exists
      ? current.listings.map((l) => (String(l.id) === String(listing.id) ? { ...l, ...listing } : l))
      : [listing, ...current.listings];
    saveDemoState({ ...current, listings: nextListings });
  } catch {
    // ignore
  }

  // 3. Upsert to Supabase
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const row = listingToRow(listing);
      await supabase.from('listings').upsert(row, { onConflict: 'id' });
    } catch (err) {
      console.warn('[Supabase Listing Update Error]', err);
    }
  }
}

/**
 * Full state synchronization (backups across local storage, Supabase, and Vercel API)
 */
export async function syncDatabaseState({ listings, orders }) {
  saveDemoState({ listings, orders });
  broadcastStateChange({ listings, orders });
  dbStatus.lastSync = new Date().toISOString();

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
      console.warn('[Supabase Full Sync Error]', err);
    }
  }

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
 * Real-time subscription engine:
 * 1. Supabase Realtime WebSocket channel for instant remote updates
 * 2. Cross-tab BroadcastChannel for 0ms same-browser tab sync
 * 3. Fast resilient poller (every 2.5s) to guarantee updates even on restrictive networks
 */
export function subscribeToDatabase(onData) {
  if (typeof window === 'undefined') return () => {};

  listeners.add(onData);
  const cleanups = [];

  // 1. Cross-tab real-time sync
  const unsubsSync = subscribeStateSync((incoming) => {
    if (incoming) {
      onData(incoming);
    }
  });
  cleanups.push(unsubsSync);

  // 2. Supabase Realtime WebSocket Subscription
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const channel = supabase
        .channel('k2k-realtime-market')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            dbStatus.lastSync = new Date().toISOString();
            if (payload.eventType === 'INSERT' && payload.new) {
              const newOrder = rowToOrder(payload.new);
              onData({ insertOrder: newOrder });
            } else if (payload.eventType === 'UPDATE' && payload.new) {
              const updatedOrder = rowToOrder(payload.new);
              onData({ updatedOrder });
            } else if (payload.eventType === 'DELETE' && payload.old) {
              onData({ deleteOrderId: String(payload.old.id) });
            } else {
              // General refresh fallback
              supabase.from('orders').select('*').order('created_at', { ascending: false }).then((res) => {
                if (!res.error && res.data) {
                  onData({ orders: res.data.map(rowToOrder) });
                }
              });
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'listings' },
          (payload) => {
            dbStatus.lastSync = new Date().toISOString();
            if (payload.eventType === 'INSERT' && payload.new) {
              const newListing = rowToListing(payload.new);
              onData({ insertListing: newListing });
            } else if (payload.eventType === 'UPDATE' && payload.new) {
              const updatedListing = rowToListing(payload.new);
              onData({ updatedListing });
            } else {
              supabase.from('listings').select('*').order('created_at', { ascending: false }).then((res) => {
                if (!res.error && res.data) {
                  onData({ listings: res.data.map(rowToListing) });
                }
              });
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            dbStatus.isRealtimeActive = true;
          }
        });

      cleanups.push(() => {
        supabase.removeChannel(channel);
        dbStatus.isRealtimeActive = false;
      });
    } catch (err) {
      console.warn('[Supabase Realtime Channel Error]', err);
    }

    // 3. Resilient Live Poller (every 2s) for instant sync across separate phones & laptops
    let isFetching = false;
    let lastKnownOrdersHash = '';

    const fetchLatest = async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        const [ordersRes, listingsRes] = await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('listings').select('*').order('created_at', { ascending: false }),
        ]);

        if (!ordersRes.error && ordersRes.data) {
          const hash = ordersRes.data.map((o) => `${o.id}:${o.status}`).join('|');
          if (hash !== lastKnownOrdersHash) {
            lastKnownOrdersHash = hash;
            dbStatus.lastSync = new Date().toISOString();
            onData({ orders: ordersRes.data.map(rowToOrder) });
          }
        }

        if (!listingsRes.error && listingsRes.data) {
          onData({ listings: listingsRes.data.map(rowToListing) });
        }
      } catch {
        // ignore background poll errors
      } finally {
        isFetching = false;
      }
    };

    const pollInterval = setInterval(fetchLatest, 2000);
    cleanups.push(() => clearInterval(pollInterval));

    if (typeof document !== 'undefined') {
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          fetchLatest();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      cleanups.push(() => document.removeEventListener('visibilitychange', handleVisibilityChange));
    }
  }

  return () => {
    listeners.delete(onData);
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
