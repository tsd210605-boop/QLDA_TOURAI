import React, { useState, useEffect } from "react";
import { getAllDepartures, dispatchTour, bookSupplierForTour, getTourAllocations, getAllSuppliers } from "../../../api/operationsApi";

const OperationsList = () => {
  const [departures, setDepartures] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [activeDep, setActiveDep] = useState(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showAllocationsModal, setShowAllocationsModal] = useState(false);
  const [allocations, setAllocations] = useState([]);

  // Dispatch form
  const [dispatchForm, setDispatchForm] = useState({
    tourGuideName: "",
    tourGuidePhone: "",
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
    status: "DISPATCHED",
    notes: "",
  });

  // Supplier booking form
  const [supplierForm, setSupplierForm] = useState({
    supplierId: "",
    serviceName: "",
    serviceType: "HOTEL",
    estimatedCost: "",
    notes: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [depList, supList] = await Promise.all([
        getAllDepartures(),
        getAllSuppliers(),
      ]);
      setDepartures(depList);
      setSuppliers(supList);
    } catch (err) {
      console.error("Error loading operations data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openDispatch = (dep) => {
    setActiveDep(dep);
    setDispatchForm({
      tourGuideName: dep.tourGuideName || "",
      tourGuidePhone: dep.tourGuidePhone || "",
      vehicleNumber: dep.vehicleNumber || "",
      driverName: dep.driverName || "",
      driverPhone: dep.driverPhone || "",
      status: dep.status || "DISPATCHED",
      notes: dep.notes || "",
    });
    setShowDispatchModal(true);
  };

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatchTour(activeDep.departureId, dispatchForm);
      alert("Phân công Hướng dẫn viên và xe thành công!");
      setShowDispatchModal(false);
      loadData();
    } catch (err) {
      alert("Lỗi phân công: " + err.message);
    }
  };

  const openSupplierBooking = (dep) => {
    setActiveDep(dep);
    setSupplierForm({
      supplierId: suppliers[0]?.supplierId || "",
      serviceName: "",
      serviceType: "HOTEL",
      estimatedCost: "",
      notes: "",
    });
    setShowSupplierModal(true);
  };

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookSupplierForTour(activeDep.departureId, {
        ...supplierForm,
        supplierId: Number(supplierForm.supplierId),
        estimatedCost: Number(supplierForm.estimatedCost),
      });
      alert("Đặt dịch vụ đối tác thành công!");
      setShowSupplierModal(false);
    } catch (err) {
      alert("Lỗi đặt dịch vụ: " + err.message);
    }
  };

  const viewAllocations = async (dep) => {
    setActiveDep(dep);
    try {
      const data = await getTourAllocations(dep.departureId);
      setAllocations(data);
      setShowAllocationsModal(true);
    } catch (err) {
      alert("Lỗi tải dịch vụ: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>MODULE ĐIỀU HÀNH TOUR & ĐỐI TÁC</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Quản lý đợt khởi hành đoàn tour, phân công Hướng dẫn viên, Xe vận chuyển và điều phối dịch vụ nhà cung ứng (Khách sạn, Nhà hàng, Vé tham quan).
      </p>

      {loading ? (
        <p>Đang tải dữ liệu điều hành...</p>
      ) : departures.length === 0 ? (
        <div style={{ background: "#f8f9fa", padding: "30px", textAlign: "center", borderRadius: "8px" }}>
          <p>Chưa có đợt khởi hành nào. Khi khách hàng đặt và thanh toán tour, đoàn tour sẽ tự động xuất hiện tại đây.</p>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.08)" }}>
          <thead>
            <tr style={{ background: "#2c3e50", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Mã Đoàn</th>
              <th style={{ padding: "12px" }}>Tour Du Lịch</th>
              <th style={{ padding: "12px" }}>Ngày Khởi Hành</th>
              <th style={{ padding: "12px" }}>Hướng Dẫn Viên (HDV)</th>
              <th style={{ padding: "12px" }}>Xe & Lái Xe</th>
              <th style={{ padding: "12px" }}>Trạng Thái</th>
              <th style={{ padding: "12px" }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {departures.map((dep) => (
              <tr key={dep.departureId} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}><strong>DEP-{dep.departureId}</strong></td>
                <td style={{ padding: "12px" }}>{dep.packageTitle}</td>
                <td style={{ padding: "12px" }}>{dep.departureDate}</td>
                <td style={{ padding: "12px" }}>
                  {dep.tourGuideName ? (
                    <div>
                      <div>👤 {dep.tourGuideName}</div>
                      <small style={{ color: "#666" }}>📞 {dep.tourGuidePhone}</small>
                    </div>
                  ) : (
                    <span style={{ color: "#e74c3c" }}>Chưa phân công</span>
                  )}
                </td>
                <td style={{ padding: "12px" }}>
                  {dep.vehicleNumber ? (
                    <div>
                      <div>🚐 Biển số: {dep.vehicleNumber}</div>
                      <small style={{ color: "#666" }}>Tài xế: {dep.driverName} ({dep.driverPhone})</small>
                    </div>
                  ) : (
                    <span style={{ color: "#e74c3c" }}>Chưa phân xe</span>
                  )}
                </td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor: dep.status === "COMPLETED" ? "#2ecc71" : dep.status === "DISPATCHED" ? "#3498db" : "#f39c12",
                    color: "#fff"
                  }}>
                    {dep.status}
                  </span>
                </td>
                <td style={{ padding: "12px", display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => openDispatch(dep)}
                    style={{ padding: "6px 10px", background: "#3498db", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                  >
                    Phân công HDV & Xe
                  </button>
                  <button
                    onClick={() => openSupplierBooking(dep)}
                    style={{ padding: "6px 10px", background: "#27ae60", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                  >
                    + Đặt Dịch vụ
                  </button>
                  <button
                    onClick={() => viewAllocations(dep)}
                    style={{ padding: "6px 10px", background: "#f39c12", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                  >
                    Xem Dịch vụ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Phân công HDV & Xe */}
      {showDispatchModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", width: "450px", maxWidth: "90%" }}>
            <h3>Phân công Hướng dẫn viên & Phương tiện (DEP-{activeDep?.departureId})</h3>
            <form onSubmit={handleDispatchSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Tên Hướng dẫn viên:</label>
                <input
                  type="text"
                  required
                  value={dispatchForm.tourGuideName}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, tourGuideName: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>SĐT Hướng dẫn viên:</label>
                <input
                  type="text"
                  required
                  value={dispatchForm.tourGuidePhone}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, tourGuidePhone: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Biển số xe / Phương tiện:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 29B-123.45"
                  value={dispatchForm.vehicleNumber}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, vehicleNumber: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Họ tên Lái xe:</label>
                <input
                  type="text"
                  value={dispatchForm.driverName}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, driverName: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>SĐT Lái xe:</label>
                <input
                  type="text"
                  value={dispatchForm.driverPhone}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, driverPhone: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Trạng thái đoàn:</label>
                <select
                  value={dispatchForm.status}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, status: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                >
                  <option value="PREPARING">PREPARING (Chuẩn bị)</option>
                  <option value="DISPATCHED">DISPATCHED (Đã phân công)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Đang đi tour)</option>
                  <option value="COMPLETED">COMPLETED (Hoàn thành)</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                <button type="button" onClick={() => setShowDispatchModal(false)} style={{ padding: "8px 16px" }}>Hủy</button>
                <button type="submit" style={{ padding: "8px 16px", background: "#3498db", color: "#fff", border: "none", borderRadius: "4px" }}>Lưu phân công</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Đặt Dịch vụ Đối tác */}
      {showSupplierModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", width: "450px", maxWidth: "90%" }}>
            <h3>Đặt Dịch Vụ Đối Tác (DEP-{activeDep?.departureId})</h3>
            <form onSubmit={handleSupplierSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Chọn Nhà cung cấp / Đối tác:</label>
                <select
                  value={supplierForm.supplierId}
                  onChange={(e) => setSupplierForm({ ...supplierForm, supplierId: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                  required
                >
                  {suppliers.map((s) => (
                    <option key={s.supplierId} value={s.supplierId}>
                      {s.supplierName} ({s.serviceType})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Tên dịch vụ đặt:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Phòng khách sạn Deluxe 2 đêm"
                  value={supplierForm.serviceName}
                  onChange={(e) => setSupplierForm({ ...supplierForm, serviceName: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Loại dịch vụ:</label>
                <select
                  value={supplierForm.serviceType}
                  onChange={(e) => setSupplierForm({ ...supplierForm, serviceType: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                >
                  <option value="HOTEL">HOTEL (Khách sạn / Lưu trú)</option>
                  <option value="RESTAURANT">RESTAURANT (Ăn uống / Nhà hàng)</option>
                  <option value="TRANSPORT">TRANSPORT (Xe / Tàu / Vận chuyển)</option>
                  <option value="TICKET">TICKET (Vé tham quan / Cáp treo)</option>
                  <option value="OTHER">OTHER (Dịch vụ khác)</option>
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px" }}>Chi phí dự kiến ($):</label>
                <input
                  type="number"
                  required
                  placeholder="VD: 500"
                  value={supplierForm.estimatedCost}
                  onChange={(e) => setSupplierForm({ ...supplierForm, estimatedCost: e.target.value })}
                  style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                <button type="button" onClick={() => setShowSupplierModal(false)} style={{ padding: "8px 16px" }}>Hủy</button>
                <button type="submit" style={{ padding: "8px 16px", background: "#27ae60", color: "#fff", border: "none", borderRadius: "4px" }}>Xác nhận đặt & Cấp Voucher</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xem Dịch vụ đã đặt */}
      {showAllocationsModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", width: "600px", maxWidth: "90%" }}>
            <h3>Danh sách Dịch Vụ Đối Tác Đã Đặt (DEP-{activeDep?.departureId})</h3>
            {allocations.length === 0 ? (
              <p>Chưa có dịch vụ nào được đặt cho đoàn này.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Tên Dịch Vụ</th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Loại</th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Chi Phí</th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Mã Voucher</th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((a) => (
                    <tr key={a.allocationId}>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>{a.serviceName}</td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>{a.serviceType}</td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>${a.estimatedCost}</td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}><strong>{a.voucherCode}</strong></td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        <span style={{ color: "#27ae60", fontWeight: "bold" }}>{a.bookingStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
              <button onClick={() => setShowAllocationsModal(false)} style={{ padding: "8px 16px" }}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationsList;
