import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import Navbar from "./components/Navbar";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/my-applications" element={<MyApplications />} />
      </Routes>
    </Router>
  );
}

export default App;
