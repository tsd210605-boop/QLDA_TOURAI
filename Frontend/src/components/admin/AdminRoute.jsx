// Bảo vệ truy cập màn hình quản trị trên React theo vai trò của phiên hiện tại.

import React from "react";
import { Redirect } from "react-router-dom";
import { canAccessAdmin } from "../../utils/auth";

/** Hiển thị nội dung quản trị cho vai trò được phép, chuyển người còn lại đến trang đăng nhập quản trị. */
const AdminRoute = ({ children }) => {
  if (!canAccessAdmin()) {
    return <Redirect to="/admin/login" />;
  }
  return children;
};

export default AdminRoute;
