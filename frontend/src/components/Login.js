import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";
import "./Login.css";

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await login(email, password);

            // Store email and dispatch auth event
            localStorage.setItem("email", res.email);
            window.dispatchEvent(new Event("authChanged"));
            setIsAuthenticated(true);

            alert("Login successful!");
            navigate("/");  // Redirect to home page
        } catch (error) {
            console.error("Login error:", error.response ? error.response.data : error.message);
            alert(error.response?.data?.message || "Invalid email or password!");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <p className="signup-link">
                    <Link to="/signup">Don't have an account? Signup</Link>
                </p>
                <p className="forgot-password">
                    <Link to="/forgot-password">Forgot Password?</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;