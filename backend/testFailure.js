const fetch = require("node-fetch");

const URL = "http://localhost:3000/api/request";

// Your student tokens
const students = [
  {"id": 230011, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMwMDExLCJyb2xlIjoiU3R1ZGVudCIsImlhdCI6MTc3NTM4MzY5MCwiZXhwIjoxNzc1Mzg3MjkwfQ.69J52KZLHAS9EAramBgnoCgNw7yG0gx_19_W6pVx72M"},
  {"id": 240004, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQwMDA0LCJyb2xlIjoiU3R1ZGVudCIsImlhdCI6MTc3NTM4Mzc2MCwiZXhwIjoxNzc1Mzg3MzYwfQ.6aVIIIsHMELluEZ0R_77NCl_70vQA4ep9kCfCkf50HM"},
  {"id": 250003, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUwMDAzLCJyb2xlIjoiU3R1ZGVudCIsImlhdCI6MTc3NTM4MzgzMCwiZXhwIjoxNzc1Mzg3NDMwfQ.W_W-PKz2rvPtgDXIbkwiI9NPADPNDMPdCFs0qOK52ho"},
  {"id": 230008, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMwMDA4LCJyb2xlIjoiU3R1ZGVudCIsImlhdCI6MTc3NTM4Mzg5NiwiZXhwIjoxNzc1Mzg3NDk2fQ.9e-GNjD6Xe_ivQDh70pYMgweOHGW87MW43EMBZUHUbM"}
];

// Valid Attendance IDs from your DB
const attendanceIds = [4, 5, 16, 32, 45, 74, 79, 88, 89];

// Send 15 concurrent requests
for (let i = 0; i < 15; i++) {
  const student = students[i % students.length];
  const attendanceId = attendanceIds[i % attendanceIds.length];

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": student.token // your system format
    },
    body: JSON.stringify({
      studentId: student.id,
      attendanceId: attendanceId,
      reason: i < 10
        ? `Normal request ${i}`
        : `FAIL request ${i}`
    })
  })
    .then(async (res) => {
      const text = await res.text(); // read once

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      console.log(
        `Request ${i} (Student ${student.id}, Attendance ${attendanceId}):`,
        data
      );
    })
    .catch(err => console.error("FETCH ERROR:", err.message));
}