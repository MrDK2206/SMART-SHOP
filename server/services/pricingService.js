import { Coupon } from "../models/Coupon.js";
import { shippingRules } from "../config/shippingRules.js";

export async function calculatePricing({ items, couponCode, shippingMethod = "standard" }) {
  const normalizedItems = items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
    name: item.product.name,
    image: item.product.image,
    price: item.product.price
  }));

  const itemsPrice = Number(
    normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  );

  const selectedShippingRule = shippingRules[shippingMethod];
  if (!selectedShippingRule) {
    throw new Error("Invalid shipping method");
  }

  const shippingPrice =
    itemsPrice >= selectedShippingRule.freeThreshold ? 0 : selectedShippingRule.basePrice;

  let appliedCoupon = null;
  let discountPrice = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!coupon) {
      throw new Error("Coupon is invalid");
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new Error("Coupon has expired");
    }
    if (itemsPrice < coupon.minOrderAmount) {
      throw new Error(`Coupon requires a minimum order of $${coupon.minOrderAmount}`);
    }

    discountPrice =
      coupon.type === "percentage"
        ? (itemsPrice * coupon.value) / 100
        : coupon.value;

    if (coupon.maxDiscount) {
      discountPrice = Math.min(discountPrice, coupon.maxDiscount);
    }

    discountPrice = Number(Math.min(discountPrice, itemsPrice).toFixed(2));
    appliedCoupon = {
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      discountPrice
    };
  }

  const taxableAmount = Math.max(itemsPrice - discountPrice, 0);
  const taxPrice = Number((taxableAmount * 0.1).toFixed(2));
  const totalPrice = Number((taxableAmount + shippingPrice + taxPrice).toFixed(2));

  return {
    itemsPrice,
    shippingPrice,
    discountPrice,
    taxPrice,
    totalPrice,
    coupon: appliedCoupon,
    shippingMethod,
    shippingLabel: selectedShippingRule.label,
    orderItems: normalizedItems
  };
}
