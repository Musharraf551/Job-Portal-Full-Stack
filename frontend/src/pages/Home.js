import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("access_token");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (token) {
      fetch("http://127.0.0.1:8000/api/profile/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,  // For JWT Authentication
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch user");
          }
          return res.json();
        })
        .then((data) => {
          setUsername(data.username);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [token]);

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container text-center">

        {/* Hero Section */}
        <h1 className="display-4 fw-bold text-primary mb-3">
          {token ? (
            <>Welcome back, <span className="text-dark">{username}</span> 👋</>
          ) : (
            <>Welcome to <span className="text-dark">JobPortal</span></>
          )}
        </h1>
        <p className="lead text-muted mb-4">
          Find your dream job or hire the best talent — all in one place.
        </p>

        {/* Action Buttons */}
        <div className="d-flex justify-content-center gap-3 mb-5">
          <Link to="/jobs" className="btn btn-primary btn-lg px-4">
            <i className="bi bi-briefcase-fill me-2"></i> Browse Jobs
          </Link>
          {token ? (
            <Link to="/my-applications" className="btn btn-success btn-lg px-4">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary btn-lg px-4">
                <i className="bi bi-box-arrow-in-right me-2"></i> Login
              </Link>
              <Link to="/register" className="btn btn-warning btn-lg px-4">
                <i className="bi bi-person-plus-fill me-2"></i> Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Features Section */}
        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm bg-white h-100">
              <i className="bi bi-search display-5 text-primary"></i>
              <h4 className="mt-3">Easy Job Search</h4>
              <p className="text-muted">Filter by location, role, and salary to find your perfect job quickly.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm bg-white h-100">
              <i className="bi bi-people-fill display-5 text-success"></i>
              <h4 className="mt-3">Hire Top Talent</h4>
              <p className="text-muted">Post jobs and connect with skilled professionals across industries.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm bg-white h-100">
              <i className="bi bi-shield-check display-5 text-warning"></i>
              <h4 className="mt-3">Secure & Reliable</h4>
              <p className="text-muted">Your data and transactions are protected with advanced security.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
