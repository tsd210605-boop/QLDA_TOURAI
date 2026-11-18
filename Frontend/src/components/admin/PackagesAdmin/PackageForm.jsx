// Quản lý biểu mẫu tạo hoặc sửa tour và lấy điểm đến từ danh mục quản trị.

import { categoryLabel, translateError } from "../../../utils/locale";
import React, { useEffect, useState } from "react";
import { createPackage, getPackageById, updatePackage, getAllDestinations } from "../../../api/adminApi";
import { useParams, useHistory } from "react-router-dom";
import "../admin.css";

const CATEGORIES = [
  "Nature & Adventure",
  "Cultural & Historical",
  "Beaches & Relaxation",
  "Wildlife & Safari",
  "Spiritual & Wellness",
  "Luxury & Honeymoon",
  "Food & Culinary"
];

const STANDARD_DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 21, 30];

/** Quản lý dữ liệu tour, lựa chọn điểm đến, số ngày và trạng thái gửi form. */
const PackageForm = () => {
  const { id } = useParams(); // edit mode if present
  const history = useHistory();

  // Package state
  const [pkg, setPkg] = useState({
    title: "",
    category: "Nature & Adventure",
    duration: "3 days",
    mainDestinations: "",
    bestFor: "",
    price: "",
    peopleCount: "",
    imageUrl: ""
  });

  // Destinations list
  const [destinations, setDestinations] = useState([]);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [destinationsError, setDestinationsError] = useState("");
  const [selectedDestinationName, setSelectedDestinationName] = useState("");

  // Duration in number of days (int)
  const [durationDays, setDurationDays] = useState(3);
  const [isCustomDays, setIsCustomDays] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Only offer destinations that exist in the database.
  // Nạp danh sách điểm đến từ API quản trị và ghi nhận lỗi để chặn gửi form khi tải thất bại.
  useEffect(() => {
    let active = true;
    getAllDestinations()
      .then((data) => {
        if (!Array.isArray(data)) throw new Error(translateError("Không tải được danh sách điểm đến."));
        if (active) setDestinations(data);
      })
      .catch((err) => {
        if (active) {
          setDestinations([]);
          setDestinationsError(translateError(err.message) || "Không tải được danh sách điểm đến. Vui lòng thử lại.");
        }
      })
      .finally(() => { if (active) setDestinationsLoading(false); });
    return () => { active = false; };
  }, []);
  // 2. Load package data if in edit mode
  // Khi sửa tour, nạp tour theo ID, điền các trường và khôi phục số ngày đã lưu từ duration.
  useEffect(() => {
    if (id) {
      setLoading(true);
      getPackageById(id)
        .then((data) => {
          if (data) {
            setPkg({
              title: data.title || "",
              category: data.category || "Nature & Adventure",
              duration: data.duration || "3 days",
              mainDestinations: data.mainDestinations || "",
              bestFor: data.bestFor || "",
              price: data.price !== undefined && data.price !== null ? String(data.price) : "",
              peopleCount: data.peopleCount !== undefined && data.peopleCount !== null ? String(data.peopleCount) : "",
              imageUrl: data.imageUrl || ""
            });

            // Parse integer days from duration
            if (data.duration) {
              const parsedDays = parseInt(data.duration, 10);
              if (!isNaN(parsedDays) && parsedDays > 0) {
                setDurationDays(parsedDays);
                setIsCustomDays(!STANDARD_DAY_OPTIONS.includes(parsedDays));
              }
            }

            // Find matching destination by name
            if (data.mainDestinations) {
              setSelectedDestinationName(data.mainDestinations);
            }
          }
        })
        .catch((err) => {
          console.error("Failed to load package:", err);
          setErrorMessage(translateError(err.message) || "Không thể tải thông tin tour.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  // When destinations load or package loads in edit mode, ensure matching dropdown value
  // Đối chiếu mainDestinations với tên điểm đến để hiển thị lại lựa chọn hiện có trong danh sách.
  useEffect(() => {
    if (pkg.mainDestinations && destinations.length > 0) {
      const match = destinations.find((d) =>
        pkg.mainDestinations.toLowerCase().includes(d.name?.toLowerCase()) ||
        d.name?.toLowerCase().includes(pkg.mainDestinations.toLowerCase())
      );
      if (match) {
        setSelectedDestinationName(match.name);
      }
    }
  }, [pkg.mainDestinations, destinations]);

  // Handle destination selection
  /** Dùng tên và địa phương của điểm đến đã chọn để điền mainDestinations, đồng thời lấy ảnh có sẵn làm ảnh gợi ý. */
  const handleDestinationChange = (e) => {
    const chosenName = e.target.value;
    setSelectedDestinationName(chosenName);
    if (errorMessage) setErrorMessage("");

    if (!chosenName) {
      setPkg((prev) => ({
        ...prev,
        mainDestinations: "",
        imageUrl: ""
      }));
      return;
    }

    const found = destinations.find((d) => d.name === chosenName);
    if (found) {
      const formattedDest = found.location ? `${found.name}, ${found.location}` : found.name;
      setPkg((prev) => ({
        ...prev,
        mainDestinations: formattedDest,
        // Auto-populate imageUrl from destination
        imageUrl: found.imageUrl || prev.imageUrl
      }));
    }
  };

  // Handle duration change (int)
  /** Chuyển giữa số ngày có sẵn và chế độ nhập số ngày tùy chỉnh. */
  const handleDurationSelectChange = (e) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustomDays(true);
    } else {
      setIsCustomDays(false);
      const days = parseInt(val, 10);
      setDurationDays(days);
    }
    if (errorMessage) setErrorMessage("");
  };

  /** Cập nhật trường đang nhập trong dữ liệu tour và bỏ lỗi cũ trên form. */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPkg((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  /** Kiểm tra điểm đến nằm trong danh mục, đủ trường văn bản và các giá trị thời lượng, giá, số khách hợp lệ trước khi gửi. */
  const validateForm = () => {
    if (destinationsLoading || destinationsError) {
      return "Vui lòng tải lại danh sách điểm đến trước khi lưu tour.";
    }
    if (!destinations.some((destination) => destination.name === selectedDestinationName)) {
      return "Vui lòng chọn điểm đến có sẵn trong danh sách.";
    }
    if (!pkg.title || !pkg.title.trim()) {
      return "Tên gói tour không được để trống!";
    }
    if (!pkg.category || !pkg.category.trim()) {
      return "Vui lòng chọn danh mục tour!";
    }
    if (!pkg.mainDestinations || !pkg.mainDestinations.trim()) {
      return "Vui lòng chọn Điểm đến chính từ danh sách!";
    }
    if (!durationDays || isNaN(durationDays) || durationDays <= 0) {
      return "Thời lượng tour (Số ngày) phải là số nguyên dương lớn hơn 0!";
    }
    if (!pkg.bestFor || !pkg.bestFor.trim()) {
      return "Đối tượng phù hợp không được để trống! (Ví dụ: Gia đình, Cặp đôi)";
    }

    const priceNum = parseFloat(pkg.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return "Giá tour (Price) phải là số dương lớn hơn 0!";
    }

    const peopleNum = parseInt(pkg.peopleCount, 10);
    if (isNaN(peopleNum) || peopleNum <= 0) {
      return "Số lượng khách phải là số nguyên dương lớn hơn 0!";
    }

    return null;
  };

  /** Chuẩn hóa giá, số khách và chuỗi thời lượng rồi gửi POST hoặc PUT theo chế độ của form. Quay về danh sách sau khi lưu thành công. */
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      alert(validationError);
      return;
    }

    const daysInt = parseInt(durationDays, 10);
    const durationString = `${daysInt} ${daysInt === 1 ? "day" : "days"}`;

    const payload = {
      title: pkg.title.trim(),
      category: pkg.category.trim(),
      duration: durationString,
      mainDestinations: pkg.mainDestinations.trim(),
      bestFor: pkg.bestFor.trim(),
      price: parseFloat(pkg.price),
      peopleCount: parseInt(pkg.peopleCount, 10),
      imageUrl: pkg.imageUrl ? pkg.imageUrl.trim() : ""
    };

    setSubmitting(true);
    setErrorMessage("");

    try {
      if (id) {
        await updatePackage(id, payload);
        alert("Cập nhật tour thành công!");
      } else {
        await createPackage(payload);
        alert("Thêm gói tour mới thành công!");
      }
      // Pass state to notify PackagesList to reload fresh data
      history.push("/admin/packages", { refreshed: Date.now() });
    } catch (err) {
      console.error("Lỗi khi lưu tour:", err);
      const msg = translateError(err.message) || "Lỗi khi lưu gói tour. Vui lòng kiểm tra lại thông tin.";
      setErrorMessage(msg);
      alert("Lỗi: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="package-form">
        <p style={{ textAlign: "center", padding: "20px" }}>Đang tải thông tin tour...</p>
      </div>
    );
  }

  return (
    <div className="package-form">
      <h2>{id ? "Chỉnh Sửa Gói Tour" : "Thêm Gói Tour Mới"}</h2>

      {errorMessage && (
        <div className="package-form-error">
          <i className="fa fa-exclamation-triangle" style={{ marginRight: "8px" }}></i>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Package Title */}
        <label>
          Tên gói tour *
          <input
            type="text"
            name="title"
            placeholder="Ví dụ: Tour Nghỉ Dưỡng Phú Quốc 3N2Đ"
            value={pkg.title}
            onChange={handleChange}
            required
          />
        </label>

        {/* Category */}
        <label>
          Danh mục *
          <select
            name="category"
            value={pkg.category}
            onChange={handleChange}
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabel(cat)}
              </option>
            ))}
          </select>
        </label>

        {/* Main Destination: Selected from existing destination list */}
        <label>
          Điểm đến chính *
          <select
            name="destinationSelect"
            disabled={destinationsLoading || Boolean(destinationsError) || destinations.length === 0}
            value={selectedDestinationName}
            onChange={handleDestinationChange}
            required
          >
            <option value="">-- Chọn điểm đến từ danh sách --</option>
            {destinations.map((d) => (
              <option key={d.id || d.name} value={d.name}>
                {d.name} {d.location ? `(${d.location})` : ""}
              </option>
            ))}
          </select>
        </label>

        {destinationsLoading && <p role="status">Đang tải danh sách điểm đến...</p>}
        {destinationsError && <p role="alert">{destinationsError}</p>}
        {!destinationsLoading && !destinationsError && destinations.length === 0 && (
          <p role="status">Chưa có điểm đến. Hãy thêm điểm đến trước khi tạo tour.</p>
        )}

        {/* Display selected destination details */}
        {pkg.mainDestinations && (
          <div style={{
            background: "#e8f8f5",
            border: "1px solid #1abc9c",
            borderRadius: "8px",
            padding: "8px 14px",
            marginBottom: "16px",
            fontSize: "13px",
            color: "#16a085"
          }}>
            <i className="fa fa-map-marker-alt" style={{ marginRight: "6px" }}></i>
            <b>Điểm đến đã chọn:</b> {pkg.mainDestinations}
          </div>
        )}

        {/* Duration in number of days (int) */}
        <label>
          Thời lượng tour (Số ngày) *
          <select
            name="durationSelect"
            value={isCustomDays ? "custom" : durationDays}
            onChange={handleDurationSelectChange}
            required
          >
            {STANDARD_DAY_OPTIONS.map((days) => (
              <option key={days} value={days}>
                {days} ngày
              </option>
            ))}
            <option value="custom">Tùy chỉnh số ngày khác...</option>
          </select>
        </label>

        {isCustomDays && (
          <label style={{ marginTop: "-8px" }}>
            Nhập số ngày cụ thể:
            <input
              type="number"
              min="1"
              max="365"
              name="customDurationDays"
              value={durationDays}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setDurationDays(isNaN(val) ? "" : val);
              }}
              placeholder="Ví dụ: 18"
              required
            />
          </label>
        )}

        {/* Best For */}
        <label>
          Đối tượng phù hợp *
          <input
            type="text"
            name="bestFor"
            placeholder="Ví dụ: Gia đình, Cặp đôi, Người thích mạo hiểm"
            value={pkg.bestFor}
            onChange={handleChange}
            required
          />
        </label>

        {/* Price */}
        <label>
          Giá tour (đ) *
          <input
            type="number"
            name="price"
            step="1"
            min="1"
            placeholder="Ví dụ: 1500000"
            value={pkg.price}
            onChange={handleChange}
            required
          />
        </label>

        {/* People Count */}
        <label>
          Số lượng khách tối đa *
          <input
            type="number"
            name="peopleCount"
            min="1"
            placeholder="Ví dụ: 10"
            value={pkg.peopleCount}
            onChange={handleChange}
            required
          />
        </label>

        {/* Image URL: Automatically populated from selected destination */}
        <label>
          Đường dẫn hình ảnh (Tự động lấy theo điểm đến, có thể tùy chỉnh)
          <input
            type="text"
            name="imageUrl"
            placeholder="https://images.unsplash.com/..."
            value={pkg.imageUrl}
            onChange={handleChange}
          />
        </label>

        {/* Live Image Preview */}
        {pkg.imageUrl && (
          <div style={{ marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#555", display: "block", marginBottom: "6px" }}>
              Xem trước ảnh đại diện tour:
            </span>
            <img
              src={pkg.imageUrl}
              alt="Ảnh xem trước"
              className="package-preview"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="package-form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => history.push("/admin/packages")}
            disabled={submitting}
          >
            Hủy / Quay lại
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={submitting || destinationsLoading || Boolean(destinationsError) || destinations.length === 0}
          >
            {submitting ? "Đang lưu..." : id ? "Lưu thay đổi" : "Tạo gói tour"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;
