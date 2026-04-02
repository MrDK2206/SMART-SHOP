import express from "express";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  getCategories,
  getCategoryBySlug,
  updateCategory
} from "../controllers/categoryController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  categoryIdSchema,
  saveCategorySchema
} from "../validators/categoryValidators.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/admin", protect, admin, getAdminCategories);
router.get("/:slug", getCategoryBySlug);
router.post("/", protect, admin, validateRequest(saveCategorySchema), createCategory);
router.put(
  "/:id",
  protect,
  admin,
  validateRequest(saveCategorySchema),
  updateCategory
);
router.delete(
  "/:id",
  protect,
  admin,
  validateRequest(categoryIdSchema),
  deleteCategory
);

export default router;
