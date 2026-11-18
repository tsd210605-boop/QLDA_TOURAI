import { bookingTypeLabel, formatDate, formatPrice } from "../../utils/locale";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { getBookingsByUserId, getBookingsByPhone, deleteBooking } from "../../api/bookingsApi";
import { getUserId, isLoggedIn } from "../../utils/auth";
import "./myBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phoneLookup, setPhoneLookup] = useState("");
  const history = useHistory();
  const userId = getUserId();

  const loadBookings = async () => {
    setLoading(true);
    try {
      if (isLoggedIn() && userId) {
        const data = await getBookingsByUserId(userId);
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handlePhoneSearch = async () => {
    if (!phoneLookup.trim()) return;
    setLoading(true);
    try {
      const data = await getBookingsByPhone(phoneLookup.trim());
      setBookings(data);
    } catch {
      alert("Không tìm thấy đơn đặt tour với số điện thoại này.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có muốn hủy đơn đặt tour này?")) return;
    deleteBooking(id)
      .then(() => {
        setBookings(bookings.filter((b) => b.bookingId !== id));
        alert("Đã hủy đơn đặt tour.");
      })
      .catch(() => alert("Không thể hủy đơn đặt tour. Vui lòng thử lại."));
  };

  const handleEdit = (id) => {
    history.push(`/edit-booking/${id}`);
  };

  if (loading) return <p>Đang tải đơn đặt tour của bạn...</p>;

  return (
    <div className="my-bookings-page">
      <h2>Đơn đặt tour của tôi</h2>

      {!isLoggedIn() && (
        <div className="my-bookings-guest">
          <p>
            <Link to="/login">Đăng nhập</Link> để xem đơn đặt tour của bạn, hoặc tìm bằng số điện thoại:
          </p>
          <input
            type="text"
            placeholder="Số điện thoại đã dùng để đặt tour"
            value={phoneLookup}
            onChange={(e) => setPhoneLookup(e.target.value)}
          />
          <button type="button" onClick={handlePhoneSearch}>
            Tìm đơn đặt tour
          </button>
        </div>
      )}

      {bookings.length === 0 ? (
        <p>Chưa có đơn đặt tour.</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((b) => (
            <div key={b.bookingId} className="booking-card">
              <p><b>Họ tên:</b> {b.name}</p>
              <p><b>Số điện thoại:</b> {b.phone}</p>
              <p><b>Loại đặt tour:</b> {bookingTypeLabel(b.bookingType)}</p>
              {b.packageTitle && <p><b>Tour:</b> {b.packageTitle}</p>}
              <p><b>Điểm đến:</b> {b.destination}</p>
              <p><b>Số ngày:</b> {b.days}</p>
              <p><b>Ngày khởi hành:</b> {formatDate(b.travelDate)}</p>
              <p><b>Tổng tiền:</b> {formatPrice(b.totalPrice)}</p>
              <div className="booking-buttons">
                <button className="edit" onClick={() => handleEdit(b.bookingId)}>Sửa</button>
                <button className="danger" onClick={() => handleDelete(b.bookingId)}>Hủy</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
