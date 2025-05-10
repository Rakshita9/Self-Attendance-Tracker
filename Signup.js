import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import "./Signup.css";

    const Signup = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Fetch existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    
        // Check if user already exists
        if (existingUsers.some(user => user.email.toLowerCase() === formData.email.toLowerCase())) {
            alert("User already exists! Redirecting to login.");
            navigate("/login");
            return;
        }
    
        // Add new user and save to localStorage
        existingUsers.push({ 
            name: formData.name.trim(), 
            email: formData.email.trim().toLowerCase(), 
            password: formData.password 
        });
    
        localStorage.setItem("users", JSON.stringify(existingUsers));
    
        console.log("Signup successful!", existingUsers);
        alert("Signup Successful! Redirecting to Login....");
        navigate("/login"); 
    };

    return (
        <div className="signup-container">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Signup</button>
        </form>
        </div>
    );
    };

    export default Signup;