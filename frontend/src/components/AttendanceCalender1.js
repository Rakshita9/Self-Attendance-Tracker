import React, { useState, useEffect } from "react";
import "./AttendanceCalendar.css";
import { useParams, useNavigate } from "react-router-dom";

const AttendanceCalendar = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [attendance, setAttendance] = useState({});
    const { subject } = useParams();
    const navigate = useNavigate();

    const user = localStorage.getItem("email") || "guest";
    const localStorageKey = `attendance_${user}_${subject}`;

    // Load attendance on mount
    useEffect(() => {
        const savedAttendance = localStorage.getItem(localStorageKey);
        if (savedAttendance) {
            setAttendance(JSON.parse(savedAttendance));
        }
    }, [localStorageKey]);

    // Save attendance on change
    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(attendance));
    }, [attendance, localStorageKey]);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

    // Toggle attendance status
    const toggleAttendance = (day) => {
        setAttendance((prev) => {
            const prevSubjectData = prev[subject] || {};
            const prevYearData = prevSubjectData[selectedYear] || {};
            const prevMonthData = prevYearData[selectedMonth] || {};

            const currentStatus = prevMonthData[day] || "";
            const newStatus =
                currentStatus === "present" ? "absent" :
                    currentStatus === "absent" ? "" : "present";

            return {
                ...prev,
                [subject]: {
                    ...prevSubjectData,
                    [selectedYear]: {
                        ...prevYearData,
                        [selectedMonth]: {
                            ...prevMonthData,
                            [day]: newStatus,
                        },
                    },
                },
            };
        });
    };

    const currentMonthAttendance = attendance[subject]?.[selectedYear]?.[selectedMonth] || {};
    const presentCount = Object.values(currentMonthAttendance).filter((s) => s === "present").length;
    const absentCount = Object.values(currentMonthAttendance).filter((s) => s === "absent").length;
    const totalDaysMarked = presentCount + absentCount;
    const attendancePercentage = totalDaysMarked ? ((presentCount / totalDaysMarked) * 100).toFixed(2) : 0;

    return (
        <div className="calendar-container">
            <div style={{ textAlign: "left", marginBottom: "10px" }}>
                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                    style={{
                        fontSize: "1.2rem",
                        padding: "6px 12px",
                        borderRadius: "5px",
                        background: "#eee",
                        border: "1px solid #ccc",
                        cursor: "pointer"
                    }}
                >
                    ← Back
                </button>
            </div>

            <h2>Attendance Calendar - {subject}</h2>

            <div className="calendar-controls">
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                    {months.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                    ))}
                </select>

                <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                    {[...Array(15)].map((_, i) => {
                        const year = new Date().getFullYear() + i;
                        return <option key={year} value={year}>{year}</option>;
                    })}
                </select>
            </div>

            <div className="calendar-header">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="calendar-day-header">{day}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {[...Array(firstDay)].map((_, i) => (
                    <div key={i} className="empty"></div>
                ))}

                {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const status = attendance[subject]?.[selectedYear]?.[selectedMonth]?.[day] || "";
                    return (
                        <div
                            key={day}
                            className={`calendar-day ${status}`}
                            onClick={() => toggleAttendance(day)}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            <div className="attendance-stats">
                <p>✅ Present: {presentCount}</p>
                <p>❌ Absent: {absentCount}</p>
                <p>📆 Total Classes: {totalDaysMarked}</p>
                <p>📊 Attendance Percentage: {attendancePercentage}%</p>
            </div>
        </div>
    );
};

export default AttendanceCalendar;
