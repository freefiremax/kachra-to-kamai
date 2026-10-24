import test from 'node:test';
import assert from 'node:assert/strict';
import { initialListings, initialOrders } from '../src/data.js';
import { getDbStatus, loadInitialDatabase } from '../src/lib/db.js';
import { getSupabaseCredentials } from '../src/lib/supabase.js';

test('database module provides resilient fallback and status outside browser', async () => {
  const status = getDbStatus();
  assert.ok(status.label);

  const creds = getSupabaseCredentials();
  assert.equal(typeof creds.url, 'string');
  assert.equal(typeof creds.key, 'string');

  const initialData = await loadInitialDatabase();
  assert.ok(Array.isArray(initialData.listings));
  assert.ok(Array.isArray(initialData.orders));
  assert.equal(initialData.listings.length, initialListings.length);
  assert.equal(initialData.orders.length, initialOrders.length);
});
