# Quy ước viết mã của Tourism Application

Tài liệu ghi lại các quy ước đang dùng trong mã Java/Spring Boot, React và SQL của dự án. Khi các module có cách xử lý khác nhau, ví dụ dưới đây ghi rõ phạm vi áp dụng.

## 1. Đặt tên

| Đối tượng | Cách viết trong dự án | Ví dụ |
|---|---|---|
| Kiểu Java và component React | Dùng `PascalCase`. Tên thể hiện đối tượng nghiệp vụ hoặc vai trò của lớp, màn hình. | `BookingRequest`, `PackageItineraryService`, `DestinationForm`, `PackageDetails` |
| Hàm Java và hàm JS thông thường | Dùng `lowerCamelCase`. Tên truy vấn thường nêu thao tác, đối tượng và điều kiện tìm. Tên hàm ghi thể hiện việc tạo, sửa hoặc xóa. | `getBookingById`, `getPackagesByCategory`, `createItinerary`, `updateDestination`, `deletePackage` |
| Biến, tham số và thuộc tính | Dùng `lowerCamelCase`. Đưa ý nghĩa của ID hoặc đơn vị vào tên khi cần phân biệt. Từ viết tắt ở giữa tên thường được viết như một từ. | `packageId` là mã tour, `itineraryId` là mã của một ngày lịch trình. Các dạng tương tự gồm `imageUrl`, `mapToDto`, `formatVnd`. |
| Hàm đọc, ghi thuộc tính Java | Dùng cặp `getX` và `setX` theo tên thuộc tính của model. | `getImageUrl()` và `setImageUrl(...)` đọc, ghi `imageUrl`. |
| State React | Với `useState`, đặt tên hàm cập nhật bằng `set` và tên state viết hoa chữ đầu. | `[durationDays, setDurationDays]`, `[pkg, setPkg]`, `[loading, setLoading]` |
| Hàm xử lý sự kiện trên form | Các hàm xử lý sự kiện có tên thường dùng `handle` rồi đến hành động. Hàm kiểm tra dữ liệu hoặc tải dữ liệu mang tên theo công việc thực hiện. | `handleSubmit`, `handleDestinationChange`, `validateForm`, `fetchItineraries` |
| Hằng cấu hình | Dùng `UPPER_SNAKE_CASE` cho các tên như URL gốc, khóa lưu phiên và tùy chọn cố định. Trong JS, `const` cũng được dùng cho biến cục bộ và hàm với tên `lowerCamelCase`. | `BASE_URL`, `TOKEN_KEY`, `STANDARD_DAY_OPTIONS`, mẫu regex Java `DURATION_DAYS` |
| Bảng, cột SQL và tên migration | Tên SQL nhiều từ dùng `snake_case`. Migration Flyway dùng `V<số phiên bản>__<mô tả>.sql`. | `package_itinerary`, `package_id`, `day_number`, `V3__package_destination_and_duration_days.sql` |

Ở repository, tên phương thức có thể mô tả đường dẫn qua một quan hệ. `findByPkg_PackageId` truy vấn theo thuộc tính `packageId` của tour cha `pkg`. Khi đối chiếu giữa các tầng, cùng một dữ liệu có thể dùng `packageId` trong Java/JSON và `package_id` trong SQL. Tương tự, tham số do cổng thanh toán định nghĩa giữ nguyên cách viết của giao thức, ví dụ `vnp_SecureHash`. [Repository lịch trình](../Backend/packages-service/src/main/java/tourism_app/packages_service/repository/PackageItineraryRepository.java) · [DDL của tour](../Backend/packages-service/src/main/resources/db/migration/V1__init.sql) · [Tích hợp VNPay](../Backend/booking-service/src/main/java/tourism_app/booking_service/service/payment/VnPayPaymentGateway.java)

## 2. Tổ chức thư mục và trách nhiệm

| Vị trí | Nội dung |
|---|---|
| `Backend/api-gateway/` | Chứa cấu hình Gateway. Các đường dẫn HTTP được ánh xạ đến dịch vụ đích trong `src/main/resources/application.yml`. |
| `Backend/{auth,booking,destination,packages}-service/` | Mỗi dịch vụ có project Maven riêng. Trong `src/main/java/<package gốc>/`, `controller` tiếp nhận request, `service` xử lý nghiệp vụ, `repository` truy cập dữ liệu và `model` chứa thực thể. Các controller quản trị điểm đến, tour và đơn đặt tour đặt trong `controller/admin`. |
| Các thư mục chuyên trách của backend | `config` chứa cấu hình Spring, `exception` chứa bộ xử lý lỗi. Booking có `dto` cho dữ liệu request và `service/payment` cho tích hợp thanh toán. |
| `Backend/<service>/src/main/resources/` | Chứa cấu hình ứng dụng, cấu hình theo môi trường và các tập tin Flyway trong `db/migration/` ở các dịch vụ dùng MySQL. Kiểm thử Java đặt dưới `src/test/java/`. |
| `Frontend/src/components/` | Màn hình và thành phần giao diện nhóm theo chức năng, ví dụ `destinations/`, `packages/`, `bookings/`. Màn hình quản trị tập trung trong `admin/`, gồm các nhóm như `PackagesAdmin/` và `DestinationsAdmin/`. |
| `Frontend/src/api/` và `Frontend/src/utils/` | `api/config.js` định nghĩa địa chỉ và endpoint. Các file như `packagesApi.js` và `adminApi.js` đóng gói lời gọi HTTP. `utils/` chứa hàm dùng chung cho phiên đăng nhập, hiển thị tiếng Việt, tiền tệ và lịch trình. |
| Kiểm thử frontend | File `*.test.js` hoặc `*.test.jsx` nằm cạnh mã cần kiểm thử, ví dụ `itinerary.test.js` và `PackageBookingForm.test.jsx`. |

Đường đi giữa các tầng phụ thuộc nghiệp vụ. `BookingController.createBooking` chuyển DTO cho service. `AdminPackageController.updatePackage` gọi thẳng repository để tìm và lưu tour. Nghiệp vụ kiểm tra một ngày lịch trình thuộc tour được đặt trong `PackageItineraryService` để cả thao tác tạo và sửa dùng chung. [BookingController.java](../Backend/booking-service/src/main/java/tourism_app/booking_service/controller/BookingController.java) · [AdminPackageController.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/controller/admin/AdminPackageController.java) · [PackageItineraryService.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/service/PackageItineraryService.java)

## 3. Cách viết hàm và kiểm tra dữ liệu

- **React.** Component hàm dùng `useState` cho dữ liệu nhập và trạng thái giao diện. `useEffect` nạp dữ liệu khi mở màn hình hoặc đổi ID. Ví dụ, form tour chia việc chọn điểm đến, kiểm tra form và gửi request thành các hàm riêng. Nếu `validateForm()` trả thông báo lỗi, `handleSubmit()` hiển thị lỗi và kết thúc trước khi gọi API. Trước khi gửi, form cắt khoảng trắng ở các trường văn bản và chuyển giá, số khách sang kiểu số. [PackageForm.jsx](../Frontend/src/components/admin/PackagesAdmin/PackageForm.jsx)
- **Controller Java.** Khai báo HTTP method và đường dẫn bằng annotation Spring MVC. Dùng `@PathVariable` cho giá trị trong URL và `@RequestBody` cho body. Các endpoint tạo/sửa có Bean Validation đặt `@Valid` trước tham số body. Kiểu tham số tùy nghiệp vụ, chẳng hạn `BookingRequest` cho đơn đặt tour và `Package` cho form quản trị tour. [BookingController.java](../Backend/booking-service/src/main/java/tourism_app/booking_service/controller/BookingController.java) · [AdminPackageController.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/controller/admin/AdminPackageController.java)
- **Ràng buộc từng trường.** DTO hoặc entity khai báo annotation theo yêu cầu của trường. Ví dụ `BookingRequest.people` dùng cả `@NotNull` và `@Positive` để yêu cầu có giá trị và lớn hơn 0. `Package.peopleCount` chỉ có `@Positive`, nên quy tắc phía backend chỉ kiểm tra tính dương khi có giá trị. `BookingRequest.phone` dùng `@NotBlank` và `@Pattern`. [BookingRequest.java](../Backend/booking-service/src/main/java/tourism_app/booking_service/dto/BookingRequest.java) · [Package.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/model/Package.java)
- **Ràng buộc cần dữ liệu liên quan.** `PackageItineraryService.validateItinerary` đọc thời lượng của tour cha, kiểm tra phạm vi ngày, mô tả và sự trùng lặp trong lịch trình. Khi sửa, hàm loại chính bản ghi đang chỉnh khỏi phép kiểm tra trùng. Ở phía React, `firstAvailableDay` tìm ngày còn trống đầu tiên để gợi ý cho người nhập. [PackageItineraryService.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/service/PackageItineraryService.java) · [itinerary.js](../Frontend/src/utils/itinerary.js)
- **Quy tắc lint của frontend.** Cấu hình ESLint trong `package.json` kế thừa `react-app` và `react-app/jest`. Các lệnh `build` và `test` dùng `react-scripts`. [package.json](../Frontend/package.json)

## 4. Xử lý lỗi và phản hồi

| Tình huống | Cách dự án đang xử lý |
|---|---|
| Body vi phạm Bean Validation | Các dịch vụ nghiệp vụ có `GlobalExceptionHandler` dùng `@ControllerAdvice`. Handler của `MethodArgumentNotValidException` trả HTTP 400 và object có tên trường làm khóa, thông báo làm giá trị. |
| Ngày lịch trình không hợp lệ | Service ném `IllegalArgumentException`. Handler của packages-service chuyển thành HTTP 400 với body dạng `{"error":"..."}`. |
| Thiếu bản ghi khi tra chi tiết | Ví dụ, `DestinationService.getById` dùng `orElseThrow` với `RuntimeException`. Handler của dịch vụ điểm đến trả HTTP 500 và khóa `error` cho trường hợp này. |
| Lỗi được xử lý ngay tại controller | `AuthController.login` tự tạo response với khóa `message`. Thiếu email hoặc mật khẩu trả 400, lỗi thông tin đăng nhập trả 401 và lỗi trạng thái tài khoản trả 403. |
| Giao diện nhận lỗi HTTP | `adminFetch` kiểm tra 401/403. Với các thao tác như tạo tour, `parseErrorMessage` đọc `error`, `message` hoặc các lỗi theo tên trường. Form nhận lỗi để hiển thị, đồng thời kết thúc trạng thái đang gửi trong `finally`. |
| Trang tra cứu tour công khai tải lỗi | `safeFetchJson` thử URL dự phòng và trả `null` nếu cả hai lần thất bại. Các hàm lấy danh sách như `getAllPackages` chuyển kết quả không phải mảng thành `[]`. |

Có thể đối chiếu trực tiếp các nhánh trên trong [handler của tour](../Backend/packages-service/src/main/java/tourism_app/packages_service/exception/GlobalExceptionHandler.java), [service điểm đến](../Backend/destination-service/src/main/java/tourism_application/destination_service/service/DestinationService.java), [handler của điểm đến](../Backend/destination-service/src/main/java/tourism_application/destination_service/exception/GlobalExceptionHandler.java), [controller tài khoản](../Backend/auth-service/src/main/java/tourism_app/auth_service/controller/AuthController.java), [API quản trị](../Frontend/src/api/adminApi.js) và [API tour công khai](../Frontend/src/api/packagesApi.js).
