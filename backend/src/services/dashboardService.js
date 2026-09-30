// src/services/dashboardService.js

import {
  getDashboardRefunds,
  getDashboardSummary,
  getDashboardRefundById,
} from "../repositories/dashboardRepository.js";

export async function getDashboardRefundsService() {
  const refunds = await getDashboardRefunds();

  return refunds.map((refund) => {
    const customer = refund.customers;
    const order = refund.orders;
    const decision = refund.refund_decisions;

    return {
      id: refund.id,
      reference: refund.reference,

      customer: {
        id: refund.customer_id,
        name: customer?.name ?? null,
        email: customer?.email ?? null,
        phone: customer?.phone ?? null,
      },

      order: {
        id: refund.order_id,
        productName: order?.product_name ?? null,
        amount: order?.amount ?? null,
        status: order?.status ?? null,
        orderDate: order?.order_date ?? null,
        deliveryDate: order?.delivery_date ?? null,
        isFinalSale: order?.is_final_sale ?? false,
      },

      refund: {
        reason: refund.reason,
        description: refund.description,
        status: refund.status,
        createdAt: refund.created_at,
      },

      decision: decision
        ? {
            decision: decision.decision,
            policyResult: decision.policy_result,
            aiClassification: decision.ai_classification,
            aiReasoning: decision.ai_reasoning,
            finalReason: decision.final_reason,
            createdAt: decision.created_at,
          }
        : null,
    };
  });
}

export async function getDashboardRefundByIdService(id) {
  const refund = await getDashboardRefundById(id);

  if (!refund) {
    throw new Error("Refund request not found");
  }

  const customer = refund.customers;
  const order = refund.orders;
  const decision = refund.refund_decisions;

  return {
    id: refund.id,
    reference: refund.reference,

    customer: {
      id: refund.customer_id,
      name: customer?.name ?? null,
      email: customer?.email ?? null,
      phone: customer?.phone ?? null,
    },

    order: {
      id: refund.order_id,
      productName: order?.product_name ?? null,
      amount: order?.amount ?? null,
      status: order?.status ?? null,
      orderDate: order?.order_date ?? null,
      deliveryDate: order?.delivery_date ?? null,
      isFinalSale: order?.is_final_sale ?? false,
    },

    refund: {
      reason: refund.reason,
      description: refund.description,
      status: refund.status,
      createdAt: refund.created_at,
    },

    decision: decision
      ? {
          id: decision.id,
          decision: decision.decision,
          policyResult: decision.policy_result,
          aiClassification: decision.ai_classification,
          aiReasoning: decision.ai_reasoning,
          finalReason: decision.final_reason,
          createdAt: decision.created_at,
        }
      : null,
  };
}

export async function getDashboardSummaryService() {
  return await getDashboardSummary();
}