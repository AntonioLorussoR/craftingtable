import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function OAuthSuccess({ onLogin, setUser }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = params.get("token");
    if (!token || typeof window === "undefined") {
      navigate("/", { replace: true });
      return;
    }

    localStorage.setItem("token", token);

    // Fetch dati utente aggiornati dal backend
    fetch(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(user => {
        if (user) {
          // Aggiorna stato React e localStorage
          setUser(user);
          onLogin?.(token, user);

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
      .finally(() => setLoading(false));
  }, [params, navigate, onLogin, setUser]);

  // Mostra loading finché lo stato user non è pronto
  useEffect(() => {
    if (!loading) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, navigate]);

  return null;
}
