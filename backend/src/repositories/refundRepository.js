import { supabase } from "../config/supabase.js";

export async function createRefundRequest({
  reference,
  customerId,
  orderId,
  reason,
  description,
}) {
  const { data, error } = await supabase
    .from("refund_requests")
    .insert({
      reference,
      customer_id: customerId,
      order_id: orderId,
      reason,
      description,
      status: "PENDING",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getRefundById(refundId) {
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
      created_at
    `)
    .eq("id", refundId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Refund request not found.");
  }

  return data;
}