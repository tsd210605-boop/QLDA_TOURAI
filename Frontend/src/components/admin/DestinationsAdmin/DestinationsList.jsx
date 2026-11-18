// Hiển thị bảng quản trị điểm đến và các thao tác theo quyền TOUR_WRITE.

import { categoryLabel, formatPrice, translateError } from "../../../utils/locale";
import React, { useEffect, useState } from "react";
import { getAllDestinations, deleteDestination } from "../../../api/adminApi";
import { useHistory, useLocation } from "react-router-dom";
import { hasPermission } from "../../../utils/auth";
import "../admin.css";

/** Dựng bảng, trạng thái tải và các nút để mở form hoặc xóa điểm đến. */
const DestinationsList = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const location = useLocation();
  const canWrite = hasPermission("TOUR_WRITE");

  /** Lấy danh sách điểm đến từ API quản trị, cập nhật bảng và kết thúc trạng thái tải khi request hoàn tất. */
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const data = await getAllDestinations();
      setDestinations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải điểm đến:", err);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  // Tải lại bảng khi người dùng mở hoặc quay về trang quản trị điểm đến.
  useEffect(() => {
    fetchDestinations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, location.state]);

  /** Yêu cầu xác nhận rồi gọi API xóa theo ID. Bỏ dòng khỏi bảng nếu lời gọi kết thúc mà không ném lỗi. */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa điểm đến này?")) return;
    try {
      await deleteDestination(id);
      setDestinations((prev) => prev.filter((d) => d.id !== id));
      alert("Đã xóa điểm đến thành công!");
    } catch (err) {
      alert("Lỗi khi xóa điểm đến: " + (translateError(err.message) || "Không xác định"));
    }
  };

  return (
    <div className="destinations-container">
      <div className="destinations-header">
        <h2>Quản Lý Điểm Đến</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={fetchDestinations}
            style={{
              background: "#4a69bd",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "9px 16px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px"
            }}
            title="Tải lại danh sách điểm đến từ máy chủ"
          >
            <i className="fa fa-sync-alt" style={{ marginRight: "6px" }}></i> Làm mới
          </button>
          {canWrite && (
            <button onClick={() => history.push("/admin/destinations/add")}>
              <i className="fa fa-plus" style={{ marginRight: "6px" }}></i> Thêm Điểm Đến
            </button>
          )}
        </div>
      </div>

      <div className="destinations-list">
        {loading ? (
          <p style={{ padding: "20px" }}>Đang tải danh sách điểm đến...</p>
        ) : destinations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666", width: "100%" }}>
            <p>Chưa có điểm đến nào trong hệ thống.</p>
            {canWrite && (
              <button
                onClick={() => history.push("/admin/destinations/add")}
                style={{
                  marginTop: "12px",
                  padding: "8px 18px",
                  background: "#1abc9c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Tạo điểm đến đầu tiên
              </button>
            )}
          </div>
        ) : (
          destinations.map((d) => (
            <div key={d.id} className="destination-card">
              {d.imageUrl && (
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  className="destination-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}

              <div className="destination-details">
                <h3>{d.name}</h3>
                <p><b>Địa phương:</b> {d.location}</p>
                <p>
                  <b>Danh mục:</b> <span style={{ color: "#1abc9c", fontWeight: "600" }}>{categoryLabel(d.category)}</span>
                </p>
                {d.avgPrice && (
                  <p><b>Chi phí TB:</b> {formatPrice(d.avgPrice)}</p>
                )}
                <p className="destination-description">{d.description}</p>

                {canWrite && (
                  <div className="destination-buttons">
                    <button onClick={() => history.push(`/admin/destinations/edit/${d.id}`)}>
                      <i className="fa fa-edit"></i> Sửa
                    </button>
                    <button className="danger" onClick={() => handleDelete(d.id)}>
                      <i className="fa fa-trash"></i> Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DestinationsList;
