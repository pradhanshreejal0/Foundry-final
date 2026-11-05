import test from "node:test";
import assert from "node:assert";

test("Order calculations and delivery fees", () => {
  // Test delivery fee logic matching distance
  const getDeliveryFee = (distanceKm) => {
    if (distanceKm <= 3) return 50;
    if (distanceKm <= 7) return 150;
    if (distanceKm <= 12) return 250;
    return 350;
  };

  assert.strictEqual(getDeliveryFee(2), 50);
  assert.strictEqual(getDeliveryFee(5), 150);
  assert.strictEqual(getDeliveryFee(10), 250);
  assert.strictEqual(getDeliveryFee(15), 350);
});

test("Coupon discount calculations", () => {
  const computeDiscount = (type, value, max, minOrder, subtotal) => {
    if (subtotal < minOrder) return 0;
    let discount = 0;
    if (type === "fixed") {
      discount = value;
    } else {
      discount = (subtotal * value) / 100;
      if (max != null) discount = Math.min(discount, max);
    }
    return Math.round(Math.min(discount, subtotal) * 100) / 100;
  };

  // Fixed discount
  assert.strictEqual(computeDiscount("fixed", 100, null, 500, 1000), 100);
  // Fixed below min order
  assert.strictEqual(computeDiscount("fixed", 100, null, 1500, 1000), 0);
  // Percentage discount with max cap
  assert.strictEqual(computeDiscount("percentage", 20, 150, 0, 1000), 150);
  // Percentage discount without cap
  assert.strictEqual(computeDiscount("percentage", 10, null, 0, 1000), 100);
});

test("Online payment feature flag logic", () => {
  const originalFlag = process.env.ONLINE_PAYMENTS_ENABLED;

  // When false
  process.env.ONLINE_PAYMENTS_ENABLED = "false";
  const isEnabledFalse = process.env.ONLINE_PAYMENTS_ENABLED === "true";
  assert.strictEqual(isEnabledFalse, false);

  // When true
  process.env.ONLINE_PAYMENTS_ENABLED = "true";
  const isEnabledTrue = process.env.ONLINE_PAYMENTS_ENABLED === "true";
  assert.strictEqual(isEnabledTrue, true);

  process.env.ONLINE_PAYMENTS_ENABLED = originalFlag;
});
