const express = require("express");
const router = express.Router();
const { shards } = require("../db");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const logAction = require("../utils/logger");

// ADMIN ONLY: VIEW LOGS
router.get("/logs", auth, allowRoles("Admin"), (req, res) => {

  // log request attempt
  logAction(
    "VIEW_AUDIT_LOGS_REQUEST",
    `admin=${req.user.id}`
  );

  let results = [];
  let completed = 0;

  // 🔥 query ALL shards and merge
  shards.forEach((db) => {
    db.query(`
      SELECT 
        al.LogID,
        al.ActionType,
        al.TableName,
        al.RecordID,
        al.ActionTime,

        m.Name AS AdminName,

        r.Name AS RequesterName,
        c.CourseName

      FROM audit_log al

      JOIN member m ON al.PerformedBy = m.MemberID

      LEFT JOIN attendance_request ar 
        ON al.RecordID = ar.RequestID 
        AND al.TableName = 'Attendance_request'

      LEFT JOIN member r 
        ON ar.StudentID = r.MemberID

      LEFT JOIN attendance a 
        ON ar.AttendanceID = a.AttendanceID

      LEFT JOIN course c 
        ON a.CourseID = c.CourseID

      ORDER BY al.LogID DESC
    `,
    (err, data) => {

      if (!err && data) {
        results.push(...data);
      }

      completed++;

      if (completed === shards.length) {

        // 🔥 optional: sort merged results
        results.sort((a, b) => b.LogID - a.LogID);

        logAction(
          "VIEW_AUDIT_LOGS_SUCCESS",
          `admin=${req.user.id} records=${results.length}`
        );

        res.json(results);
      }
    });
  });

});

module.exports = router;