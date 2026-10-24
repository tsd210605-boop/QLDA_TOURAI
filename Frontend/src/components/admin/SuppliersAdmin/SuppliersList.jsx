import React, { useState, useEffect } from "react";
import { getAllSuppliers, createSupplier } from "../../../api/operationsApi";

const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    supplierName: "",
    serviceType: "HOTEL",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    currentDebt: 0,
  });

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getAllSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error("Error loading suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSupplier(form);
      alert("Thêm nhà cung ứng đối tác thành công!");
      setShowAddModal(false);
      setForm({
        supplierName: "",
        serviceType: "HOTEL",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        currentDebt: 0,
      });
      loadSuppliers();
    } catch (err) {
      alert("Lỗi thêm đối tác: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2>DANH BẠ NHÀ CUNG ỨNG & CÔNG NỢ ĐỐI TÁC</h2>
          <p style={{ color: "#666" }}>Quản lý đối tác khách sạn, nhà hàng, phương tiện và theo dõi số dư công nợ dịch vụ.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ padding: "10px 16px", background: "#2ecc71", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          + Thêm Đối Tác Mới
        </button>
      </div>

      {loading ? (
        <p>Đang tải danh bạ nhà cung cấp...</p>
      ) : suppliers.length === 0 ? (
        <p>Chưa có nhà cung cấp nào.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.08)" }}>
          <thead>
            <tr style={{ background: "#2c3e50", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Tên Nhà Cung Ứng</th>
              <th style={{ padding: "12px" }}>Loại Dịch Vụ</th>
              <th style={{ padding: "12px" }}>Người Liên Hệ</th>
              <th style={{ padding: "12px" }}>Số Điện Thoại</th>
              <th style={{ padding: "12px" }}>Địa Chỉ</th>
              <th style={{ padding: "12px" }}>Công Nợ Hiện Tại ($)</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.supplierId} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{s.supplierId}</td>
                <td style={{ padding: "12px" }}><strong>{s.supplierName}</strong></td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    backgroundColor: s.serviceType === "HOTEL" ? "#9b59b6" : s.serviceType === "RESTAURANT" ? "#e67e22" : "#3498db",
                    color: "#fff"
                  }}>
                    {s.serviceType}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>{s.contactPerson}</td>
                <td style={{ padding: "12px" }}>{s.phone}</td>
                <td style={{ padding: "12px" }}>{s.address}</td>
                <td style={{ padding: "12px", color: s.currentDebt > 0 ? "#e74c3c" : "#2ecc71", fontWeight: "bold" }}>
                  ${s.currentDebt || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Thêm Nhà Cung Cấp */}
      {showAddModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", width: "450px", maxWidth: "90%" }}>
            <h3>Thêm Nhà Cung Ứng / Đối Tác Mới</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Tên Nhà cung ứng (*):</label>
                <input
                  type="text"
                  required
                  value={form.supplierName}
                  onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Loại dịch vụ (*):</label>
                <select
                  value={form.serviceType}
                  onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                >
                  <option value="HOTEL">HOTEL (Khách sạn / Lưu trú)</option>
                  <option value="RESTAURANT">RESTAURANT (Ăn uống / Nhà hàng)</option>
                  <option value="TRANSPORT">TRANSPORT (Xe / Tàu vận chuyển)</option>
                  <option value="TICKET">TICKET (Vé tham quan / Cáp treo)</option>
                  <option value="OTHER">OTHER (Dịch vụ khác)</option>
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Người liên hệ:</label>
                <input
                  type="text"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Số điện thoại:</label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Email:</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Địa chỉ:</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: "8px 16px" }}>Hủy</button>
                <button type="submit" style={{ padding: "8px 16px", background: "#2ecc71", color: "#fff", border: "none", borderRadius: "4px" }}>Lưu Đối Tác</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersList;
