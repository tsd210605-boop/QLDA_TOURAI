// Hiển thị ảnh của ưu đãi tour và dẫn người dùng đến tour tương ứng.

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getOffers } from "../../api/packagesApi";
import "./packages.css";

/** Dựng các thẻ ưu đãi từ danh sách do trang cha truyền vào hoặc do component tự nạp. */
const OffersCarousel = ({ offers: propOffers }) => {
  const [offers, setOffers] = useState([]);
  const history = useHistory();

  // Dùng danh sách ưu đãi hợp lệ từ trang cha hoặc gọi API lấy ưu đãi khi chưa được truyền vào.
  useEffect(() => {
    if (propOffers && Array.isArray(propOffers)) {
      setOffers(propOffers);
    } else {
      getOffers()
        .then((data) => {
          if (Array.isArray(data)) {
            setOffers(data);
          } else {
            setOffers([]);
          }
        })
        .catch(() => setOffers([]));
    }
  }, [propOffers]);

  if (!Array.isArray(offers) || offers.length === 0) {
    return null;
  }

  return (
    <div className="offers-carousel-container">
      <div className="offers-carousel">
        {offers.map((offer) => (
          <div
            key={offer.offerId}
            className="offer-slide"
            onClick={() => history.push(`/packages/${offer.packageId}`)}
          >
            <img src={offer.imageUrl} alt={`Ưu đãi ${offer.offerTitle || "Ưu đãi đặc biệt"}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersCarousel;
