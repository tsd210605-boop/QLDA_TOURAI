CREATE TABLE IF NOT EXISTS bookings (
    booking_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NULL,
    booking_type VARCHAR(50) NULL,
    package_title VARCHAR(255) NULL,
    destination VARCHAR(255) NULL,
    travel_date DATE NULL,
    people INT NULL,
    days INT NULL,
    total_price DECIMAL(19, 2) NULL,
    name VARCHAR(255) NULL,
    phone VARCHAR(50) NULL,
    PRIMARY KEY (booking_id),
    INDEX idx_bookings_user_id (user_id),
    INDEX idx_bookings_phone (phone)
);
