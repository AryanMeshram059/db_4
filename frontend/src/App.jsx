import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <>
      {!token ? <Login setToken={setToken} /> : <Dashboard />}
    </>
  );
}

export default App;