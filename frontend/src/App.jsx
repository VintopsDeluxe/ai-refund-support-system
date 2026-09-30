import { useState } from "react";

import RefundForm from "./components/RefundForm.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import AdminLogin from "./components/AdminLogin.jsx";

function App() {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem("adminUser");

    return savedAdmin
      ? JSON.parse(savedAdmin)
      : null;
  });

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    setAdmin(null);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h1>WORKNOON AI Refund Support System</h1>

          <p>
            AI-powered refund processing and support management.
          </p>
        </header>

        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <RefundForm />

          <hr
            style={{
              margin: "48px 0",
              border: "none",
              borderTop: "1px solid #dfe3ea",
            }}
          />

          {admin ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  gap: "16px",
                }}
              >
                <p style={{ margin: 0 }}>
                  Signed in as <strong>{admin.name}</strong>
                </p>

                <button
                  onClick={handleLogout}
                  style={{
                    padding: "10px 16px",
                    border: "1px solid #d0d5dd",
                    borderRadius: "8px",
                    background: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>

              <AdminDashboard />
            </>
          ) : (
            <AdminLogin onLogin={setAdmin} />
          )}
        </div>
      </div>
    </main>
  );
}

export default App;