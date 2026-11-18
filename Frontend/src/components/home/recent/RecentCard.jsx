import { categoryLabel } from "../../../utils/locale";
import React from "react";
import { list } from "../../data/Data";
import { formatVnd } from "../../../utils/currency";

const RecentCard = () => (
  <div className="content grid3 mtop">
    {list.map(({ id, cover, category, location, name, price }) => (
      <article className="box shadow" key={id}>
        <div className="img">
          <img src={cover} alt={name} loading="lazy" />
        </div>
        <div className="text">
          <div className="category flex">
            <span style={{ background: "#ff98001a", color: "#a85b00" }}>{categoryLabel(category)}</span>
            <i className="fa fa-heart" aria-hidden="true"></i>
          </div>
          <h4>{name}</h4>
          <p><i className="fa fa-location-dot" aria-hidden="true"></i> {location}</p>
        </div>
        <div className="button flex">
          <span className="tour-price">Từ {formatVnd(price)}</span>
          <span>/người</span>
        </div>
      </article>
    ))}
  </div>
);

export default RecentCard;
