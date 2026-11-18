import React from "react";
import { Link } from "react-router-dom";
import { price } from "../../data/Data";
import { formatVnd } from "../../../utils/currency";

const PriceCard = () => (
  <div className="content flex mtop">
    {price.map((item) => (
      <div className="box shadow" key={item.plan}>
        <h3>{item.plan}</h3>
        <p className="tour-plan-from">Giá từ</p>
        <h1 className="tour-plan-price">{formatVnd(item.price)}</h1>
        <p>/người · {item.ptext}</p>
        <ul>
          {item.features.map((feature) => (
            <li key={feature}>
              <label style={{ background: "#27ae601f", color: "#27ae60" }}>
                <i className="fa-solid fa-check" aria-hidden="true"></i>
              </label>
              <p>{feature}</p>
            </li>
          ))}
        </ul>
        <Link className="btn5 tour-plan-link" to="/packages">Xem các tour</Link>
      </div>
    ))}
  </div>
);

export default PriceCard;
