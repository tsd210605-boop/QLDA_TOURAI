# Nhật ký lập trình hai module Điểm đến và Tour – Lịch trình

**Thời gian thực hiện theo lịch nhóm cung cấp:** 16/10/2026–08/11/2026. Nhóm kết thúc giai đoạn lập trình ngày **08/11**, muộn **1 ngày** so với mốc 07/11. Ba đầu việc đầu hoàn thành đúng hạn. Chênh lệch nằm ở đầu việc tích hợp Frontend–Backend.

## 1. Mốc công việc và thành viên

| Công việc | Người thực hiện theo phân công | Người ở cột phụ trách/đối chiếu¹ | Bắt đầu | Hạn kế hoạch | Hoàn thành theo lịch nhóm |
|---|---|---|---|---|---|
| Toàn bộ giai đoạn lập trình | Cả nhóm | Lê Văn Huy | 16/10/2026 | 07/11/2026 | **08/11/2026** |
| Thiết lập mã nguồn nền Backend, Frontend và kết nối CSDL | Trần Sơn Duy | Phạm Đức Vượng | 16/10/2026 | 20/10/2026 | 20/10/2026 |
| Xây dựng CRUD điểm đến, kiểm tra đầu vào và lưu CSDL | Trần Sơn Duy | Lê Văn Huy | 21/10/2026 | 27/10/2026 | 27/10/2026 |
| Xây dựng CRUD tour, lịch trình từng ngày và liên kết điểm đến | Phạm Đức Vượng | Lê Văn Huy | 28/10/2026 | 04/11/2026 | 04/11/2026 |
| Tích hợp Frontend–Backend và kiểm tra tương thích | Cả nhóm | Lê Văn Huy | 05/11/2026 | 07/11/2026 | **08/11/2026** |

¹ Bảng nguồn có hai cột tên người nhưng thiếu tiêu đề cột. Tài liệu hiểu cột thứ nhất là người thực hiện và giữ cột thứ hai để đối chiếu trách nhiệm. Các ngày hoàn thành lấy từ lịch nhóm. Mục 2 gắn **người được phân công và khoảng thời gian của đầu việc** với phần mã thực hiện chức năng đó. Mục 3 ghi **tác giả, thời gian và thay đổi** có thể xác nhận bằng Git.

## 2. Nội dung lập trình theo từng khoảng thời gian

### 16–20/10/2026 · Trần Sơn Duy · Thiết lập mã nguồn nền và CSDL

Phạm Đức Vượng đứng ở cột thứ hai của đầu việc. Sản phẩm của giai đoạn này là khung ứng dụng cho phép giao diện gọi đúng dịch vụ và mỗi dịch vụ kết nối đúng cơ sở dữ liệu.

| Hạng mục | Nội dung đối chiếu trong mã nguồn | File liên quan |
|---|---|---|
| Khởi động ứng dụng | Hai service có điểm vào Spring Boot và khai báo phụ thuộc Maven riêng. Ở frontend, React tạo root và dựng component `App`. | [DestinationServiceApplication.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/DestinationServiceApplication.java) · [PackagesServiceApplication.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/PackagesServiceApplication.java) · [pom.xml điểm đến](../Backend/destination-service/pom.xml) · [pom.xml tour](../Backend/packages-service/pom.xml) · [index.js](../Frontend/src/index.js) |
| Kết nối CSDL | SQL khởi tạo hai schema `destinations_db` và `packages_db`. Compose kết nối các service với MySQL. Cấu hình production của từng service lấy JDBC URL từ `DB_URL` và bật Flyway. | [init.sql](../mysql-init/init.sql) · [docker-compose.yml](../docker-compose.yml) · [Kết nối điểm đến](../Backend/destination-service/src/main/resources/application-prod.properties) · [Kết nối tour](../Backend/packages-service/src/main/resources/application-prod.properties) |
| Tạo bảng và định tuyến API | Migration khởi tạo bảng điểm đến, tour, ngày lịch trình và ưu đãi. Frontend khai báo endpoint trong `config.js`. Gateway ánh xạ nhóm đường dẫn điểm đến và tour đến service tương ứng. | [DDL điểm đến](../Backend/destination-service/src/main/resources/db/migration/V1__init.sql) · [DDL tour](../Backend/packages-service/src/main/resources/db/migration/V1__init.sql) · [config.js](../Frontend/src/api/config.js) · [Route Gateway](../Backend/api-gateway/src/main/resources/application.yml) |

### 21–27/10/2026 · Trần Sơn Duy · Quản lý điểm đến

Lê Văn Huy đứng ở cột thứ hai của đầu việc. Chức năng gồm xem địa danh theo nhóm và quản trị từng điểm đến từ biểu mẫu đến bản ghi MySQL.

| Hạng mục | Nội dung đối chiếu trong mã nguồn | File liên quan |
|---|---|---|
| Mô hình và truy vấn | Entity ánh xạ bảng `destinations`. Repository cung cấp CRUD và truy vấn danh mục không phân biệt hoa thường. Service đọc theo ID, danh mục hoặc toàn bộ bảng. | [Destination.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/model/Destination.java) · [DestinationRepository.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/repository/DestinationRepository.java) · [DestinationService.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/service/DestinationService.java) |
| API và giao diện công khai | `getByCategories` nhóm bản ghi theo `category`. Trang điểm đến gọi `getDestinationsByCategories`, dựng danh sách theo nhóm và cho phép cuộn đến nhóm được chọn. | [DestinationController.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/controller/DestinationController.java) · [destinationsApi.js](../Frontend/src/api/destinationsApi.js) · [Destinations.jsx](../Frontend/src/components/destinations/Destinations.jsx) |
| Thêm, xem, sửa, xóa | Trang quản trị tải danh sách hoặc một bản ghi để sửa. Form gửi POST/PUT tới `/api/admin/destinations` hoặc đường dẫn có ID. Controller lưu qua repository. Khi xóa, danh sách gửi DELETE theo ID. | [DestinationsList.jsx](../Frontend/src/components/admin/DestinationsAdmin/DestinationsList.jsx) · [DestinationForm.jsx](../Frontend/src/components/admin/DestinationsAdmin/DestinationForm.jsx) · [adminApi.js](../Frontend/src/api/adminApi.js) · [AdminDestinationController.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/controller/admin/AdminDestinationController.java) |
| Kiểm tra đầu vào | Form kiểm tra tên, địa phương, danh mục. Backend dùng `@Valid` và `@NotBlank`. Khi vi phạm, handler trả HTTP 400 kèm lỗi theo trường. | [DestinationForm.jsx](../Frontend/src/components/admin/DestinationsAdmin/DestinationForm.jsx) · [Destination.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/model/Destination.java) · [GlobalExceptionHandler.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/exception/GlobalExceptionHandler.java) |

### 28/10–04/11/2026 · Phạm Đức Vượng · Quản lý tour và lịch trình

Lê Văn Huy đứng ở cột thứ hai của đầu việc. Khoảng phân công bao gồm ba thao tác có thể trình diễn liên tiếp: chọn điểm đến trên form tour, lưu tour và thêm lịch trình cho tour vừa tạo.

| Hạng mục | Nội dung đối chiếu trong mã nguồn | File liên quan |
|---|---|---|
| Danh mục và chi tiết tour | Controller cung cấp API danh sách, chi tiết, lọc chuyên mục và tìm tour liên quan. Trang chi tiết dùng ID tour để lấy thông tin chính và lịch trình. | [PackageController.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/controller/PackageController.java) · [PackageService.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/service/PackageService.java) · [packagesApi.js](../Frontend/src/api/packagesApi.js) · [PackageDetails.jsx](../Frontend/src/components/packages/PackageDetails.jsx) |
| CRUD tour | Trang quản trị mở form tạo/sửa và gửi lệnh xóa. `handleSubmit` chuẩn hóa thời lượng, chuyển giá và số khách sang số. `AdminPackageController` kiểm tra body rồi đọc/ghi qua repository. | [PackagesList.jsx](../Frontend/src/components/admin/PackagesAdmin/PackagesList.jsx) · [PackageForm.jsx](../Frontend/src/components/admin/PackagesAdmin/PackageForm.jsx) · [AdminPackageController.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/controller/admin/AdminPackageController.java) · [Package.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/model/Package.java) · [PackageRepository.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/repository/PackageRepository.java) |
| Liên kết điểm đến với tour | Form gọi `getAllDestinations` từ API quản trị. `handleDestinationChange` lấy tên, địa phương và ảnh của địa danh được chọn để điền `mainDestinations`, `imageUrl`. Tour lưu bản sao các giá trị này. | [PackageForm.jsx](../Frontend/src/components/admin/PackagesAdmin/PackageForm.jsx) · [adminApi.js](../Frontend/src/api/adminApi.js) · [AdminDestinationController.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/controller/admin/AdminDestinationController.java) · [Package.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/model/Package.java) |
| Màn hình lịch trình | `fetchItineraries` tải song song tour và lịch trình, sắp ngày tăng dần. `firstAvailableDay` gợi ý ngày còn trống đầu tiên. `handleAdd` gửi số ngày và mô tả, `handleDelete` xóa theo ID của bản ghi ngày. | [PackageItineraries.jsx](../Frontend/src/components/admin/PackagesAdmin/PackageItineraries.jsx) · [itinerary.js](../Frontend/src/utils/itinerary.js) · [adminApi.js](../Frontend/src/api/adminApi.js) |
| Kiểm tra và lưu lịch trình | Khi thêm ngày, service tìm tour cha theo `packageId`, kiểm tra phạm vi ngày, mô tả khác trắng và ngày trùng, rồi lưu quan hệ qua `package_id`. Khi sửa ngày, service bỏ qua chính `itineraryId` đang sửa trong phép kiểm tra trùng. | [AdminPackageItineraryController.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/controller/admin/AdminPackageItineraryController.java) · [PackageItineraryService.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/service/PackageItineraryService.java) · [PackageItineraryRepository.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/repository/PackageItineraryRepository.java) · [PackageItinerary.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/model/PackageItinerary.java) |

### 05–08/11/2026 · Cả nhóm · Tích hợp và kiểm tra tương thích

Theo kế hoạch, Trần Sơn Duy, Phạm Đức Vượng và Lê Văn Huy cùng tham gia đầu việc này. Lịch nhóm ghi hạn **07/11** và hoàn thành **08/11**. Các file kiểm thử bên dưới cho biết tình huống nào được mã hóa thành test. Ngày chạy và người chạy từng test trong giai đoạn này chưa có trong dữ liệu được cung cấp.

| Điểm tích hợp | Nội dung cần đối chiếu giữa các phần đã lập trình | File triển khai hoặc kiểm thử |
|---|---|---|
| Trình duyệt → Gateway → service | Bản production dùng Nginx tiếp nhận tiền tố `/backend/`, Gateway chuyển các route đọc/ghi tới đúng service. Frontend ghép endpoint và gửi header xác thực cho API quản trị. | [nginx.conf](../Frontend/nginx.conf) · [docker-compose.prod.yml](../docker-compose.prod.yml) · [Route Gateway](../Backend/api-gateway/src/main/resources/application.yml) · [config.js](../Frontend/src/api/config.js) · [adminApi.js](../Frontend/src/api/adminApi.js) |
| Điểm đến → form tour | Đối chiếu danh sách điểm đến trả về với các lựa chọn trên form, dữ liệu gửi khi lưu tour và thông báo khi API quản trị trả lỗi. | [adminApi.test.js](../Frontend/src/api/adminApi.test.js) · [PackageForm.test.jsx](../Frontend/src/components/admin/PackagesAdmin/PackageForm.test.jsx) · [AdminDestinationControllerTest.java](../Backend/destination-service/src/test/java/tourism_application/destination_service/AdminDestinationControllerTest.java) · [AdminPackageControllerTest.java](../Backend/packages-service/src/test/java/tourism_app/packages_service/AdminPackageControllerTest.java) |
| Tour → lịch trình | Đối chiếu cách đọc thời lượng, gợi ý ngày còn trống trên giao diện và cách backend xử lý ngày trùng, ngày vượt thời lượng, mô tả trống hoặc sửa một ngày đang tồn tại. | [PackageItineraries.test.jsx](../Frontend/src/components/admin/PackagesAdmin/PackageItineraries.test.jsx) · [itinerary.test.js](../Frontend/src/utils/itinerary.test.js) · [PackageItineraryControllerTest.java](../Backend/packages-service/src/test/java/tourism_app/packages_service/PackageItineraryControllerTest.java) |

## 3. Lịch sử thay đổi xác nhận được bằng Git

Các mốc dưới đây lấy từ lịch sử nhánh `main` và tham chiếu `origin/main` trong bản sao dự án, theo giờ Việt Nam (UTC+7). Git ghi tên tác giả là **DuyTS**. Bảng kế hoạch sử dụng tên thật của thành viên.

| Thời điểm commit | Tác giả Git | Commit | Nội dung và file xác nhận được |
|---|---|---|---|
| 24/10/2026 09:30:50 | DuyTS | `cd3b36b` · `initial commit` | Snapshot đầu tiên đã chứa [docker-compose.yml](../docker-compose.yml), [init.sql](../mysql-init/init.sql), [AdminDestinationController.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/controller/admin/AdminDestinationController.java), [AdminPackageController.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/controller/admin/AdminPackageController.java), [PackageItineraryService.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/service/PackageItineraryService.java) và [PackageForm.jsx](../Frontend/src/components/admin/PackagesAdmin/PackageForm.jsx). Ngày này xác nhận các file đã có mặt trong Git. |
| 26/10/2026 21:07:37 | DuyTS | `8c8818b` · `update thanh toan 26/10` | Trong phạm vi hai module, commit thêm [migration dữ liệu tour theo chuyên mục](../Backend/packages-service/src/main/resources/db/migration/V2__seed_all_categories_packages.sql) và bổ sung phép đếm số tour từng chuyên mục ở [PackagesList.jsx](../Frontend/src/components/packages/PackagesList.jsx). Thay đổi tại [PackageItineraries.jsx](../Frontend/src/components/admin/PackagesAdmin/PackageItineraries.jsx) chỉ bổ sung chú thích ESLint. |
| 26/10/2026 21:19:47 | DuyTS | `ecd9c0e` · `fix: make all mvnw executable` | Đổi quyền thực thi từ `100644` sang `100755` cho Maven Wrapper của bốn service, gồm [mvnw của điểm đến](../Backend/destination-service/mvnw) và [mvnw của tour](../Backend/packages-service/mvnw). |

**Cách đọc hai nguồn cùng nhau.** Mã tour và lịch trình đã xuất hiện trong snapshot ngày 24/10, sớm hơn ngày bắt đầu đầu việc tour 28/10. Vì vậy, có thể ghi Phạm Đức Vượng là người được phân công cho đầu việc 28/10–04/11 theo lịch nhóm. Ba commit hiện có chưa đủ để quy từng dòng mã trong snapshot đó cho Vượng, Duy hoặc Huy, hay xác định ai đã sửa file nào vào từng ngày sau 26/10.
