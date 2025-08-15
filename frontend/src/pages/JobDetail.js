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
        <div className="alert alert-danger shadow-sm">{error}</div>
      </div>
    );

  return (
    <div className="container my-5">
      {/* Job Info */}
      <div className="card border-0 shadow-lg p-4 rounded-4">
        <div className="card-body">
          <h2 className="fw-bold text-primary mb-3">{job.title}</h2>
          <p className="fs-5 text-muted">{job.company}</p>
          <p className="mb-2">
            <i className="bi bi-geo-alt-fill text-danger me-2"></i>
            <strong>Location:</strong> {job.location}
          </p>
          {job.salary && (
            <p className="mb-3">
              <i className="bi bi-cash-stack text-success me-2"></i>
              <strong>Salary:</strong> {job.salary}
            </p>
          )}
          <p className="small text-muted mb-4">
            📅 Posted on: {new Date(job.created_at).toLocaleDateString()}
          </p>
          <h5 className="fw-bold">Job Description</h5>
          <p className="text-secondary">{job.description}</p>
        </div>
      </div>

      {/* Application Form */}
      <div className="card border-0 shadow-lg p-4 rounded-4 mt-4">
        <div className="card-body">
          <h4 className="fw-bold mb-3 text-success">
            <i className="bi bi-pencil-square me-2"></i> Apply for this Job
          </h4>

          <div className="mb-3">
            <label className="form-label fw-semibold">Cover Letter</label>
            <textarea
              className="form-control shadow-sm"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write your cover letter here..."
              rows={5}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Upload Resume</label>
            <input
              className="form-control shadow-sm"
              type="file"
              onChange={(e) => setResume(e.target.files[0])}
            />
            <small className="text-muted">
              Supported formats: PDF, DOC, DOCX
            </small>
          </div>

          <button
            className="btn btn-primary px-4 py-2 rounded-pill shadow-sm"
            onClick={handleApply}
          >
            Submit Application
          </button>

          {applyMessage && (
            <div
              className={`alert mt-3 rounded-3 shadow-sm ${
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
