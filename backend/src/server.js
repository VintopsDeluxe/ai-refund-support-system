import express from "express";
import cors from "cors";


import refundRoutes from "./routes/refundRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Existing routes
app.use("/api/refunds", refundRoutes);

// Dashboard routes
app.use("/api/dashboard", dashboardRoutes);

// Auth Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Refund Support System API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});