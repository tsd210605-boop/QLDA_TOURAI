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

  useEffect(() => {
  if (id) {
    getBookingById(id).then(data => {
      setBooking({
        name: data.name || "",
        phone: data.phone || "",
        bookingType: data.bookingType || "CUSTOM",
        packageTitle: data.packageTitle || "",
        destination: data.destination || "",
        travelDate: data.travelDate || "",
        people: data.people || "",
        days: data.days || ""
      });
    });
  }
}, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
  };

  const handleSubmit = async () => {
    if (!booking.name || !booking.destination || !booking.travelDate) return alert("Fill all required fields");
    await updateBooking(id, booking);
    history.push("/admin/bookings");
  };

  return (
    <div className="booking-form">
      <h2>Edit Booking</h2>

      <label>Name
        <input name="name" value={booking.name} onChange={handleChange} />
      </label>
      <label>Phone
        <input name="phone" value={booking.phone} onChange={handleChange} />
      </label>
      <label>Type
        <select name="bookingType" value={booking.bookingType} onChange={handleChange}>
          <option value="CUSTOM">CUSTOM</option>
          <option value="PACKAGE">PACKAGE</option>
        </select>
      </label>
      {booking.bookingType === "PACKAGE" && (
        <label>Package Title
          <input name="packageTitle" value={booking.packageTitle} onChange={handleChange} />
        </label>
      )}
      <label>Destination
        <input name="destination" value={booking.destination} onChange={handleChange} />
      </label>
      <label>Travel Date
        <input type="date" name="travelDate" value={booking.travelDate} onChange={handleChange} />
      </label>
      <label>People
        <input type="number" name="people" value={booking.people} onChange={handleChange} />
      </label>
      <label>Days
        <input type="number" name="days" value={booking.days} onChange={handleChange} />
      </label>

      <button onClick={handleSubmit}>Update</button>
    </div>
  );
};

export default BookingForm;
