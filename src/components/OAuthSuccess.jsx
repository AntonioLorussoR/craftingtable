import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = params.get("token");
    if (!token || typeof window === "undefined") {
      navigate("/", { replace: true });
      return;
    }

    fetch(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(user => {
        if (user) {
          login(token, user);
        }
      })
      .catch(err => console.error("Errore fetching utente OAuth:", err))
      .finally(() => {
        navigate("/dashboard", { replace: true });
      });
  }, [params, navigate, login]);

  return null;
}
