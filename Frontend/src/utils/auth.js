const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";
const USER_NAME_KEY = "userName";
const USER_EMAIL_KEY = "userEmail";
const USER_ROLE_KEY = "role";
const USER_PERMISSIONS_KEY = "permissions";

export const saveSession = ({ token, userId, name, email, role, permissions }) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (userId) localStorage.setItem(USER_ID_KEY, String(userId));
  if (name) localStorage.setItem(USER_NAME_KEY, name);
  if (email) localStorage.setItem(USER_EMAIL_KEY, email);
  if (role) localStorage.setItem(USER_ROLE_KEY, role.toUpperCase());
  if (permissions && Array.isArray(permissions)) {
    localStorage.setItem(USER_PERMISSIONS_KEY, JSON.stringify(permissions));
  }
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(USER_PERMISSIONS_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUserId = () => {
  const id = localStorage.getItem(USER_ID_KEY);
  return id ? Number(id) : null;
};

export const getUserName = () => localStorage.getItem(USER_NAME_KEY) || "User";

export const getUserEmail = () => localStorage.getItem(USER_EMAIL_KEY) || "";

export const getUserRole = () => localStorage.getItem(USER_ROLE_KEY) || "CUSTOMER";

export const getUserPermissions = () => {
  try {
    const raw = localStorage.getItem(USER_PERMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const isLoggedIn = () => Boolean(getToken());

export const isAdmin = () => getUserRole() === "ADMIN";

export const isOperator = () => getUserRole() === "OPERATOR";

export const isSales = () => getUserRole() === "SALES";

export const isGuide = () => getUserRole() === "GUIDE";

export const isCustomer = () => getUserRole() === "CUSTOMER" || getUserRole() === "USER";

/**
 * Staff members allowed into Admin dashboard
 */
export const canAccessAdmin = () => {
  const role = getUserRole();
  return role === "ADMIN" || role === "OPERATOR" || role === "SALES";
};

/**
 * Check if the current user has a specific permission
 */
export const hasPermission = (permissionName) => {
  if (isAdmin()) return true; // ADMIN has super-user bypass
  const perms = getUserPermissions();
  return perms.includes(permissionName);
};

export const authHeaders = (json = true) => {
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};
