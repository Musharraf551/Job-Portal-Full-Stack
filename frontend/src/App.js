import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import JobDetail from './pages/JobDetail';
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import JobPost from './pages/JobPost';



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/job-post" element={<JobPost />} />
      </Routes>
    </Router>
  );
}

export default App;
