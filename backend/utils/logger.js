const fs = require("fs");
const path = require("path");

// Path to audit.log
const logFilePath = path.join(__dirname, "../logs/audit.log");

// Ensure logs folder + file exist
const logDir = path.dirname(logFilePath);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "");
}

// Function to write logs
function logAction(action, details = "") {
  const timestamp = new Date().toISOString();
  const log = `[${timestamp}] ${action}: ${details}\n`;

  fs.appendFile(logFilePath, log, (err) => {
    if (err) {
      console.error("Logging error:", err);
    }
  });
}

module.exports = logAction;