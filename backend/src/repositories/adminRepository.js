import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function getAdminByEmail(email) {
  const { data, error } = await supabaseAdmin
    .from("admins")
    .select(`
      id,
      name,
      email,
      password_hash
    `)
    .eq("email", email)
    .maybeSingle();

  if (error) {
    const diagnosticError = new Error("Failed to query admin");
    diagnosticError.code = "SUPABASE_ADMIN_QUERY_ERROR";
    diagnosticError.details = error.message;

    throw diagnosticError;
  }

  return data;
}