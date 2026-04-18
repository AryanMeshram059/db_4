const express = require("express");
const cors = require("cors");
const { shards } = require("./db");

const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");
const allowRoles = require("./middleware/role");
const requestRoutes = require("./routes/request");
const attendanceRoutes = require("./routes/attendance");
const userRoutes = require("./routes/user");
const logRoutes = require("./routes/logs");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api", authRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", requestRoutes);
app.use("/api", userRoutes);
app.use("/api", logRoutes);

// health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// 🔥 test all shards
app.get("/test-db", (req, res) => {
  let completed = 0;
  let status = [];

  shards.forEach((db, i) => {
    db.query("SELECT 1", (err) => {
      if (err) {
        status.push(`Shard ${i}: ❌`);
      } else {
        status.push(`Shard ${i}: ✅`);
      }

      completed++;

      if (completed === shards.length) {
        res.json({
          message: "Shard status",
          shards: status
        });
      }
    });
  });
});

// protected routes
app.get("/api/protected", auth, (req, res) => {
  res.send(`Hello user ${req.user.id}, role: ${req.user.role}`);
});

app.get("/api/admin-only", auth, allowRoles("Admin"), (req, res) => {
  res.send("Welcome Admin 👑");
});

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000 🚀");
});