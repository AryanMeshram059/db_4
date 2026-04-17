import { useEffect, useState } from "react";
import API from "../api";

function Requests({ role }) {
  const [requests, setRequests] = useState([]);

  // Load requests
  const load = () => {
    API.get("/request")
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    load();
  }, []);

  // Update request (Approve / Reject)
  const update = async (id, status) => {
    try {
      await API.put(`/request/${id}`, { status });

      // 🔥 update UI instantly
      setRequests(prev =>
        prev.map(r =>
          r.RequestID === id ? { ...r, Status: status } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">

      <h3 className="text-xl font-semibold mb-3">Requests</h3>

      {/* No requests */}
      {requests.length === 0 && <p>No requests</p>}

      {/* Request list */}
      {requests.map((r) => (
        <div key={r.RequestID} className="bg-gray-50 p-4 rounded border mb-3">

          <p><b>Student:</b> {r.StudentName}</p>
          <p><b>Course:</b> {r.CourseName}</p>
          <p><b>Reason:</b> {r.Reason}</p>

          <p>
            <b>Status:</b>{" "}
            <span className={
              r.Status === "Approved"
                ? "text-green-600 font-semibold"
                : r.Status === "Rejected"
                ? "text-red-600 font-semibold"
                : "text-yellow-600 font-semibold"
            }>
              {r.Status}
            </span>
          </p>

          {/* 🔥 Admin Buttons */}
          {role === "Admin" && r.Status === "Pending" && (
            <div className="mt-3 space-x-2">
              <button
                onClick={() => update(r.RequestID, "Approved")}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => update(r.RequestID, "Rejected")}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}

        </div>
      ))}

    </div>
  );
}

export default Requests;