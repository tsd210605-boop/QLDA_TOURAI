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

  if (loading) return <p>Loading booking details...</p>;
  if (!booking) return <p>Booking not found.</p>;

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
      alert("Please fill all fields correctly");
      return;
    }

    updateBooking(id, booking)
      .then(() => {
        alert("Booking updated successfully!");
        history.push("/bookings"); // useHistory navigation
      })
      .catch(() => alert("Failed to update booking. Please try again."));
  };

  return (
    <div className="edit-booking-form">
      <h2>Edit Booking</h2>

      <label>
        Booking Type:
        <input type="text" name="bookingType" value={booking.bookingType} readOnly />
      </label>

      <label>
        Full Name:
        <input type="text" name="name" value={booking.name} onChange={handleChange} />
      </label>

      <label>
        Phone:
        <input type="text" name="phone" value={booking.phone} onChange={handleChange} />
      </label>

      <label>
        Destination:
        <input type="text" name="destination" value={booking.destination} onChange={handleChange} />
      </label>

      {booking.bookingType === "PACKAGE" && (
        <label>
          Package Title:
          <input type="text" name="packageTitle" value={booking.packageTitle || ""} readOnly />
        </label>
      )}

      <label>
        Days:
        <input type="number" name="days" value={booking.days} onChange={handleChange} />
      </label>

      <label>
        Travel Date:
        <input type="date" name="travelDate" value={booking.travelDate} onChange={handleChange} />
      </label>

      <label>
        People:
        <input type="number" name="people" value={booking.people} onChange={handleChange} />
      </label>

      <label>
        Total Price:
        <input type="text" value={`$${booking.totalPrice}`} readOnly />
      </label>

      <button onClick={handleSubmit}>Update Booking</button>
    </div>
  );
};

export default EditBooking;
