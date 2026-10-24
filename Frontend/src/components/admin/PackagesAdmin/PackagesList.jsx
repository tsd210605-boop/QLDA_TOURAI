import React, { useEffect, useState } from "react";
import { getAllPackages, deletePackage } from "../../../api/adminApi";
import { useHistory } from "react-router-dom";
import "../admin.css";

const PackagesList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    getAllPackages()
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to load packages in admin:", err);
        setPackages([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this package?")) return;
    deletePackage(id)
      .then(() => setPackages(packages.filter(p => p.packageId !== id)))
      .catch(() => alert("Failed to delete package."));
  };

  if (loading) return <p>Loading packages...</p>;

  return (
    <div className="packages-list">
      <div className="packages-header">
        <h2>Tour Packages</h2>
        <button onClick={() => history.push("/admin/packages/add")}>
          + Add Package
        </button>
      </div>

      {packages.length === 0 ? (
        <p>No packages found.</p>
      ) : (
        packages.map((p) => (
          <div key={p.packageId} className="package-card">

            {/* Image */}
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.title}
                className="package-image"
              />
            )}

            {/* Main details */}
            <div className="package-details">
              <h3>{p.title}</h3>

              <p><b>Category:</b> {p.category}</p>
              <p><b>Duration:</b> {p.duration}</p>
              <p><b>Best For:</b> {p.bestFor}</p>
              <p><b>Main Destinations:</b> {p.mainDestinations}</p>
              <p><b>People Count:</b> {p.peopleCount}</p>
              <p className="package-price">
                <b>Price:</b> ${p.price}
              </p>

              {/* Itineraries */}
              {p.itineraries && p.itineraries.length > 0 && (
                <div className="package-itineraries">
                  <h4>Itinerary</h4>
                  <ul>
                    {p.itineraries.map((it) => (
                      <li key={it.dayNumber}>
                        <b>Day {it.dayNumber}:</b> {it.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Buttons */}
              <div className="package-buttons">
                <button onClick={() => history.push(`/admin/packages/edit/${p.packageId}`)}>
                  Edit
                </button>
                <button className="danger" onClick={() => handleDelete(p.packageId)}>
                  Delete
                </button>
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default PackagesList;
