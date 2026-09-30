import express from "express";
import { getOrder } from "../controllers/orderController.js";

const router = express.Router();

router.get("/:id", getOrder);

export default router;