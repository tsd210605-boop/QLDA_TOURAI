-- V2 Migration: Module Dieu hanh tour & Cong thanh toan truc tuyen (VNPay/MoMo)

ALTER TABLE bookings
    ADD COLUMN booking_code VARCHAR(50) NULL AFTER booking_id,
    ADD COLUMN status VARCHAR(50) DEFAULT 'PENDING' AFTER total_price,
    ADD COLUMN payment_status VARCHAR(50) DEFAULT 'UNPAID' AFTER status,
    ADD COLUMN email VARCHAR(255) NULL AFTER phone,
    ADD COLUMN special_requests TEXT NULL AFTER email,
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER special_requests;

CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGINT NOT NULL AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    transaction_code VARCHAR(100) NOT NULL,
    payment_gateway VARCHAR(50) NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_url TEXT NULL,
    vnp_response_code VARCHAR(20) NULL,
    bank_code VARCHAR(50) NULL,
    idempotency_key VARCHAR(100) NULL,
    pay_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (payment_id),
    INDEX idx_payments_booking_id (booking_id),
    INDEX idx_payments_trans_code (transaction_code)
);

CREATE TABLE IF NOT EXISTS invoices (
    invoice_id BIGINT NOT NULL AUTO_INCREMENT,
    invoice_code VARCHAR(50) NOT NULL UNIQUE,
    booking_id BIGINT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NULL,
    customer_phone VARCHAR(50) NULL,
    company_name VARCHAR(255) NULL,
    tax_code VARCHAR(50) NULL,
    total_amount DECIMAL(19, 2) NOT NULL,
    vat_amount DECIMAL(19, 2) NOT NULL,
    qr_code_data TEXT NULL,
    issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ISSUED',
    PRIMARY KEY (invoice_id),
    INDEX idx_invoices_booking_id (booking_id)
);

CREATE TABLE IF NOT EXISTS tour_departures (
    departure_id BIGINT NOT NULL AUTO_INCREMENT,
    booking_id BIGINT NULL,
    package_title VARCHAR(255) NULL,
    departure_date DATE NULL,
    tour_guide_name VARCHAR(255) NULL,
    tour_guide_phone VARCHAR(50) NULL,
    vehicle_number VARCHAR(50) NULL,
    driver_name VARCHAR(255) NULL,
    driver_phone VARCHAR(50) NULL,
    status VARCHAR(50) DEFAULT 'PREPARING',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (departure_id),
    INDEX idx_departures_booking_id (booking_id)
);

CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id BIGINT NOT NULL AUTO_INCREMENT,
    supplier_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255) NULL,
    phone VARCHAR(50) NULL,
    email VARCHAR(255) NULL,
    address VARCHAR(255) NULL,
    current_debt DECIMAL(19, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (supplier_id)
);

CREATE TABLE IF NOT EXISTS group_supplier_allocations (
    allocation_id BIGINT NOT NULL AUTO_INCREMENT,
    departure_id BIGINT NOT NULL,
    supplier_id BIGINT NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    estimated_cost DECIMAL(19, 2) NOT NULL,
    voucher_code VARCHAR(100) NULL,
    booking_status VARCHAR(50) DEFAULT 'REQUESTED',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (allocation_id),
    INDEX idx_allocations_departure_id (departure_id),
    INDEX idx_allocations_supplier_id (supplier_id)
);

-- Seed preliminary suppliers for testing
INSERT INTO suppliers (supplier_name, service_type, contact_person, phone, email, address, current_debt)
VALUES 
('Khách sạn Mường Thanh Luxury', 'HOTEL', 'Nguyễn Thị Lan', '0912345678', 'contact@muongthanh.vn', 'Đà Nẵng', 0),
('Nhà hàng Sen Tây Hồ', 'RESTAURANT', 'Trần Văn Đức', '0987654321', 'booking@sentayho.com.vn', 'Hà Nội', 0),
('Công ty Vận tải Du lịch Việt Bus', 'TRANSPORT', 'Lê Hữu Thắng', '0905123456', 'info@vietbus.vn', 'TP. Hồ Chí Minh', 0),
('Ban Quản lý Di tích Vịnh Hạ Long', 'TICKET', 'Phạm Minh Tú', '02033888999', 'tickets@halongbay.gov.vn', 'Quảng Ninh', 0);
