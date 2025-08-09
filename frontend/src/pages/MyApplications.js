import React, { useEffect, useState, useRef } from "react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceTimeout = useRef(null);

  const fetchApplications = async (searchQuery = "") => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You must be logged in to view your applications.");
        setLoading(false);
        return;
      }

      const url = searchQuery
        ? `http://127.0.0.1:8000/api/my-applications/?search=${encodeURIComponent(searchQuery)}`
        : `http://127.0.0.1:8000/api/my-applications/`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 429) {
        throw new Error("Too many requests. Please wait and try again.");
      }

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setApplications(data.results);
    } catch (err) {
      setError(err.message);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchApplications(value);
    }, 500);  // 500ms debounce delay
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Applications</h2>

      <input
        type="text"
        placeholder="Search by job title, company, location..."
        value={search}
        onChange={handleSearch}
        style={{
          padding: "8px",
          marginBottom: "20px",
          width: "300px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {loading && <p>Loading applications...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          {applications.length > 0 ? (
            <ul>
              {applications.map((app) => (
                <li key={app.id} style={{ marginBottom: "10px" }}>
                  <strong>{app.job.title}</strong> at {app.job.company}
                  <br />
                  Applied on: {new Date(app.applied_at).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No applications found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default MyApplications;
