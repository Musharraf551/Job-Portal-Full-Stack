// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#eee' }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/login">Login</Link> |{" "}
      <Link to="/jobs">Jobs</Link> |{" "}
      <Link to="/my-applications">My Applications</Link>
    </nav>
  );
}

export default Navbar;
