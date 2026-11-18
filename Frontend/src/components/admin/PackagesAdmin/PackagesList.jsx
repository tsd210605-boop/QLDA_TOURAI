// Hiển thị bảng tour quản trị và đường dẫn vào biểu mẫu sửa hoặc quản lý lịch trình.

import { categoryLabel, formatDuration, formatPrice, translateError } from "../../../utils/locale";
import React, { useEffect, useState } from "react";
import { getAllPackages, deletePackage } from "../../../api/adminApi";
import { useHistory, useLocation } from "react-router-dom";
import { hasPermission } from "../../../utils/auth";
import "../admin.css";

/** Dựng bảng tour và dùng quyền TOUR_WRITE để hiển thị thao tác quản trị. */
const PackagesList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const location = useLocation();
  const canWrite = hasPermission("TOUR_WRITE");

  /** Nạp danh sách tour để cập nhật bảng và trạng thái tải. */
  const loadPackages = () => {
    setLoading(true);
    getAllPackages()
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to load packages in admin:", err);
        setPackages([]);
      })
      .finally(() => setLoading(false));
  };

  // Re-fetch on mount and on every navigation back with updated state
  // Nạp lại catalog quản trị khi mở trang hoặc quay về từ biểu mẫu.
  useEffect(() => {
    loadPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, location.state]);

  /** Xin xác nhận xóa tour. Chỉ loại dòng khỏi bảng khi API báo thành công. */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa gói tour này không?")) return;
    try {
      const ok = await deletePackage(id);
      if (ok) {
        setPackages((prev) => prev.filter((p) => p.packageId !== id));
        alert("Đã xóa gói tour thành công!");
      } else {
        alert("Không thể xóa gói tour.");
      }
    } catch (err) {
      alert("Lỗi khi xóa tour: " + (translateError(err.message) || "Không xác định"));
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Đang tải danh sách tour...</p>;

  return (
    <div className="packages-list">
      <div className="packages-header">
        <h2>Quản Lý Gói Tour</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={loadPackages}
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
            title="Tải lại danh sách gói tour từ máy chủ"
          >
            <i className="fa fa-sync-alt" style={{ marginRight: "6px" }}></i> Làm mới
          </button>
          {canWrite && (
            <button onClick={() => history.push("/admin/packages/add")}>
              <i className="fa fa-plus" style={{ marginRight: "6px" }}></i> Thêm Gói Tour
            </button>
          )}
        </div>
      </div>

      {packages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <p>Chưa có gói tour nào trong hệ thống.</p>
          {canWrite && (
            <button
              onClick={() => history.push("/admin/packages/add")}
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
              Tạo tour đầu tiên
            </button>
          )}
        </div>
      ) : (
        packages.map((p) => {
          const itineraries = p.itinerary || p.itineraries || [];
          return (
            <div key={p.packageId} className="package-card">
              {/* Image */}
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="package-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}

              {/* Main details */}
              <div className="package-details">
                <h3>{p.title}</h3>

                <p>
                  <b>Danh mục:</b> <span style={{ color: "#1abc9c", fontWeight: "600" }}>{categoryLabel(p.category)}</span>
                </p>
                <p><b>Thời lượng:</b> {formatDuration(p.duration)}</p>
                <p><b>Phù hợp:</b> {p.bestFor}</p>
                <p><b>Điểm đến chính:</b> {p.mainDestinations}</p>
                <p><b>Số khách tối đa:</b> {p.peopleCount} người</p>
                <p className="package-price">
                  <b>Giá:</b> {formatPrice(p.price)}
                </p>

                {/* Itineraries */}
                {itineraries.length > 0 && (
                  <div className="package-itineraries">
                    <h4>Lịch trình tóm tắt:</h4>
                    <ul>
                      {itineraries.map((it, idx) => (
                        <li key={it.itineraryId || idx}>
                          <b>Ngày {it.dayNumber}:</b> {it.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Buttons */}
                <div className="package-buttons">
                  <button
                    style={{ background: "#3498db" }}
                    onClick={() => history.push(`/admin/packages/${p.packageId}/itineraries`)}
                  >
                    <i className="fa fa-calendar-alt"></i> Lịch trình
                  </button>
                  {canWrite && (
                    <>
                      <button onClick={() => history.push(`/admin/packages/edit/${p.packageId}`)}>
                        <i className="fa fa-edit"></i> Sửa
                      </button>
                      <button className="danger" onClick={() => handleDelete(p.packageId)}>
                        <i className="fa fa-trash"></i> Xóa
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PackagesList;
