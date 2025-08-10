import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container text-center mt-5">
      <h1>Welcome to JobPortal</h1>
      <p className="lead">
        Find your dream job or hire the best talent easily.
      </p>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link to="/jobs" className="btn btn-primary btn-lg">
          Browse Jobs
        </Link>
        <Link to="/login" className="btn btn-outline-primary btn-lg">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;
