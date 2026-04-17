from locust import HttpUser, task, between
import random
    
#  Student tokens
students = [
    {"id": 230011, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMwMDExLCJyb2xlIjoiU3R1ZGVudCIsImlhdCI6MTc3NTM4MzY5MCwiZXhwIjoxNzc1Mzg3MjkwfQ.69J52KZLHAS9EAramBgnoCgNw7yG0gx_19_W6pVx72M"},
    {"id": 240004, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQwMDA0LCJyb2xlIjoiU3R1ZGVudCIsImlhdCI6MTc3NTM4Mzc2MCwiZXhwIjoxNzc1Mzg3MzYwfQ.6aVIIIsHMELluEZ0R_77NCl_70vQA4ep9kCfCkf50HM"},
    {"id": 250003, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUwMDAzLCJyb2xlIjoiU3R1ZGVudCIsImlhdCI6MTc3NTM4MzgzMCwiZXhwIjoxNzc1Mzg3NDMwfQ.W_W-PKz2rvPtgDXIbkwiI9NPADPNDMPdCFs0qOK52ho"},
    {"id": 230008, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMwMDA4LCJyb2xlIjoiU3R1ZGVudCIsImlhdCI6MTc3NTM4Mzg5NiwiZXhwIjoxNzc1Mzg3NDk2fQ.9e-GNjD6Xe_ivQDh70pYMgweOHGW87MW43EMBZUHUbM"}
]

#  Valid attendance IDs
attendance_ids = [4, 5, 16, 32, 45, 74, 79, 88, 89]

class AttendanceUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def create_request(self):
        student = random.choice(students)
        attendance_id = random.choice(attendance_ids)

        payload = {
            "studentId": student["id"],
            "attendanceId": attendance_id,
            "reason": random.choice([
                "Medical leave",
                "Family emergency",
                "FAIL case test"  # triggers rollback
            ])
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": student["token"]
        }

        self.client.post("/api/request", json=payload, headers=headers)