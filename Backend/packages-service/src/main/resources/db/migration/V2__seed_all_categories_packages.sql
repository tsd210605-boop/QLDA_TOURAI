-- =========================================================
-- V2__seed_all_categories_packages.sql
-- Seed Tour Packages and Itineraries for All 7 Categories
-- =========================================================

-- 1. Nature & Adventure
INSERT INTO packages (package_id, title, category, duration, best_for, main_destinations, price, people_count, image_url)
VALUES 
(4, 'Tour Trekking Sapa - Chinh Phục Đỉnh Fansipan 3N2Đ', 'Nature & Adventure', '3 days', 'Phượt thủ, Người thích mạo hiểm', 'Bản Cát Cát, Đèo Ô Quy Hồ, Đỉnh Fansipan 3143m', 180.0, 12, 'https://images.unsplash.com/photo-1570641963303-92ce4845cd4c?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE title=VALUES(title), price=VALUES(price);

INSERT INTO package_itinerary (day_number, description, package_id) VALUES
(1, 'Hà Nội - Sapa: Xe giường nằm cao cấp đưa đoàn lên Sapa. Chiều trekking Bản Cát Cát, ngắm ruộng bậc thang và thác Tiên Sa.', 4),
(2, 'Chinh phục Nóc nhà Đông Dương Fansipan bằng cáp treo 3 dây, săn mây trên cổng trời Đèo Ô Quy Hồ tuyệt đẹp.', 4),
(3, 'Khám phá Thung lũng Mường Hoa thơ mộng, thưởng thức lẩu cá hồi đặc sản Sapa và khởi hành về lại Hà Nội.', 4);

-- 2. Cultural & Historical
INSERT INTO packages (package_id, title, category, duration, best_for, main_destinations, price, people_count, image_url)
VALUES 
(5, 'Tour Di Sản Cố Đô Huế - Quảng Bình Phong Nha 3N2Đ', 'Cultural & Historical', '3 days', 'Gia đình, Người yêu lịch sử & văn hóa', 'Đại Nội Huế, Chùa Thiên Mụ, Động Phong Nha', 210.0, 15, 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE title=VALUES(title), price=VALUES(price);

INSERT INTO package_itinerary (day_number, description, package_id) VALUES
(1, 'Đón khách tại Huế. Thăm Đại Nội Hoàng Cung, Ngọ Môn, Điện Thái Hòa. Tối du thuyền nghe ca Huế trên sông Hương.', 5),
(2, 'Viếng Chùa Thiên Mụ, Lăng Khải Định. Chiều di chuyển ra Quảng Bình, khám phá Kỳ quan Động Phong Nha bằng thuyền máy.', 5),
(3, 'Tham quan Động Thiên Đường huyền ảo, chụp ảnh lưu niệm tại vĩ tuyến 17 Cầu Hiền Lương và kết thúc hành trình.', 5);

-- 3. Beaches & Relaxation
INSERT INTO packages (package_id, title, category, duration, best_for, main_destinations, price, people_count, image_url)
VALUES 
(6, 'Tour Nghỉ Dưỡng Nha Trang - Vịnh Ninh Vân 4N3Đ', 'Beaches & Relaxation', '4 days', 'Nghỉ dưỡng gia đình, Cặp đôi', 'Bãi Dài, Vịnh Ninh Vân, Đảo Hòn Tằm', 280.0, 10, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE title=VALUES(title), price=VALUES(price);

INSERT INTO package_itinerary (day_number, description, package_id) VALUES
(1, 'Đón sân bay Cam Ranh về resort ven biển. Tự do tắm biển Bãi Dài và thưởng thức tiệc hải sản tươi sống.', 6),
(2, 'Du thuyền tham quan Vịnh Nha Trang, tắm bùn khoáng nóng Hòn Tằm thư giãn phục hồi năng lượng.', 6),
(3, 'Khám phá vẻ đẹp nguyên sơ Vịnh Ninh Vân, lặn ngắm san hô biển sâu và chèo ván chèo đứng SUP.', 6),
(4, 'Thăm Tháp Bà Ponagar, mua sắm đặc sản yến sào Nha Trang, xe đưa đoàn ra sân bay kết thúc chuyến đi.', 6);

-- 4. Wildlife & Safari
INSERT INTO packages (package_id, title, category, duration, best_for, main_destinations, price, people_count, image_url)
VALUES 
(7, 'Tour Khám Phá Vườn Quốc Gia Cát Tiên - Safari Đêm 2N1Đ', 'Wildlife & Safari', '2 days', 'Gia đình có trẻ nhỏ, Yêu thiên nhiên & động vật hoang dã', 'Rừng Cát Tiên, Bàu Sấu, Khu cứu hộ linh trưởng', 135.0, 12, 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80'),
(8, 'Tour Safari Bán Hoang Dã Vinpearl Phú Quốc 3N2Đ', 'Wildlife & Safari', '3 days', 'Nhóm bạn, Gia đình thích trải nghiệm Safari động vật', 'Vinpearl Safari, Rừng nguyên sinh, Rạch Vẹm', 260.0, 14, 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE title=VALUES(title), price=VALUES(price);

INSERT INTO package_itinerary (day_number, description, package_id) VALUES
(1, 'Khởi hành từ TP.HCM đi Cát Tiên. Thăm Khu bảo tồn linh trưởng và Cây Tung đại thụ. Đêm tham gia xe mui trần xem thú hoang dã đi săn mồi ban đêm.', 7),
(2, 'Trekking xuyên rừng nhiệt đới đến Bàu Sấu ngắm cá sấu nước ngọt tự nhiên và các loài chim quý hiếm. Chiều về lại TP.HCM.', 7),
(1, 'Đến Phú Quốc, nhận phòng khách sạn resort. Chiều đi thuyền ngắm sao biển tại Làng chài Rạch Vẹm nguyên sơ.', 8),
(2, 'Trọn ngày trải nghiệm Vinpearl Safari - vườn thú bán hoang dã: ngồi xe chuyên dụng ngắm hổ Bengal, hươu cao cổ, tê giác châu Phi.', 8),
(3, 'Đi bộ khám phá hệ sinh thái Rừng nguyên sinh Phú Quốc, tắm suối Tranh mát lạnh và mua đặc sản tiêu chín ngào đường.', 8);

-- 5. Spiritual & Wellness
INSERT INTO packages (package_id, title, category, duration, best_for, main_destinations, price, people_count, image_url)
VALUES 
(9, 'Tour Tâm Linh Bái Đính - Tràng An - Chùa Tam Chúc 2N1Đ', 'Spiritual & Wellness', '2 days', 'Phật tử, Người cao tuổi, Cầu an & Thư thái tâm hồn', 'Chùa Bái Đính, Quần thể Tràng An, Chùa Tam Chúc Hà Nam', 140.0, 18, 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80'),
(10, 'Tour Yoga & Thiền Định Yên Tử - Đỉnh Phù Vân 2N1Đ', 'Spiritual & Wellness', '2 days', 'Người tìm kiếm thanh tịnh, Tái tạo năng lượng, Thiền & Yoga', 'Núi Yên Tử Quảng Ninh, Chùa Đồng, Khu tĩnh dưỡng Legacy Yên Tử', 195.0, 10, 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE title=VALUES(title), price=VALUES(price);

INSERT INTO package_itinerary (day_number, description, package_id) VALUES
(1, 'Hà Nội - Ninh Bình: Chiêm bái Đại tượng Phật Chùa Bái Đính lớn nhất Đông Nam Á. Chiều ngồi thuyền nan xuôi dòng di sản Tràng An qua các hang động kỳ ảo.', 9),
(2, 'Khởi hành sang Quần thể chùa Tam Chúc (Hà Nam) - ngôi chùa lớn nhất thế giới trên hồ nước biếc. Thiền định và thưởng thức tiệc trà chay thanh tịnh.', 9),
(1, 'Check-in khu nghỉ dưỡng kiến trúc thời Trần Legacy Yên Tử. Chiều tham gia lớp học Yoga và Thiền chuông Tây Tạng. Tối thưởng thức ẩm thực thực dưỡng thảo mộc.', 10),
(2, 'Hành trình cáp treo lên Chùa Hoa Yên và Chùa Đồng đỉnh non thiêng Yên Tử đón bình minh trên biển mây. Tự do ngâm mình trong bồn thảo dược thiên nhiên.', 10);

-- 6. Luxury & Honeymoon
INSERT INTO packages (package_id, title, category, duration, best_for, main_destinations, price, people_count, image_url)
VALUES 
(11, 'Tour Trăng Mật Đà Lạt - Thành Phố Tình Yêu 3N2Đ', 'Luxury & Honeymoon', '3 days', 'Cặp đôi, Tuần trăng mật lãng mạn', 'Hồ Tuyền Lâm, Thung lũng Tình Yêu, Đồi chè Cầu Đất', 290.0, 2, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'),
(12, 'Tour Du Thuyền 5 Sao Vịnh Lan Hạ - Du Ngoạn Thượng Lưu 2N1Đ', 'Luxury & Honeymoon', '2 days', 'Kỷ niệm ngày cưới, Trải nghiệm đẳng cấp thượng lưu', 'Vịnh Lan Hạ, Hang Sáng Tối, Đảo Ba Trái Đào', 350.0, 4, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE title=VALUES(title), price=VALUES(price);

INSERT INTO package_itinerary (day_number, description, package_id) VALUES
(1, 'Đón cặp đôi bằng xe hoa sang trọng về resort 5 sao bên Hồ Tuyền Lâm. Buổi tối set up bữa tối nến hoa hồng lãng mạn bên hồ.', 11),
(2, 'Khám phá Thung lũng Tình Yêu, chụp ảnh ngoại cảnh tại Vườn hoa Cẩm Tú Cầu và ngắm hoàng hôn rực rỡ tại Đồi Đa Phú.', 11),
(3, 'Săn mây Đồi chè Cầu Đất lúc bình minh, thưởng thức cà phê Mê Linh và tặng cặp vé massage đôi spa chuyên sâu phục hồi sức khỏe.', 11),
(1, 'Lên du thuyền hạng sang 5 sao đẳng cấp thế giới. Nhận phòng Suite có ban công riêng nhìn ra biển. Thưởng thức tiệc trà chiều hoàng hôn và tiệc tối Fine Dining tôm hùm.', 12),
(2, 'Tập Thái Cực Quyền đón bình minh trên sundeck. Chèo kayak tại Hang Sáng Tối, tắm biển Ba Trái Đào và thưởng thức buffet trưa thịnh soạn trước khi cập bến.', 12);

-- 7. Food & Culinary
INSERT INTO packages (package_id, title, category, duration, best_for, main_destinations, price, people_count, image_url)
VALUES 
(13, 'Tour Tinh Hoa Ẩm Thực Hà Nội - Food Tour 36 Phố Phường 1 Ngày', 'Food & Culinary', '1 day', 'Người sành ăn, Khám phá văn hóa ẩm thực truyền thống', 'Phố Cổ Hà Nội, Phở Bát Đàn, Chả cá Lã Vọng, Cà phê Trứng', 65.0, 8, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'),
(14, 'Tour Khám Phá Ẩm Thực Miền Tây Sông Nước - Chợ Nổi Cái Răng 2N1Đ', 'Food & Culinary', '2 days', 'Gia đình, Tín đồ ẩm thực dân dã Nam Bộ', 'Chợ nổi Cái Răng Cần Thơ, Miệt vườn Phong Điền, Lò hủ tiếu truyền thống', 125.0, 12, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE title=VALUES(title), price=VALUES(price);

INSERT INTO package_itinerary (day_number, description, package_id) VALUES
(1, '08:00 Thưởng thức phở bò Bát Đàn trứ danh. 10:30 Thưởng trà sen Tây Hồ và bánh cốm Hàng Than. 12:30 Thưởng thức chả cá Lã Vọng thơm lừng. Chiều dạo phố Tạ Hiện ăn bún chả que tre, kết thúc ngày bằng ly cà phê trứng Giảng béo ngậy.', 13),
(1, 'TP.HCM - Cần Thơ: Ghé miệt vườn thưởng thức trái cây sầu riêng, măng cụt hái tại vườn. Tham gia lớp học làm bánh xèo miền Tây giòn rụm và cá lóc nướng trui lá sen.', 14),
(2, '05:30 Sáng đi ghe máy khám phá Chợ nổi Cái Răng, ăn tô bún riêu bồng bềnh sóng nước. Ghé lò hủ tiếu ngũ sắc, tự tay tráng bánh và mua đặc sản kẹo dừa Bến Tre.', 14);

-- 8. Promotional Offers (Package Offers Carousel)
INSERT INTO package_offers (offer_id, package_id, offer_title, discount_percentage, start_date, end_date, image_url)
VALUES
(2, 8, 'Ưu đãi 15% Safari Bán Hoang Dã Phú Quốc', 15, '2026-01-01', '2026-12-31', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80'),
(3, 11, 'Gói Trăng Mật Đà Lạt - Tặng Bữa Tối Nến Lãng Mạn', 20, '2026-01-01', '2026-12-31', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE offer_title=VALUES(offer_title), discount_percentage=VALUES(discount_percentage);
