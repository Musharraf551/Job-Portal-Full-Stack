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
    const token = localStorage.getItem("access_token");
    if (!token) {
      setApplyMessage("You must be logged in to apply.");
      return;
    }

    const formData = new FormData();
    formData.append("cover_letter", coverLetter);
    if (resume) formData.append("resume", resume);

    fetch(`http://127.0.0.1:8000/api/jobs/${id}/apply/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
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
        setApplyMessage("✅ Application submitted successfully!");
        setCoverLetter("");
        setResume(null);
      })
      .catch((err) => setApplyMessage(err.message));
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{job.title}</h2>
          <p className="card-text">{job.description}</p>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          {job.salary && (
            <p>
              <strong>Salary:</strong> {job.salary}
            </p>
          )}
          <p className="text-muted">
            Posted on: {new Date(job.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h4 className="card-title mb-3">Apply for this Job</h4>
          <div className="mb-3">
            <label className="form-label">Cover Letter</label>
            <textarea
              className="form-control"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write your cover letter here"
              rows={5}
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Resume</label>
            <input
              className="form-control"
              type="file"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </div>
          <button className="btn btn-primary" onClick={handleApply}>
            Submit Application
          </button>

          {applyMessage && (
            <div
              className={`alert mt-3 ${
                applyMessage.includes("✅") ? "alert-success" : "alert-danger"
              }`}
            >
              {applyMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetail;
