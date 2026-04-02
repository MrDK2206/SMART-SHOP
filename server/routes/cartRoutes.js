import express from "express";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToCartSchema, updateCartSchema } from "../validators/cartValidators.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getCart)
  .post(protect, validateRequest(addToCartSchema), addToCart);
router
  .route("/:productId")
  .put(protect, validateRequest(updateCartSchema), updateCartItem)
  .delete(protect, removeCartItem);

export default router;
