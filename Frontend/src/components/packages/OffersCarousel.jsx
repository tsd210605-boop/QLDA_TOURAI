import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getOffers } from "../../api/packagesApi";
import "./packages.css";

const OffersCarousel = ({ offers: propOffers }) => {
  const [offers, setOffers] = useState([]);
  const history = useHistory();

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
            <img src={offer.imageUrl} alt={`Offer ${offer.offerTitle || "Special"}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersCarousel;
