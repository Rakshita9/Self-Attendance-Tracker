import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";
import "./Signup.css";

const Signup = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.email || !formData.password) {
            alert("Email and password are required!");
            return;
        }

        if (formData.password.length < 6) {
            alert("Password must be at least 6 characters!");
            return;
        }

        try {
            const res = await signup(formData.email.trim().toLowerCase(), formData.password);
            console.log("✅ Signup successful:", res);

            alert("Signup successful! Redirecting to login...");
            navigate("/login");
        } catch (err) {
            console.error("❌ Signup error:", err);
            const errorMsg = err.response?.data?.message || err.message || "Signup failed!";
            alert(errorMsg);
        }
    };

    return (
        <div className="signup-container">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;