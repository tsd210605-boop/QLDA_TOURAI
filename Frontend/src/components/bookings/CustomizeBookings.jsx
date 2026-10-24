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
      alert("Please fill all fields correctly");
      return;
    }

    const userId = getUserId();
    createBooking({
      bookingType: "CUSTOM",
      userId: userId || null,
      ...form,
      days: Number(form.days),
      people: Number(form.people),
    }).then(() => alert("Custom booking submitted!"));
  };

  return (
    <div className="customize-booking-form">
      <div className="form-header">
        <h2>Customize Your Trip</h2>
      </div>

      <label>
        Full Name:
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>

      <label>
        Phone Number:
        <input
          type="text"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </label>

      <label>
        Destinations:
        <input
          type="text"
          value={form.destination}
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
        />
      </label>

      <label>
        Days:
        <input
          type="number"
          value={form.days}
          onChange={(e) => setForm({ ...form, days: e.target.value })}
        />
      </label>

      <label>
        Travel Date:
        <input
          type="date"
          value={form.travelDate}
          onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
        />
      </label>

      <label>
        People:
        <input
          type="number"
          value={form.people}
          onChange={(e) => setForm({ ...form, people: e.target.value })}
        />
      </label>

      <button onClick={submitBooking}>Submit Custom Booking</button>
    </div>
  );
};

export default CustomizeBookings;
