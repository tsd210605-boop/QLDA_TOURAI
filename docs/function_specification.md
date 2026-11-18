# Đặc tả chức năng — Quản lý điểm đến và Quản lý tour du lịch – lịch trình

Tài liệu theo dấu một thao tác từ màn hình React đến bảng MySQL và quay lại giao diện. Phạm vi nghiệp vụ lấy từ *THIET_KE_CHI_TIET_BACKEND (2).docx*. Đường dẫn HTTP, tên hàm, điều kiện kiểm tra và kết quả bên dưới bám theo mã nguồn hiện tại. Các giá trị ID trong ví dụ chỉ dùng để minh họa.

## 1. Một request đi qua hệ thống như thế nào?

| Thứ tự | File tham gia | Dữ liệu đi qua |
|---|---|---|
| 1. Chọn màn hình | [Pages.jsx](../Frontend/src/components/pages/Pages.jsx), [AdminRoute.jsx](../Frontend/src/components/admin/AdminRoute.jsx), [AdminDashboard.jsx](../Frontend/src/components/admin/AdminDashboard.jsx) | React Router chọn component theo URL trên trình duyệt. Ví dụ, mở `/admin/packages/edit/42` sẽ dựng `PackageForm` với `id = 42`. Component này mới phát request lấy dữ liệu. |
| 2. Tạo HTTP request | [config.js](../Frontend/src/api/config.js), [destinationsApi.js](../Frontend/src/api/destinationsApi.js), [packagesApi.js](../Frontend/src/api/packagesApi.js), [adminApi.js](../Frontend/src/api/adminApi.js) | `ENDPOINTS` ghép địa chỉ gốc với đường dẫn API. Lời gọi quản trị qua `adminFetch` dùng `authHeaders()` trong [auth.js](../Frontend/src/utils/auth.js) để đặt kiểu JSON và gắn Bearer JWT khi có token. Các hàm tạo/sửa chuyển object thành chuỗi JSON bằng `JSON.stringify`. |
| 3. Định tuyến | [docker-compose.prod.yml](../docker-compose.prod.yml), [nginx.conf](../Frontend/nginx.conf), [application.yml của Gateway](../Backend/api-gateway/src/main/resources/application.yml) | Với cấu hình production mặc định, trình duyệt gọi `/backend/...`, Nginx bỏ tiền tố `/backend` rồi chuyển đến `api-gateway:8080`. Khi chạy frontend với cấu hình mặc định trong `config.js`, trình duyệt gọi thẳng Gateway tại `localhost:8080`. |
| 4. Kiểm tra quyền | `security/JwtAuthFilter.java`, `security/JwtTokenService.java`, `config/SecurityConfig.java` trong từng service | `doFilterInternal` lấy token, `parseToken` xác minh JWT, đọc subject và role. Khi hợp lệ, filter đặt quyền `ROLE_<role>` vào SecurityContext. Chuỗi filter do `filterChain` cấu hình cho phép đọc công khai và kiểm tra role trước khi vào controller quản trị. |
| 5. Xử lý và trả kết quả | Controller → service hoặc repository → entity/bảng → controller → frontend | Spring ánh xạ biến URL vào tham số và JSON vào `@RequestBody`. Spring Data JPA đọc/ghi bảng theo entity. Với kết quả là entity hoặc danh sách, Spring chuyển thành JSON. Frontend đọc phản hồi và cập nhật state, chuyển trang hoặc hiển thị lỗi. Các bảng ở mục 2–4 nêu đúng nhánh xử lý của từng endpoint. |

Gateway chuyển `/api/destinations/**` và `/api/admin/destinations/**` đến **destination-service:8083**. Ba nhóm `/packages/**`, `/api/admin/packages/**` và `/admin/packages/**` đến **packages-service:8084**. Trong Compose production, hai service kết nối cùng máy chủ `mysql:3306`, lần lượt dùng schema `destinations_db` và `packages_db`.

**Quyền thực tế.** Cả hai service cho phép `ADMIN`, `OPERATOR`, `SALES` vào các route quản trị của mình. Hai trang danh sách quản trị dùng thêm `hasPermission("TOUR_WRITE")` để điều khiển nút thao tác. Khi nhận HTTP 401 hoặc 403, `adminFetch` báo lỗi quyền truy cập. [Cấu hình điểm đến](../Backend/destination-service/src/main/java/tourism_application/destination_service/config/SecurityConfig.java) · [Cấu hình tour](../Backend/packages-service/src/main/java/tourism_app/packages_service/config/SecurityConfig.java)

## 2. Module quản lý điểm đến

**Chức năng.** Khách xem địa danh theo nhóm. Nhân viên quản lý danh mục và dùng lại thông tin địa danh khi lập tour. [Destination.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/model/Destination.java) ánh xạ vào `destinations_db.destinations`. Khóa `id` tự tăng. `name`, `location`, `category` có `@NotBlank`. Ba thuộc tính còn lại là `description`, `imageUrl`, `avgPrice` (giá tham khảo, kiểu Double).

### 2.1. Khách duyệt điểm đến

1. Mở `/destinations` → [Destinations.jsx](../Frontend/src/components/destinations/Destinations.jsx) chạy `loadDestinations()` → `destinationsApi.js#getDestinationsByCategories()` gửi `GET /api/destinations/by-categories`.
2. Gateway chuyển đến [DestinationController.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/controller/DestinationController.java). `getByCategories()` gọi [DestinationService.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/service/DestinationService.java) qua `getAll()`. [DestinationRepository.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/repository/DestinationRepository.java) thực hiện `findAll()` và trả danh sách entity.
3. Controller nhóm danh sách trong Java theo `category`, dùng khóa `Uncategorized` nếu giá trị là null. JSON trả về có dạng `{"Nature & Adventure": [{...}], "City Experience": [{...}]}`. React lưu vào `destinationsByCategory` và dựng từng nhóm. Khi người dùng bấm một nhóm, `scrollToCategory()` cuộn đến nhóm trong dữ liệu đã tải.

Các API công khai khác dùng cùng Gateway và các file controller, service, repository trên.

| Request | Thứ tự gọi sau khi vào controller | Kết quả |
|---|---|---|
| `GET /api/destinations` | `getAll → service.getAll → findAll` | Mảng điểm đến, có thể rỗng. |
| `GET /api/destinations/{id}` | `getById → service.getById → findById` | Một điểm đến. Thiếu ID trong CSDL phát sinh `RuntimeException`. |
| `GET /api/destinations/by-category/{category}` | `getByCategory → service.getByCategory → findByCategoryIgnoreCase` | Mảng lọc theo tên nhóm, bỏ qua hoa/thường. Đường dẫn thực tế dùng `by-category`. |

### 2.2. Nhân viên xem, tạo, sửa và xóa điểm đến

Hai màn hình [DestinationsList.jsx](../Frontend/src/components/admin/DestinationsAdmin/DestinationsList.jsx) và [DestinationForm.jsx](../Frontend/src/components/admin/DestinationsAdmin/DestinationForm.jsx) gọi **adminApi.js**. Sau Gateway và bộ lọc quyền, [AdminDestinationController.java](../Backend/destination-service/src/main/java/tourism_application/destination_service/controller/admin/AdminDestinationController.java) gọi **trực tiếp DestinationRepository**. Các hàm `create/update/delete` trong `DestinationService` không tham gia các request quản trị này.

| Thao tác và điểm phát ở React | Request | Hàm backend theo thứ tự và phản hồi thành công |
|---|---|---|
| Vào danh sách. `fetchDestinations → getAllDestinations` | `GET /api/admin/destinations` | `getAllDestinations → findAll`. Trả 200 và mảng để dựng bảng. |
| Mở form sửa. `useEffect → getDestinationById(id)` | `GET /api/admin/destinations/{id}` | `getDestinationById → findById`. Trả 200 và bản ghi để điền form. |
| Lưu form mới. `handleSubmit → createDestination` | `POST /api/admin/destinations` | `addDestination(@Valid Destination) → save`. Bản ghi mới nhận ID tự tăng. Trả 200 và entity đã lưu. |
| Lưu form sửa. `handleSubmit → updateDestination` | `PUT /api/admin/destinations/{id}` | `updateDestination → findById → setName/setDescription/setLocation/setCategory/setImageUrl → save`. ID từ URL xác định dòng cần sửa. Trả 200 và entity sau sửa. |
| Xác nhận xóa. `handleDelete → deleteDestination` | `DELETE /api/admin/destinations/{id}` | `deleteDestination → deleteById`. Hàm controller trả `void`, thành công mặc định 200, thân rỗng. Giao diện lọc ID khỏi danh sách hiện tại. |

**Dữ liệu của form.** `handleSubmit` kiểm tra tên, địa phương và danh mục có nội dung. Form gửi năm trường `name, description, location, category, imageUrl`. Giá trị chọn cho `category` là `Beach & Relaxation`, `Nature & Adventure`, `Cultural & Historical` hoặc `City Experience`. [locale.js](../Frontend/src/utils/locale.js) cung cấp `categoryLabel` để hiện nhãn tiếng Việt. Backend kiểm tra chuỗi danh mục khác trắng, không áp đặt danh sách bốn giá trị. Khi tạo trực tiếp qua API có thể gửi `avgPrice`. Form không có ô nhập giá và controller PUT giữ lại giá cũ. Sau POST/PUT thành công, form quay về `/admin/destinations` và danh sách tải lại.

**Khi có lỗi.** Vi phạm `@Valid` trả 400 với JSON theo từng trường. GET chi tiết và PUT với ID không tồn tại đi vào `handleRuntimeException`, trả 500 với khóa `error`. DELETE gọi thẳng `deleteById` và không có bước kiểm tra tồn tại riêng. Ở giao diện, `deleteDestination` trả boolean `res.ok`, nhưng `DestinationsList.handleDelete` bỏ qua giá trị này. Vì thế, dòng biến mất trên màn hình chưa đủ để xác nhận máy chủ đã xóa nếu HTTP trả lỗi mà hàm không ném ngoại lệ. [GlobalExceptionHandler.java của điểm đến](../Backend/destination-service/src/main/java/tourism_application/destination_service/exception/GlobalExceptionHandler.java)

## 3. Module quản lý tour du lịch

**Chức năng.** Khách duyệt tour, lọc theo chuyên mục, xem chi tiết, tour liên quan, ưu đãi và lịch trình. Nhân viên tạo, sửa, xóa sản phẩm tour và quản lý từng ngày của chuyến đi.

| Entity và bảng trong `packages_db` | Dữ liệu và quan hệ cần biết |
|---|---|
| [Package.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/model/Package.java) → `packages` | `packageId` tự tăng. `title, category, duration, mainDestinations, bestFor` là chuỗi bắt buộc khác trắng. `price` (Double, VNĐ) và `peopleCount` (Integer) có `@Positive` khi có giá trị. Entity còn có `imageUrl` và danh sách `itinerary`. |
| [PackageItinerary.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/model/PackageItinerary.java) → `package_itinerary` | `itineraryId` định danh một bản ghi. `dayNumber` là ngày thứ mấy trong chuyến đi. `description` chứa nội dung. Thuộc tính `pkg` ánh xạ FK `package_id` và có `@JsonIgnore` để tránh lặp tour cha trong JSON của từng ngày. |
| [PackageOffer.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/model/PackageOffer.java) → `package_offers` | `offerId, packageId, offerTitle, discountPercentage, startDate, endDate, imageUrl`. Hàm đọc ưu đãi lấy toàn bộ bảng, không lọc theo ngày hiệu lực. |

### 3.1. Khách tìm và mở tour

Tại `/packages`, [PackagesList.jsx](../Frontend/src/components/packages/PackagesList.jsx) lấy toàn bộ tour để đếm theo nhóm và hiển thị danh sách, đồng thời lấy ưu đãi cho [OffersCarousel.jsx](../Frontend/src/components/packages/OffersCarousel.jsx). Khi đổi nhóm, `packagesApi.js#getPackagesByCategory` mã hóa tên nhóm vào URL. Bảy giá trị trên giao diện là `Nature & Adventure`, `Cultural & Historical`, `Beaches & Relaxation`, `Wildlife & Safari`, `Spiritual & Wellness`, `Luxury & Honeymoon`, `Food & Culinary`.

Khi mở `/packages/42`, [PackageDetails.jsx](../Frontend/src/components/packages/PackageDetails.jsx) khởi chạy riêng ba lời gọi lấy tour, lịch trình và ưu đãi theo ID. Sau khi tour trả về và có `category`, trang mới gọi lấy tour liên quan. Bảng dưới theo thứ tự **hàm trong packagesApi.js → HTTP qua Gateway → controller → service → repository**.

| Hàm frontend và request | Đường đi trong packages-service | Kết quả |
|---|---|---|
| `getAllPackages` · `GET /packages` | `PackageController.getAllPackages → PackageService.getAllPackages → PackageRepository.findAll` | Mảng tour. Giao diện lưu cả danh sách và tính số tour mỗi nhóm. |
| `getPackagesByCategory` · `GET /packages/category/{category}` | `PackageController.getPackagesByCategory → PackageService.getPackagesByCategory → PackageRepository.findByCategory` | Mảng tour cùng chuyên mục. |
| `getPackageById` · `GET /packages/{id}` | `PackageController.getPackageById → PackageService.getPackageById → PackageRepository.findById` | Một tour, có thể kèm `itinerary`. ID không tồn tại phát sinh lỗi 500 tại service. |
| `getRelatedPackages` · `GET /packages/category/{category}/related/{excludeId}` | `PackageController.getRelatedPackages → PackageService.getRelatedPackages → PackageRepository.findByCategory` | Service loại tour có `packageId == excludeId` trước khi trả danh sách. |
| `getItineraryByPackageId` · `GET /packages/{id}/itinerary` | `PackageItineraryController.getItinerary → PackageItineraryService.getItineraryByPackage → PackageItineraryRepository.findByPkg_PackageId` | Mảng ngày theo tour. Trang chi tiết ưu tiên mảng này khi có dữ liệu, rồi mới dùng `pkg.itinerary`. Truy vấn và trang công khai đều không áp đặt thứ tự ngày. |
| `getOffers` · `GET /packages/offers` | `PackageController.getOffers → PackageOfferService.getAllOffers → PackageOfferRepository.findAll` | Mảng ưu đãi cho carousel. |
| `getPackageOffer` · `GET /packages/{id}/offer` | Frontend có lời gọi, nhưng backend hiện chưa khai báo mapping tương ứng. | Khi các lần gọi đều thất bại, helper trả `null`. Trang chi tiết dùng mức giảm 0 và hiển thị giá gốc. |

Các file triển khai tra cứu nằm trong [controller](../Backend/packages-service/src/main/java/tourism_app/packages_service/controller), [service](../Backend/packages-service/src/main/java/tourism_app/packages_service/service) và [repository](../Backend/packages-service/src/main/java/tourism_app/packages_service/repository). Trong `packagesApi.js`, `safeFetchJson` thử Gateway trước, sau đó thử `localhost:8084/packages` khi cần. Nếu cả hai thất bại, hàm lấy danh sách trả `[]`, hàm lấy đối tượng trả `null`. Dữ liệu rỗng trên UI vì vậy cũng có thể xuất phát từ lỗi tải.

### 3.2. Nhân viên tạo tour từ một điểm đến

1. **Nạp dữ liệu.** Mở `/admin/packages/add` → [PackageForm.jsx](../Frontend/src/components/admin/PackagesAdmin/PackageForm.jsx) → `adminApi.js#getAllDestinations` → `GET /api/admin/destinations` → Gateway → `AdminDestinationController.getAllDestinations → DestinationRepository.findAll`. Mảng trả về là nguồn của ô chọn điểm đến. Khi danh sách đang tải, tải lỗi hoặc rỗng, form khóa nút lưu.
2. **Chọn điểm đến.** `handleDestinationChange` tìm địa danh theo `name`. Ví dụ chọn bản ghi có tên “Vịnh Hạ Long”, địa phương “Quảng Ninh”, form điền `mainDestinations = "Vịnh Hạ Long, Quảng Ninh"`. Nếu địa danh thiếu địa phương, form chỉ dùng tên. Có ảnh thì dùng `imageUrl` của địa danh để xem trước, thiếu ảnh thì giữ ảnh tour hiện có. Nhân viên có thể sửa URL.
3. **Chuẩn bị request.** `validateForm` kiểm tra lựa chọn còn trong danh mục đã nạp, các trường văn bản bắt buộc, số ngày, giá và số khách dương. `handleSubmit` cắt khoảng trắng, chuyển giá sang số, số khách sang số nguyên và ghép thời lượng thành `"1 day"` hoặc `"N days"`. `formatDuration` và `formatPrice` đảm nhiệm trình bày tiếng Việt. Code áp điều kiện giá dương, không có ngưỡng 1.000 VNĐ trong controller.
4. **Ghi vào CSDL.** `adminApi.js#createPackage` → `POST /api/admin/packages` → Gateway → bộ lọc quyền của packages-service → [AdminPackageController.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/controller/admin/AdminPackageController.java) → `addPackage(@Valid Package)` → `PackageRepository.save`. Backend kiểm tra các ràng buộc của entity và ghi vào bảng `packages`. Phản hồi 200 chứa tour với `packageId` đã cấp. Form quay về `/admin/packages`, trang danh sách tải lại.
5. **Quan hệ giữa hai module.** Request POST gửi chuỗi `mainDestinations` và ảnh. packages-service không gọi lại destination-service. Việc sửa hoặc xóa địa danh sau đó không tự cập nhật dữ liệu đã chép vào tour. Migration V3 bổ sung `destination_id` và `duration_days` có thể null, nhưng entity và payload của luồng này đều dùng `mainDestinations` và `duration`. [Migration V3 của tour](../Backend/packages-service/src/main/resources/db/migration/V3__package_destination_and_duration_days.sql)

Ví dụ dưới đây là body sau khi người dùng nhập tour hai ngày và bấm lưu.

```json
{
  "title": "Khám phá Vịnh Hạ Long",
  "category": "Nature & Adventure",
  "duration": "2 days",
  "mainDestinations": "Vịnh Hạ Long, Quảng Ninh",
  "bestFor": "Gia đình",
  "price": 2500000,
  "peopleCount": 12,
  "imageUrl": "/images/ha-long.jpg"
}
```

### 3.3. Danh sách, sửa và xóa tour quản trị

Các thao tác đi từ [PackagesList.jsx quản trị](../Frontend/src/components/admin/PackagesAdmin/PackagesList.jsx) hoặc `PackageForm.jsx` → `adminApi.js` → Gateway → bộ lọc quyền → `AdminPackageController` → [PackageRepository.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/repository/PackageRepository.java). Controller CRUD gọi repository trực tiếp.

| Thao tác | Request và hàm chủ chốt | Xử lý dữ liệu và kết quả |
|---|---|---|
| Xem danh sách | `loadPackages → getAllPackages` → `GET /api/admin/packages` → `getAllPackages → findAll` | Trả 200 và mảng. Helper quản trị có nhánh thử danh mục công khai qua Gateway rồi cổng 8084 nếu không lấy được mảng hợp lệ. |
| Nạp tour để sửa | `getPackageById` → `GET /api/admin/packages/{id}` → `getPackageById → findById` | Trả 200 và entity. Form đọc số ngày đầu chuỗi `duration`, đưa giá và số khách về chuỗi cho ô nhập, đối chiếu tên địa danh với `mainDestinations` để chọn lại mục tương ứng. |
| Lưu chỉnh sửa | `handleSubmit → updatePackage` → `PUT /api/admin/packages/{id}` → `updatePackage → findById → save` | Cùng body với tạo mới. Controller chép tám trường của ví dụ vào tour tìm thấy và trả 200 cùng entity đã sửa. Đổi thời lượng ở đây không tự chỉnh các ngày lịch trình đã lưu. |
| Xóa tour | `handleDelete → deletePackage` → `DELETE /api/admin/packages/{id}` → `deletePackage → deleteById` | Khi thành công trả 200, thân rỗng. UI kiểm tra `res.ok` rồi loại tour khỏi danh sách. JPA có cascade tới lịch trình và bảng lịch trình có FK `ON DELETE CASCADE`. Bảng ưu đãi chỉ có index trên `package_id`, nên luồng này không bảo đảm xóa ưu đãi theo tour. |

Thiếu trường văn bản bắt buộc hoặc có số không dương vi phạm `@Valid` → 400 và JSON theo tên trường. Riêng `price`, `peopleCount` chỉ có `@Positive` ở backend, còn form yêu cầu nhập cả hai. GET theo ID và PUT với tour không tồn tại → `RuntimeException` → 500 với `error`. [GlobalExceptionHandler.java của tour](../Backend/packages-service/src/main/java/tourism_app/packages_service/exception/GlobalExceptionHandler.java) · [DDL của ba bảng](../Backend/packages-service/src/main/resources/db/migration/V1__init.sql)

## 4. Quản lý lịch trình từng ngày trong module tour

**Hai ID có vai trò khác nhau.** `packageId` xác định tour cha khi liệt kê hoặc thêm ngày. `itineraryId` xác định chính bản ghi cần xem, sửa hoặc xóa. Ví dụ tour 42 có thể chứa bản ghi lịch trình 95 mang `dayNumber = 2`. Khi xóa ngày đó, frontend gửi ID 95.

### 4.1. Mở màn hình và chọn ngày còn trống

1. Mở trang React `/admin/packages/42/itineraries` → [PackageItineraries.jsx](../Frontend/src/components/admin/PackagesAdmin/PackageItineraries.jsx) chạy `fetchItineraries()`. Hàm dùng `Promise.all` gọi song song `adminApi.getPackageItineraries(42)` và `adminApi.getPackageById(42)`.
2. Request thứ nhất là `GET /admin/packages/42/itineraries` → Gateway → [AdminPackageItineraryController.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/controller/admin/AdminPackageItineraryController.java) → `getItineraries → PackageItineraryService.getItineraryByPackage → PackageItineraryRepository.findByPkg_PackageId`. Kết quả là mảng các ngày. Truy vấn danh sách chỉ lọc theo tour, nên có thể trả `[]` cả khi chưa có ngày hoặc khi mã tour không tồn tại.
3. Request thứ hai là `GET /api/admin/packages/42` → `AdminPackageController.getPackageById → PackageRepository.findById`. Màn hình cần `title, duration, mainDestinations` để hiển thị và xác định giới hạn ngày.
4. React sắp xếp mảng theo `dayNumber` tăng dần. [itinerary.js](../Frontend/src/utils/itinerary.js) dùng `getDurationDays` để đọc số ngày và `firstAvailableDay` tìm số nhỏ nhất còn trống từ 1 đến thời lượng tour. Ví dụ tour ba ngày đã có ngày 1 và 3 thì gợi ý **ngày 2**. Form khóa thao tác thêm khi tải lỗi, thời lượng không đọc được hoặc đã đủ ngày.

### 4.2. Thêm một ngày

1. `PackageItineraries.handleAdd` kiểm tra số nguyên trong khoảng cho phép, ngày chưa dùng và mô tả có nội dung. Với tour 42, frontend cắt khoảng trắng rồi gửi `{"dayNumber":2,"description":"Tham quan vịnh bằng thuyền"}` qua `adminApi.addItinerary(42, body)`.
2. `POST /admin/packages/42/itineraries` → Gateway → bộ lọc quyền → `AdminPackageItineraryController.createItinerary` → [PackageItineraryService.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/service/PackageItineraryService.java). `createItinerary` gọi `PackageRepository.findById(42)` để lấy tour cha.
3. `validateItinerary` gọi `getDurationDays(pkg.getDuration())`, kiểm tra ngày từ 1 đến số ngày của tour và mô tả khác trắng. [PackageItineraryRepository.java](../Backend/packages-service/src/main/java/tourism_app/packages_service/repository/PackageItineraryRepository.java) đọc các bản ghi của tour qua `findByPkg_PackageId` để service dò trùng ngày. Ví dụ tour `"2 days"` chấp nhận ngày 2 nếu còn trống và từ chối ngày 3.
4. Service đặt `itineraryId = null` để tạo khóa mới, gắn `pkg` từ URL rồi `save` xuống `package_itinerary`. Phản hồi 200 chứa `itineraryId, dayNumber, description`. UI xóa ô mô tả và gọi lại `fetchItineraries` để cập nhật danh sách và ngày gợi ý.
5. Ngày trùng, ngoài khoảng, mô tả trắng hoặc thời lượng không đọc được gây `IllegalArgumentException` → 400 với `{"error":"..."}`. Mã tour cha không tồn tại gây `RuntimeException` → 500. Kiểm tra trùng nằm ở service. Migration hiện tại không đặt khóa duy nhất trên cặp `(package_id, day_number)`.

### 4.3. Xem riêng, sửa hoặc xóa một bản ghi

Ba request đều qua Gateway → bộ lọc quyền → `AdminPackageItineraryController` → `PackageItineraryService`. Màn hình quản trị hiện có thao tác thêm và xóa. Backend còn cung cấp GET chi tiết và PUT cho từng bản ghi.

| Request | Thứ tự gọi | Kết quả |
|---|---|---|
| `GET /admin/packages/itinerary/{id}` | `getItinerary → getItineraryById → itineraryRepository.findById` | Trả 200 và một ngày lịch trình. |
| `PUT /admin/packages/itinerary/{id}` | `updateItinerary → getItineraryById → validateItinerary → save` | Body gồm `dayNumber, description`. Service kiểm tra trên tour cha hiện có và bỏ qua chính ID đang sửa khi dò trùng. Trả 200 và bản ghi sau cập nhật. |
| `DELETE /admin/packages/itinerary/{id}` | React `handleDelete → adminApi.deleteItinerary` → controller `deleteItinerary` → service `deleteItinerary → existsById → deleteById` | Thành công trả 200 và văn bản `Itinerary deleted successfully!`. UI gọi lại `fetchItineraries`. Ngày vừa xóa có thể được gợi ý lại. |

Với cả ba API theo `itineraryId`, bản ghi không tồn tại dẫn đến `RuntimeException` và HTTP 500. Lỗi phạm vi ngày, mô tả hoặc trùng ngày khi PUT áp dụng cùng cơ chế 400 như khi thêm mới.
