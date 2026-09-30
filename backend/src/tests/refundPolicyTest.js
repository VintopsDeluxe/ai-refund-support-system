import { evaluateRefundPolicy } from "../services/refundPolicyService.js";

// Test 1: Final-sale order → DENIED
const finalSaleOrder = {
  amount: 129.99,
  order_date: new Date().toISOString(),
  is_final_sale: true,
};

const finalSaleResult = evaluateRefundPolicy(
  finalSaleOrder,
  "I want a refund."
);

console.log("\n--- FINAL SALE TEST ---");
console.log(finalSaleResult);


// Test 2: High-value order → ESCALATED
const highValueOrder = {
  amount: 750,
  order_date: new Date().toISOString(),
  is_final_sale: false,
};

const highValueResult = evaluateRefundPolicy(
  highValueOrder,
  "The item arrived damaged."
);

console.log("\n--- HIGH VALUE TEST ---");
console.log(highValueResult);