import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = (e) => {
        e.preventDefault();
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());

        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem("users", JSON.stringify(users));
            alert(" Password reset successful! Redirecting...");
            navigate("/login");
        } else {
            alert(" Email not found! Please sign up.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-400 to-blue-400">
            <div className="bg-white p-8 shadow-lg rounded-xl w-96">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4"> Reset Password</h2>

                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                    {/* Email Field */}
                    <input 
                        type="email" 
                        placeholder=" Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    />

                    {/* Password Field */}
                    <input 
                        type="password" 
                        placeholder=" Enter new password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 w-full"
                    />

                    {/* Reset Password Button */}
                    <button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-all duration-300 w-full shadow-md"
                    >
                        🔄 Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;