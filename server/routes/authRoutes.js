import express from "express";
import {
  getProfile,
  loginUser,
  requestPasswordReset,
  registerUser,
  updateProfile
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  loginSchema,
  forgotPasswordSchema,
  registerSchema,
  updateProfileSchema
} from "../validators/authValidators.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), requestPasswordReset);
router
  .route("/profile")
  .get(protect, getProfile)
  .put(protect, validateRequest(updateProfileSchema), updateProfile);

export default router;
