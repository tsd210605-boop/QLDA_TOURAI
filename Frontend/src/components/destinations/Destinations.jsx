import React, { useEffect, useState } from "react";
import "./destinations.css";
import CategoryCarousel from "./CategoryCarousel";
import { getDestinationsByCategories } from "../../api/destinationsApi";

const Destinations = () => {
    const [destinationsByCategory, setDestinationsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDestinations();
    }, []);

    const loadDestinations = async () => {
        try {
            const data = await getDestinationsByCategories();
            setDestinationsByCategory(data || {});
        } catch (err) {
            setError("Error loading destinations.");
        } finally {
            setLoading(false);
        }
    };

    // Scroll to category section when carousel heading is clicked
    const scrollToCategory = (categoryId) => {
        const section = document.getElementById(categoryId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="destinations-page">

            {/* Carousel with click-to-scroll */}
            <CategoryCarousel onCategoryClick={scrollToCategory} />

            {loading && <p className="loading">Loading destinations...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error &&
                Object.entries(destinationsByCategory).map(([category, destinations]) => {
                    // Convert category name into an ID (same as in carousel)
                    const categoryId = category
                        .toLowerCase()
                        .replace(/&/g, "")
                        .replace(/\s+/g, "-");

                    return (
                        <section key={category} id={categoryId} className="category-section">
                            <h2>{category}</h2>

                            {Array.isArray(destinations) && destinations.length > 0 ? (
                                <div className="destination-cards">
                                    {destinations.map((dest) => (
                                        <div key={dest.id ?? Math.random()} className="destination-card">
                                            <img
                                                src={dest.imageUrl ?? "/default.jpg"}
                                                alt={dest.name ?? "Destination"}
                                                className="destination-image"
                                            />
                                            <div className="destination-info">
                                                <h3>{dest.name ?? "Unknown Name"}</h3>
                                                <p className="location">{dest.location ?? "Unknown Location"}</p>
                                                <p className="description">
                                                    {dest.description ?? "No description available."}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-results">No destinations found in this category.</p>
                            )}
                        </section>
                    );
                })}
        </div>
    );
};

export default Destinations;
