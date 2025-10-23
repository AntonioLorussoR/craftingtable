import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ token, children }) {
  const location = useLocation();

  if (!token && location.pathname !== "/") {
    return <Navigate to="/" />;
  }

  return children;
}
