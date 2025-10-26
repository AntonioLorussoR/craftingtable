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

    // Salva token
    localStorage.setItem("token", token);

    // Fetch dati utente aggiornati dal backend
    fetch(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(user => {
        if (user) {
          // Aggiorna localStorage senza cancellare profilePicture esistente
          const existing = JSON.parse(localStorage.getItem("user") || "{}");
          const updatedUser = {
            ...existing,
            ...user,
            profilePicture: user.profilePicture || existing.profilePicture || null,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Aggiorna stato globale / contesto
          onLogin?.(token, updatedUser);
        }
      })
      .catch(err => console.error("Errore fetching utente OAuth:", err))
      .finally(() => {
        navigate("/dashboard", { replace: true });
      });
  }, [params, navigate, onLogin]);

  return null;
}
