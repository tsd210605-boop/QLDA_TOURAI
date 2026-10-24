import React, { useEffect, useState } from "react";
import { getPackageItineraries, addItinerary, deleteItinerary } from "../../../api/adminApi";
import { useParams } from "react-router-dom";

const PackageItineraries = () => {
  const { id } = useParams(); // packageId
  const [itineraries, setItineraries] = useState([]);
  const [dayNumber, setDayNumber] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchItineraries();
  }, [id]);

  const fetchItineraries = () => {
    getPackageItineraries(id).then((data) => setItineraries(data));
  };

  const handleAdd = () => {
    if (!dayNumber || !description) return alert("Fill all fields");
    addItinerary(id, { dayNumber, description })
      .then(() => {
        setDayNumber("");
        setDescription("");
        fetchItineraries();
      });
  };

  const handleDelete = (itineraryId) => {
    if (!window.confirm("Delete this itinerary?")) return;
    deleteItinerary(itineraryId)
      .then(() => fetchItineraries());
  };

  return (
    <div>
      <h2>Package Itineraries</h2>
      <label>
        Day Number:
        <input type="number" value={dayNumber} onChange={(e) => setDayNumber(e.target.value)} />
      </label>
      <label>
        Description:
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <button onClick={handleAdd}>Add Itinerary</button>

      <div>
        {itineraries.map((it) => (
          <div key={it.itineraryId}>
            <p><b>Day {it.dayNumber}:</b> {it.description}</p>
            <button onClick={() => handleDelete(it.itineraryId)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageItineraries;
