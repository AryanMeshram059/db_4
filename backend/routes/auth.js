const express = require("express");
const router = express.Router();
const { shards } = require("../db");
const jwt = require("jsonwebtoken");
const logAction = require("../utils/logger");

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  let found = false;
  let completed = 0;

  console.log("🔸 LOGIN → Searching ALL shards");

  // 🔥 search user across ALL shards
  shards.forEach((db, index) => {

    console.log("   ↳ Checking shard:", index);

    db.query(
      "SELECT * FROM member WHERE Email = ?",
      [email],
      (err, result) => {

        if (err) {
          logAction("LOGIN_ERROR", `email=${email} DB_ERROR`);
          return res.status(500).send("Server error");
        }

        // if user found in this shard
        if (result.length > 0 && !found) {
          found = true;

          const user = result[0];
          console.log("🔹 LOGIN → Found user in shard:", user.MemberID%3);

          

          // Wrong password
          if (password !== user.PasswordHash) {
            logAction("USER_LOGIN", `email=${email} FAILED (Wrong password)`);
            return res.status(401).send("Invalid password");
          }

          // Success
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
            `user=${email} role=${user.Role} SUCCESS shard=${index}`
          );

          return res.json({ token });
        }

        completed++;

        // after checking all shards → user not found
        if (completed === shards.length && !found) {
          logAction("USER_LOGIN", `email=${email} FAILED (User not found)`);
          return res.status(401).send("User not found");
        }
      }
    );
  });
});

module.exports = router;