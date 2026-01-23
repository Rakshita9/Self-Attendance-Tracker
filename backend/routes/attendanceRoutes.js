import express from "express";
import Attendance from "../models/Attendance.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

router.post("/mark", authenticate, async (req, res) => {
    const { status } = req.body;
    const attendance = new Attendance({ userId: req.user.id, status });
    await attendance.save();
    res.json({ message: "Attendance marked successfully" });
});

export default router;