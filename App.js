import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SubjectPanel from "./components/SubjectPanel";
import AttendanceCalender1 from "./components/AttendanceCalender1";
import Stats from "./components/Stats";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import About from "./components/about";
import ForgotPassword from "./components/ForgotPassword"
import "./App.css";

const App = () => {
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false); //  Track login state


  // Check if user is already logged in 
  useEffect(() => {
    const loggedIn = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(loggedIn);
  }, []);

  const addSubject = (subject) => {
    if (subject && !subjects.includes(subject)) setSubjects([...subjects, subject]);
  };

  const deleteSubject = (subject) => {
    setSubjects(subjects.filter((s) => s !== subject));
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className="container mx-auto p-4">
        <Routes>
          {/*  Protected Home Route - Redirects to Login if Not Authenticated */}
          <Route path="/" element={isAuthenticated ? (
                <>
                  <SubjectPanel subjects={subjects} addSubject={addSubject} deleteSubject={deleteSubject} />
                  {/* <AttendanceCalender1 attendance={attendance} setAttendance={setAttendance} />
                  <Stats attendance={attendance} /> */}
                </>
              ) : (<Navigate to="/login" replace/>)
            } />
      <Route path="/calendar/:subject" element={<AttendanceCalender1 />} />
          {/* Login & Signup Routes */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/calendar/:subject" element={<AttendanceCalender1 />} /> */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;