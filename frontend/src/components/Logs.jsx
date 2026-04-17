import { useEffect, useState } from "react";
import API from "../api";

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get("/logs").then(res => setLogs(res.data));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">

      <h3 className="text-xl font-semibold mb-3">Audit Logs</h3>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>ID</th>
            <th>Action</th>
            <th>User</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {logs.map(l => (
            <tr key={l.LogID} className="text-center border-t">
              <td>{l.LogID}</td>
              <td>{l.ActionType}</td>
              <td>{l.Name}</td>
              <td>{l.ActionTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Logs;