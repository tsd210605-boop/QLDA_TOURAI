import React, { useEffect, useState } from "react";
import { getAllDestinations, deleteDestination } from "../../../api/adminApi";
import { useHistory } from "react-router-dom";
import "../admin.css";

const DestinationsList = () => {
  const [destinations, setDestinations] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const data = await getAllDestinations();
      setDestinations(data);
    } catch {
      alert("Failed to fetch destinations");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this destination?")) return;
    try {
      await deleteDestination(id);
      setDestinations(destinations.filter((d) => d.id !== id));
    } catch {
      alert("Error deleting destination");
    }
  };

  return (
    <div className="destinations-container"> {/* parent wrapper */}
      
      <div className="destinations-header">
        <h2>Destinations</h2>
        <button onClick={() => history.push("/admin/destinations/add")}>
          + Add Destination
        </button>
      </div>

      <div className="destinations-list">
        {destinations.length === 0 ? (
          <p>No destinations found.</p>
        ) : (
          destinations.map((d) => (
            <div key={d.id} className="destination-card">

              {d.imageUrl && (
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  className="destination-image"
                />
              )}

              <div className="destination-details">
                <h3>{d.name}</h3>
                <p><b>Location:</b> {d.location}</p>
                <p><b>Category:</b> {d.category}</p>
                <p className="destination-description">{d.description}</p>

                <div className="destination-buttons">
                  <button onClick={() => history.push(`/admin/destinations/edit/${d.id}`)}>
                    Edit
                  </button>
                  <button className="danger" onClick={() => handleDelete(d.id)}>
                    Delete
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default DestinationsList;
