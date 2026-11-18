import React from "react";
import Heading from "../../common/Heading";
import { location } from "../../data/Data";
import "./style.css";

const Location = () => (
  <section className="location padding">
    <div className="container">
      <Heading title="Điểm đến nổi bật tại Việt Nam" subtitle="Khám phá phố cổ, núi rừng và biển đảo qua những điểm đến được yêu thích trên khắp Việt Nam." />
      <div className="content grid3 mtop">
        {location.map((item) => (
          <div className="box" key={item.id}>
            <img src={item.cover} alt={item.name} loading="lazy" />
            <div className="overlay">
              <h5>{item.name}</h5>
              <p><span>{item.places}</span> <span>{item.places2}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Location;
