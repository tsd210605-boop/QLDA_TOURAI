import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import PackageCard from "./PackageCard";
import {
    getPackageById,
    getItineraryByPackageId,
    getRelatedPackages,
    getPackageOffer
} from "../../api/packagesApi";
import "./packageDetails.css";

const PackageDetails = () => {
    const { id } = useParams();
    const history = useHistory();

    const [pkg, setPackage] = useState(null);
    const [itinerary, setItinerary] = useState([]);
    const [relatedPackages, setRelatedPackages] = useState([]);
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getPackageById(id)
            .then((data) => {
                setPackage(data);
                if (data?.category) {
                    getRelatedPackages(data.category, id)
                        .then((res) => setRelatedPackages(Array.isArray(res) ? res : []))
                        .catch(() => setRelatedPackages([]));
                }
            })
            .catch((err) => console.error("Error fetching package details:", err))
            .finally(() => setLoading(false));

        getItineraryByPackageId(id)
            .then((data) => setItinerary(Array.isArray(data) ? data : []))
            .catch(() => setItinerary([]));

        getPackageOffer(id)
            .then(setOffer)
            .catch(() => setOffer(null));
    }, [id]);

    if (loading) {
        return (
            <div className="package-details-page">
                <div className="package-details-container loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải thông tin tour du lịch...</p>
                </div>
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="package-details-page">
                <div className="package-details-container empty-container">
                    <h2>Không tìm thấy thông tin tour</h2>
                    <p>Tour du lịch có thể đã bị xóa hoặc đường dẫn không chính xác.</p>
                    <button className="back-btn" onClick={() => history.push("/packages")}>
                        <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách tour
                    </button>
                </div>
            </div>
        );
    }

    const discount = offer ? Number(offer.discountPercentage) : 0;
    const originalPrice = Number(pkg.price);
    const finalPrice = discount > 0 ? (originalPrice - (originalPrice * discount) / 100).toFixed(2) : originalPrice.toFixed(2);
    const savingsAmount = discount > 0 ? ((originalPrice * discount) / 100).toFixed(2) : 0;

    return (
        <div className="package-details-page">
            <div className="package-details-container">
                {/* Breadcrumb Navigation */}
                <div className="details-nav-bar">
                    <nav className="details-breadcrumb">
                        <Link to="/"><i className="fa-solid fa-house"></i> Trang chủ</Link>
                        <span className="sep">/</span>
                        <Link to="/packages">Tour du lịch</Link>
                        <span className="sep">/</span>
                        <span className="active">{pkg.title}</span>
                    </nav>
                    <button className="back-link-btn" onClick={() => history.push("/packages")}>
                        <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
                    </button>
                </div>

                {/* Hero Showcase Card */}
                <div className="package-hero-card">
                    {/* Left: Visual Showcase */}
                    <div className="hero-media-col">
                        <div className="image-frame">
                            <img src={pkg.imageUrl} alt={pkg.title} className="details-img" />
                            {pkg.category && (
                                <span className="category-tag">
                                    <i className="fa-solid fa-compass"></i> {pkg.category}
                                </span>
                            )}
                            {discount > 0 && (
                                <span className="discount-tag">
                                    <i className="fa-solid fa-fire"></i> Giảm {discount}%
                                </span>
                            )}
                        </div>

                        <div className="trust-badges-grid">
                            <div className="trust-badge">
                                <i className="fa-solid fa-bolt"></i>
                                <div>
                                    <strong>Xác nhận tức thì</strong>
                                    <span>Vé điện tử QR qua Email</span>
                                </div>
                            </div>
                            <div className="trust-badge">
                                <i className="fa-solid fa-shield-halved"></i>
                                <div>
                                    <strong>Bảo hiểm trọn gói</strong>
                                    <span>An tâm suốt hành trình</span>
                                </div>
                            </div>
                            <div className="trust-badge">
                                <i className="fa-solid fa-credit-card"></i>
                                <div>
                                    <strong>Thanh toán linh hoạt</strong>
                                    <span>Hỗ trợ VNPAY, Thẻ ATM/Visa</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Tour Details & Booking Action Box */}
                    <div className="hero-content-col">
                        <div className="title-row">
                            <span className="availability-pill">
                                <i className="fa-solid fa-circle-check"></i> Đang mở bán
                            </span>
                            <span className="review-pill">
                                <i className="fa-solid fa-star"></i> 4.9 (128 đánh giá)
                            </span>
                        </div>

                        <h1 className="package-title">{pkg.title}</h1>

                        {/* Specs Grid */}
                        <div className="specs-grid">
                            <div className="spec-card">
                                <div className="spec-icon clock">
                                    <i className="fa-regular fa-clock"></i>
                                </div>
                                <div className="spec-info">
                                    <span className="spec-label">Thời lượng</span>
                                    <span className="spec-value">{pkg.duration || "N/A"}</span>
                                </div>
                            </div>

                            <div className="spec-card">
                                <div className="spec-icon people">
                                    <i className="fa-solid fa-users"></i>
                                </div>
                                <div className="spec-info">
                                    <span className="spec-label">Quy mô đoàn</span>
                                    <span className="spec-value">Tối đa {pkg.peopleCount} người</span>
                                </div>
                            </div>

                            <div className="spec-card">
                                <div className="spec-icon location">
                                    <i className="fa-solid fa-location-dot"></i>
                                </div>
                                <div className="spec-info">
                                    <span className="spec-label">Điểm tham quan</span>
                                    <span className="spec-value">{pkg.mainDestinations || "Theo lịch trình"}</span>
                                </div>
                            </div>

                            <div className="spec-card">
                                <div className="spec-icon target">
                                    <i className="fa-solid fa-bullseye"></i>
                                </div>
                                <div className="spec-info">
                                    <span className="spec-label">Phù hợp cho</span>
                                    <span className="spec-value">{pkg.bestFor || "Mọi đối tượng"}</span>
                                </div>
                            </div>
                        </div>

                        {pkg.description && (
                            <div className="tour-summary-box">
                                <p>{pkg.description}</p>
                            </div>
                        )}

                        {/* Dedicated Booking CTA Box (NEVER overlaps text) */}
                        <div className="booking-cta-panel">
                            <div className="cta-pricing-row">
                                <div className="price-label-col">
                                    <span className="label">Giá trọn gói mỗi khách:</span>
                                    {discount > 0 && (
                                        <span className="save-chip">
                                            Tiết kiệm ${savingsAmount}
                                        </span>
                                    )}
                                </div>
                                <div className="price-value-col">
                                    {discount > 0 ? (
                                        <div className="discounted-price-group">
                                            <span className="strike-price">${originalPrice.toFixed(2)}</span>
                                            <span className="main-price">${finalPrice}</span>
                                            <span className="unit">/ người</span>
                                        </div>
                                    ) : (
                                        <div className="regular-price-group">
                                            <span className="main-price">${originalPrice.toFixed(2)}</span>
                                            <span className="unit">/ người</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="cta-button-row">
                                <Link
                                    to={`/bookings/package/${pkg.packageId}`}
                                    className="book-btn-primary"
                                >
                                    <i className="fa-solid fa-calendar-check"></i> Đặt tour ngay (Book Now)
                                </Link>
                            </div>

                            <div className="cta-reassurance">
                                <i className="fa-solid fa-shield-check"></i>
                                <span>Giữ chỗ ngay, thanh toán an toàn tiện lợi qua VNPAY / MoMo. Hỗ trợ xuất hóa đơn VAT điện tử.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Day-by-Day Itinerary Section */}
                {itinerary.length > 0 && (
                    <div className="details-section itinerary-section">
                        <div className="section-header">
                            <span className="section-subtitle">Chương trình chi tiết</span>
                            <h2 className="section-title">
                                <i className="fa-solid fa-route"></i> Lịch trình tour theo ngày
                            </h2>
                        </div>
                        <div className="itinerary-timeline">
                            {itinerary.map((day, idx) => (
                                <div key={day.itineraryId || idx} className="timeline-node">
                                    <div className="timeline-badge">
                                        <span>Ngày</span>
                                        <strong>{day.dayNumber}</strong>
                                    </div>
                                    <div className="timeline-connector"></div>
                                    <div className="timeline-card">
                                        <h3 className="timeline-card-title">Ngày {day.dayNumber}: Lịch trình & Trải nghiệm</h3>
                                        <p className="timeline-card-desc">{day.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Inclusions & Policies Section */}
                <div className="details-section policies-section">
                    <div className="section-header">
                        <span className="section-subtitle">Thông tin dịch vụ</span>
                        <h2 className="section-title">
                            <i className="fa-solid fa-circle-info"></i> Quyền lợi & Quy định tour
                        </h2>
                    </div>
                    <div className="policies-grid">
                        <div className="policy-card included">
                            <h3><i className="fa-solid fa-circle-check"></i> Dịch vụ bao gồm</h3>
                            <ul>
                                <li><i className="fa-solid fa-check"></i> Xe du lịch máy lạnh đưa đón chất lượng cao suốt tuyến.</li>
                                <li><i className="fa-solid fa-check"></i> Hướng dẫn viên nhiệt tình, chu đáo, nhiều năm kinh nghiệm.</li>
                                <li><i className="fa-solid fa-check"></i> Bữa ăn theo tiêu chuẩn chương trình và nước suối mỗi ngày.</li>
                                <li><i className="fa-solid fa-check"></i> Vé tham quan tất cả các thắng cảnh có trong lịch trình.</li>
                                <li><i className="fa-solid fa-check"></i> Bảo hiểm du lịch theo quy định tối đa 50.000.000đ/vụ.</li>
                            </ul>
                        </div>
                        <div className="policy-card excluded">
                            <h3><i className="fa-solid fa-circle-xmark"></i> Dịch vụ chưa bao gồm</h3>
                            <ul>
                                <li><i className="fa-solid fa-xmark"></i> Chi phí cá nhân: giặt ủi, đồ uống ngoài thực đơn tour.</li>
                                <li><i className="fa-solid fa-xmark"></i> Thuế VAT (xuất hoá đơn theo yêu cầu của khách hàng).</li>
                                <li><i className="fa-solid fa-xmark"></i> Tiền bồi dưỡng (Tip) cho lái xe và hướng dẫn viên (tùy tâm).</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Related Packages Section */}
                {relatedPackages.length > 0 && (
                    <div className="details-section related-section">
                        <div className="section-header">
                            <span className="section-subtitle">Gợi ý khám phá</span>
                            <h2 className="section-title">
                                <i className="fa-solid fa-compass"></i> Các tour khác cùng danh mục "{pkg.category}"
                            </h2>
                        </div>
                        <div className="related-packages-grid">
                            {relatedPackages.map((rpkg) => (
                                <PackageCard key={rpkg.packageId} pkg={rpkg} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PackageDetails;

