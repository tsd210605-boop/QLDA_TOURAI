-- =========================================================
-- V2__rbac_roles_permissions.sql
-- Role-Based Access Control (RBAC) Schema & Seed Data
-- =========================================================

-- 1. Table: roles
CREATE TABLE IF NOT EXISTS roles (
    role_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id),
    UNIQUE KEY uk_roles_name (name)
);

-- 2. Table: permissions
CREATE TABLE IF NOT EXISTS permissions (
    permission_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    description VARCHAR(255) NULL,
    PRIMARY KEY (permission_id),
    UNIQUE KEY uk_permissions_name (name)
);

-- 3. Table: role_permissions (Many-to-Many mapping)
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions (permission_id) ON DELETE CASCADE
);

-- 4. Alter table users to add role_id and status
ALTER TABLE users ADD COLUMN role_id BIGINT NULL;
ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

-- 5. Seed standard Roles per report specification
INSERT INTO roles (role_id, name, description) VALUES
(1, 'ADMIN', 'Quản trị viên toàn hệ thống - Toàn quyền cấu hình, tài khoản và phân quyền'),
(2, 'OPERATOR', 'Điều hành tour - Quản lý phân bổ nhà cung cấp, lịch khởi hành và điều động tour'),
(3, 'SALES', 'Nhân viên kinh doanh - Quản lý tư vấn tour, xử lý đơn đặt chỗ (bookings) và voucher'),
(4, 'GUIDE', 'Hướng dẫn viên du lịch - Điểm danh đoàn qua mã QR, nhật ký hành trình'),
(5, 'CUSTOMER', 'Khách hàng / Du khách - Tìm kiếm tour, đặt chỗ, thanh toán trực tuyến VietQR/VNPay')
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);

-- 6. Seed standard Permissions per report specification
INSERT INTO permissions (permission_id, name, module, description) VALUES
(1, 'USER_MANAGE', 'AUTH', 'Quản lý tài khoản người dùng và trạng thái hoạt động'),
(2, 'ROLE_MANAGE', 'AUTH', 'Quản lý vai trò và phân quyền (RBAC)'),
(3, 'TOUR_READ', 'TOUR', 'Xem danh mục và chi tiết tour du lịch'),
(4, 'TOUR_WRITE', 'TOUR', 'Thêm mới, sửa, xóa tour du lịch'),
(5, 'BOOKING_VIEW', 'BOOKING', 'Xem danh sách và tra cứu tất cả đơn đặt tour'),
(6, 'BOOKING_MANAGE', 'BOOKING', 'Cập nhật, phê duyệt hoặc hủy đơn đặt tour'),
(7, 'OPERATIONS_DISPATCH', 'OPERATIONS', 'Điều động hướng dẫn viên, phương tiện cho đoàn tour'),
(8, 'SUPPLIER_MANAGE', 'OPERATIONS', 'Quản lý danh bạ đối tác nhà cung cấp dịch vụ'),
(9, 'PAYMENT_VIEW', 'PAYMENT', 'Tra cứu hóa đơn VAT điện tử và giao dịch thanh toán')
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);

-- 7. Seed Role - Permissions mappings
-- ADMIN (Role 1): Full permissions
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9);

-- OPERATOR (Role 2): Tour, Operations, Suppliers, View Bookings
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
(2, 3), (2, 4), (2, 5), (2, 7), (2, 8);

-- SALES (Role 3): Tour, Bookings, Payment
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
(3, 3), (3, 5), (3, 6), (3, 9);

-- GUIDE (Role 4): Tour, View Bookings
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
(4, 3), (4, 5);

-- CUSTOMER (Role 5): Read Tour
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
(5, 3);
