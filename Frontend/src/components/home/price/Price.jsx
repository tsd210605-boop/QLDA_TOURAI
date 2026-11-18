import React from "react";
import Heading from "../../common/Heading";
import "./price.css";
import PriceCard from "./PriceCard";

const Price = () => (
  <section className="price padding">
    <div className="container">
      <Heading title="Chọn hành trình theo ngân sách" subtitle="Gợi ý các tour Việt Nam từ chuyến đi trong ngày đến kỳ nghỉ nhiều ngày, với mức giá tham khảo cho từng người." />
      <PriceCard />
      <p className="home-price-note">Giá tham khảo cho một người lớn, chưa bao gồm vé máy bay. Dịch vụ và giá cuối cùng được xác nhận theo ngày khởi hành.</p>
    </div>
  </section>
);

export default Price;
