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
        <h3>Đơn đặt tour</h3>
        <ul>
          <li
            className={active === "my" ? "active" : ""}
            onClick={() => setActive("my")}
          >
            Đơn đặt tour của tôi
          </li>
          <li
            className={active === "package" ? "active" : ""}
            onClick={() => setActive("package")}
          >
            Đặt tour trọn gói
          </li>
          <li
            className={active === "custom" ? "active" : ""}
            onClick={() => setActive("custom")}
          >
            Đặt tour theo yêu cầu
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
