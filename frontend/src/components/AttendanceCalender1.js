import React, { useState, useEffect } from "react";
import "./AttendanceCalendar.css";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAttendance, saveAttendance, deleteAttendance } from "../api";

const AttendanceCalendar = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [attendance, setAttendance] = useState({});
    const { subject } = useParams();
    const navigate = useNavigate();

    const formatDate = (year, month, day) => {
        const mm = String(month + 1).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        return `${year}-${mm}-${dd}`;
    };

    const normalizeApiStatus = (status) => {
        const value = String(status || "").toLowerCase();
        if (value === "present") return "present";
        if (value === "absent") return "absent";
        return "";
    };

    const toApiStatus = (status) => {
        if (status === "present") return "Present";
        if (status === "absent") return "Absent";
        return "";
    };

    const parseAttendanceDate = (value) => {
        const raw = String(value || "").trim();
        if (!raw) return null;

        const ymdMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (ymdMatch) {
            return {
                year: Number(ymdMatch[1]),
                month: Number(ymdMatch[2]),
                day: Number(ymdMatch[3]),
            };
        }

        const parsed = new Date(raw);
        if (!Number.isNaN(parsed.getTime())) {
            return {
                year: parsed.getFullYear(),
                month: parsed.getMonth() + 1,
                day: parsed.getDate(),
            };
        }

        return null;
    };

    const loadAttendance = async () => {
        try {
            const res = await fetchAttendance();
            const mapped = {};
            let latestDate = null;

            (res.data || []).forEach((item) => {
                if (item.subject !== subject) return;

                const parsedDate = parseAttendanceDate(item.date);
                if (!parsedDate) return;

                const { year, month, day } = parsedDate;
                const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                if (!latestDate || dateKey > latestDate) {
                    latestDate = dateKey;
                }

                if (!mapped[subject]) mapped[subject] = {};
                if (!mapped[subject][year]) mapped[subject][year] = {};
                if (!mapped[subject][year][month - 1]) mapped[subject][year][month - 1] = {};

                mapped[subject][year][month - 1][day] = normalizeApiStatus(item.status);
            });

            setAttendance(mapped);

            if (latestDate) {
                const [latestYear, latestMonth] = latestDate.split("-").map(Number);
                setSelectedYear(latestYear);
                setSelectedMonth(latestMonth - 1);
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, [subject]);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

    // Toggle attendance status
    const toggleAttendance = async (day) => {
        const currentStatus = attendance[subject]?.[selectedYear]?.[selectedMonth]?.[day] || "";
        const newStatus =
            currentStatus === "present" ? "absent" :
                currentStatus === "absent" ? "" : "present";

        const date = formatDate(selectedYear, selectedMonth, day);

        try {
            if (newStatus) {
                await saveAttendance(subject, date, toApiStatus(newStatus));
            } else {
                await deleteAttendance(subject, date);
            }

            setAttendance((prev) => {
                const prevSubjectData = prev[subject] || {};
                const prevYearData = prevSubjectData[selectedYear] || {};
                const prevMonthData = prevYearData[selectedMonth] || {};

                const updatedMonthData = { ...prevMonthData };

                if (newStatus) {
                    updatedMonthData[day] = newStatus;
                } else {
                    delete updatedMonthData[day];
                }

                return {
                    ...prev,
                    [subject]: {
                        ...prevSubjectData,
                        [selectedYear]: {
                            ...prevYearData,
                            [selectedMonth]: updatedMonthData,
                        },
                    },
                };
            });
        } catch (error) {
            console.error("Error saving attendance:", error);
            alert("Attendance save failed. Please try again.");
        }
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
