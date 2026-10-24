import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { clearSession, getUserRole, getUserName, hasPermission } from "../../utils/auth";
import "./admin.css";

const Sidebar = () => {
  const history = useHistory();
  const location = useLocation();
  const role = getUserRole();
  const userName = getUserName();

  const handleLogout = () => {
    clearSession();
    history.push("/admin/login");
  };

  const getRoleBadgeClass = (r) => {
    switch (r) {
      case "ADMIN":
        return "badge-admin";
      case "OPERATOR":
        return "badge-operator";
      case "SALES":
        return "badge-sales";
      default:
        return "badge-default";
    }
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>TravelBook</h2>
        <div className="user-role-card">
          <span className="user-name">{userName}</span>
          <span className={`user-role-badge ${getRoleBadgeClass(role)}`}>
            {role}
          </span>
        </div>
      </div>

      <ul className="sidebar-nav">
        <li className={location.pathname === "/admin" ? "active" : ""}>
          <Link to="/admin">
            <i className="fa fa-tachometer-alt"></i> Dashboard
          </Link>
        </li>

        {(hasPermission("TOUR_READ") || hasPermission("TOUR_WRITE")) && (
          <li className={location.pathname.startsWith("/admin/packages") ? "active" : ""}>
            <Link to="/admin/packages">
              <i className="fa fa-suitcase"></i> Packages
            </Link>
          </li>
        )}

        {(hasPermission("TOUR_READ") || hasPermission("TOUR_WRITE")) && (
          <li className={location.pathname.startsWith("/admin/destinations") ? "active" : ""}>
            <Link to="/admin/destinations">
              <i className="fa fa-map-marker-alt"></i> Destinations
            </Link>
          </li>
        )}

        {(hasPermission("BOOKING_VIEW") || hasPermission("BOOKING_MANAGE")) && (
          <li className={location.pathname.startsWith("/admin/bookings") ? "active" : ""}>
            <Link to="/admin/bookings">
              <i className="fa fa-calendar-check"></i> Bookings
            </Link>
          </li>
        )}

        {hasPermission("OPERATIONS_DISPATCH") && (
          <li className={location.pathname.startsWith("/admin/operations") ? "active" : ""}>
            <Link to="/admin/operations">
              <i className="fa fa-route"></i> Điều hành Tour
            </Link>
          </li>
        )}

        {hasPermission("SUPPLIER_MANAGE") && (
          <li className={location.pathname.startsWith("/admin/suppliers") ? "active" : ""}>
            <Link to="/admin/suppliers">
              <i className="fa fa-handshake"></i> Nhà cung ứng
            </Link>
          </li>
        )}

        {(hasPermission("USER_MANAGE") || hasPermission("ROLE_MANAGE")) && (
          <li className={location.pathname.startsWith("/admin/users") ? "active" : ""}>
            <Link to="/admin/users">
              <i className="fa fa-users-cog"></i> Phân quyền & RBAC
            </Link>
          </li>
        )}
      </ul>

      <div className="sidebar-footer">
        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
          <i className="fa fa-sign-out-alt"></i> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
