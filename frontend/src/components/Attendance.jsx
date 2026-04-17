import { useEffect, useState } from "react";
import API from "../api";

function Attendance() {
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Request UI
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reason, setReason] = useState("");

  // 🔑 Get studentId from JWT
  const getStudentIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  // 📌 Load courses
  useEffect(() => {
    API.get("/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  // 📌 Load attendance
  const loadAttendance = async (courseId) => {
    try {
      setLoading(true);
      const res = await API.get(`/attendance/${courseId}`);
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Submit request (FINAL FIXED)
  const submitRequest = async () => {
    if (!reason.trim()) {
      alert("Please enter a reason");
      return;
    }

    const studentId = getStudentIdFromToken();

    if (!studentId) {
      alert("User not authenticated ❌");
      return;
    }

    try {
      const res = await API.post("/request", {
        studentId: studentId,                         // ✅ REQUIRED
        attendanceId: selectedRecord.AttendanceID,    // ✅ REQUIRED
        reason: reason                                // ✅ REQUIRED
      });

      alert(res.data.message || "Request created ✅");

      // 🔄 Reload attendance after success
      await loadAttendance(selectedRecord.CourseID);

      // reset UI
      setSelectedRecord(null);
      setReason("");

    } catch (err) {
      console.error("ERROR:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
        "Request failed ❌"
      );
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">

      <h3 className="text-xl font-semibold mb-4">Attendance</h3>

      {/* Courses */}
      <div className="flex flex-wrap gap-2 mb-4">
        {courses.map(c => (
          <button
            key={c.CourseID}
            onClick={() => loadAttendance(c.CourseID)}
            className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded"
          >
            {c.CourseName}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && <p>Loading attendance...</p>}

      {/* Table */}
      {!loading && attendance.length > 0 && (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map(a => (
              <tr key={a.AttendanceID} className="text-center border-t">

                <td className={
                  a.Status === "Absent"
                    ? "text-red-500"
                    : "text-green-600"
                }>
                  {a.Status}
                </td>

                <td>{a.SessionDate}</td>

                <td>
                  {a.Status === "Absent" && (
                    a.RequestID ? (
                      <span className={
                        a.RequestStatus === "Approved" ? "text-green-600 font-semibold" :
                        a.RequestStatus === "Rejected" ? "text-red-600 font-semibold" :
                        "text-yellow-600 font-semibold"
                      }>
                        {a.RequestStatus || "Requested"}
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedRecord(a)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Request
                      </button>
                    )
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Empty */}
      {!loading && attendance.length === 0 && (
        <p>Select a course to view attendance</p>
      )}

      {/* Request Box */}
      {selectedRecord && (
        <div className="mt-4 p-4 border rounded bg-gray-50">

          <h4 className="font-semibold mb-2">Enter Reason</h4>

          <input
            className="border p-2 w-full mb-3"
            placeholder="Reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              onClick={submitRequest}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Submit
            </button>

            <button
              onClick={() => {
                setSelectedRecord(null);
                setReason("");
              }}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default Attendance;