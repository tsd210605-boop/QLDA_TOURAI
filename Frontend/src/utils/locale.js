// Đổi mã dữ liệu thành nhãn tiếng Việt và định dạng giá, thời lượng, ngày tháng và thông báo lỗi.

// Vietnamese display labels keep the API's existing category and booking values.
export const tourCategories = [
  ["Nature & Adventure", "Thiên nhiên và khám phá"],
  ["Cultural & Historical", "Văn hóa và lịch sử"],
  ["Beaches & Relaxation", "Biển và nghỉ dưỡng"],
  ["Wildlife & Safari", "Khám phá động vật hoang dã"],
  ["Spiritual & Wellness", "Tâm linh và chăm sóc sức khỏe"],
  ["Luxury & Honeymoon", "Cao cấp và tuần trăng mật"],
  ["Food & Culinary", "Ẩm thực"],
];
const categoryEntries = [...tourCategories, ["Mountain & Nature", "Núi rừng và thiên nhiên"], ["Beach & Island", "Biển đảo"], ["Culture & Heritage", "Văn hóa và di sản"], ["Wellness & Retreat", "Chăm sóc sức khỏe và nghỉ dưỡng"], ["City & Nightlife", "Thành phố và cuộc sống về đêm"], ["Beach & Relaxation", "Biển và nghỉ dưỡng"], ["City Experience", "Trải nghiệm thành phố"]];
/** Tìm nhãn tiếng Việt tương ứng với mã danh mục, không phân biệt hoa thường. */
export const categoryLabel = (value) => categoryEntries.find(([key]) => key.toLowerCase() === String(value || "").trim().toLowerCase())?.[1] || value || "Chưa phân loại";
/** Đổi nhãn hiển thị về mã danh mục và ưu tiên giữ mã gốc nếu nhãn khớp. */
export const categoryValue = (label, original) => categoryLabel(original) === label ? original : categoryEntries.find(([, text]) => text === label)?.[0] || label;
/** Đổi mã loại đặt tour thành nhãn tour trọn gói hoặc tour theo yêu cầu. */
export const bookingTypeLabel = (value) => ({ PACKAGE: "Tour trọn gói", CUSTOM: "Tour theo yêu cầu" }[value] || value || "Chưa xác định");

const money = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });
/** Định dạng số tiền theo tiếng Việt và thêm ký hiệu đồng. Hiển thị nhãn thiếu giá nếu giá trị không hợp lệ. */
export const formatPrice = (value) => value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) ? "Chưa có giá" : `${money.format(Number(value))} đ`;
/** Đổi chuỗi ngày YYYY-MM-DD thành DD/MM/YYYY trực tiếp. Giá trị không khớp định dạng được trả nguyên. */
export const formatDate = (value) => {
  if (!value) return "Chưa xác định";
  // Format date-only values directly, without shifting them through a timezone.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? match[3] + "/" + match[2] + "/" + match[1] : value;
};
/** Định dạng chuỗi thời lượng bằng đơn vị ngày, đêm và giờ cho giao diện. */
export const formatDuration = (value) => /^\d+$/.test(String(value ?? "")) ? `${value} ngày` : String(value || "").replace(/\bdays?\b/gi, "ngày").replace(/\bnights?\b/gi, "đêm").replace(/\bhours?\b/gi, "giờ");


/** Đổi mã vai trò thành tên hiển thị tiếng Việt, không phân biệt hoa thường. */
export const roleLabel = (value) => ({
  ADMIN: "Quản trị viên", OPERATOR: "Điều hành tour", SALES: "Nhân viên kinh doanh",
  GUIDE: "Hướng dẫn viên", CUSTOMER: "Khách hàng", USER: "Khách hàng"
}[String(value || "").toUpperCase()] || value || "Chưa xác định");
/** Đổi mã loại dịch vụ sang nhãn như khách sạn hoặc vận chuyển. */
export const serviceTypeLabel = (value) => ({
  HOTEL: "Khách sạn", RESTAURANT: "Nhà hàng", TRANSPORT: "Vận chuyển",
  TICKET: "Vé tham quan", OTHER: "Dịch vụ khác"
}[value] || value || "Chưa xác định");
/** Đổi mã trạng thái nghiệp vụ thành nhãn hiển thị tiếng Việt. */
export const statusLabel = (value) => ({
  PREPARING: "Đang chuẩn bị", DISPATCHED: "Đã phân công", IN_PROGRESS: "Đang thực hiện",
  COMPLETED: "Hoàn thành", PENDING: "Chờ xử lý", CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã hủy", CANCELED: "Đã hủy", BOOKED: "Đã đặt", PAID: "Đã thanh toán",
  UNPAID: "Chưa thanh toán", SUCCESS: "Thành công", FAILED: "Thất bại",
  ACTIVE: "Đang hoạt động", BLOCKED: "Đã khóa", REFUNDED: "Đã hoàn tiền"
}[value] || value || "Chưa xác định");


/** Đổi mã phân hệ thành tên nhóm chức năng để trình bày trên giao diện. */
export const moduleLabel = (value) => ({
  AUTH: "Tài khoản", TOUR: "Tour du lịch", BOOKING: "Đặt tour",
  OPERATIONS: "Điều hành", PAYMENT: "Thanh toán"
}[value] || value || "Chức năng khác");
/** Đổi mã phân quyền như TOUR_WRITE thành nhãn thao tác tiếng Việt. */
export const permissionLabel = (value) => ({
  USER_MANAGE: "Quản lý tài khoản", ROLE_MANAGE: "Quản lý phân quyền",
  TOUR_READ: "Xem tour", TOUR_WRITE: "Quản lý tour", BOOKING_VIEW: "Xem đặt tour",
  BOOKING_MANAGE: "Quản lý đặt tour", OPERATIONS_DISPATCH: "Phân công điều hành",
  SUPPLIER_MANAGE: "Quản lý nhà cung ứng", PAYMENT_VIEW: "Xem thanh toán"
}[value] || value || "Chưa xác định");
/** Đổi mã phương thức thanh toán thành nhãn hiển thị. */
export const paymentMethodLabel = (value) => ({
  VIETQR: "Chuyển khoản VietQR", MOCK: "Thanh toán thử nghiệm", VNPAY: "VNPay"
}[value] || value || "Chưa xác định");

const errorMessages = {
  "Admin access denied. Please log in again.": "Bạn không có quyền quản trị. Vui lòng đăng nhập lại.",
  "Failed to load bookings": "Không tải được danh sách đặt tour.",
  "Failed to create payment URL": "Không tạo được đường dẫn thanh toán.",
  "Failed to process payment callback": "Không xử lý được kết quả thanh toán.",
  "Invalid credentials": "Email hoặc mật khẩu không chính xác.",
  "User not found": "Không tìm thấy tài khoản với email này.",
  "Email exists": "Email này đã được đăng ký.",
  "email, password, and name are required": "Vui lòng nhập email, mật khẩu và họ tên.",
  "Package not found": "Không tìm thấy tour.",
  "Itinerary not found": "Không tìm thấy lịch trình.",
  "Destination not found": "Không tìm thấy điểm đến.",
  "Booking not found": "Không tìm thấy đơn đặt tour.",
  "Package title cannot be empty": "Vui lòng nhập tên tour.",
  "Category cannot be empty": "Vui lòng chọn danh mục.",
  "Category is required": "Vui lòng chọn danh mục.",
  "Duration cannot be empty": "Vui lòng nhập thời gian tour.",
  "Best for field cannot be empty": "Vui lòng nhập đối tượng phù hợp.",
  "Main destinations cannot be empty": "Vui lòng nhập điểm đến chính.",
  "Price is required": "Vui lòng nhập giá tour.",
  "Price must be greater than 0": "Giá tour phải lớn hơn 0.",
  "People count is required": "Vui lòng nhập số khách tối đa.",
  "People count must be greater than 0": "Số khách tối đa phải lớn hơn 0.",
  "Day number must be greater than 0": "Thứ tự ngày phải lớn hơn 0.",
  "Itinerary description is required": "Vui lòng nhập mô tả lịch trình.",
  "Destination name cannot be empty": "Vui lòng nhập tên điểm đến.",
  "Location cannot be empty": "Vui lòng nhập địa điểm.",
  "Destination cannot be empty": "Vui lòng nhập điểm đến.",
  "Travel date is required": "Vui lòng chọn ngày khởi hành.",
  "Number of people is required": "Vui lòng nhập số khách.",
  "Number of people must be greater than 0": "Số khách phải lớn hơn 0.",
  "Number of days is required": "Vui lòng nhập số ngày.",
  "Number of days must be greater than 0": "Số ngày phải lớn hơn 0.",
  "Total price is required": "Vui lòng nhập tổng tiền.",
  "Total price must be greater than 0": "Tổng tiền phải lớn hơn 0.",
  "Contact name cannot be empty": "Vui lòng nhập họ tên người liên hệ.",
  "Phone number cannot be empty": "Vui lòng nhập số điện thoại.",
  "Invalid phone number format": "Số điện thoại không đúng định dạng.",
  "Email cannot be empty": "Vui lòng nhập email.",
  "Email should be valid": "Địa chỉ email không hợp lệ.",
  "Password cannot be empty": "Vui lòng nhập mật khẩu.",
  "Name cannot be empty": "Vui lòng nhập họ và tên.",
};
/** Dịch thông báo lỗi API hoặc lỗi mạng. Có thể đọc object lỗi theo từng trường và dùng thông báo mặc định. */
export const translateError = (message, fallback = "Không thể thực hiện yêu cầu. Vui lòng thử lại.") => {
  if (!message) return fallback;
  if (typeof message === "object") {
    const details = message.error || message.message;
    return details ? translateError(details, fallback) : Object.values(message).map((item) => translateError(item, fallback)).join("; ") || fallback;
  }
  const text = String(message).trim();
  if (errorMessages[text]) return errorMessages[text];
  if (/^(Failed to fetch|NetworkError|Network request failed|Load failed)/i.test(text)) return "Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối và thử lại.";
  if (/^Package not found/i.test(text)) return errorMessages["Package not found"];
  if (/^Itinerary not found/i.test(text)) return errorMessages["Itinerary not found"];
  if (/^Destination not found/i.test(text)) return errorMessages["Destination not found"];
  return /[À-ỹĐđ]/.test(text) ? text : fallback;
};

/** Đọc response dưới dạng JSON hoặc văn bản và ném thông báo đã dịch nếu HTTP báo lỗi. */
export const readApiResponse = async (response, fallback) => {
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) throw new Error(translateError(data, fallback));
  return data;
};
