// Hiển thị biểu mẫu tạo hoặc sửa điểm đến, kiểm tra dữ liệu nhập và gửi API quản trị.

import { categoryLabel, translateError } from "../../../utils/locale";
import React, { useEffect, useState } from "react";
import { createDestination, getDestinationById, updateDestination } from "../../../api/adminApi";
import { useParams, useHistory } from "react-router-dom";
import "../admin.css";

const DESTINATION_CATEGORIES = [
  "Beach & Relaxation",
  "Nature & Adventure",
  "Cultural & Historical",
  "City Experience"
];

/** Chọn chế độ tạo hay sửa theo ID trên URL và quản lý dữ liệu, trạng thái tải và lỗi của biểu mẫu. */
const DestinationForm = () => {
  const { id } = useParams();
  const history = useHistory();

  const [destination, setDestination] = useState({
    name: "",
    description: "",
    location: "",
    category: "Beach & Relaxation",
    imageUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Khi có ID trên URL, nạp thông tin điểm đến hiện có để điền form sửa.
  useEffect(() => {
    if (id) {
      setLoading(true);
      getDestinationById(id)
        .then((data) => {
          if (data) {
            setDestination({
              name: data.name || "",
              description: data.description || "",
              location: data.location || "",
              category: data.category || "Beach & Island",
              imageUrl: data.imageUrl || ""
            });
          }
        })
        .catch((err) => {
          console.error("Failed to load destination:", err);
          setErrorMessage(translateError(err.message) || "Không thể tải thông tin điểm đến.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  /** Cập nhật trường đang thay đổi trong biểu mẫu và bỏ thông báo lỗi cũ. */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDestination((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  /** Kiểm tra tên, địa phương và danh mục rồi gọi tạo mới hoặc cập nhật. Khi thành công, quay về danh sách điểm đến. */
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!destination.name?.trim()) {
      alert("Tên điểm đến không được để trống!");
      return;
    }
    if (!destination.location?.trim()) {
      alert("Địa điểm không được để trống!");
      return;
    }
    if (!destination.category?.trim()) {
      alert("Vui lòng chọn danh mục!");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      if (id) {
        await updateDestination(id, destination);
        alert("Cập nhật điểm đến thành công!");
      } else {
        await createDestination(destination);
        alert("Thêm điểm đến mới thành công!");
      }
      history.push("/admin/destinations", { refreshed: Date.now() });
    } catch (error) {
      console.error("Lỗi lưu điểm đến:", error);
      const msg = error.message || "Lỗi khi lưu điểm đến.";
      setErrorMessage(msg);
      alert("Lỗi: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="destination-form">
        <p style={{ textAlign: "center", padding: "20px" }}>Đang tải thông tin điểm đến...</p>
      </div>
    );
  }

  return (
    <div className="destination-form">
      <h2>{id ? "Chỉnh Sửa Điểm Đến" : "Thêm Điểm Đến Mới"}</h2>

      {errorMessage && (
        <div className="package-form-error" style={{ marginBottom: "16px" }}>
          <i className="fa fa-exclamation-triangle" style={{ marginRight: "8px" }}></i>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Tên điểm đến *
          <input
            type="text"
            name="name"
            placeholder="Ví dụ: Vịnh Hạ Long, Phú Quốc..."
            value={destination.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mô tả
          <textarea
            name="description"
            rows="4"
            placeholder="Mô tả về điểm đến..."
            value={destination.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Địa phương / Tỉnh thành *
          <input
            type="text"
            name="location"
            placeholder="Ví dụ: Quảng Ninh, Kiên Giang..."
            value={destination.location}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Danh mục *
          <select
            name="category"
            value={destination.category}
            onChange={handleChange}
            required
          >
            {DESTINATION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabel(cat)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Đường dẫn hình ảnh
          <input
            type="text"
            name="imageUrl"
            placeholder="https://images.unsplash.com/..."
            value={destination.imageUrl}
            onChange={handleChange}
          />
        </label>

        {destination.imageUrl && (
          <div style={{ marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#555", display: "block", marginBottom: "6px" }}>
              Xem trước ảnh:
            </span>
            <img
              src={destination.imageUrl}
              alt="Ảnh xem trước"
              className="destination-preview"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="package-form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => history.push("/admin/destinations")}
            disabled={submitting}
          >
            Hủy / Quay lại
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={submitting}
          >
            {submitting ? "Đang lưu..." : id ? "Lưu thay đổi" : "Tạo điểm đến"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DestinationForm;
