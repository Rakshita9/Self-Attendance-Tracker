    // src/api.js
    import axios from 'axios';

    const API_URL = 'http://localhost:5000'; // Your backend URL

    // Set up Axios instance
    const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    });

    // Function to handle user signup
    export const signup = async (email, password) => {
    return await api.post('/signup', { email, password });
    };

    // Function to handle user login
    export const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    localStorage.setItem('isAuthenticated', 'true'); // Set authentication state
    localStorage.setItem('token', response.data.token); // Store token
    return response.data;
    };

    // Function to fetch subjects
    export const fetchSubjects = async () => {
    const token = localStorage.getItem('token');
    return await api.get('/subjects', {
        headers: { Authorization: token },
    });
    };

    // Function to add a subject
    export const addSubject = async (name) => {
    const token = localStorage.getItem('token');
    return await api.post('/subjects', { name }, {
        headers: { Authorization: token },
    });
    };

    // Function to delete a subject
    export const deleteSubject = async (name) => {
    const token = localStorage.getItem('token');
    return await api.delete(`/subjects/${name}`, {
        headers: { Authorization: token },
    });
    };

    // Function to save attendance
    export const saveAttendance = async (subject, date, status) => {
    const token = localStorage.getItem('token');
    return await api.post('/attendance', { subject, date, status }, {
        headers: { Authorization: token },
    });
    };

    // Function to fetch attendance
    export const fetchAttendance = async () => {
    const token = localStorage.getItem('token');
    return await api.get('/attendance', {
        headers: { Authorization: token },
    });
    };