import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    fetch(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.nomeUtente) setUser(data);
      })
      .catch(() => setError("Errore nel recupero dell'utente"));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6">
      <h1 className="text-5xl font-bold mb-6">Crafting Table</h1>

      {user ? (
        <>
          <p className="text-lg mb-10 text-center max-w-xl">
            Ciao <span className="font-semibold">{user.nomeUtente}</span>, sei pronto a collaborare con il tuo team?
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-200 transition"
          >
            Vai alla Dashboard
          </button>
        </>
      ) : (
        <>
          <p className="text-lg mb-10 text-center max-w-xl">
            Collabora con il tuo team, gestisci progetti e condividi idee in un unico spazio.
          </p>
          <div className="flex gap-6">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-200 transition"
            >
              Accedi
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-transparent border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Registrati
            </button>
          </div>
          <div className="flex gap-6 p-3 border-white rounded-xl hover:bg-gray">< GoogleSignInButton/></div>
          
        </>
      )}

      {error && <p className="mt-6 text-red-300 text-sm">{error}</p>}
    </div>
  );
}
