// Khai báo các lời gọi HTTP đến tuyến API công khai của điểm đến.

import { translateError } from "../utils/locale";
import { ENDPOINTS } from "./config";

const BASE_URL = ENDPOINTS.destinations;

/** Lấy toàn bộ điểm đến từ API công khai dưới dạng mảng JSON. */
export const getAllDestinations = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error(translateError("Failed to fetch all destinations."));
  return response.json();
};

/** Lấy chi tiết điểm đến theo ID và báo lỗi khi HTTP không thành công. */
export const getDestinationById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error(translateError("Destination not found."));
  return response.json();
};

/** Gửi POST đến đường dẫn điểm đến công khai và đọc JSON response. Form quản trị gọi adminApi.js. */
export const createDestination = async (data) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

/** Gửi PUT đến đường dẫn điểm đến công khai theo ID và đọc JSON response. Form quản trị gọi adminApi.js. */
export const updateDestination = async (id, data) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

/** Gửi DELETE tới đường dẫn công khai theo ID và báo lỗi HTTP. Trang quản trị gọi adminApi.js. */
export const deleteDestination = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(translateError("Failed to delete destination."));
};

/** Lấy object có khóa là danh mục và giá trị là danh sách điểm đến trong danh mục đó. */
export const getDestinationsByCategories = async () => {
  const response = await fetch(`${BASE_URL}/by-categories`);
  if (!response.ok) {
    throw new Error(translateError(`Network response was not ok: ${response.status} ${response.statusText}`));
  }
  return response.json();
};
