-- Bổ sung cột mã điểm đến và số ngày, rồi điền số ngày từ chuỗi thời lượng đã lưu.

-- Preserve the original text; new writes store the duration as integer days.
ALTER TABLE packages ADD COLUMN destination_id BIGINT NULL;
ALTER TABLE packages ADD COLUMN duration_days INT NULL;

UPDATE packages
SET duration_days = CAST(REGEXP_SUBSTR(TRIM(duration), '^[0-9]+') AS UNSIGNED)
WHERE REGEXP_LIKE(TRIM(duration), '^[0-9]+([[:space:]]+(days?|ngày)([[:space:]]|/|$)|$)', 'i')
  AND CAST(REGEXP_SUBSTR(TRIM(duration), '^[0-9]+') AS UNSIGNED) BETWEEN 1 AND 2147483647;

CREATE INDEX idx_packages_destination_id ON packages (destination_id);
