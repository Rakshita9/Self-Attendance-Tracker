    import React from "react";
    import "./about.css";

    const about = () => {
    return (
        <div className="about-container">
        <h1>About Self-Attendance Tracker</h1>
        <p>
            Welcome to the <strong>Self-Attendance Tracker</strong>, a simple and efficient web application 
            designed to help students track their class attendance with ease.
        </p>

        <h2>Features</h2>
        <ul>
            <li> Calendar view with color-coded attendance (Green for Present, Red for Absent).</li>
            <li> Subject-wise attendance selection and management.</li>
            <li> Real-time attendance statistics including total, present, absent, and percentage.</li>
            <li> Ability to delete subjects and update records easily.</li>
            <li> Responsive UI with a pink and sky-blue gradient theme.</li>
            <li> Secure login & signup functionality.</li>
        </ul>

        <h2>How It Works?</h2>
        <ol>
            <li>Sign up and log in to your account.</li>
            <li>Add subjects and start marking attendance.</li>
            <li>View your progress through an interactive calendar.</li>
            <li>Analyze your attendance statistics for better planning.</li>
        </ol>

        <h2>Why Use This?</h2>
        <p>
            Tracking attendance manually can be tedious. This app helps you monitor attendance efficiently 
            with a user-friendly interface. Stay on top of your academics with ease!
        </p>

    
        </div>
    );
    };

    export default about;