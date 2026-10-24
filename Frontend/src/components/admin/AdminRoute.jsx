import React from "react";
import { Redirect } from "react-router-dom";
import { canAccessAdmin } from "../../utils/auth";

const AdminRoute = ({ children }) => {
  if (!canAccessAdmin()) {
    return <Redirect to="/admin/login" />;
  }
  return children;
};

export default AdminRoute;
