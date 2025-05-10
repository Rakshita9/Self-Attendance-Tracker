import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



const app = express();
app.use(express.json());
dotenv.config();



//  Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());


//  MongoDB Connection
mongoose.connect("mongodb://localhost:27017/attendance", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(" Connected to MongoDB"))
    .catch((err) => console.log(" MongoDB Connection Error:", err));


//  User Schema & Model
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);




//  Subject Schema 
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
const Subject = mongoose.model("Subject", subjectSchema);





//  Attendance Schema 
const attendanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["Present", "Absent", "Holiday"], required: true },
});
const Attendance = mongoose.model("Attendance", attendanceSchema);





//  Authentication Middleware
const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: " Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: " Invalid Token" });
    }
};




//  User Signup 
app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: " User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.json({ message: " Signup successful" });
    } catch (err) {
        res.status(500).json({ message: " Signup error", error: err.message });
    }
});

app.get("/signup", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ message: " User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: " Error fetching user data", error: error.message });
    }
});





//  User Login 
app.post("/login", async (req, res) => {
    console.log("Login request received:", req.body);
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: " Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.json({ message: " Login successful", token, email: user.email });
    } catch (err) {
        res.status(500).json({ message: " Login error", error: err.message });
    }
});






app.get("/login", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ message: " User not found" });
        res.json(login);
    } catch (error) {
        res.status(500).json({ message: " Error fetching credentials", error: error.message });
    }
});





//  POST: Add Subject 
app.post("/subject", authenticate, async (req, res) => {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: " Subject name is required" });

    try {
        const existingSubject = await Subject.findOne({ name, userId: req.user.id });

        if (existingSubject) return res.status(400).json({ message: " Subject already exists" });

        const newSubject = new Subject({ name, userId: req.user.id });
        await newSubject.save();
        res.status(201).json({ message: " Subject added successfully", subject: newSubject });
    } catch (error) {
        res.status(500).json({ message: " Error saving subject", error: error.message });
    }
});




//  GET: Fetch Subjects 
app.get("/subject", authenticate, async (req, res) => {
    try {
        const subjects = await Subject.find({ userId: req.user.id });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: " Error fetching subjects", error: error.message });
    }
});




//  DELETE: Remove Subject & Related Attendance
app.delete("/subjects/:name", authenticate, async (req, res) => {
    try {
        await Subject.deleteOne({ name: req.params.name, userId: req.user.id });
        await Attendance.deleteMany({ subject: req.params.name, userId: req.user.id });
        res.json({ message: " Subject and related attendance deleted" });
    } catch (err) {
        res.status(500).json({ message: " Error deleting subject", error: err.message });
    }
});





//  POST: Save Attendance 
app.post("/attendance", authenticate, async (req, res) => {
    const { subject, date, status } = req.body;

    try {
        const existingAttendance = await Attendance.findOne({ subject, date, userId: req.user.id });

        if (existingAttendance) {
            existingAttendance.status = status;
            await existingAttendance.save();
        } else {
            const newAttendance = new Attendance({ subject, date, status, userId: req.user.id });
            await newAttendance.save();
        }

        res.json({ message: " Attendance saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: " Error saving attendance", error: error.message });
    }
});



app.get("/attendance", authenticate, async (req, res) => {
    try {
        const data = await Attendance.find({ userId: req.user.id });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: " Error fetching attendance", error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});
