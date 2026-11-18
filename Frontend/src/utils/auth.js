// Quản lý thông tin đăng nhập trong localStorage và tạo header xác thực cho các lời gọi API.

const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";
const USER_NAME_KEY = "userName";
const USER_EMAIL_KEY = "userEmail";
const USER_ROLE_KEY = "role";
const USER_PERMISSIONS_KEY = "permissions";

/** Lưu token, thông tin người dùng, role và quyền từ kết quả đăng nhập rồi phát sự kiện cập nhật phiên. */
export const saveSession = ({ token, userId, name, email, role, permissions }) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (userId) localStorage.setItem(USER_ID_KEY, String(userId));
  if (name) localStorage.setItem(USER_NAME_KEY, name);
  if (email) localStorage.setItem(USER_EMAIL_KEY, email);
  if (role) localStorage.setItem(USER_ROLE_KEY, role.toUpperCase());
  if (permissions && Array.isArray(permissions)) {
    localStorage.setItem(USER_PERMISSIONS_KEY, JSON.stringify(permissions));
  }
  try {
    window.dispatchEvent(new Event("auth-changed"));
  } catch (e) {
    // Ignore in non-browser env
  }
};

/** Xóa các khóa của phiên khỏi localStorage và phát sự kiện để giao diện cập nhật. */
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(USER_PERMISSIONS_KEY);
  try {
    window.dispatchEvent(new Event("auth-changed"));
  } catch (e) {
    // Ignore in non-browser env
  }
};

/** Đọc token đã lưu để gọi API cần xác thực. */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/** Đọc ID người dùng và chuyển sang số. Trả null khi chưa có ID. */
export const getUserId = () => {
  const id = localStorage.getItem(USER_ID_KEY);
  return id ? Number(id) : null;
};

/** Đọc tên hiển thị từ phiên hoặc trả nhãn mặc định. */
export const getUserName = () => localStorage.getItem(USER_NAME_KEY) || "Người dùng";

/** Đọc email đã lưu, dùng chuỗi rỗng nếu chưa có. */
export const getUserEmail = () => localStorage.getItem(USER_EMAIL_KEY) || "";

/** Đọc vai trò đã lưu và dùng CUSTOMER khi chưa có giá trị. */
export const getUserRole = () => localStorage.getItem(USER_ROLE_KEY) || "CUSTOMER";

/** Đọc mảng mã quyền từ JSON đã lưu và trả mảng rỗng nếu thiếu hoặc không đọc được. */
export const getUserPermissions = () => {
  try {
    const raw = localStorage.getItem(USER_PERMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

/** Kiểm tra trình duyệt có token đăng nhập đã lưu hay không. */
export const isLoggedIn = () => Boolean(getToken());

/** Kiểm tra vai trò quản trị viên của phiên hiện tại. */
export const isAdmin = () => getUserRole() === "ADMIN";

/** Kiểm tra vai trò điều hành tour của phiên hiện tại. */
export const isOperator = () => getUserRole() === "OPERATOR";

/** Kiểm tra vai trò nhân viên kinh doanh của phiên hiện tại. */
export const isSales = () => getUserRole() === "SALES";

/** Kiểm tra vai trò hướng dẫn viên của phiên hiện tại. */
export const isGuide = () => getUserRole() === "GUIDE";

/** Kiểm tra phiên có vai trò khách hàng CUSTOMER hoặc USER. */
export const isCustomer = () => getUserRole() === "CUSTOMER" || getUserRole() === "USER";

/**
 * Staff members allowed into Admin dashboard
 */
/** Kiểm tra vai trò ADMIN, OPERATOR hoặc SALES để quyết định cho vào khu vực quản trị. */
export const canAccessAdmin = () => {
  const role = getUserRole();
  return role === "ADMIN" || role === "OPERATOR" || role === "SALES";
};

/**
 * Check if the current user has a specific permission
 */
/** Cho phép ADMIN và kiểm tra danh sách quyền đã lưu đối với các vai trò còn lại. */
export const hasPermission = (permissionName) => {
  if (isAdmin()) return true; // ADMIN has super-user bypass
  const perms = getUserPermissions();
  return perms.includes(permissionName);
};

/** Tạo header JSON theo tùy chọn và gắn Authorization dạng Bearer khi có token. */
export const authHeaders = (json = true) => {
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};
