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
      setSuccess("✅ Job posted successfully!");
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
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea, #20d6e3ff)",
        padding: "20px",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "15px",
          backgroundColor: "#fff",
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "#333" }}>
          📄 Post a Job <small className="text-muted">(Admin Only)</small>
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Job Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter job title"
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Job Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe the job responsibilities"
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Company</label>
            <input
              type="text"
              className="form-control"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              placeholder="Enter company name"
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Location</label>
            <input
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Enter job location"
              style={{ borderRadius: "10px" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            style={{
              padding: "10px",
              borderRadius: "10px",
              fontSize: "16px",
              backgroundColor: "#667eea",
              border: "none",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#5a67d8")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#667eea")
            }
          >
            🚀 Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobPost;
