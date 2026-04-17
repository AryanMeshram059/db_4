const express = require("express");
const cors = require("cors");
const db=require("./db");
const authRoutes =require("./routes/auth");
const auth = require("./middleware/auth");
const allowRoles = require("./middleware/role");
const requestRoutes = require("./routes/request");
const attendanceRoutes = require("./routes/attendance");
const userRoutes = require("./routes/user");
const logRoutes = require("./routes/logs");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", requestRoutes);
app.use("/api", userRoutes);
app.use("/api", logRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
// db test route
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) return res.send(err);
    res.send("DB working ✅");
  });
});

app.get("/api/protected", auth, (req, res) => {
  res.send(`Hello user ${req.user.id}, role: ${req.user.role}`);
});

app.get("/api/admin-only", auth, allowRoles("Admin"), (req, res) => {
  res.send("Welcome Admin 👑");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});