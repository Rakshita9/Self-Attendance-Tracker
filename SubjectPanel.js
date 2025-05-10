import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SubjectsPanel.css";

const SubjectsPanel = () => {
    const [subject, setSubject] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const navigate = useNavigate();

    // Load subjects from localStorage when component mounts
    useEffect(() => {
        const savedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
        setSubjects(savedSubjects);
    }, []);

    // Save subjects to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("subjects", JSON.stringify(subjects));
    }, [subjects]);

    const handleAddSubject = () => {
        if (subject.trim() === "") return; // Prevent empty subjects

        const newSubjects = [...subjects, subject];
        setSubjects(newSubjects);
        setSubject(""); // Clear input field
    };

    const handleDelete = (subj) => {
        setSubjectToDelete(subj);
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        const updatedSubjects = subjects.filter((s) => s !== subjectToDelete);
        setSubjects(updatedSubjects);
        setShowConfirm(false);
        setSubjectToDelete(null);

        // Remove related attendance data
        const attendanceData = JSON.parse(localStorage.getItem("attendance")) || {};
        delete attendanceData[subjectToDelete];
        localStorage.setItem("attendance", JSON.stringify(attendanceData));
    };

    return (
        <div className="subjects-panel p-4 bg-gradient-to-r from-pink-300 to-sky-300 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Subjects</h2>

            {/* Input Field */}
            <input
                type="text"
                placeholder="Enter subject name"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            />

            {/* Add Subject Button */}
            <button className="add-btn" onClick={handleAddSubject}>Add Subject</button>

            {/* Display Subjects */}
            <ul className="mt-4">
                {subjects.map((subj, index) => (
                    <li key={index} className="subject-item">
                        {/* Subject Click to Navigate */}
                        <span 
                            className="subject-name"
                            onClick={() => navigate(`/calendar/${subj}`)}
                        >
                            {subj}
                        </span>
                        <button className="delete-btn" onClick={() => handleDelete(subj)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* Delete Confirmation Popup */}
            {showConfirm && (
                <div className="popup ">
                    <div className="popup-content">
                        <p> If you delete "{subjectToDelete}", all related data will be removed. Are you sure?</p>
                        <button className="delete-btn" onClick={confirmDelete}>Confirm</button>
                        <button className="add-btn" onClick={() => setShowConfirm(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectsPanel;