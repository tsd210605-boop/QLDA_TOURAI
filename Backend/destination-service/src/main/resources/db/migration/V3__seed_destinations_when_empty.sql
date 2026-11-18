-- Keep existing destinations and administrator edits when upgrading an existing database.
CREATE TEMPORARY TABLE destination_seed LIKE destinations;

-- =========================================================
-- V3__seed_destinations_when_empty.sql
-- Seed Popular Destinations for All Categories
-- =========================================================

INSERT INTO destination_seed (id, name, description, location, category, avg_price, image_url)
VALUES
-- 1. Nature & Adventure
(1, 'Đỉnh Fansipan - Nóc Nhà Đông Dương', 'Chinh phục đỉnh núi cao nhất bán đảo Đông Dương 3143m, biển mây bồng bềnh và thung lũng Mường Hoa.', 'Sapa, Lào Cai', 'Nature & Adventure', 45.0, 'https://images.unsplash.com/photo-1570641963303-92ce4845cd4c?auto=format&fit=crop&w=800&q=80'),
(2, 'Vườn Quốc Gia Cát Tiên', 'Khu dự trữ sinh quyển thế giới với trải nghiệm safari đêm xem thú hoang dã và trekking Bàu Sấu.', 'Đồng Nai', 'Nature & Adventure', 30.0, 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80'),
(3, 'Động Phong Nha & Kẻ Bàng', 'Kỳ quan đệ nhất động với hệ thống sông ngầm thạch nhũ lung linh huyền ảo hàng triệu năm tuổi.', 'Quảng Bình', 'Nature & Adventure', 35.0, 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80'),

-- 2. Cultural & Historical
(4, 'Đại Nội Kinh Thành Huế', 'Di sản văn hóa thế giới UNESCO, quần thể cung điện lăng tẩm hoàng gia triều Nguyễn nguy nga.', 'Thừa Thiên Huế', 'Cultural & Historical', 25.0, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'),
(5, 'Phố Cổ Hội An', 'Đô thị cổ bên dòng sông Hoài với kiến trúc đèn lồng truyền thống và ẩm thực cao lầu trứ danh.', 'Quảng Nam', 'Cultural & Historical', 20.0, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'),
(6, 'Quần Thể Danh Thắng Tràng An', 'Di sản hỗn hợp thế giới đầu tiên tại Đông Nam Á với cảnh quan karst độc đáo và các hang động thủy cung.', 'Ninh Bình', 'Cultural & Historical', 30.0, 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'),

-- 3. City Experience
(7, 'Phố Cổ & Hồ Hoàn Kiếm Hà Nội', 'Trái tim thủ đô nghìn năm văn hiến, khám phá 36 phố phường, thưởng thức phở Bát Đàn và cà phê trứng.', 'Hà Nội', 'City Experience', 20.0, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'),
(8, 'Thành Phố Ngàn Hoa Đà Lạt', 'Thành phố cao nguyên mộng mơ với khí hậu mát mẻ quanh năm, Hồ Tuyền Lâm, Đồi chè Cầu Đất.', 'Lâm Đồng', 'City Experience', 40.0, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'),
(9, 'Bà Nà Hills & Cầu Vàng Đà Nẵng', 'Thành phố đáng sống nhất Việt Nam với Cầu Vàng bàn tay khổng lồ và bãi biển Mỹ Khê tuyệt đẹp.', 'Đà Nẵng', 'City Experience', 50.0, 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80'),

-- 4. Beach & Relaxation
(10, 'Đảo Ngọc Phú Quốc', 'Bãi Sao cát trắng mịn, lặn ngắm san hô Hòn Mây Rút, ngắm hoàng hôn Sunset Sanato tuyệt đẹp.', 'Kiên Giang', 'Beach & Relaxation', 55.0, 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80'),
(11, 'Vịnh Nha Trang & Hòn Tằm', 'Vịnh biển đẹp bậc nhất hành tinh với dịch vụ tắm bùn khoáng nóng và các môn thể thao lướt sóng, dù lượn.', 'Khánh Hòa', 'Beach & Relaxation', 38.0, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'),
(12, 'Vịnh Hạ Long', 'Kỳ quan thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ giữa làn nước biển ngọc bích.', 'Quảng Ninh', 'Beach & Relaxation', 60.0, 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80')
ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category);


INSERT INTO destinations (id, name, description, location, category, avg_price, image_url)
SELECT id, name, description, location, category, avg_price, image_url
FROM destination_seed
WHERE NOT EXISTS (SELECT 1 FROM destinations);

DROP TEMPORARY TABLE destination_seed;
