import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Teams from "./pages/Teams";
import OAuthSuccess from "./components/OAuthSuccess";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/protectedRoute";
import { AuthContext } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, login, logout } = useContext(AuthContext);

  const hideNavbarOnPaths = ["/", "/login", "/register"];
  const showNavbar = !hideNavbarOnPaths.includes(location.pathname);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      {showNavbar && <Navbar onLogout={handleLogout} />}
      <div className={location.pathname === "/" ? "" : "p-6"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register onLogin={login} />} />
          <Route path="/oauth-success" element={<OAuthSuccess onLogin={login} />} />
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
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
