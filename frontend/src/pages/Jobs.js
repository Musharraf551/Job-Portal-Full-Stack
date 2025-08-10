import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/jobs/");
        const data = await res.json();
        setJobs(data.results || data); // supports both paginated and non-paginated
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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
        <div className="alert alert-warning">No jobs available at the moment.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Available Jobs</h2>
      <div className="row">
        {jobs.map((job) => (
          <div key={job.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="text-muted mb-1">
                  <strong>Company:</strong> {job.company}
                </p>
                <p className="text-muted mb-1">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="small">{job.description.slice(0, 100)}...</p>
                <Link
                  to={`/jobs/${job.id}`}
                  className="btn btn-primary btn-sm mt-2"
                >
                  View Details
                </Link>
              </div>
              <div className="card-footer text-muted">
                Posted on: {new Date(job.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
