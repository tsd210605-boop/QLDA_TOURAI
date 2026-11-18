// Đọc thời lượng tour và xác định ngày còn trống để gợi ý trên form lịch trình.

// Keep the accepted duration formats in sync with PackageItineraryService.
/** Đọc số ngày nguyên dương từ chuỗi thời lượng, giữ cùng giới hạn số nguyên với backend. */
export const getDurationDays = (duration) => {
  const match = /^(\d+)(?:\s*(?:days?|ngày)(?=\s|\/|$)|\s*n(?=\s|\d|$)|$)/i.exec(String(duration ?? "").trim());
  const days = match ? Number(match[1]) : NaN;
  return Number.isInteger(days) && days > 0 && days <= 2147483647 ? days : null;
};

/** Tìm ngày chưa được dùng nhỏ nhất trong khoảng từ 1 đến thời lượng tour. Trả null nếu hết ngày hoặc thiếu thời lượng. */
export const firstAvailableDay = (itineraries, durationDays) => {
  if (!durationDays) return null;
  const usedDays = new Set(itineraries.map((item) => item.dayNumber));
  let day = 1;
  while (day <= durationDays && usedDays.has(day)) day += 1;
  return day <= durationDays ? day : null;
};
