CREATE TABLE IF NOT EXISTS destinations (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NULL,
    description VARCHAR(4000) NULL,
    location VARCHAR(255) NULL,
    category VARCHAR(255) NULL,
    avg_price DOUBLE NULL,
    image_url VARCHAR(500) NULL,
    PRIMARY KEY (id),
    INDEX idx_destinations_category (category)
);
