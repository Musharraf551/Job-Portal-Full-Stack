import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function JobPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Add other job fields as needed
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const userProfile = JSON.parse(localStorage.getItem("user_profile"));

  useEffect(() => {
    if (!userProfile || !userProfile.is_staff) {
      alert("Access denied! Admins only.");
      navigate("/"); // redirect if not admin
    }
  }, [navigate, userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("access_token");

    const res = await fetch("http://127.0.0.1:8000/api/jobs/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      setSuccess("Job posted successfully!");
      setTitle("");
      setDescription("");
    } else {
      const errorData = await res.json();
      setError(errorData.detail || "Failed to post job.");
    }
  };

  return (
    <div>
      <h2>Post a Job (Admin Only)</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}

export default JobPost;
