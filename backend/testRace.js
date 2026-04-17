const fetch = require("node-fetch");

const URL = "http://localhost:3000/api/request/1847";

const tokens = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTAwMywicm9sZSI6IkFkbWluIiwiaWF0IjoxNzc1Mzg0MDEwLCJleHAiOjE3NzUzODc2MTB9.7PPWkpG3GPCmv9fAXvm6SBHCik_1q2HsS7miujnh9TM",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTAwNCwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzc1Mzg0MDYyLCJleHAiOjE3NzUzODc2NjJ9.PRBRVdmKYllTP9IytHXhVq2te5SRXhU7VQ_sXpjTnGc",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTAwNSwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzc1Mzg0MTA2LCJleHAiOjE3NzUzODc3MDZ9.zV2izS-HeLwTihFObPxEUICNXMW--6CTM98pdwByD98",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTAwNiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzc1Mzg0MTQ0LCJleHAiOjE3NzUzODc3NDR9.OJZRLuPT2w7IRBlqfPB7zAAEgZ_dyiftaKhlw6Jk7E0"
];

for (let i = 0; i < 8; i++) {
  fetch(URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${tokens[i % tokens.length]}`
    },
    body: JSON.stringify({
      status: i % 2 === 0 ? "approved" : "rejected"
    })
  })
    .then(res => res.text())
    .then(data => console.log(`Admin ${i}:`, data));
}