import test from 'node:test';
import assert from 'node:assert/strict';
import { initialListings, initialOrders } from '../src/data.js';
import { loadDemoRole, loadDemoState } from '../src/lib/persistence.js';

test('demo persistence falls back to the bundled sample state outside a browser', () => {
  const state = loadDemoState();

  assert.equal(state.listings.length, initialListings.length);
  assert.equal(state.orders.length, initialOrders.length);
  assert.equal(loadDemoRole(), 'buyer');
});
