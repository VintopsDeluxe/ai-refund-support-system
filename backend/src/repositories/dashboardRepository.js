// src/repositories/dashboardRepository.js

import { supabase } from "../config/supabase.js";

export async function getDashboardRefunds() {
  const { data, error } = await supabase
    .from("refund_requests")
    .select(`
      id,
      reference,
      customer_id,
      order_id,
      reason,
      description,
      status,
      created_at,

      customers (
        id,
        name,
        email,
        phone
      ),

      orders (
        id,
        product_name,
        amount,
        status,
        order_date,
        delivery_date,
        is_final_sale
      ),

      refund_decisions (
        id,
        decision,
        policy_result,
        ai_classification,
        ai_reasoning,
        final_reason,
        created_at
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch dashboard refunds: ${error.message}`);
  }

  return data || [];
}

export async function getDashboardSummary() {
  const { data, error } = await supabase
    .from("refund_requests")
    .select(`
      id,
      status,

      refund_decisions (
        decision
      )
    `);

  if (error) {
    throw new Error(`Failed to fetch dashboard summary: ${error.message}`);
  }

  const refunds = data || [];

  return {
    totalRequests: refunds.length,

    pendingRequests: refunds.filter(
      (refund) => refund.status === "PENDING"
    ).length,

    approvedDecisions: refunds.filter(
      (refund) =>
        refund.refund_decisions?.decision === "APPROVED"
    ).length,

    escalatedDecisions: refunds.filter(
      (refund) =>
        refund.refund_decisions?.decision === "ESCALATED"
    ).length,

    rejectedDecisions: refunds.filter(
      (refund) =>
        refund.refund_decisions?.decision === "REJECTED"
    ).length,
  };
}
export async function getDashboardRefundById(id) {
  const { data, error } = await supabase
    .from("refund_requests")
    .select(`
      id,
      reference,
      customer_id,
      order_id,
      reason,
      description,
      status,
      created_at,

      customers (
        id,
        name,
        email,
        phone
      ),

      orders (
        id,
        product_name,
        amount,
        status,
        order_date,
        delivery_date,
        is_final_sale
      ),

      refund_decisions (
        id,
        decision,
        policy_result,
        ai_classification,
        ai_reasoning,
        final_reason,
        created_at
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch refund details: ${error.message}`);
  }

  return data;
}