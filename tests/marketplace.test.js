import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDeliveryFee, calculateOrderBreakdown, validateListingForm } from '../src/lib/marketplace.js';

test('delivery estimate increases with distance and weight', () => {
  const nearby = calculateDeliveryFee({ distanceKm: 3, weightKg: 10 });
  const farther = calculateDeliveryFee({ distanceKm: 12, weightKg: 80 });

  assert.equal(nearby, 40);
  assert.ok(farther > nearby);
});

test('order breakdown keeps seller commission separate from buyer delivery', () => {
  const breakdown = calculateOrderBreakdown({
    price: 12,
    quantity: 50,
    unit: 'kg',
    distanceKm: 3,
    weightKg: 50,
  });

  assert.equal(breakdown.itemTotal, 600);
  assert.equal(breakdown.deliveryFee, 85);
  assert.equal(breakdown.commission, 30);
  assert.equal(breakdown.buyerTotal, 685);
  assert.equal(breakdown.sellerSettlement, 570);
});

test('restricted category and incomplete listing data are rejected', () => {
  const errors = validateListingForm({
    title: '',
    description: '',
    category: 'restricted',
    quantity: 0,
    price: -1,
    area: '',
  });

  assert.equal(errors.category, 'Restricted materials are blocked from the prototype marketplace.');
  assert.ok(errors.title);
  assert.ok(errors.quantity);
  assert.ok(errors.price);
  assert.ok(errors.area);
});
