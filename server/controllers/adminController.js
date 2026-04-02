import asyncHandler from "express-async-handler";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

export const getDashboardSummary = asyncHandler(async (_req, res) => {
  const [userCount, productCount, orderCount, revenueData, users] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" }
        }
      }
    ]),
    User.find(
      { "passwordResetRequests.0": { $exists: true } },
      "name email passwordResetRequests"
    )
  ]);

  const passwordResetRequests = users
    .flatMap((user) =>
      user.passwordResetRequests.map((request) => ({
        name: user.name,
        email: user.email,
        requestedAt: request.requestedAt,
        status: request.status
      }))
    )
    .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
    .slice(0, 10);

  res.json({
    userCount,
    productCount,
    orderCount,
    revenue: revenueData[0]?.revenue ?? 0,
    passwordResetRequests
  });
});
