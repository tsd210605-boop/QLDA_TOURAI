import React from "react";
import { Link } from "react-router-dom";
import "./brand.css";

const Brand = ({ light = false }) => (
  <Link to="/" className={light ? "tourism-brand tourism-brand--light" : "tourism-brand"} aria-label="Tourism - Trang chủ">Tourism</Link>
);

export default Brand;
