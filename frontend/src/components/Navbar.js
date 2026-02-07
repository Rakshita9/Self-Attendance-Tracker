import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("token") !== null
    );

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(localStorage.getItem("token") !== null);
        };

        window.addEventListener("authChanged", checkAuth);
        window.addEventListener("storage", checkAuth);

        return () => {
            window.removeEventListener("authChanged", checkAuth);
            window.removeEventListener("storage", checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("email");
        localStorage.removeItem("userName");

        setIsAuthenticated(false);
        window.dispatchEvent(new Event("authChanged"));
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="logo">Self Attendance Tracker</div>

            <div className="nav-right">
                {/* HOME */}
                {isAuthenticated ? (
                    <Link to="/" className="nav-link">Home</Link>
                ) : (
                    <span className="nav-link disabled-link">Home</span>
                )}

                {/* ABOUT always visible */}
                <Link to="/about" className="nav-link">About</Link>

                {/* AUTH BUTTONS */}
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-link">Signup</Link>
                    </>
                ) : (
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
