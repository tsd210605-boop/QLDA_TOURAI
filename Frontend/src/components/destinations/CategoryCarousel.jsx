import React, { useState } from "react";
import "./CategoryCarousel.css";

const categories = [
    {
        title: "Explore Destinations",
        image: "/images/destinations-carousel/explore.jpg",
        categoryId: null,
    },
    {
        title: "Nature & Adventure",
        image: "/images/destinations-carousel/nature.jpg",
        categoryId: "nature-adventure",
    },
    {
        title: "Cultural & Historical",
        image: "/images/destinations-carousel/cultural.jpg",
        categoryId: "cultural-historical",
    },
    {
        title: "City Experience",
        image: "/images/destinations-carousel/cities.jpg",
        categoryId: "city-experience",
    },
    {
        title: "Beach & Relaxation",
        image: "/images/destinations-carousel/beaches.jpg",
        categoryId: "beach-relaxation",
    },
];

const CategoryCarousel = ({ onCategoryClick }) => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % categories.length);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + categories.length) % categories.length);
    };

    const isFirst = current === 0;

    return (
        <div className="carousel-container">
            <button className="arrow left" onClick={prevSlide}>❮</button>

            <div className="carousel-slide">
                <img
                    src={categories[current].image}
                    alt={categories[current].title}
                    className="carousel-image"
                />

                {/* Dynamic class for first slide vs others */}
                <div
                    className={isFirst ? "carousel-heading first-heading" : "carousel-heading"}
                    onClick={() =>
                        categories[current].categoryId &&
                        onCategoryClick(categories[current].categoryId)
                    }
                    style={{ cursor: categories[current].categoryId ? "pointer" : "default" }}
                >
                    {categories[current].title}
                </div>
            </div>

            <button className="arrow right" onClick={nextSlide}>❯</button>
        </div>
    );
};

export default CategoryCarousel;
