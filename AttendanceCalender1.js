    import React, { useState, useEffect } from "react";
    import "./AttendanceCalendar.css";

    const AttendanceCalendar = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [attendance, setAttendance] = useState({}); // Stores attendance status
    

    useEffect(() => {
        const savedAttendance = localStorage.getItem("attendance");
        if (savedAttendance) {
            setAttendance(JSON.parse(savedAttendance));
        }
    }, []);

    useEffect(() => {
        // Save attendance to localStorage whenever it updates
        localStorage.setItem("attendance", JSON.stringify(attendance));
    }, [attendance]);




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
            const newStatus = prev[selectedYear]?.[selectedMonth]?.[day] === "present" 
                ? "absent" 
                : prev[selectedYear]?.[selectedMonth]?.[day] === "absent" 
                ? "" 
                : "present";
    
            return {
                ...prev,
                [selectedYear]: {
                    ...prev[selectedYear],
                    [selectedMonth]: {
                        ...prev[selectedYear]?.[selectedMonth],
                        [day]: newStatus,
                    },
                },
            };
        });
    };

    
    // Calculate statistics
    const currentMonthAttendance = attendance[selectedYear]?.[selectedMonth] || {};

    const presentCount = Object.values(currentMonthAttendance).filter((status) => status === "present").length;
    const absentCount = Object.values(currentMonthAttendance).filter((status) => status === "absent").length;
    const totalDaysMarked = presentCount + absentCount;
    const attendancePercentage = totalDaysMarked ? ((presentCount / totalDaysMarked) * 100).toFixed(2) : 0;

    return (
        <div className="calendar-container">
        <h2>Attendance Calendar</h2>

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

        {/* Weekday Headers */}
        <div className="calendar-header">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-day-header">{day}</div>
            ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
            {[...Array(firstDay)].map((_, i) => (
            <div key={i} className="empty"></div>
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            return (
                <div
                key={day}
                className={`calendar-day ${attendance[selectedYear]?.[selectedMonth]?.[day] || ""}`}

                onClick={() => toggleAttendance(day)}
                >
                {day}
                </div>
            );
            })}
        </div>


{/* Attendance Statistics */}
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
