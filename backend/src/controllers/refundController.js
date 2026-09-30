import {
  processRefundRequest,
  getRefundDetails,
  updateAdminRefundDecision,
} from "../services/refundService.js";

export async function createRefund(req, res) {
  try {
    const {
      customerId,
      orderId,
      reason,
      description,
    } = req.body;

    const result = await processRefundRequest({
      customerId,
      orderId,
      reason,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Refund request processed successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error processing refund request:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process refund request.",
    });
  }
}

export async function getRefund(req, res) {
  try {
    const { id } = req.params;

    const result = await getRefundDetails(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching refund:", error);

    res.status(404).json({
      success: false,
      message: "Refund request not found.",
    });
  }
}
export async function updateRefundDecision(req, res) {
  try {
    const { id } = req.params;
    const { decision } = req.body;

    const updatedDecision =
      await updateAdminRefundDecision({
        refundRequestId: id,
        decision,
        adminId: req.admin.adminId,
      });

    return res.status(200).json({
      success: true,
      message: "Refund decision updated successfully.",
      data: updatedDecision,
    });
  } catch (error) {
    console.error(
      "Error updating refund decision:",
      error
    );

    if (
      error.message === "Invalid admin decision" ||
      error.message ===
        "Only escalated refunds can be updated by an admin"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Refund decision not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update refund decision.",
    });
  }
}