import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/jobs/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job details");
        return res.json();
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
    setApplyMessage("");
    const token = localStorage.getItem("access_token"); // or "access" if you saved JWT as "access"
    if (!token) {
      setApplyMessage("You must be logged in to apply.");
      return;
    }

    const formData = new FormData();
    formData.append("cover_letter", coverLetter);
    if (resume) formData.append("resume", resume);

    fetch(`http://127.0.0.1:8000/api/jobs/${id}/apply/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          const resClone = res.clone();

          let errorMsg = "Failed to apply";
          try {
            const errorData = await res.json();
            errorMsg = errorData.detail || JSON.stringify(errorData);
          } catch {
            const errorText = await resClone.text();
            errorMsg = errorText;
          }
          throw new Error(errorMsg);
        }
        await res.json();
        setApplyMessage("Application submitted successfully!");
        setCoverLetter("");
        setResume(null);
      })
      .catch((err) => setApplyMessage(err.message));
  };

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <p><strong>Location:</strong> {job.location}</p>
      {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}

      <h3>Apply for this job</h3>
      <textarea
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        placeholder="Write your cover letter here"
        rows={5}
        cols={50}
      />
      <br />
      <input
        type="file"
        onChange={(e) => setResume(e.target.files[0])}
      />
      <br />
      <button onClick={handleApply}>Apply</button>

      {applyMessage && <p>{applyMessage}</p>}
    </div>
  );
}

export default JobDetail;
