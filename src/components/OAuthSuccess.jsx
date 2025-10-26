import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function OAuthSuccess({ onLogin }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (!token || typeof window === "undefined") {
      navigate("/", { replace: true });
      return;
    }

    // Salva token e aggiorna stato globale
    localStorage.setItem("token", token);
    onLogin?.(token);

    // Fetch dati utente aggiornati dal backend
    fetch(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(user => {
        if (user) {
          // Salva in localStorage senza sovrascrivere profilePicture già presente
          const existing = JSON.parse(localStorage.getItem("user") || "{}");
          const updatedUser = {
            ...existing,
            ...user,
            profilePicture: user.profilePicture || existing.profilePicture || null,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      })
      .catch(err => console.error("Errore fetching utente OAuth:", err))
      .finally(() => navigate("/dashboard", { replace: true }));
  }, [params, navigate, onLogin]);

  return null;
}
