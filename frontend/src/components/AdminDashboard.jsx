import { useEffect, useState } from "react";
import api from "../api.js";

function AdminDashboard() {
  const [refunds, setRefunds] = useState([]);
  const [summary, setSummary] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedDecisions: 0,
    escalatedDecisions: 0,
    rejectedDecisions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRefund, setSelectedRefund] = useState(null);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [decisionError, setDecisionError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("ALL");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [refundsResponse, summaryResponse] =
        await Promise.all([
          api.get("/dashboard/refunds"),
          api.get("/dashboard/summary"),
        ]);

      setRefunds(refundsResponse.data.data || []);
      setSummary(summaryResponse.data.data || {});
    } catch (error) {
      console.error("Dashboard loading error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString();
  }

  function getDecision(refund) {
    return refund.decision?.decision || "PENDING";
  }

  function getDecisionBadgeStyle(decision) {
    const styles = {
      APPROVED: {
        background: "#ecfdf3",
        color: "#027a48",
      },

      REJECTED: {
        background: "#fef3f2",
        color: "#b42318",
      },

      ESCALATED: {
        background: "#fffaeb",
        color: "#b54708",
      },

      PENDING: {
        background: "#f2f4f7",
        color: "#344054",
      },
    };

    return {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "600",
      ...styles[decision],
    };
  }

  async function handleDecision(decision) {
    if (!selectedRefund) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to ${decision.toLowerCase()} this refund?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDecisionLoading(true);
      setDecisionError("");

      await api.patch(
        `/refunds/${selectedRefund.id}/decision`,
        {
          decision,
        }
      );

      setSelectedRefund(null);

      await loadDashboard();
    } catch (error) {
      console.error("Refund decision error:", error);

      setDecisionError(
        error.response?.data?.message ||
          "Failed to update refund decision."
      );
    } finally {
      setDecisionLoading(false);
    }
  }

  const filteredRefunds = refunds.filter((refund) => {
    const search = searchTerm.toLowerCase();

    const customerName =
      refund.customer?.name?.toLowerCase() || "";

    const reference =
      refund.reference?.toLowerCase() || "";

    const orderId =
      refund.order?.id?.toLowerCase() || "";

    const decision =
      refund.decision?.decision || "PENDING";

    const matchesSearch =
      customerName.includes(search) ||
      reference.includes(search) ||
      orderId.includes(search);

    const matchesDecision =
      decisionFilter === "ALL" ||
      decision === decisionFilter;

    return matchesSearch && matchesDecision;
  });

  if (loading) {
    return (
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e3e7ef",
          borderRadius: "16px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <p>Loading dashboard...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e3e7ef",
          borderRadius: "16px",
          padding: "32px",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            background: "#fef3f2",
            border: "1px solid #fecdca",
            color: "#b42318",
          }}
        >
          {error}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div style={{ marginBottom: "24px" }}>
        <h2>Admin Dashboard</h2>

        <p style={{ color: "#667085" }}>
          Monitor and manage customer refund requests.
        </p>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e3e7ef",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <p style={{ color: "#667085" }}>
            Total Requests
          </p>
          <h3>{summary.totalRequests}</h3>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e3e7ef",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <p style={{ color: "#667085" }}>
            Pending
          </p>
          <h3>{summary.pendingRequests}</h3>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e3e7ef",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <p style={{ color: "#667085" }}>
            Approved
          </p>
          <h3>{summary.approvedDecisions}</h3>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e3e7ef",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <p style={{ color: "#667085" }}>
            Escalated
          </p>
          <h3>{summary.escalatedDecisions}</h3>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e3e7ef",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <p style={{ color: "#667085" }}>
            Rejected
          </p>
          <h3>{summary.rejectedDecisions}</h3>
        </div>
      </div>

      {/* Recent Refund Requests */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e3e7ef",
          borderRadius: "16px",
          padding: "24px",
          boxShadow:
            "0 8px 24px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h3>Recent Refund Requests</h3>

          <p style={{ color: "#667085" }}>
            Review and manage submitted refund requests.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by customer, reference, or order ID..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: "18px",
            border: "1px solid #d0d5dd",
            borderRadius: "8px",
          }}
        />

        <select
          value={decisionFilter}
          onChange={(event) =>
            setDecisionFilter(event.target.value)
          }
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: "24px",
            border: "1px solid #d0d5dd",
            borderRadius: "8px",
            background: "#ffffff",
          }}
        >
          <option value="ALL">All Decisions</option>
          <option value="APPROVED">Approved</option>
          <option value="ESCALATED">Escalated</option>
          <option value="REJECTED">Rejected</option>
          <option value="PENDING">Pending</option>
        </select>

        {filteredRefunds.length === 0 ? (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              color: "#667085",
            }}
          >
            No refund requests found.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "850px",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #e3e7ef",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "14px 12px" }}>
                    Customer
                  </th>

                  <th style={{ padding: "14px 12px" }}>
                    Reference
                  </th>

                  <th style={{ padding: "14px 12px" }}>
                    Order ID
                  </th>

                  <th style={{ padding: "14px 12px" }}>
                    Reason
                  </th>

                  <th style={{ padding: "14px 12px" }}>
                    Decision
                  </th>

                  <th style={{ padding: "14px 12px" }}>
                    Date
                  </th>

                  <th style={{ padding: "14px 12px" }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRefunds.map((refund) => {
                  const decision = getDecision(refund);

                  return (
                    <tr
                      key={refund.id}
                      style={{
                        borderBottom:
                          "1px solid #f0f2f5",
                      }}
                    >
                      <td style={{ padding: "14px 12px" }}>
                        {refund.customer?.name || "—"}
                      </td>

                      <td style={{ padding: "14px 12px" }}>
                        {refund.reference || "—"}
                      </td>

                      <td
                        style={{
                          padding: "14px 12px",
                          fontSize: "13px",
                          fontFamily: "monospace",
                        }}
                      >
                        {refund.order?.id || "—"}
                      </td>

                      <td style={{ padding: "14px 12px" }}>
                        {refund.refund?.reason || "—"}
                      </td>

                      <td style={{ padding: "14px 12px" }}>
                        <span
                          style={getDecisionBadgeStyle(
                            decision
                          )}
                        >
                          {decision}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "14px 12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(
                          refund.refund?.createdAt
                        )}
                      </td>

                      <td style={{ padding: "14px 12px" }}>
                        <button
                          onClick={() =>
                            setSelectedRefund(refund)
                          }
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #d0d5dd",
                            borderRadius: "8px",
                            background: "#ffffff",
                            fontWeight: "500",
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refund Details Modal */}
      {selectedRefund && (
        <div
          onClick={() => {
            if (!decisionLoading) {
              setSelectedRefund(null);
              setDecisionError("");
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2>Refund Details</h2>

              <button
                onClick={() => {
                  setSelectedRefund(null);
                  setDecisionError("");
                }}
                disabled={decisionLoading}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "24px",
                  cursor: decisionLoading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3>Customer Information</h3>

              <p>
                <strong>Name:</strong>{" "}
                {selectedRefund.customer?.name || "—"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedRefund.customer?.email || "—"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {selectedRefund.customer?.phone || "—"}
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3>Order Information</h3>

              <p>
                <strong>Order ID:</strong>{" "}
                {selectedRefund.order?.id || "—"}
              </p>

              <p>
                <strong>Product:</strong>{" "}
                {selectedRefund.order?.productName || "—"}
              </p>

              <p>
                <strong>Amount:</strong>{" "}
                {selectedRefund.order?.amount ?? "—"}
              </p>

              <p>
                <strong>Order Status:</strong>{" "}
                {selectedRefund.order?.status || "—"}
              </p>

              <p>
                <strong>Order Date:</strong>{" "}
                {formatDate(
                  selectedRefund.order?.orderDate
                )}
              </p>

              <p>
                <strong>Delivery Date:</strong>{" "}
                {formatDate(
                  selectedRefund.order?.deliveryDate
                )}
              </p>

              <p>
                <strong>Final Sale:</strong>{" "}
                {selectedRefund.order?.isFinalSale
                  ? "Yes"
                  : "No"}
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3>Refund Information</h3>

              <p>
                <strong>Reference:</strong>{" "}
                {selectedRefund.reference || "—"}
              </p>

              <p>
                <strong>Reason:</strong>{" "}
                {selectedRefund.refund?.reason || "—"}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {selectedRefund.refund?.description || "—"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedRefund.refund?.status || "—"}
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3>AI Decision</h3>

              <p>
                <strong>Decision:</strong>{" "}
                {selectedRefund.decision?.decision ||
                  "PENDING"}
              </p>

              <p>
                <strong>AI Classification:</strong>{" "}
                {selectedRefund.decision?.aiClassification
                  ?.category || "—"}
              </p>

              <p>
                <strong>AI Confidence:</strong>{" "}
                {selectedRefund.decision?.aiClassification
                  ?.confidence ?? "—"}
              </p>

              <p>
                <strong>AI Reasoning:</strong>{" "}
                {selectedRefund.decision?.aiReasoning ||
                  "—"}
              </p>

              <p>
                <strong>Final Reason:</strong>{" "}
                {selectedRefund.decision?.finalReason ||
                  "—"}
              </p>
            </div>

            {/* Admin Decision Buttons */}
            {selectedRefund.decision?.decision ===
              "ESCALATED" && (
              <div
                style={{
                  marginTop: "28px",
                  paddingTop: "24px",
                  borderTop: "1px solid #e3e7ef",
                }}
              >
                <h3>Admin Decision</h3>

                <p
                  style={{
                    color: "#667085",
                    marginBottom: "16px",
                  }}
                >
                  This refund requires human review.
                </p>

                {decisionError && (
                  <div
                    style={{
                      marginBottom: "16px",
                      padding: "12px",
                      borderRadius: "8px",
                      background: "#fef3f2",
                      border: "1px solid #fecdca",
                      color: "#b42318",
                    }}
                  >
                    {decisionError}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() =>
                      handleDecision("APPROVED")
                    }
                    disabled={decisionLoading}
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#16a34a",
                      color: "#ffffff",
                      fontWeight: "600",
                      opacity: decisionLoading
                        ? 0.6
                        : 1,
                    }}
                  >
                    {decisionLoading
                      ? "Processing..."
                      : "Approve Refund"}
                  </button>

                  <button
                    onClick={() =>
                      handleDecision("REJECTED")
                    }
                    disabled={decisionLoading}
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#dc2626",
                      color: "#ffffff",
                      fontWeight: "600",
                      opacity: decisionLoading
                        ? 0.6
                        : 1,
                    }}
                  >
                    {decisionLoading
                      ? "Processing..."
                      : "Reject Refund"}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedRefund(null);
                setDecisionError("");
              }}
              disabled={decisionLoading}
              style={{
                width: "100%",
                marginTop: "24px",
                padding: "12px",
                border: "1px solid #d0d5dd",
                borderRadius: "8px",
                background: "#ffffff",
                fontWeight: "600",
                cursor: decisionLoading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminDashboard;