// Gọi API công khai để đọc catalog tour, chi tiết, lịch trình, tour liên quan và ưu đãi.

import { ENDPOINTS } from "./config";

const BASE_URL = ENDPOINTS.packages;
const DIRECT_URL = "http://localhost:8084/packages";

/** Thử đọc JSON qua URL chính rồi URL dự phòng. Trả null nếu cả hai lần đều thất bại. */
const safeFetchJson = async (primaryUrl, fallbackUrl) => {
  try {
    const res = await fetch(primaryUrl);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Primary fetch failed for ${primaryUrl}:`, err);
  }
  if (fallbackUrl) {
    try {
      const res = await fetch(fallbackUrl);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error(`Fallback fetch failed for ${fallbackUrl}:`, e);
    }
  }
  return null;
};

/* -------------------- GET -------------------- */

/** Đọc catalog tour và trả mảng rỗng nếu dữ liệu không phải mảng. */
export const getAllPackages = async () => {
  const data = await safeFetchJson(BASE_URL, DIRECT_URL);
  return Array.isArray(data) ? data : [];
};

/** Mã hóa danh mục vào URL và đọc các tour thuộc danh mục đã chọn. */
export const getPackagesByCategory = async (category) => {
  const encoded = encodeURIComponent(category);
  const data = await safeFetchJson(
    `${BASE_URL}/category/${encoded}`,
    `${DIRECT_URL}/category/${encoded}`
  );
  return Array.isArray(data) ? data : [];
};

/** Đọc một tour theo packageId. Kết quả có thể là null nếu không tải được. */
export const getPackageById = async (id) => {
  return await safeFetchJson(`${BASE_URL}/${id}`, `${DIRECT_URL}/${id}`);
};

/** Đọc các ngày lịch trình thuộc tour và chuẩn hóa kết quả lỗi thành mảng rỗng. */
export const getItineraryByPackageId = async (id) => {
  const data = await safeFetchJson(
    `${BASE_URL}/${id}/itinerary`,
    `${DIRECT_URL}/${id}/itinerary`
  );
  return Array.isArray(data) ? data : [];
};

/** Đọc các tour cùng chuyên mục, dùng excludeId để backend loại tour hiện tại. */
export const getRelatedPackages = async (category, excludeId) => {
  const encoded = encodeURIComponent(category);
  const data = await safeFetchJson(
    `${BASE_URL}/category/${encoded}/related/${excludeId}`,
    `${DIRECT_URL}/category/${encoded}/related/${excludeId}`
  );
  return Array.isArray(data) ? data : [];
};

/** Đọc danh sách ưu đãi công khai để hiển thị trên carousel. */
export const getOffers = async () => {
  const data = await safeFetchJson(`${BASE_URL}/offers`, `${DIRECT_URL}/offers`);
  return Array.isArray(data) ? data : [];
};

/** Thử lấy ưu đãi của một tour. Backend hiện chưa có mapping cho URL này nên helper có thể trả null. */
export const getPackageOffer = async (packageId) => {
  return await safeFetchJson(
    `${BASE_URL}/${packageId}/offer`,
    `${DIRECT_URL}/${packageId}/offer`
  );
};
