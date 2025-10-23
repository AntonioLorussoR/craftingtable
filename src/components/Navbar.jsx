import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-wide cursor-pointer" onClick={() => navigate("/")}>
              Crafting Table
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => navigate("/dashboard")} className="hover:text-gray-200">
              Home
            </button>
            <button onClick={() => navigate("/profile")} className="hover:text-gray-200">
              Profilo
            </button>
            <button onClick={() => navigate("/teams")} className="hover:text-gray-200">
              Teams
            </button>
          </div>

          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm font-medium"
          >
            Logout
          </button>

          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
              ☰
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col gap-2 py-2">
            <button onClick={() => navigate("/dashboard")} className="text-left px-2 py-1 hover:bg-blue-500 rounded">
              Home
            </button>
            <button onClick={() => navigate("/profile")} className="text-left px-2 py-1 hover:bg-blue-500 rounded">
              Profilo
            </button>
            <button onClick={() => navigate("/teams")} className="text-left px-2 py-1 hover:bg-blue-500 rounded">
              Teams
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
