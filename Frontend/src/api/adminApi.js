// Gửi request quản trị cho tour, lịch trình, điểm đến và đơn đặt tour qua cấu hình API dùng chung.

import { translateError } from "../utils/locale";
import { ENDPOINTS } from "./config";
import { authHeaders } from "../utils/auth";

const PACKAGES_ADMIN = ENDPOINTS.adminPackages;
const ITINERARIES_ADMIN = ENDPOINTS.adminItineraries;
const DESTINATIONS_ADMIN = ENDPOINTS.adminDestinations;
const BOOKINGS_ADMIN = ENDPOINTS.adminBookings;

/** Gửi request với header phiên đăng nhập, tắt cache mặc định và báo lỗi khi nhận HTTP 401 hoặc 403. */
const adminFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error(translateError("Admin access denied. Please log in again."));
  }
  return res;
};

/** Đọc thông báo hoặc gom lỗi theo từng trường từ JSON. Dùng thông tin HTTP khi response không phải JSON. */
const parseErrorMessage = async (res) => {
  try {
    const errorBody = await res.json();
    if (typeof errorBody === "object" && errorBody !== null) {
      if (errorBody.error) return errorBody.error;
      if (errorBody.message) return errorBody.message;
      const fieldErrors = Object.entries(errorBody)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      if (fieldErrors) return fieldErrors;
    }
    return String(errorBody);
  } catch (e) {
    return res.statusText || `Lỗi yêu cầu (HTTP ${res.status})`;
  }
};

/** Ưu tiên lấy danh sách quản trị. Khi cần, thử danh mục công khai qua Gateway rồi thử trực tiếp cổng 8084. */
export const getAllPackages = async () => {
  try {
    const res = await adminFetch(PACKAGES_ADMIN, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn("adminFetch failed, falling back to public packages endpoint:", err);
  }
  try {
    const fallback = await fetch(ENDPOINTS.packages, { cache: "no-store" });
    if (fallback.ok) {
      const data = await fallback.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.error("Failed to load packages in admin fallback:", err);
  }
  // Direct fallback to port 8084 if api gateway is not running
  try {
    const directRes = await fetch("http://localhost:8084/packages", { cache: "no-store" });
    if (directRes.ok) {
      const data = await directRes.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    // Ignore
  }
  return [];
};

/** Lấy tour theo ID để điền form hoặc đọc thời lượng tại màn hình lịch trình. */
export const getPackageById = async (id) => {
  let res;
  try {
    res = await adminFetch(`${PACKAGES_ADMIN}/${id}`, { cache: "no-store" });
  } catch (err) {
    res = await adminFetch(`http://localhost:8084/api/admin/packages/${id}`, { cache: "no-store" });
  }
  if (!res.ok) {
    const errorMsg = await parseErrorMessage(res);
    throw new Error(translateError(errorMsg));
  }
  return res.json();
};

/** Gửi JSON tạo tour qua POST và trả tour đã lưu để phía gọi có thể đọc kết quả. */
export const createPackage = async (packageData) => {
  let res;
  try {
    res = await adminFetch(PACKAGES_ADMIN, {
      method: "POST",
      body: JSON.stringify(packageData),
    });
  } catch (err) {
    // If gateway 8080 connection fails, fallback to direct port 8084
    res = await adminFetch("http://localhost:8084/api/admin/packages", {
      method: "POST",
      body: JSON.stringify(packageData),
    });
  }
  if (!res.ok) {
    const errorMsg = await parseErrorMessage(res);
    throw new Error(translateError(errorMsg));
  }
  return res.json();
};

/** Gửi JSON cập nhật tour qua PUT theo ID và trả bản ghi sau khi lưu. */
export const updatePackage = async (id, packageData) => {
  let res;
  try {
    res = await adminFetch(`${PACKAGES_ADMIN}/${id}`, {
      method: "PUT",
      body: JSON.stringify(packageData),
    });
  } catch (err) {
    res = await adminFetch(`http://localhost:8084/api/admin/packages/${id}`, {
      method: "PUT",
      body: JSON.stringify(packageData),
    });
  }
  if (!res.ok) {
    const errorMsg = await parseErrorMessage(res);
    throw new Error(translateError(errorMsg));
  }
  return res.json();
};

/** Gửi DELETE theo mã tour và trả cờ HTTP thành công để bảng quyết định có bỏ dòng hay không. */
export const deletePackage = async (id) => {
  const res = await adminFetch(`${PACKAGES_ADMIN}/${id}`, { method: "DELETE" });
  return res.ok;
};

/** Lấy lịch trình theo mã tour, kiểm tra HTTP và xác nhận dữ liệu trả về là mảng. */
export const getPackageItineraries = async (packageId) => {
  const res = await adminFetch(`${ITINERARIES_ADMIN}/${packageId}/itineraries`);
  if (!res.ok) throw new Error(translateError(await parseErrorMessage(res)));
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Dữ liệu lịch trình trả về không hợp lệ.");
  return data;
};

/** Gửi số thứ tự ngày và mô tả để tạo bản ghi lịch trình cho tour được chọn. */
export const addItinerary = async (packageId, itineraryData) => {
  const res = await adminFetch(`${ITINERARIES_ADMIN}/${packageId}/itineraries`, {
    method: "POST",
    body: JSON.stringify(itineraryData),
  });
  if (!res.ok) throw new Error(translateError(await parseErrorMessage(res)));
  return res.json();
};

/** Xóa một bản ghi theo mã lịch trình và báo lỗi nếu backend từ chối. */
export const deleteItinerary = async (itineraryId) => {
  const res = await adminFetch(`${ITINERARIES_ADMIN}/itinerary/${itineraryId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(translateError(await parseErrorMessage(res)));
  return true;
};

/** Lấy mảng điểm đến phục vụ bảng quản trị và danh sách lựa chọn trên form tour. */
export const getAllDestinations = async () => {
  const res = await adminFetch(DESTINATIONS_ADMIN);
  if (!res.ok) throw new Error(translateError(await parseErrorMessage(res)));
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error(translateError("Dữ liệu điểm đến trả về không hợp lệ."));
  return data;
};

/** Đọc JSON chi tiết của một điểm đến để form sửa dùng làm giá trị ban đầu. */
export const getDestinationById = async (id) => {
  const res = await adminFetch(`${DESTINATIONS_ADMIN}/${id}`);
  return res.json();
};

/** Gửi JSON tạo điểm đến và trả bản ghi mới hoặc thông báo lỗi đã dịch. */
export const createDestination = async (destinationData) => {
  const res = await adminFetch(DESTINATIONS_ADMIN, {
    method: "POST",
    body: JSON.stringify(destinationData),
  });
  if (!res.ok) {
    const errorMsg = await parseErrorMessage(res);
    throw new Error(translateError(errorMsg));
  }
  return res.json();
};

/** Gửi các trường chỉnh sửa của điểm đến theo ID và trả bản ghi được cập nhật. */
export const updateDestination = async (id, destinationData) => {
  const res = await adminFetch(`${DESTINATIONS_ADMIN}/${id}`, {
    method: "PUT",
    body: JSON.stringify(destinationData),
  });
  if (!res.ok) {
    const errorMsg = await parseErrorMessage(res);
    throw new Error(translateError(errorMsg));
  }
  return res.json();
};

/** Gửi DELETE theo mã điểm đến và trả cờ HTTP thành công. */
export const deleteDestination = async (id) => {
  const res = await adminFetch(`${DESTINATIONS_ADMIN}/${id}`, { method: "DELETE" });
  return res.ok;
};

/** Lấy danh sách đơn đặt tour từ API quản trị. */
export const getAllBookings = async () => {
  const res = await adminFetch(BOOKINGS_ADMIN);
  return res.json();
};

/** Lấy một đơn đặt tour theo ID qua API quản trị. */
export const getBookingById = async (id) => {
  const res = await adminFetch(`${BOOKINGS_ADMIN}/${id}`);
  return res.json();
};

/** Gửi thông tin cần sửa cho đơn đặt tour theo ID và đọc JSON trả về. */
export const updateBooking = async (id, bookingData) => {
  const res = await adminFetch(`${BOOKINGS_ADMIN}/${id}`, {
    method: "PUT",
    body: JSON.stringify(bookingData),
  });
  return res.json();
};

/** Gửi yêu cầu xóa đơn đặt tour theo ID và trả trạng thái thành công. */
export const deleteBooking = async (id) => {
  const res = await adminFetch(`${BOOKINGS_ADMIN}/${id}`, { method: "DELETE" });
  return res.ok;
};
