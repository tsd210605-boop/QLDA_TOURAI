import React, { useState } from "react";
import { createBooking } from "../../api/bookingsApi";
import { getUserId } from "../../utils/auth";
import "./customizeBookings.css";

const CustomizeBookings = () => {
  const [form, setForm] = useState({
    destination: "",
    days: "",
    travelDate: "",
    people: "",
    name: "",
    phone: ""
  });

  const submitBooking = () => {
    if (
      form.destination.trim() === "" ||
      form.name.trim() === "" ||
      form.phone.trim() === "" ||   // ✅ FIXED
      form.travelDate === "" ||
      Number(form.days) <= 0 ||
      Number(form.people) <= 0
    ) {
      alert("Vui lòng nhập đầy đủ và chính xác thông tin.");
      return;
    }

    const userId = getUserId();
    createBooking({
      bookingType: "CUSTOM",
      userId: userId || null,
      ...form,
      days: Number(form.days),
      people: Number(form.people),
    }).then(() => alert("Đã gửi yêu cầu đặt tour!"));
  };

  return (
    <div className="customize-booking-form">
      <div className="form-header">
        <h2>Thiết kế chuyến đi của bạn</h2>
      </div>

      <label>
        Họ và tên:
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>

      <label>
        Số điện thoại:
        <input
          type="text"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </label>

      <label>
        Điểm đến:
        <input
          type="text"
          value={form.destination}
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
        />
      </label>

      <label>
        Số ngày:
        <input
          type="number"
          value={form.days}
          onChange={(e) => setForm({ ...form, days: e.target.value })}
        />
      </label>

      <label>
        Ngày khởi hành:
        <input
          type="date"
          value={form.travelDate}
          onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
        />
      </label>

      <label>
        Số khách:
        <input
          type="number"
          value={form.people}
          onChange={(e) => setForm({ ...form, people: e.target.value })}
        />
      </label>

      <button onClick={submitBooking}>Gửi yêu cầu đặt tour</button>
    </div>
  );
};

export default CustomizeBookings;
