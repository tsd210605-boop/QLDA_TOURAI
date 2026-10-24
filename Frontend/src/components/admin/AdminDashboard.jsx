import React from "react";
import Sidebar from "./Sidebar";
import { Route, Switch } from "react-router-dom";

// Packages
import PackagesList from "./PackagesAdmin/PackagesList";
import PackageForm from "./PackagesAdmin/PackageForm";
import PackageItineraries from "./PackagesAdmin/PackageItineraries";

// Destinations
import DestinationsList from "./DestinationsAdmin/DestinationsList";
import DestinationForm from "./DestinationsAdmin/DestinationForm";

// Bookings
import BookingsList from "./BookingsAdmin/BookingsList";

// Operations & Suppliers
import OperationsList from "./OperationsAdmin/OperationsList";
import SuppliersList from "./SuppliersAdmin/SuppliersList";

// RBAC & User Management
import UserManagement from "./UserManagement/UserManagement";

import "./admin.css";

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
      <div className="content-wrapper">
        <Switch>
          {/* Default welcome page */}
          <Route exact path="/admin">
            <div className="welcome-dashboard">
              <h1>Welcome to the Admin Dashboard!</h1>
              <p>Manage your packages, destinations, bookings, tour operations, and suppliers.</p>
            </div>
          </Route>

          {/* Packages */}
          <Route exact path="/admin/packages" component={PackagesList} />
          <Route path="/admin/packages/add" component={PackageForm} />
          <Route path="/admin/packages/edit/:id" component={PackageForm} />
          <Route path="/admin/packages/:id/itineraries" component={PackageItineraries} />

          {/* Destinations */}
          <Route exact path="/admin/destinations" component={DestinationsList} />
          <Route path="/admin/destinations/add" component={DestinationForm} />
          <Route path="/admin/destinations/edit/:id" component={DestinationForm} />

          {/* Bookings */}
          <Route exact path="/admin/bookings" component={BookingsList} />

          {/* Operations & Suppliers */}
          <Route exact path="/admin/operations" component={OperationsList} />
          <Route exact path="/admin/suppliers" component={SuppliersList} />

          {/* RBAC User Management */}
          <Route exact path="/admin/users" component={UserManagement} />
        </Switch>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
