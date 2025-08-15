import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [url, setUrl] = useState("http://127.0.0.1:8000/api/jobs/"); 
  const [search, setSearch] = useState("");

  const fetchJobs = async (pageUrl) => {
    setLoading(true);
    try {
      const res = await fetch(pageUrl);
      const data = await res.json();

      setJobs(data.results || data);
      setNextPage(data.next);
      setPrevPage(data.previous);
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(url);
  }, [url]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning shadow-sm">
          No jobs available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">

      {/* Page Heading */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Available Jobs</h2>
        <input
          type="text"
          className="form-control w-50 shadow-sm"
          placeholder="🔍 Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Job Cards */}
      <div className="row g-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-lg h-100 job-card">
              <div className="card-body">
                <h5 className="card-title fw-bold">{job.title}</h5>
                <p className="text-muted mb-1">
                  <i className="bi bi-building me-1"></i> {job.company}
                </p>
                <p className="text-muted mb-1">
                  <i className="bi bi-geo-alt me-1"></i> {job.location}
                </p>
                <p className="small text-secondary">
                  {job.description.slice(0, 100)}...
                </p>
                <Link
                  to={`/jobs/${job.id}`}
                  className="btn btn-outline-primary btn-sm mt-2 rounded-pill"
                >
                  View Details →
                </Link>
              </div>
              <div className="card-footer bg-light text-muted small">
                📅 {new Date(job.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <nav className="mt-5">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${!prevPage ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setUrl(prevPage)}
              disabled={!prevPage}
            >
              ← Previous
            </button>
          </li>
          <li className={`page-item ${!nextPage ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setUrl(nextPage)}
              disabled={!nextPage}
            >
              Next →
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Jobs;
