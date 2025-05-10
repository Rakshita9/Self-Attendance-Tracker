
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
        };
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        setIsAuthenticated(false); 
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="logo">Self Attendance Tracker</div>
            <div className="nav-right">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/about" className="nav-link">About</Link>

                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-link">Signup</Link>
                    </>
                ) : (
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;