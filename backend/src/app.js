import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Refund Support API is running",
  });
});

app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/refunds", refundRoutes);

export default app;