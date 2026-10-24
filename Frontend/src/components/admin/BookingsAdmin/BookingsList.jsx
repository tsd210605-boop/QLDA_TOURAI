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
      alert("Failed to fetch bookings");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await deleteBooking(id);
      setBookings(bookings.filter((b) => b.bookingId !== id));
    } catch {
      alert("Error deleting booking");
    }
  };

  const handleEdit = (id) => {
    history.push(`/admin/bookings/edit/${id}`);
  };

  return (
    <div className="bookings-container">
      <h2>Bookings</h2>
      <div className="bookings-grid">
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.bookingId} className="booking-card">
              <p><b>Name:</b> {b.name}</p>
              <p><b>Phone:</b> {b.phone}</p>
              <p><b>Type:</b> {b.bookingType}</p>
              <p><b>Package:</b> {b.packageTitle || "-"}</p>
              <p><b>Destination:</b> {b.destination}</p>
              <p><b>Travel Date:</b> {b.travelDate}</p>
              <p><b>People:</b> {b.people}</p>
              <p><b>Days:</b> {b.days}</p>
              <div className="booking-buttons">
              <button onClick={() => history.push(`/admin/bookings/edit/${b.bookingId}`)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(b.bookingId)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


export default BookingsList;
