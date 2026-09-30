import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

import { supabase } from "../config/supabase.js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function createRefundDecision({
  refundRequestId,
  decision,
  policyResult,
  aiClassification,
  aiReasoning,
  finalReason,
}) {
  const { data, error } = await supabase
    .from("refund_decisions")
    .insert({
      refund_request_id: refundRequestId,
      decision,
      policy_result: policyResult,
      ai_classification: aiClassification,
      ai_reasoning: aiReasoning,
      final_reason: finalReason,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getRefundDecision(refundRequestId) {
  const { data, error } = await supabase
    .from("refund_decisions")
    .select(`
      id,
      refund_request_id,
      decision,
      policy_result,
      ai_classification,
      ai_reasoning,
      final_reason,
      created_at
    `)
    .eq("refund_request_id", refundRequestId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateRefundDecision(
  refundRequestId,
  decision,
  finalReason
) {
  const { data, error } = await supabaseAdmin
    .from("refund_decisions")
    .update({
      decision,
      final_reason: finalReason,
    })
    .eq("refund_request_id", refundRequestId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}