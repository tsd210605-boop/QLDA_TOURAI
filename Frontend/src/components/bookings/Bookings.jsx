import React, { useState, useEffect } from "react";
import MyBookings from "./MyBookings";
import CustomizeBookings from "./CustomizeBookings";
import PackageBookingForm from "./PackageBookingForm";
import "./bookings.css";

const Bookings = () => {
  const [active, setActive] = useState("my"); 
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  useEffect(() => {
    const pkg = localStorage.getItem("selectedPackage");
    if (pkg) {
      const pkgData = JSON.parse(pkg);
      setSelectedPackageId(pkgData.packageId);
      setActive("packageForm");
      localStorage.removeItem("selectedPackage");
    }
  }, []);

  const handleMenuClick = (menu) => {
    if (menu === "package") {
      window.location.href = "/packages";
    } else {
      setActive(menu);
    }
  };

  return (
    <div className="bookings-page">
      <aside className="bookings-menu">
        <h3>Bookings</h3>
        <ul>
          <li
            className={active === "my" ? "active" : ""}
            onClick={() => handleMenuClick("my")}
          >
            My Bookings
          </li>
          <li
            className={active === "package" ? "active" : ""}
            onClick={() => handleMenuClick("package")}
          >
            Package Bookings
          </li>
          <li
            className={active === "custom" ? "active" : ""}
            onClick={() => handleMenuClick("custom")}
          >
            Customize Bookings
          </li>
        </ul>
      </aside>

      <main className="bookings-content">
        {active === "my" && <MyBookings />}
        {active === "custom" && <CustomizeBookings />}
        {active === "packageForm" && selectedPackageId && (
          <PackageBookingForm id={selectedPackageId} />
        )}
      </main>
    </div>
  );
};

export default Bookings;
