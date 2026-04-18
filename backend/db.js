const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "aryan0509",
//   database: "attendance_management_db"
// });
const shards = [
  mysql.createConnection({
    host: "10.0.116.184",
    port: 3307,
    user: "Mateen_Sharief",
    password: "password@123",
    database: "Mateen_Sharief"
  }),
  mysql.createConnection({
    host: "10.0.116.184",
    port: 3308,
    user: "Mateen_Sharief",
    password: "password@123",
    database: "Mateen_Sharief"
  }),
  mysql.createConnection({
    host: "10.0.116.184",
    port: 3309,
    user: "Mateen_Sharief",
    password: "password@123",
    database: "Mateen_Sharief"
  })
];

// db.connect((err) => {
//   if (err) {
//     console.error("DB connection failed:", err);
//   } else {
//     console.log("Connected to MySQL");
//   }
// });
shards.forEach((db, i) => {
  db.connect(err => {
    if (err) console.error(`Shard ${i} failed`, err);
    else console.log(`Shard ${i} connected`);
  });
});

function getDB(studentId) {
  const shardId = studentId % 3;
  return shards[shardId];
}

// module.exports = db;

module.exports = {
  getDB,
  shards
};