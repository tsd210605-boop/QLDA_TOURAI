// Hiển thị catalog địa danh theo nhóm trên trang điểm đến công khai.

import { categoryLabel } from "../../utils/locale";
import React, { useEffect, useState } from "react";
import "./destinations.css";
import CategoryCarousel from "./CategoryCarousel";
import { getDestinationsByCategories } from "../../api/destinationsApi";

/** Dựng trang điểm đến, nơi hiển thị dữ liệu theo danh mục và các trạng thái tải hoặc lỗi. */
const Destinations = () => {
    const [destinationsByCategory, setDestinationsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Tải dữ liệu đã nhóm khi người dùng mở trang điểm đến.
    useEffect(() => {
        loadDestinations();
    }, []);

    /** Gọi API nhóm điểm đến theo danh mục và lưu kết quả để dựng từng nhóm. */
    const loadDestinations = async () => {
        try {
            const data = await getDestinationsByCategories();
            setDestinationsByCategory(data || {});
        } catch (err) {
            setError("Không tải được danh sách điểm đến.");
        } finally {
            setLoading(false);
        }
    };

    // Scroll to category section when carousel heading is clicked
    /** Cuộn tới phần danh mục tương ứng trong danh sách đã hiển thị. */
    const scrollToCategory = (categoryId) => {
        const section = document.getElementById(categoryId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="destinations-page">

            {/* Carousel with click-to-scroll */}
            <CategoryCarousel onCategoryClick={scrollToCategory} />

            {loading && <p className="loading">Đang tải điểm đến...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error &&
                Object.entries(destinationsByCategory).map(([category, destinations]) => {
                    // Convert category name into an ID (same as in carousel)
                    const categoryId = category
                        .toLowerCase()
                        .replace(/&/g, "")
                        .replace(/\s+/g, "-");

                    return (
                        <section key={category} id={categoryId} className="category-section">
                            <h2>{categoryLabel(category)}</h2>

                            {Array.isArray(destinations) && destinations.length > 0 ? (
                                <div className="destination-cards">
                                    {destinations.map((dest) => (
                                        <div key={dest.id ?? Math.random()} className="destination-card">
                                            <img
                                                src={dest.imageUrl ?? "/default.jpg"}
                                                alt={dest.name ?? "Điểm đến"}
                                                className="destination-image"
                                            />
                                            <div className="destination-info">
                                                <h3>{dest.name ?? "Chưa có tên"}</h3>
                                                <p className="location">{dest.location ?? "Chưa có địa chỉ"}</p>
                                                <p className="description">
                                                    {dest.description ?? "Chưa có mô tả."}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-results">Chưa có điểm đến thuộc danh mục này.</p>
                            )}
                        </section>
                    );
                })}
        </div>
    );
};

export default Destinations;
