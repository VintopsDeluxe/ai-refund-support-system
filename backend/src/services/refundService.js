import { getOrderById } from "../repositories/orderRepository.js";
import {
  createRefundRequest,
  getRefundById,
} from "../repositories/refundRepository.js";
import {
  createRefundDecision,
  getRefundDecision,
  updateRefundDecision,
} from "../repositories/refundDecisionRepository.js";
import {
  createAuditLog,
  getAuditLogs,
} from "../repositories/auditLogRepository.js";

import { evaluateRefundPolicy } from "./refundPolicyService.js";
import { classifyRefundRequest } from "./aiService.js";

export async function processRefundRequest({
  customerId,
  orderId,
  reason,
  description,
}) {
  // 1. Get the order
  const order = await getOrderById(orderId);

  // 2. Run the deterministic refund policy
  const policyResult = evaluateRefundPolicy(order, reason);

  // 3. Classify the customer's request
  const aiResult = await classifyRefundRequest({
    reason,
    description,
  });

  // 4. Generate a refund reference
  const reference = `REF-${Date.now()}`;

  // 5. Create the refund request
  const refundRequest = await createRefundRequest({
    reference,
    customerId,
    orderId,
    reason,
    description,
  });

  // 6. Determine the final decision
  let finalDecision = policyResult.decision;
  let finalReason = policyResult.reasons.join(" ");

  // Suspicious requests always require human review.
  if (aiResult.requiresHumanReview) {
    finalDecision = "ESCALATED";

    finalReason = `${finalReason} AI classification flagged the request for human review: ${aiResult.reasoning}`;
  }

  // 7. Create the refund decision
  const refundDecision = await createRefundDecision({
    refundRequestId: refundRequest.id,
    decision: finalDecision,
    policyResult,
    aiClassification: aiResult,
    aiReasoning: aiResult.reasoning,
    finalReason,
  });

  // 8. Create audit log
  await createAuditLog({
    refundRequestId: refundRequest.id,
    event: "REFUND_DECISION_CREATED",
    metadata: {
      decision: finalDecision,
      policyDecision: policyResult.decision,
      aiCategory: aiResult.category,
      aiConfidence: aiResult.confidence,
      customerId,
      orderId,
    },
  });

  return {
    refundRequest,
    refundDecision,
  };
}

export async function getRefundDetails(refundId) {
  // 1. Get the refund request
  const refundRequest = await getRefundById(refundId);

  // 2. Get the decision
  const refundDecision = await getRefundDecision(refundId);

  // 3. Get the audit history
  const auditLogs = await getAuditLogs(refundId);

  return {
    refundRequest,
    refundDecision,
    auditLogs,
  };
}
export async function updateAdminRefundDecision({
  refundRequestId,
  decision,
  adminId,
}) {
  if (!["APPROVED", "REJECTED"].includes(decision)) {
    throw new Error("Invalid admin decision");
  }

  const currentDecision = await getRefundDecision(
    refundRequestId
  );

  if (!currentDecision) {
    throw new Error("Refund decision not found");
  }

  if (currentDecision.decision !== "ESCALATED") {
    throw new Error(
      "Only escalated refunds can be updated by an admin"
    );
  }

  const finalReason =
    decision === "APPROVED"
      ? "Refund approved by an authorized admin."
      : "Refund rejected by an authorized admin.";

  const updatedDecision = await updateRefundDecision(
    refundRequestId,
    decision,
    finalReason
  );

  await createAuditLog({
    refundRequestId,
    event: "ADMIN_DECISION_UPDATED",
    metadata: {
      adminId,
      decision,
      finalReason,
    },
  });

  return updatedDecision;
}