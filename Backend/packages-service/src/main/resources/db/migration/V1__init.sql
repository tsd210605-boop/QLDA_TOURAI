CREATE TABLE IF NOT EXISTS packages (
    package_id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NULL,
    category VARCHAR(255) NULL,
    duration VARCHAR(255) NULL,
    best_for VARCHAR(255) NULL,
    main_destinations VARCHAR(255) NULL,
    price DOUBLE NULL,
    people_count INT NULL,
    image_url VARCHAR(500) NULL,
    PRIMARY KEY (package_id),
    INDEX idx_packages_category (category)
);

CREATE TABLE IF NOT EXISTS package_itinerary (
    itinerary_id BIGINT NOT NULL AUTO_INCREMENT,
    day_number INT NOT NULL,
    description TEXT NULL,
    package_id BIGINT NULL,
    PRIMARY KEY (itinerary_id),
    INDEX idx_itinerary_package_id (package_id),
    CONSTRAINT fk_itinerary_package
        FOREIGN KEY (package_id) REFERENCES packages (package_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS package_offers (
    offer_id BIGINT NOT NULL AUTO_INCREMENT,
    package_id BIGINT NULL,
    offer_title VARCHAR(255) NULL,
    discount_percentage INT NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    image_url VARCHAR(500) NULL,
    PRIMARY KEY (offer_id),
    INDEX idx_offers_package_id (package_id)
);
