import { demoPricing } from '../data.js';

export function calculateDeliveryFee({ distanceKm, weightKg, vehicleType = 'mini-truck' }) {
  const vehicleMultiplier = vehicleType === 'pickup' ? 1.15 : vehicleType === 'mini-truck' ? 1 : 1.35;
  const distanceCharge = Math.max(0, distanceKm - demoPricing.includedDistanceKm) * demoPricing.distanceRate;
  const weightCharge = Math.max(0, weightKg - demoPricing.includedWeightKg) * demoPricing.weightRate;

  return Math.round((demoPricing.baseDelivery + distanceCharge + weightCharge) * vehicleMultiplier);
}

export function calculateOrderBreakdown({ price, quantity, unit, distanceKm, weightKg = quantity, vehicleType }) {
  const itemTotal = price * quantity;
  const deliveryFee = calculateDeliveryFee({ distanceKm, weightKg, vehicleType });
  const commission = Math.round(itemTotal * demoPricing.commissionRate);

  return {
    itemTotal,
    deliveryFee,
    commission,
    buyerTotal: itemTotal + deliveryFee,
    sellerSettlement: itemTotal - commission,
    unit,
  };
}

export function validateListingForm(form) {
  const errors = {};

  if (!form.title.trim()) errors.title = 'Add a clear material title.';
  if (!form.description.trim()) errors.description = 'Describe the material and intended use constraints.';
  if (!form.category) errors.category = 'Choose a material category.';
  if (form.category === 'restricted') errors.category = 'Restricted materials are blocked from the prototype marketplace.';
  if (!Number.isFinite(Number(form.quantity)) || Number(form.quantity) <= 0) errors.quantity = 'Quantity must be greater than zero.';
  if (!Number.isFinite(Number(form.price)) || Number(form.price) < 0) errors.price = 'Enter a valid seller-set price.';
  if (!form.area.trim()) errors.area = 'Add a pickup area.';

  return errors;
}

export function getStatusIndex(status) {
  const order = ['requested', 'seller_accepted', 'payment_simulated', 'agent_assigned', 'picked_up', 'delivered', 'completed'];
  return order.indexOf(status);
}
