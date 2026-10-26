# HỆ THỐNG TÀI LIỆU THIẾT KẾ CHI TIẾT DỰ ÁN TRAVELBOOK
**(SYSTEM DESIGN DOCUMENTATION - TRAVELBOOK TOURISM PLATFORM)**

Hệ thống tài liệu thiết kế này được biên soạn đầy đủ, chi tiết và chuẩn hóa theo đúng yêu cầu học thuật & công nghệ của đồ án, đáp ứng yêu cầu phân tách độc lập các phần: **Backend**, **Frontend** và **Cơ sở dữ liệu (Database)**.

---

## MỤC LỤC TÀI LIỆU CHI TIẾT

| STT | Tài liệu thiết kế | Đường dẫn file | Nội dung trọng tâm |
| :---: | :--- | :--- | :--- |
| **1** | **Thiết kế Chi tiết Cơ sở dữ liệu** | [THIET_KE_CSDL.md](./THIET_KE_CSDL.md) | Kiến trúc Database-per-Service, Sơ đồ ERD, Đặc tả chi tiết từng bảng, Khóa chính/ngoại, Indexes, Migration Flyway. |
| **2** | **Thiết kế Chi tiết Backend** | [THIET_KE_BACKEND.md](./THIET_KE_BACKEND.md) | Kiến trúc Microservices & API Gateway, Đặc tả toàn bộ RESTful API, Sơ đồ Class/Component, Sơ đồ Sequence các luồng Auth/RBAC, Booking VietQR, Điều hành tour. |
| **3** | **Thiết kế Chi tiết Frontend** | [THIET_KE_FRONTEND.md](./THIET_KE_FRONTEND.md) | Kiến trúc React SPA, Cây Component, Bộ lọc 7 danh mục tour, Quản lý State & Sự kiện `auth-changed`, Ma trận phân quyền RBAC UI, Luồng người dùng. |

---

## TỔNG HỢP CÔNG NGHỆ ÁP DỤNG TRONG THIẾT KẾ

* **Frontend:** React 18, React Router v5, Vanilla CSS3, FontAwesome 5.
* **Backend:** Java 17, Spring Boot 3.2.0, Spring Cloud Gateway, Spring Security, JJWT 0.11.5, Spring Data JPA, Hibernate ORM.
* **Cơ sở dữ liệu:** MySQL 8.0, Flyway Migration Community Edition 9.22.
* **Cổng thanh toán & Tích hợp:** VietQR NAPAS247 (Vietcombank), Google Maps Geo-coordinates API.
