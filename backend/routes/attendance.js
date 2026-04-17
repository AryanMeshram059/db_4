const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const logAction = require("../utils/logger");

// GET attendance
router.get("/attendance/:courseId", auth, (req, res) => {
  const courseId = req.params.courseId;

  // Log request start
  logAction(
    "VIEW_ATTENDANCE_REQUEST",
    `user=${req.user.id} role=${req.user.role} course=${courseId}`
  );

  if (req.user.role === "Student") {

    db.query(`
      SELECT 
        a.*, 
        l.SessionDate, 
        l.StartTime, 
        l.EndTime,
        ar.RequestID,
        ar.Status AS RequestStatus

      FROM attendance a
      JOIN lecturelog l 
        ON a.SessionID = l.SessionID

      LEFT JOIN attendance_request ar 
        ON a.AttendanceID = ar.AttendanceID 
        AND ar.StudentID = ?

      WHERE a.StudentID = ? 
        AND a.CourseID = ?
    `,
    [req.user.id, req.user.id, courseId],
    (err, result) => {
      if (err) {
        logAction(
          "VIEW_ATTENDANCE_ERROR",
          `user=${req.user.id} course=${courseId}`
        );
        return res.status(500).send(err);
      }

      logAction(
        "VIEW_ATTENDANCE_SUCCESS",
        `user=${req.user.id} role=Student course=${courseId}`
      );

      res.json(result);
    });

  } else {

    db.query(`
      SELECT 
        a.*, 
        l.SessionDate, 
        l.StartTime, 
        l.EndTime, 
        m.Name

      FROM attendance a
      JOIN lecturelog l 
        ON a.SessionID = l.SessionID

      JOIN member m 
        ON a.StudentID = m.MemberID

      WHERE a.CourseID = ?
    `,
    [courseId],
    (err, result) => {
      if (err) {
        logAction(
          "VIEW_ATTENDANCE_ERROR",
          `user=${req.user.id} course=${courseId}`
        );
        return res.status(500).send(err);
      }

      logAction(
        "VIEW_ATTENDANCE_SUCCESS",
        `user=${req.user.id} role=${req.user.role} course=${courseId}`
      );

      res.json(result);
    });

  }
});


//  GET courses
router.get("/courses", auth, (req, res) => {

  logAction(
    "VIEW_COURSES_REQUEST",
    `user=${req.user.id} role=${req.user.role}`
  );

  db.query(`
    SELECT c.CourseID, c.CourseName
    FROM enrollment e
    JOIN course c ON e.CourseID = c.CourseID
    WHERE e.StudentID = ?
  `,
  [req.user.id],
  (err, result) => {
    if (err) {
      logAction(
        "VIEW_COURSES_ERROR",
        `user=${req.user.id}`
      );
      return res.status(500).send(err);
    }

    logAction(
      "VIEW_COURSES_SUCCESS",
      `user=${req.user.id}`
    );

    res.json(result);
  });

});

module.exports = router;