import express from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getCatalogMeta,
  getFeaturedProducts,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  getProductsSchema,
  productIdSchema,
  saveProductSchema
} from "../validators/catalogValidators.js";

const router = express.Router();

router.get("/", validateRequest(getProductsSchema), getProducts);
router.get("/meta", getCatalogMeta);
router.get("/featured", getFeaturedProducts);
router.post("/", protect, admin, validateRequest(saveProductSchema), createProduct);
router
  .route("/:id")
  .get(validateRequest(productIdSchema), getProductById)
  .put(protect, admin, validateRequest(saveProductSchema), updateProduct)
  .delete(protect, admin, validateRequest(productIdSchema), deleteProduct);
router.post("/:id/reviews", protect, createProductReview);

export default router;
