-- Vietnam destination catalog. Existing records and administrator edits are retained.
-- Image URLs are served by the Tourism frontend.

INSERT INTO destinations (name, description, location, category, avg_price, image_url)
SELECT 'Sa Pa', 'Những thửa ruộng bậc thang, bản làng và cung đường giữa núi rừng Tây Bắc. Tham quan bản Cát Cát và thung lũng Mường Hoa.', 'Sa Pa, Việt Nam', 'Thiên nhiên và khám phá', NULL, '/images/vietnam/sa-pa.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Sa Pa');

INSERT INTO destinations (name, description, location, category, avg_price, image_url)
SELECT 'Đà Lạt', 'Thành phố cao nguyên với rừng thông, đồi chè Cầu Đất, hồ Xuân Hương và không khí mát mẻ.', 'Đà Lạt, Việt Nam', 'Thiên nhiên và khám phá', NULL, '/images/vietnam/da-lat.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Đà Lạt');

INSERT INTO destinations (name, description, location, category, avg_price, image_url)
SELECT 'Tràng An - Ninh Bình', 'Khám phá cảnh quan núi đá vôi bằng thuyền, kết hợp tham quan cố đô Hoa Lư và Hang Múa.', 'Ninh Bình, Việt Nam', 'Văn hóa và di sản', NULL, '/images/vietnam/ninh-binh.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Tràng An - Ninh Bình');

INSERT INTO destinations (name, description, location, category, avg_price, image_url)
SELECT 'Phố cổ Hội An', 'Dạo phố cổ, ghé Chùa Cầu, thưởng thức ẩm thực địa phương và ngắm đèn lồng bên sông Hoài.', 'Hội An, Việt Nam', 'Văn hóa và di sản', NULL, '/images/vietnam/hoi-an.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Phố cổ Hội An');

INSERT INTO destinations (name, description, location, category, avg_price, image_url)
SELECT 'Hà Nội', 'Trải nghiệm nhịp sống phố cổ, hồ Hoàn Kiếm, Văn Miếu và những món ăn quen thuộc của thủ đô.', 'Hà Nội, Việt Nam', 'Trải nghiệm thành phố', NULL, '/images/vietnam/ha-noi.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Hà Nội');

INSERT INTO destinations (name, description, location, category, avg_price, image_url)
SELECT 'Đà Nẵng', 'Kết hợp khám phá thành phố biển với Cầu Vàng tại Bà Nà Hills và các điểm tham quan lân cận.', 'Đà Nẵng, Việt Nam', 'Trải nghiệm thành phố', NULL, '/images/vietnam/da-nang.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Đà Nẵng');

INSERT INTO destinations (name, description, location, category, avg_price, image_url)
SELECT 'Vịnh Hạ Long', 'Du ngoạn giữa các đảo đá vôi, tham quan hang Sửng Sốt, đảo Ti Tốp và nghỉ đêm trên du thuyền.', 'Hạ Long, Việt Nam', 'Biển đảo và nghỉ dưỡng', NULL, '/images/vietnam/ha-long.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Vịnh Hạ Long');

INSERT INTO destinations (name, description, location, category, avg_price, image_url)
SELECT 'Phú Quốc', 'Nghỉ dưỡng bên biển, tham quan Bãi Sao, khám phá các đảo nhỏ và ngắm hoàng hôn trên đảo ngọc.', 'Phú Quốc, Việt Nam', 'Biển đảo và nghỉ dưỡng', NULL, '/images/vietnam/phu-quoc.jpg'
WHERE NOT EXISTS (SELECT 1 FROM destinations WHERE name = 'Phú Quốc');
