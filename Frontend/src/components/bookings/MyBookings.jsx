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
  }, [userId]);

  const handlePhoneSearch = async () => {
    if (!phoneLookup.trim()) return;
    setLoading(true);
    try {
      const data = await getBookingsByPhone(phoneLookup.trim());
      setBookings(data);
    } catch {
      alert("Could not find bookings for that phone number.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    deleteBooking(id)
      .then(() => {
        setBookings(bookings.filter((b) => b.bookingId !== id));
        alert("Booking cancelled successfully.");
      })
      .catch(() => alert("Failed to cancel booking. Please try again."));
  };

  const handleEdit = (id) => {
    history.push(`/edit-booking/${id}`);
  };

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div className="my-bookings-page">
      <h2>My Bookings</h2>

      {!isLoggedIn() && (
        <div className="my-bookings-guest">
          <p>
            <Link to="/login">Sign in</Link> to see bookings linked to your account, or search by phone:
          </p>
          <input
            type="text"
            placeholder="Phone number used when booking"
            value={phoneLookup}
            onChange={(e) => setPhoneLookup(e.target.value)}
          />
          <button type="button" onClick={handlePhoneSearch}>
            Find bookings
          </button>
        </div>
      )}

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((b) => (
            <div key={b.bookingId} className="booking-card">
              <p><b>Name:</b> {b.name}</p>
              <p><b>Phone:</b> {b.phone}</p>
              <p><b>Type:</b> {b.bookingType}</p>
              {b.packageTitle && <p><b>Package:</b> {b.packageTitle}</p>}
              <p><b>Destination:</b> {b.destination}</p>
              <p><b>Days:</b> {b.days}</p>
              <p><b>Travel Date:</b> {b.travelDate}</p>
              <p><b>Total Price:</b> ${b.totalPrice}</p>
              <div className="booking-buttons">
                <button className="edit" onClick={() => handleEdit(b.bookingId)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(b.bookingId)}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
