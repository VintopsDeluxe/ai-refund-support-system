import {
  getDashboardRefundsService,
  getDashboardSummaryService,
  getDashboardRefundByIdService,
} from "../services/dashboardService.js";

export async function getDashboardRefunds(req, res) {
  try {
    const refunds = await getDashboardRefundsService();

    return res.status(200).json({
      success: true,
      count: refunds.length,
      data: refunds,
    });
  } catch (error) {
    console.error("Dashboard refunds error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard refunds",
      error: error.message,
    });
  }
}

export async function getDashboardSummary(req, res) {
  try {
    const summary = await getDashboardSummaryService();

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
}
export async function getDashboardRefundById(req, res) {
  try {
    const { id } = req.params;

    const refund = await getDashboardRefundByIdService(id);

    return res.status(200).json({
      success: true,
      data: refund,
    });
  } catch (error) {
    console.error("Dashboard refund details error:", error);

    if (error.message === "Refund request not found") {
      return res.status(404).json({
        success: false,
        message: "Refund request not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch refund details",
      error: error.message,
    });
  }
}