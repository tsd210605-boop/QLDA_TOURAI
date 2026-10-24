import React, { useEffect, useState } from "react";
import PackageCard from "./PackageCard";
import OffersCarousel from "./OffersCarousel";
import { getAllPackages, getPackagesByCategory, getOffers } from "../../api/packagesApi";
import "./packages.css";

const categories = [
    "Nature & Adventure",
    "Cultural & Historical",
    "Beaches & Relaxation",
    "Wildlife & Safari",
    "Spiritual & Wellness",
    "Luxury & Honeymoon",
    "Food & Culinary"
];

const PackagesList = () => {
    const [packages, setPackages] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (!selectedCategory) {
            getAllPackages()
                .then((data) => setPackages(Array.isArray(data) ? data : []))
                .catch(() => setPackages([]))
                .finally(() => setLoading(false));
        } else {
            getPackagesByCategory(selectedCategory)
                .then((data) => setPackages(Array.isArray(data) ? data : []))
                .catch(() => setPackages([]))
                .finally(() => setLoading(false));
        }
    }, [selectedCategory]);

    useEffect(() => {
        getOffers()
            .then((data) => setOffers(Array.isArray(data) ? data : []))
            .catch(() => setOffers([]));
    }, []);

    return (
        <div className="packages-page">
            <OffersCarousel offers={offers} />

            <div className="packages-wrapper">
                <aside className="categories-menu">
                    <h3>Categories</h3>
                    <ul>
                        <li
                            className={!selectedCategory ? "active" : ""}
                            onClick={() => setSelectedCategory("")}
                        >
                            All ({packages.length > 0 && !selectedCategory ? packages.length : "Tất cả"})
                        </li>
                        {categories.map((cat) => (
                            <li
                                key={cat}
                                className={selectedCategory === cat ? "active" : ""}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="packages-container">
                    <h1 className="packages-title">
                        {selectedCategory || "All"} Packages
                    </h1>

                    {loading ? (
                        <div style={{ padding: "40px", fontSize: "16px", color: "#718096" }}>
                            <i className="fa fa-spinner fa-spin"></i> Đang tải danh sách gói du lịch...
                        </div>
                    ) : packages.length === 0 ? (
                        <div style={{ padding: "40px", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e0" }}>
                            <p style={{ fontSize: "16px", color: "#64748b", marginBottom: "15px" }}>
                                Chưa có tour du lịch nào trong danh mục <strong>"{selectedCategory}"</strong>.
                            </p>
                            <button
                                type="button"
                                style={{
                                    padding: "8px 18px",
                                    background: "#0284c7",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600"
                                }}
                                onClick={() => setSelectedCategory("")}
                            >
                                Xem tất cả các gói du lịch
                            </button>
                        </div>
                    ) : (
                        <div className="packages-grid">
                            {packages.map((pkg) => (
                                <PackageCard key={pkg.packageId} pkg={pkg} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PackagesList;
