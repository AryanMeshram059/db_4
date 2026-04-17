const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const logAction = require("../utils/logger");

//  ADMIN ONLY: VIEW LOGS
router.get("/logs", auth, allowRoles("Admin"), (req, res) => {

  //  Log request attempt
  logAction(
    "VIEW_AUDIT_LOGS_REQUEST",
    `admin=${req.user.id}`
  );

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
  (err, result) => {
    if (err) {
      logAction(
        "VIEW_AUDIT_LOGS_ERROR",
        `admin=${req.user.id}`
      );
      return res.status(500).send(err);
    }

    logAction(
      "VIEW_AUDIT_LOGS_SUCCESS",
      `admin=${req.user.id} records=${result.length}`
    );

    res.json(result);
  });

});

module.exports = router;