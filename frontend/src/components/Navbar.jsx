function Navbar({ user }) {
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold text-lg">Attendance Portal</h1>

      <div className="flex gap-4 items-center">
        <span>{user.Name}</span>
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;