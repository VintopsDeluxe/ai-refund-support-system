import express from "express";

import {
    getDashboardRefundById,
  getDashboardRefunds,
  getDashboardSummary,
} from "../controllers/dashboardController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/refunds", requireAdmin, getDashboardRefunds);
router.get("/summary", requireAdmin, getDashboardSummary);
router.get("/refunds/:id", requireAdmin, getDashboardRefundById);


export default router;