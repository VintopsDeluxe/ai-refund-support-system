import { supabase } from "../config/supabase.js";

export async function createAuditLog({
  refundRequestId,
  event,
  metadata,
}) {
  const { data, error } = await supabase
    .from("audit_logs")
    .insert({
      refund_request_id: refundRequestId,
      event,
      metadata,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAuditLogs(refundRequestId) {
  const { data, error } = await supabase
    .from("audit_logs")
    .select(`
      id,
      refund_request_id,
      event,
      metadata,
      created_at
    `)
    .eq("refund_request_id", refundRequestId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}