import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function JobPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const userProfile = JSON.parse(localStorage.getItem("user_profile"));

  useEffect(() => {
    if (!userProfile || !userProfile.is_staff) {
      alert("Access denied! Admins only.");
      navigate("/");
    }
  }, [navigate, userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("access_token");

    const res = await fetch("http://127.0.0.1:8000/api/jobs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, company, location }),
    });

    if (res.ok) {
      setSuccess("Job posted successfully!");
      setTitle("");
      setDescription("");
      setCompany("");
      setLocation("");
    } else {
      const errorData = await res.json();
      setError(errorData.detail || JSON.stringify(errorData));
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2>Post a Job (Admin Only)</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Job Title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="Job Description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Company"
            className="form-control"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Location"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Post Job</button>
      </form>
    </div>
  );
}

export default JobPost;
