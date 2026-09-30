import { useState } from "react";
import api from "../api.js";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await api.post("/auth/login", {
        email,
        password,
      });

      const token = result.data.data.token;
      const admin = result.data.data.admin;

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(admin));

      onLogin(admin);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        background: "#ffffff",
        border: "1px solid #e3e7ef",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h2>Admin Login</h2>

        <p style={{ color: "#667085" }}>
          Sign in to access the refund support dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="adminEmail">Email</label>

          <input
            id="adminEmail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
          <label htmlFor="adminPassword">Password</label>

          <input
            id="adminPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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

        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px",
              borderRadius: "8px",
              background: "#fef3f2",
              border: "1px solid #fecdca",
              color: "#b42318",
            }}
          >
            {error}
          </div>
        )}

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
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </section>
  );
}

export default AdminLogin;