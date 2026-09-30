import { supabase } from "../config/supabase.js";

export async function getOrderById(orderId) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      customer_id,
      product_name,
      amount,
      status,
      order_date,
      delivery_date,
      is_final_sale,
      created_at
    `)
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Order not found.");
  }

  return data;
}