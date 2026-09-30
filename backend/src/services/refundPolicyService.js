const REFUND_WINDOW_DAYS = 30;
const HUMAN_REVIEW_THRESHOLD = 500;

export function evaluateRefundPolicy(order, reason) {
  const reasons = [];

  const orderDate = new Date(order.order_date);
  const today = new Date();

  const ageInDays = Math.floor(
    (today - orderDate) / (1000 * 60 * 60 * 24)
  );

  // Rule 1: Final-sale orders are never eligible.
  if (order.is_final_sale) {
    reasons.push("Order is marked as final sale.");

    return {
      decision: "DENIED",
      eligible: false,
      requiresHumanReview: false,
      reasons,
      orderAgeDays: ageInDays,
    };
  }

  // Rule 2: Orders older than the refund window are not eligible.
  if (ageInDays > REFUND_WINDOW_DAYS) {
    reasons.push(
      `Order is ${ageInDays} days old, exceeding the ${REFUND_WINDOW_DAYS}-day refund window.`
    );

    return {
      decision: "DENIED",
      eligible: false,
      requiresHumanReview: false,
      reasons,
      orderAgeDays: ageInDays,
    };
  }

  // Rule 3: High-value refunds require human review.
  if (order.amount > HUMAN_REVIEW_THRESHOLD) {
    reasons.push(
      `Refund amount of $${order.amount} exceeds the $${HUMAN_REVIEW_THRESHOLD} human-review threshold.`
    );

    return {
      decision: "ESCALATED",
      eligible: false,
      requiresHumanReview: true,
      reasons,
      orderAgeDays: ageInDays,
    };
  }

  // Rule 4: Damaged or incorrect items can qualify for refund.
  const normalizedReason = reason?.toLowerCase() || "";

  const qualifyingReasons = [
    "damaged",
    "incorrect",
    "wrong item",
    "defective",
    "broken",
  ];

  const hasQualifyingReason = qualifyingReasons.some((keyword) =>
    normalizedReason.includes(keyword)
  );

  if (hasQualifyingReason) {
    reasons.push(
      "Request contains a qualifying damaged or incorrect-item reason."
    );
  }

  return {
    decision: "APPROVED",
    eligible: true,
    requiresHumanReview: false,
    reasons,
    orderAgeDays: ageInDays,
  };
}