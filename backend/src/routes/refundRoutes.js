import express from "express";

import {
  createRefund,
  getRefund,
  updateRefundDecision,
} from "../controllers/refundController.js";

import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createRefund);
router.get("/:id", getRefund);

router.patch(
  "/:id/decision",
  requireAdmin,
  updateRefundDecision
);

export default router;