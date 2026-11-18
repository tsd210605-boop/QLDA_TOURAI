-- Convert the original USD seed prices to VND at the user-specified rate.
-- Match both the seed ID and its original USD price to preserve later VND edits.
-- The original-price guard also makes this update safe to run more than once.
UPDATE packages AS p
JOIN (
    SELECT 4 AS package_id, 180 AS usd_price
    UNION ALL SELECT 5, 210
    UNION ALL SELECT 6, 280
    UNION ALL SELECT 7, 135
    UNION ALL SELECT 8, 260
    UNION ALL SELECT 9, 140
    UNION ALL SELECT 10, 195
    UNION ALL SELECT 11, 290
    UNION ALL SELECT 12, 350
    UNION ALL SELECT 13, 65
    UNION ALL SELECT 14, 125
) AS legacy ON legacy.package_id = p.package_id AND p.price = legacy.usd_price
SET p.price = ROUND(legacy.usd_price * 26000, 0);
