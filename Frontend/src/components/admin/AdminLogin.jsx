import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { login } from "../../api/authApi";
import { saveSession, canAccessAdmin } from "../../utils/auth";
import "../admin/admin.css";

const AdminLogin = () => {
  const history = useHistory();
  const [email, setEmail] = useState("admin@travelbook.com");
  const [password, setPassword] = useState("admin123");
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
      // Save session with role and permissions
      saveSession(data);

      if (!canAccessAdmin()) {
        setError(
          `Tài khoản (${data.role}) không có quyền truy cập khu vực quản trị. Khu vực này dành cho ADMIN, OPERATOR hoặc SALES.`
        );
        return;
      }

      history.push("/admin");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Quản Trị TravelBook</h2>
        <p className="admin-login-hint">Đăng nhập hệ thống Phân quyền Quản trị (RBAC)</p>

        {error && <p className="admin-login-error">{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
            Chọn nhanh tài khoản Demo theo Vai trò:
          </label>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <button
              type="button"
              style={{
                padding: "4px 8px",
                fontSize: "12px",
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
            <button
              type="button"
              style={{
                padding: "4px 8px",
                fontSize: "12px",
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
                padding: "4px 8px",
                fontSize: "12px",
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
          {loading ? "Đang xử lý..." : "Đăng nhập Quản trị"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
