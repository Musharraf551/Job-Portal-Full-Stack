import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/jobs/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }
        return response.json();
      })
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleApply = () => {
    fetch(`http://127.0.0.1:8000/api/apply/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add Authorization if backend requires login
        // "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        job_id: id,
        cover_letter: "I am very interested in this role." // You can make this dynamic later
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to apply for job");
        }
        return response.json();
      })
      .then((data) => {
        setApplyMessage("Application submitted successfully!");
      })
      .catch((err) => {
        setApplyMessage(err.message);
      });
  };

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <p><strong>Location:</strong> {job.location}</p>
      {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}

      <button onClick={handleApply}>Apply</button>
      {applyMessage && <p>{applyMessage}</p>}
    </div>
  );
}

export default JobDetail;
