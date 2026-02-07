import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SubjectsPanel.css";

const SubjectsPanel = () => {
    const [subject, setSubject] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // ✅ Fetch subjects from backend on mount
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get("http://localhost:5000/subject", {
                    headers: { Authorization: token },
                });
                setSubjects(res.data);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        fetchSubjects();
    }, [token]);

    // ✅ Add subject via backend
    const handleAddSubject = async () => {
        if (subject.trim() === "") return;

        try {
            const res = await axios.post(
                "http://localhost:5000/subject",
                { name: subject },
                { headers: { Authorization: token } }
            );
            setSubjects([...subjects, res.data.subject]);
            setSubject("");
        } catch (error) {
            alert(error.response?.data?.message || "Error adding subject");
        }
    };

    const handleDelete = (subj) => {
        setSubjectToDelete(subj.name); // subj is an object now
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/subjects/${subjectToDelete}`, {
                headers: { Authorization: token },
            });
            setSubjects(subjects.filter((s) => s.name !== subjectToDelete));
            setShowConfirm(false);
            setSubjectToDelete(null);
        } catch (error) {
            alert("Error deleting subject");
        }
    };

    return (
        <div className="subjects-panel p-4 bg-gradient-to-r from-pink-300 to-sky-300 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Subjects</h2>

            <input
                type="text"
                placeholder="Enter subject name"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            />

            <button className="add-btn" onClick={handleAddSubject}>Add Subject</button>

            <ul className="mt-4">
                {subjects.map((subj, index) => (
                    <li key={index} className="subject-item">
                        <span
                            className="subject-name"
                            onClick={() => navigate(`/calendar/${subj.name}`)}
                        >
                            {subj.name}
                        </span>
                        <button className="delete-btn" onClick={() => handleDelete(subj)}>Delete</button>
                    </li>
                ))}
            </ul>

            {showConfirm && (
                <div className="popup">
                    <div className="popup-content">
                        <p>
                            If you delete "{subjectToDelete}", all related data will be removed. Are you sure?
                        </p>
                        <button className="delete-btn" onClick={confirmDelete}>Confirm</button>
                        <button className="add-btn" onClick={() => setShowConfirm(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectsPanel;
