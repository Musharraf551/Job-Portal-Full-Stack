import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/jobs/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access")}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job details");
        return res.json();
      })
      .then((data) => setJob(data))
      .catch((err) => setError(err.message));
  }, [id]);

  const handleApply = () => {
    fetch(`http://127.0.0.1:8000/api/applications/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access")}`
      },
      body: JSON.stringify({
        job: id,
        cover_letter: "I am interested in this job."
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to apply for job");
        return res.json();
      })
      .then(() => alert("Applied successfully!"))
      .catch((err) => setError(err.message));
  };

  if (error) return <p>{error}</p>;
  if (!job) return <p>Loading...</p>;

  return (
    <div>
      <h2>{job.title}</h2>
      <p>{job.company}</p>
      <p>{job.location}</p>
      <p>₹{job.salary}</p>
      <p>{job.description}</p>
      <button onClick={handleApply}>Apply Now</button>
    </div>
  );
}

export default JobDetail;
