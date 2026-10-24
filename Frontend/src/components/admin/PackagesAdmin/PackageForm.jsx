import React, { useEffect, useState } from "react";
import { createPackage, getPackageById, updatePackage } from "../../../api/adminApi";
import { useParams, useHistory } from "react-router-dom";
import "../admin.css";

const PackageForm = () => {
  const { id } = useParams(); // edit mode
  const history = useHistory();
  const [pkg, setPkg] = useState({
    title: "",
    duration: "",
    mainDestinations: "",
    bestFor: "",
    price: "",
    peopleCount: "",
    imageUrl: ""
  });

  useEffect(() => {
    if (id) {
      getPackageById(id).then((data) => setPkg(data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPkg({ ...pkg, [name]: value });
  };

  const handleSubmit = () => {
    if (!pkg.title || !pkg.duration) {
      alert("Title and Duration are required!");
      return;
    }

    if (id) {
      updatePackage(id, pkg)
        .then(() => {
          alert("Package updated!");
          history.push("/admin/packages");
        });
    } else {
      createPackage(pkg)
        .then(() => {
          alert("Package created!");
          history.push("/admin/packages");
        });
    }
  };

  return (
    <div className="package-form">
      <h2>{id ? "Edit Package" : "Add Package"}</h2>
      <label>
        Title:
        <input type="text" name="title" value={pkg.title} onChange={handleChange} />
      </label>
      <label>
        Duration:
        <input type="text" name="duration" value={pkg.duration} onChange={handleChange} />
      </label>
      <label>
        Main Destinations:
        <input type="text" name="mainDestinations" value={pkg.mainDestinations} onChange={handleChange} />
      </label>
      <label>
        Best For:
        <input type="text" name="bestFor" value={pkg.bestFor} onChange={handleChange} />
      </label>
      <label>
        Price:
        <input type="number" name="price" value={pkg.price} onChange={handleChange} />
      </label>
      <label>
        People Count:
        <input type="number" name="peopleCount" value={pkg.peopleCount} onChange={handleChange} />
      </label>
      <label>
        Image URL:
        <input type="text" name="imageUrl" value={pkg.imageUrl} onChange={handleChange} />
      </label>
      <button onClick={handleSubmit}>{id ? "Update" : "Create"}</button>
    </div>
  );
};

export default PackageForm;
