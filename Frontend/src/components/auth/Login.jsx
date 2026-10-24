import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { login } from "../../api/authApi";
import { saveSession, canAccessAdmin } from "../../utils/auth";
import "./auth.css";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("customer@travelbook.com");
  const [password, setPassword] = useState("customer123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      saveSession(data);
      if (canAccessAdmin()) {
        history.push("/admin");
      } else {
        history.push("/bookings");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng Nhập Tài Khoản</h2>
        {error && <p className="auth-error">{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
            Tài khoản Demo thử nghiệm:
          </label>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <button
              type="button"
              style={{
                padding: "3px 8px",
                fontSize: "11px",
                background: "#718096",
                color: "#fff",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setDemoAccount("customer@travelbook.com", "customer123")}
            >
              Customer
            </button>
            <button
              type="button"
              style={{
                padding: "3px 8px",
                fontSize: "11px",
                background: "#3182ce",
                color: "#fff",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setDemoAccount("guide@travelbook.com", "guide123")}
            >
              Guide
            </button>
            <button
              type="button"
              style={{
                padding: "3px 8px",
                fontSize: "11px",
                background: "#27ae60",
                color: "#fff",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setDemoAccount("sales@travelbook.com", "sales123")}
            >
              Sales
            </button>
            <button
              type="button"
              style={{
                padding: "3px 8px",
                fontSize: "11px",
                background: "#9b59b6",
                color: "#fff",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setDemoAccount("operator@travelbook.com", "operator123")}
            >
              Operator
            </button>
            <button
              type="button"
              style={{
                padding: "3px 8px",
                fontSize: "11px",
                background: "#f39c12",
                color: "#fff",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setDemoAccount("admin@travelbook.com", "admin123")}
            >
              Admin
            </button>
          </div>
        </div>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
        </button>
        <p style={{ marginTop: "12px", textAlign: "center" }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
