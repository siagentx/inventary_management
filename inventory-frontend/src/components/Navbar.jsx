import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

function Navbar() {
  const [user, setUser] = useState(null);
useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
fetchUser();
  }, []);
const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };
return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Inventary Mangement System
        </h1>
      </div>
<div className="flex items-center gap-5">
<button className="text-gray-500 hover:text-gray-800">🔔</button>
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
      {user?.username?.charAt(0).toUpperCase() || "U"}
</div>
<div className="hidden sm:block">
<p className="text-sm font-medium text-gray-700">
              {user?.username || "User"}
</p>
<button onClick={handleLogout}className="text-xs text-red-600 hover:text-red-800">Logout</button>
</div>
</div>
</div>
</nav>
  );
}
export default Navbar;