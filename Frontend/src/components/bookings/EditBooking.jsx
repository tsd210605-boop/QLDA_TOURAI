import { bookingTypeLabel, formatPrice } from "../../utils/locale";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom"; // v5
import { getBookingById, updateBooking } from "../../api/bookingsApi";
import "./editBooking.css";

const EditBooking = () => {
  const { id } = useParams(); // bookingId from URL
  const history = useHistory(); // v5

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookingById(id)
      .then((data) => {
        setBooking(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Đang tải thông tin đặt tour...</p>;
  if (!booking) return <p>Không tìm thấy đơn đặt tour.</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
  };

  const handleSubmit = () => {
    // Basic validation
    if (
      booking.name.trim() === "" ||
      booking.phone.trim() === "" ||
      booking.destination.trim() === "" ||
      !booking.travelDate ||
      Number(booking.days) <= 0 ||
      Number(booking.people) <= 0
    ) {
      alert("Vui lòng nhập đầy đủ và chính xác thông tin.");
      return;
    }

    updateBooking(id, booking)
      .then(() => {
        alert("Cập nhật đơn đặt tour thành công!");
        history.push("/bookings"); // useHistory navigation
      })
      .catch(() => alert("Không thể cập nhật đơn đặt tour. Vui lòng thử lại."));
  };

  return (
    <div className="edit-booking-form">
      <h2>Chỉnh sửa đơn đặt tour</h2>

      <label>
        Loại đặt tour:
        <input type="text" name="bookingType" value={bookingTypeLabel(booking.bookingType)} readOnly />
      </label>

      <label>
        Họ và tên:
        <input type="text" name="name" value={booking.name} onChange={handleChange} />
      </label>

      <label>
        Số điện thoại:
        <input type="text" name="phone" value={booking.phone} onChange={handleChange} />
      </label>

      <label>
        Điểm đến:
        <input type="text" name="destination" value={booking.destination} onChange={handleChange} />
      </label>

      {booking.bookingType === "PACKAGE" && (
        <label>
          Tên tour:
          <input type="text" name="packageTitle" value={booking.packageTitle || ""} readOnly />
        </label>
      )}

      <label>
        Số ngày:
        <input type="number" name="days" value={booking.days} onChange={handleChange} />
      </label>

      <label>
        Ngày khởi hành:
        <input type="date" name="travelDate" value={booking.travelDate} onChange={handleChange} />
      </label>

      <label>
        Số khách:
        <input type="number" name="people" value={booking.people} onChange={handleChange} />
      </label>

      <label>
        Tổng tiền:
        <input type="text" value={formatPrice(booking.totalPrice)} readOnly />
      </label>

      <button onClick={handleSubmit}>Cập nhật đơn đặt tour</button>
    </div>
  );
};

export default EditBooking;
