import { useState } from "react";
import api from "../api.js";

function RefundForm() {
  const [formData, setFormData] = useState({
    customerId: "",
    orderId: "",
    reason: "",
    description: "",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setResponse(null);

    try {
      const result = await api.post("/refunds", formData);

      setResponse({
        success: true,
        message: "Refund request submitted successfully.",
        data: result.data,
      });

      setFormData({
        customerId: "",
        orderId: "",
        reason: "",
        description: "",
      });
    } catch (error) {
      setResponse({
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to submit refund request.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e3e7ef",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h2>Submit a Refund Request</h2>

        <p style={{ color: "#667085" }}>
          Submit a customer refund request for AI-powered processing.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="customerId">Customer ID</label>

          <input
            id="customerId"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
            style={{
              display: "block",
              width: "100%",
              marginTop: "8px",
              padding: "12px",
              border: "1px solid #d0d5dd",
              borderRadius: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="orderId">Order ID</label>

          <input
            id="orderId"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            required
            style={{
              display: "block",
              width: "100%",
              marginTop: "8px",
              padding: "12px",
              border: "1px solid #d0d5dd",
              borderRadius: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="reason">Reason</label>

          <input
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            style={{
              display: "block",
              width: "100%",
              marginTop: "8px",
              padding: "12px",
              border: "1px solid #d0d5dd",
              borderRadius: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            style={{
              display: "block",
              width: "100%",
              marginTop: "8px",
              padding: "12px",
              border: "1px solid #d0d5dd",
              borderRadius: "8px",
              resize: "vertical",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#ffffff",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Submitting..." : "Submit Refund Request"}
        </button>
      </form>

      {response && (
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            borderRadius: "10px",
            background: response.success ? "#ecfdf3" : "#fef3f2",
            border: response.success
              ? "1px solid #abefc6"
              : "1px solid #fecdca",
          }}
        >
          <h3>
            {response.success ? "Refund Response" : "Error"}
          </h3>

          <p>{response.message}</p>

          {response.success &&
            response.data?.data?.refundDecision && (
              <div>
                <p>
                  <strong>Decision:</strong>{" "}
                  {response.data.data.refundDecision.decision}
                </p>

                <p>
                  <strong>Reason:</strong>{" "}
                  {response.data.data.refundDecision.final_reason}
                </p>
              </div>
            )}
        </div>
      )}
    </section>
  );
}

export default RefundForm;