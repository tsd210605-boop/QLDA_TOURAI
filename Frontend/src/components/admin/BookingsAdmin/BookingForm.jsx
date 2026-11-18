import { translateError } from "../../../utils/locale";
import React, { useEffect, useState } from "react";
import { getBookingById, updateBooking } from "../../../api/adminApi";
import { useParams, useHistory } from "react-router-dom";
import "../admin.css";

const BookingForm = () => {
  const { id } = useParams();
  const history = useHistory();

  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    bookingType: "CUSTOM",
    packageTitle: "",
    destination: "",
    travelDate: "",
    people: "",
    days: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      getBookingById(id)
        .then((data) => {
          if (data) {
            setBooking({
              name: data.name || "",
              phone: data.phone || "",
              bookingType: data.bookingType || "CUSTOM",
              packageTitle: data.packageTitle || "",
              destination: data.destination || "",
              travelDate: data.travelDate || "",
              people: data.people !== undefined && data.people !== null ? String(data.people) : "",
              days: data.days !== undefined && data.days !== null ? String(data.days) : ""
            });
          }
        })
        .catch((err) => {
          console.error("Failed to load booking:", err);
          setErrorMessage(translateError(err.message) || "Không thể tải thông tin đặt tour.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!booking.name?.trim()) return alert("Họ tên khách hàng không được để trống!");
    if (!booking.destination?.trim()) return alert("Điểm đến không được để trống!");
    if (!booking.travelDate) return alert("Ngày khởi hành không được để trống!");

    setSubmitting(true);
    setErrorMessage("");

    try {
      await updateBooking(id, booking);
      alert("Cập nhật đơn đặt tour thành công!");
      history.push("/admin/bookings");
    } catch (err) {
      console.error("Lỗi khi cập nhật đặt chỗ:", err);
      const msg = translateError(err.message) || "Không thể cập nhật đặt tour.";
      setErrorMessage(msg);
      alert("Lỗi: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="booking-form">
        <p style={{ textAlign: "center", padding: "20px" }}>Đang tải thông tin đơn đặt chỗ...</p>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <h2>Chỉnh Sửa Đơn Đặt Tour #{id}</h2>

      {errorMessage && (
        <div className="package-form-error" style={{ marginBottom: "16px" }}>
          <i className="fa fa-exclamation-triangle" style={{ marginRight: "8px" }}></i>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Họ tên khách hàng *
          <input
            name="name"
            value={booking.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Số điện thoại
          <input
            name="phone"
            value={booking.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Loại đặt chỗ
          <select
            name="bookingType"
            value={booking.bookingType}
            onChange={handleChange}
          >
            <option value="CUSTOM">Tour tự thiết kế (CUSTOM)</option>
            <option value="PACKAGE">Gói tour trọn gói (PACKAGE)</option>
          </select>
        </label>

        {booking.bookingType === "PACKAGE" && (
          <label>
            Tên gói tour
            <input
              name="packageTitle"
              value={booking.packageTitle}
              onChange={handleChange}
            />
          </label>
        )}

        <label>
          Điểm đến *
          <input
            name="destination"
            value={booking.destination}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Ngày khởi hành *
          <input
            type="date"
            name="travelDate"
            value={booking.travelDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Số lượng khách
          <input
            type="number"
            min="1"
            name="people"
            value={booking.people}
            onChange={handleChange}
          />
        </label>

        <label>
          Số ngày lưu trú
          <input
            type="number"
            min="1"
            name="days"
            value={booking.days}
            onChange={handleChange}
          />
        </label>

        <div className="package-form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => history.push("/admin/bookings")}
            disabled={submitting}
          >
            Hủy / Quay lại
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={submitting}
          >
            {submitting ? "Đang lưu..." : "Cập nhật đơn đặt tour"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
