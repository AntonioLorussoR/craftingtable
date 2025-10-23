import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Teams from "./pages/Teams";
import OAuthSuccess from "./components/OAuthSuccess";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/protectedRoute";

function AppContent({ token, setToken }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  const hideNavbarOnPaths = ["/", "/login", "/register"];
  const showNavbar = !hideNavbarOnPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar onLogout={handleLogout} />}
      <div className={location.pathname === "/" ? "" : "p-6"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/oauth-success" element={<OAuthSuccess onLogin={handleLogin}/>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute token={token}>
                <Dashboard token={token} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute token={token}>
                <Profile token={token} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams"
            element={
              <ProtectedRoute token={token}>
                <Teams token={token} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <AppContent token={token} setToken={setToken} />
    </Router>
  );
}
