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

        try {
            await signup(formData.email.trim().toLowerCase(), formData.password);

            alert("Signup successful! Redirecting to login...");
            navigate("/login");
        } catch (err) {
            console.error("Signup error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Signup failed!");
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