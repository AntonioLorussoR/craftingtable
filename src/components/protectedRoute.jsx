import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  if (!token && location.pathname !== "/") {
    return <Navigate to="/" />;
  }

  return children;
}
