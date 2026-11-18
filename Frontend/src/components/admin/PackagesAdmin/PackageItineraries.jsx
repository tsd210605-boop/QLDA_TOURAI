// Hiển thị thông tin tour và cung cấp thao tác thêm hoặc xóa từng ngày lịch trình.

import { formatDuration, translateError } from "../../../utils/locale";
import React, { useEffect, useState } from "react";
import { getDurationDays, firstAvailableDay } from "../../../utils/itinerary";
import { getPackageItineraries, addItinerary, deleteItinerary, getPackageById } from "../../../api/adminApi";
import { useParams, useHistory } from "react-router-dom";
import "../admin.css";

/** Tính số ngày của tour và ngày còn trống để điều khiển form thêm lịch trình. */
const PackageItineraries = () => {
  const { id } = useParams(); // packageId
  const history = useHistory();

  const [packageInfo, setPackageInfo] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [dayNumber, setDayNumber] = useState(1);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const durationDays = getDurationDays(packageInfo?.duration);
  const nextDay = firstAvailableDay(itineraries, durationDays);
  const formDisabled = loading || submitting || Boolean(loadError) || !durationDays || nextDay === null;

  /** Nạp song song thông tin tour và các ngày lịch trình, sắp xếp theo số ngày rồi gợi ý ngày nhỏ nhất còn trống. */
  const fetchItineraries = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [itList, pkg] = await Promise.all([
        getPackageItineraries(id), getPackageById(id)
      ]);
      if (!Array.isArray(itList) || !pkg || typeof pkg !== "object") {
        throw new Error("Dữ liệu lịch trình hoặc thông tin tour không hợp lệ.");
      }
      const sorted = [...itList].sort((a, b) => a.dayNumber - b.dayNumber);
      setItineraries(sorted);
      setPackageInfo(pkg);
      setDayNumber(firstAvailableDay(sorted, getDurationDays(pkg.duration)) ?? "");
    } catch (err) {
      setLoadError(translateError(err.message));
      setPackageInfo(null);
      setItineraries([]);
    } finally {
      setLoading(false);
    }
  };

  // Nạp lịch trình khi mở trang hoặc khi mã tour trên URL thay đổi.
  useEffect(() => {
    fetchItineraries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /** Kiểm tra phạm vi ngày, ngày trùng và mô tả. Gửi request tạo và tải lại lịch trình khi thành công. */
  const handleAdd = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (formDisabled) return;
    const day = Number(dayNumber);
    if (!Number.isInteger(day) || day < 1 || day > durationDays) {
      alert(`Tour có ${durationDays} ngày. Ngày lịch trình phải là số nguyên từ 1 đến ${durationDays}.`);
      return;
    }
    if (itineraries.some((item) => item.dayNumber === day)) {
      alert(`Ngày ${day} đã có lịch trình. Vui lòng chọn ngày khác.`);
      return;
    }
    if (!description.trim()) {
      alert("Vui lòng nhập mô tả lịch trình.");
      return;
    }

    setSubmitting(true);
    addItinerary(id, {
      dayNumber: day,
      description: description.trim()
    })
      .then(() => {
        setDescription("");
        fetchItineraries();
        alert("Đã thêm lịch trình thành công!");
      })
      .catch((err) => {
        alert("Lỗi khi thêm lịch trình: " + (translateError(err.message) || "Không xác định"));
      })
      .finally(() => setSubmitting(false));
  };

  /** Xác nhận, xóa bằng itineraryId rồi tải lại danh sách để cập nhật ngày còn trống. */
  const handleDelete = (itineraryId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch trình ngày này không?")) return;
    deleteItinerary(itineraryId)
      .then(() => {
        fetchItineraries();
        alert("Đã xóa lịch trình thành công!");
      })
      .catch((err) => {
        alert("Lỗi khi xóa lịch trình: " + (translateError(err.message) || "Không xác định"));
      });
  };

  return (
    <div className="package-form" style={{ maxWidth: "750px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button
          type="button"
          onClick={() => history.push("/admin/packages")}
          style={{
            background: "#95a5a6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 14px",
            cursor: "pointer",
            width: "auto"
          }}
        >
          <i className="fa fa-arrow-left" style={{ marginRight: "6px" }}></i> Quay lại Tour
        </button>
        <span style={{ fontSize: "14px", color: "#666" }}>Mã tour: #{id}</span>
      </div>

      <h2>Quản Lý Lịch Trình Chi Tiết</h2>

      {packageInfo && (
        <div style={{
          background: "#fff",
          border: "1px solid #1abc9c",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "24px"
        }}>
          <h4 style={{ margin: "0 0 6px 0", color: "#2c3e50" }}>{packageInfo.title}</h4>
          <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
            <b>Thời lượng:</b> {formatDuration(packageInfo.duration)} | <b>Điểm đến:</b> {packageInfo.mainDestinations}
          </p>
        </div>
      )}

      {loadError && <p role="alert">Không tải được lịch trình: {loadError}</p>}
      {!loading && !loadError && !durationDays && (
        <p role="alert">Không xác định được số ngày của tour. Vui lòng cập nhật thời lượng tour trước khi thêm lịch trình.</p>
      )}
      {!loading && !loadError && durationDays && nextDay === null && (
        <p role="status">Đã có đủ lịch trình cho {durationDays} ngày của tour.</p>
      )}

      {/* Form to add itinerary */}
      <form onSubmit={handleAdd} style={{ background: "#fff", padding: "18px", borderRadius: "10px", marginBottom: "25px" }}>
        <h4 style={{ marginTop: 0, color: "#16a085" }}>
          <i className="fa fa-plus-circle" style={{ marginRight: "6px" }}></i> Thêm ngày lịch trình mới
        </h4>

        <label>
          Ngày thứ (Day Number) *
          <input
            type="number"
            min="1"
            max={durationDays || undefined}
            step="1"
            disabled={formDisabled}
            aria-describedby="itinerary-day-range"
            value={dayNumber}
            onChange={(e) => setDayNumber(e.target.value)}
            required
            style={{ marginBottom: "12px" }}
          />
        </label>

        {durationDays && (
          <p id="itinerary-day-range">Chỉ nhập ngày từ 1 đến {durationDays}; mỗi ngày có một lịch trình.</p>
        )}

        <label>
          Mô tả hoạt động chi tiết *
          <textarea
            rows="3"
            placeholder="Ví dụ: Đón sân bay về khách sạn, chiều tham quan Bản Cát Cát..."
            value={description}
            disabled={formDisabled}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ marginBottom: "12px" }}
          />
        </label>

        <button
          type="submit"
          disabled={formDisabled}
          style={{
            background: "#1abc9c",
            color: "#fff",
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {submitting ? "Đang thêm..." : "+ Thêm vào lịch trình"}
        </button>
      </form>

      {/* Existing itineraries list */}
      <div>
        <h3 style={{ color: "#2c3e50", marginBottom: "14px" }}>
          Các ngày trong hành trình ({itineraries.length})
        </h3>

        {loading ? (
          <p>Đang tải lịch trình...</p>
        ) : loadError ? null : itineraries.length === 0 ? (
          <p style={{ color: "#777", fontStyle: "italic", textAlign: "center", padding: "20px" }}>
            Chưa có lịch trình chi tiết cho tour này. Hãy thêm ngày đầu tiên ở trên!
          </p>
        ) : (
          itineraries.map((it) => (
            <div
              key={it.itineraryId}
              style={{
                background: "#fff",
                borderLeft: "4px solid #3498db",
                borderRadius: "8px",
                padding: "14px 18px",
                marginBottom: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "14px"
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{
                  background: "#3498db",
                  color: "#fff",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  display: "inline-block",
                  marginBottom: "8px"
                }}>
                  Ngày {it.dayNumber}
                </span>
                <p style={{ margin: 0, color: "#333", lineHeight: "1.5", fontSize: "14px" }}>
                  {it.description}
                </p>
              </div>

              <button
                type="button"
                className="danger"
                onClick={() => handleDelete(it.itineraryId)}
                style={{
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "13px",
                  width: "auto"
                }}
              >
                <i className="fa fa-trash"></i> Xóa
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PackageItineraries;
