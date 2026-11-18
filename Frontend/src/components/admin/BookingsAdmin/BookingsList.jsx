import { bookingTypeLabel, formatDate } from "../../../utils/locale";
import React, { useEffect, useState } from "react";
import { getAllBookings, deleteBooking } from "../../../api/adminApi";
import { useHistory } from "react-router-dom";
import "../admin.css";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch {
      alert("Không tải được danh sách đặt tour.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có muốn hủy đơn đặt tour này?")) return;
    try {
      await deleteBooking(id);
      setBookings(bookings.filter((b) => b.bookingId !== id));
    } catch {
      alert("Không thể xóa đơn đặt tour.");
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleEdit = (id) => {
    history.push(`/admin/bookings/edit/${id}`);
  };

  return (
    <div className="bookings-container">
      <h2>Đơn đặt tour</h2>
      <div className="bookings-grid">
        {bookings.length === 0 ? (
          <p>Chưa có đơn đặt tour.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.bookingId} className="booking-card">
              <p><b>Họ tên:</b> {b.name}</p>
              <p><b>Số điện thoại:</b> {b.phone}</p>
              <p><b>Loại đặt tour:</b> {bookingTypeLabel(b.bookingType)}</p>
              <p><b>Tour:</b> {b.packageTitle || "-"}</p>
              <p><b>Điểm đến:</b> {b.destination}</p>
              <p><b>Ngày khởi hành:</b> {formatDate(b.travelDate)}</p>
              <p><b>Số khách:</b> {b.people}</p>
              <p><b>Số ngày:</b> {b.days}</p>
              <div className="booking-buttons">
              <button onClick={() => history.push(`/admin/bookings/edit/${b.bookingId}`)}>Sửa</button>
              <button className="danger" onClick={() => handleDelete(b.bookingId)}>Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


export default BookingsList;
