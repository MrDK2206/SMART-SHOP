export const sampleCoupons = [
  {
    code: "WELCOME10",
    description: "10% off on first orders above $50",
    type: "percentage",
    value: 10,
    minOrderAmount: 50,
    maxDiscount: 30,
    isActive: true
  },
  {
    code: "SHIPFREE",
    description: "$10 off shipping-heavy carts",
    type: "fixed",
    value: 10,
    minOrderAmount: 80,
    isActive: true
  }
];
