import express from "express";
import { getDashboardSummary } from "../controllers/adminController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, admin, getDashboardSummary);

export default router;
