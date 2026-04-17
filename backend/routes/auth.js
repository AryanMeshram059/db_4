const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const logAction = require("../utils/logger");

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM member WHERE Email = ?",
    [email],
    (err, result) => {
      if (err) {
        logAction("LOGIN_ERROR", `email=${email} DB_ERROR`);
        return res.status(500).send("Server error");
      }

      //  User not found
      if (result.length === 0) {
        logAction("USER_LOGIN", `email=${email} FAILED (User not found)`);
        return res.status(401).send("User not found");
      }

      const user = result[0];

      // Wrong password
      if (password !== user.PasswordHash) {
        logAction("USER_LOGIN", `email=${email} FAILED (Wrong password)`);
        return res.status(401).send("Invalid password");
      }

      //  Success
      const token = jwt.sign(
        {
          id: user.MemberID,
          role: user.Role
        },
        "secretkey",
        { expiresIn: "1h" }
      );

      logAction(
        "USER_LOGIN",
        `user=${email} role=${user.Role} SUCCESS`
      );

      res.json({ token });
    }
  );  
});

module.exports = router;