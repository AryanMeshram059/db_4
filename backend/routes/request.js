const express = require("express");
const router = express.Router();
const { getDB, shards } = require("../db");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const logAction = require("../utils/logger");


// CREATE REQUEST (GLOBAL LIMIT = 10 per day)
router.post("/request", auth, (req, res) => {
  const { studentId, attendanceId, reason } = req.body;

  if (!studentId || !attendanceId || !reason) {
    return res.status(400).send("Missing fields ❌");
  }

  const shardId = studentId % 3;
  console.log("🔹 INSERT → StudentID:", studentId, "| Shard:", shardId);

  const db = getDB(studentId);

  db.beginTransaction((err) => {
    if (err) return res.status(500).send("Transaction error ❌");

    db.query(
      `INSERT INTO attendance_request 
       (AttendanceID, StudentID, Reason, Status)
       VALUES (?, ?, ?, 'Pending')`,
      [attendanceId, studentId, reason],
      (err, result) => {

        if (err) {
          console.error("REAL ERROR:", err);
          return db.rollback(() => {
            return res.status(500).send("Insert failed ❌");
          });
        }

        const requestId = result.insertId;

        // FAILURE SIMULATION
        if (reason.includes("FAIL")) {
          return db.rollback(() => {
            logAction("ROLLBACK_EXECUTED", `requestId=${requestId}`);
            return res.status(500).json({
              message: "Simulated failure → rollback executed ❌"
            });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              return res.status(500).send("Commit failed ❌");
            });
          }

          logAction("REQUEST_CREATED", `requestId=${requestId}`);

          res.json({
            message: "Request created (sharded) ✅",
            requestId
          });
        });
      }
    );
  });
});


// VIEW REQUESTS
router.get("/request", auth, (req, res) => {

  if (req.user.role === "Student") {

    const shardId = req.user.id % 3;
    console.log("🔹 LOOKUP → StudentID:", req.user.id, "| Shard:", shardId);

    const db = getDB(req.user.id);

    db.query(`
      SELECT 
        ar.*,
        m.Name AS StudentName,
        c.CourseName
      FROM attendance_request ar
      JOIN member m ON ar.StudentID = m.MemberID
      JOIN attendance a ON ar.AttendanceID = a.AttendanceID
      JOIN course c ON a.CourseID = c.CourseID
      WHERE ar.StudentID = ?
    `,
    [req.user.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    });

  } else {

    console.log("🔸 ADMIN → Querying ALL shards");

    let results = [];
    let completed = 0;

    shards.forEach((db, i) => {
      console.log("   ↳ Querying shard:", i);

      db.query(`
        SELECT 
          ar.*,
          m.Name AS StudentName,
          c.CourseName
        FROM attendance_request ar
        JOIN member m ON ar.StudentID = m.MemberID
        JOIN attendance a ON ar.AttendanceID = a.AttendanceID
        JOIN course c ON a.CourseID = c.CourseID
        ORDER BY ar.RequestDate DESC
      `,
      (err, data) => {

        if (!err && data) results.push(...data);

        completed++;
        if (completed === shards.length) {
          res.json(results);
        }
      });
    });

  }
});


// UPDATE REQUEST (Race Condition Safe)
router.put("/request/:id", auth, allowRoles("Admin"), (req, res) => {
  const { status } = req.body;
  const requestId = req.params.id;

  console.log("🔸 ADMIN UPDATE → Searching all shards");

  let found = false;

  shards.forEach((db, i) => {
    console.log("   ↳ Checking shard:", i);

    db.query(
      "SELECT StudentID FROM attendance_request WHERE RequestID = ?",
      [requestId],
      (err, result) => {

        if (result && result.length > 0 && !found) {
          found = true;

          const studentId = result[0].StudentID;
          const shardId = studentId % 3;

          console.log("🔹 UPDATE → Found in shard:", shardId);

          const targetDB = getDB(studentId);

          targetDB.query(
            `UPDATE attendance_request
             SET Status = ?, ProcessedBy = ?
             WHERE RequestID = ? AND Status = 'pending'`,
            [status, req.user.id, requestId],
            (err, updateResult) => {
              if (err) return res.status(500).send("Database error ❌");

              if (updateResult.affectedRows === 0) {
                return res.send("Already processed by another admin ❌");
              }

              res.send("Request updated safely (sharded) ✅");
            }
          );
        }
      }
    );
  });
});

module.exports = router;