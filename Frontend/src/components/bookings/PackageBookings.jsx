import React, { useState, useEffect } from "react";
import MyBookings from "./MyBookings";
import CustomizeBookings from "./CustomizeBookings";
import "./bookings.css";

const Bookings = () => {
  const [active, setActive] = useState("package");

  // Redirect to Packages page when "Package Bookings" is selected
  useEffect(() => {
    if (active === "package") {
      window.location.href = "/packages";
    }
  }, [active]);

  return (
    <div className="bookings-page">
      <aside className="bookings-menu">
        <h3>Bookings</h3>
        <ul>
          <li
            className={active === "my" ? "active" : ""}
            onClick={() => setActive("my")}
          >
            My Bookings
          </li>
          <li
            className={active === "package" ? "active" : ""}
            onClick={() => setActive("package")}
          >
            Package Bookings
          </li>
          <li
            className={active === "custom" ? "active" : ""}
            onClick={() => setActive("custom")}
          >
            Customize Bookings
          </li>
        </ul>
      </aside>

      <main className="bookings-content">
        {active === "my" && <MyBookings />}
        {active === "custom" && <CustomizeBookings />}
        {/* No PackageBookings component here anymore */}
      </main>
    </div>
  );
};

export default Bookings;
