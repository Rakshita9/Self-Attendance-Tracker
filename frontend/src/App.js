import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchSubjects } from "./api";

import Navbar from "./components/Navbar";
import SubjectPanel from "./components/SubjectPanel";
import AttendanceCalender1 from "./components/AttendanceCalender1";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import About from "./components/about";
import ForgotPassword from "./components/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

const App = () => {
  const [subjects, setSubjects] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );

  /* ---------------- FETCH SUBJECTS ---------------- */
  const loadSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetchSubjects();
      setSubjects(res.data.map((s) => s.name || s));
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  /* ---------------- AUTH EFFECT ---------------- */
  useEffect(() => {
    if (isAuthenticated) {
      loadSubjects();
    } else {
      // SECURITY: clear previous user data
      setSubjects([]);
    }
  }, [isAuthenticated]);

  /* ---------------- LOGOUT HANDLER ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("email");
    localStorage.removeItem("userName");

    setIsAuthenticated(false);
    setSubjects([]);
  };

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        onLogout={handleLogout}
      />

      <div className="container mx-auto p-4">
        <Routes>

          {/* ---------- PROTECTED HOME ---------- */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SubjectPanel
                  subjects={subjects}
                  setSubjects={setSubjects}
                  addSubject={(sub) => setSubjects([...subjects, sub])}
                  deleteSubject={(sub) =>
                    setSubjects(subjects.filter((s) => s !== sub))
                  }
                />
              </ProtectedRoute>
            }
          />

          {/* ---------- PROTECTED CALENDAR ---------- */}
          <Route
            path="/calendar/:subject"
            element={
              <ProtectedRoute>
                <AttendanceCalender1 />
              </ProtectedRoute>
            }
          />

          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

        </Routes>
      </div>

      <Footer />
    </Router>
  );
};

export default App;
