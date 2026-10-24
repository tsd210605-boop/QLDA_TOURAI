import { API } from "./config";
import { authHeaders } from "../utils/auth";

const AUTH_URL = `${API.AUTH}/api/auth`;

export const login = async (email, password) => {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data && data.message ? data.message : "Đăng nhập thất bại";
    throw new Error(errorMsg);
  }
  return data;
};

export const register = async ({ email, password, name, phone }) => {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, phone }),
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data && data.message ? data.message : "Đăng ký thất bại";
    throw new Error(errorMsg);
  }
  return data;
};

export const getMe = async () => {
  const res = await fetch(`${AUTH_URL}/me`, {
    headers: authHeaders(true),
  });
  if (!res.ok) throw new Error("Không thể xác thực danh tính");
  return res.json();
};

export const getAllUsers = async () => {
  const res = await fetch(`${AUTH_URL}/users`, {
    headers: authHeaders(true),
  });
  if (!res.ok) throw new Error("Không thể tải danh sách tài khoản");
  return res.json();
};

export const updateUserRole = async (userId, role) => {
  const res = await fetch(`${AUTH_URL}/users/${userId}/role`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể cập nhật vai trò");
  return data;
};

export const updateUserStatus = async (userId, status) => {
  const res = await fetch(`${AUTH_URL}/users/${userId}/status`, {
    method: "PATCH",
    headers: authHeaders(true),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể cập nhật trạng thái");
  return data;
};

export const getAllRoles = async () => {
  const res = await fetch(`${AUTH_URL}/roles`, {
    headers: authHeaders(true),
  });
  if (!res.ok) throw new Error("Không thể tải danh sách vai trò");
  return res.json();
};

export const updateRolePermissions = async (roleId, permissions) => {
  const res = await fetch(`${AUTH_URL}/roles/${roleId}/permissions`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify({ permissions }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể cập nhật quyền");
  return data;
};

export const getAllPermissions = async () => {
  const res = await fetch(`${AUTH_URL}/permissions`, {
    headers: authHeaders(true),
  });
  if (!res.ok) throw new Error("Không thể tải danh sách quyền");
  return res.json();
};
