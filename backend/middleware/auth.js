const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  let token = req.headers.authorization;

  console.log("AUTH HEADER:", token);

  if (!token) {
    return res.status(401).send("No token provided");
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    console.log("DECODED:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return res.status(401).send("Invalid token");
  }
}

module.exports = auth;