const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const auth = require("../middleware/auth");

// GET current user
router.get("/me", auth, (req, res) => {

  const db = getDB(req.user.id);
  console.log("Using shard:", req.user.id % 3);

  db.query(
    "SELECT MemberID, Name, Email, Role FROM member WHERE MemberID = ?",
    [req.user.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result[0]);
    }
  );

});

module.exports = router;