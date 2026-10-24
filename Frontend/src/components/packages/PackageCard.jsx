import React from "react";
import { useHistory } from "react-router-dom";

const PackageCard = ({ pkg }) => {
    const history = useHistory();

    const handleCardClick = () => {
        history.push(`/packages/${pkg.packageId}`);
    };

    return (
        <div className="package-card" onClick={handleCardClick}>
            <div className="package-card-img-wrap">
                <img src={pkg.imageUrl} alt={pkg.title} className="package-img" />
                {pkg.category && <span className="package-category-chip">{pkg.category}</span>}
            </div>

            <div className="package-card-content">
                <h3 className="package-title" title={pkg.title}>{pkg.title}</h3>

                <div className="package-meta-row">
                    <span className="package-meta-item">
                        <i className="fa-regular fa-clock"></i> {pkg.duration || "N/A"}
                    </span>
                    <span className="package-meta-item">
                        <i className="fa-solid fa-users"></i> Tối đa {pkg.peopleCount} khách
                    </span>
                </div>

                <p className="package-destination-row">
                    <i className="fa-solid fa-location-dot"></i> {pkg.mainDestinations}
                </p>

                <div className="package-card-footer">
                    <div className="package-price-box">
                        <span className="price-prefix">Giá từ</span>
                        <strong className="price-val">${pkg.price}</strong>
                    </div>

                    <button
                        className="see-more-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick();
                        }}
                    >
                        Chi tiết <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackageCard;

