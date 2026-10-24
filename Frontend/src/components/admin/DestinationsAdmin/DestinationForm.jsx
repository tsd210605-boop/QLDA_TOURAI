import React, { useEffect, useState } from "react";
import { createDestination, getDestinationById, updateDestination } from "../../../api/adminApi";
import { useParams, useHistory } from "react-router-dom";
import "../admin.css";

const DestinationForm = () => {
  const { id } = useParams();
  const history = useHistory();

  const [destination, setDestination] = useState({
    name: "",
    description: "",
    location: "",
    category: "",
    imageUrl: ""
  });

  useEffect(() => {
    if (id) {
      getDestinationById(id).then((data) => {
        setDestination({
          name: data.name || "",
          description: data.description || "",
          location: data.location || "",
          category: data.category || "",
          imageUrl: data.imageUrl || ""   // ✅ FIXED
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDestination({ ...destination, [name]: value });
  };

  const handleSubmit = async () => {
    if (!destination.name) return alert("Name is required");

    try {
      if (id) {
        await updateDestination(id, destination);
      } else {
        await createDestination(destination);
      }
      history.push("/admin/destinations");
    } catch (error) {
      alert("Failed to save destination");
    }
  };

  return (
    <div className="destination-form">
      <h2>{id ? "Edit Destination" : "Add Destination"}</h2>

      <label>
        Name
        <input
          type="text"
          name="name"
          value={destination.name}
          onChange={handleChange}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={destination.description}
          onChange={handleChange}
        />
      </label>

      <label>
        Location
        <input
          type="text"
          name="location"
          value={destination.location}
          onChange={handleChange}
        />
      </label>

      <label>
        Category
        <input
          type="text"
          name="category"
          value={destination.category}
          onChange={handleChange}
        />
      </label>

      <label>
        Image URL
        <input
          type="text"
          name="imageUrl"
          value={destination.imageUrl}
          onChange={handleChange}
        />
      </label>

      {/* ✅ IMAGE PREVIEW */}
      {destination.imageUrl && (
        <img
          src={destination.imageUrl}
          alt="Preview"
          className="destination-preview"
        />
      )}

      <button onClick={handleSubmit}>
        {id ? "Update" : "Create"}
      </button>
    </div>
  );
};

export default DestinationForm;
