import { useEffect, useState } from "react";
import API from "../api";
import Attendance from "../components/Attendance";
import Requests from "../components/Requests";
import Logs from "../components/Logs";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/me")
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.clear();
        window.location.reload();
      });
  }, []);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar user={user} />

      <div className="p-6">

        {/* <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-2xl font-bold">
            Welcome {user.Name}
          </h2>
          <p className="text-gray-500">{user.Role}</p>
        </div> */}

        {user.Role === "Student" && (
          <>
            <div className="bg-white p-4 rounded shadow mb-6">
              <h2 className="text-2xl font-bold">
                Welcome {user.Name}
              </h2>
              <p className="text-gray-500">{user.Role}</p>
            </div>
            <Attendance />
            <Requests role="Student" />
          </>
        )}

        {user.Role === "Admin" && (
          <>
            <div className="bg-white p-4 rounded shadow mb-6">
              <h2 className="text-2xl font-bold">
                Welcome Proffessor    {user.Name}   
              </h2>
              <p className="text-gray-500">{user.Role}</p>
            </div>
            <Requests role="Admin" />
            <Logs />
          </>
        )}

      </div>
    </div>
  );
}

export default Dashboard;