import express from "express";
import {
  createCodOrder,
  createRazorpayOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  previewOrder,
  updateOrderStatus,
  verifyRazorpayPayment
} from "../controllers/orderController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createCodOrderSchema,
  createRazorpayOrderSchema,
  previewOrderSchema,
  updateOrderStatusSchema,
  verifyPaymentSchema
} from "../validators/orderValidators.js";

const router = express.Router();

router.post("/preview", protect, validateRequest(previewOrderSchema), previewOrder);
router.post("/cod", protect, validateRequest(createCodOrderSchema), createCodOrder);
router.post(
  "/razorpay/create",
  protect,
  validateRequest(createRazorpayOrderSchema),
  createRazorpayOrder
);
router.post(
  "/razorpay/verify",
  protect,
  validateRequest(verifyPaymentSchema),
  verifyRazorpayPayment
);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, admin, getOrders);
router
  .route("/:id")
  .get(protect, getOrderById)
  .put(protect, admin, validateRequest(updateOrderStatusSchema), updateOrderStatus);

export default router;
