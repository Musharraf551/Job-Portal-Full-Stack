import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("No token found. Please login first.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/jobs/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(Array.isArray(response.data) ? response.data : response.data.results);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch jobs. Please make sure you're logged in.");
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <h2>Available Jobs</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <h3><Link to={`/jobs/${job.id}`}>{job.title}</Link></h3>
            <p>{job.description}</p>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> ₹{job.salary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Jobs;
