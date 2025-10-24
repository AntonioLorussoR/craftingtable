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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-4 py-6 sm:px-6 md:px-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center">Crafting Table</h1>

      {user ? (
        <>
          <p className="text-base sm:text-lg mb-8 text-center leading-relaxed max-w-md">
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
          <p className="text-base sm:text-lg mb-8 text-center leading-relaxed max-w-md">
            Collabora con il tuo team, gestisci progetti e condividi idee in un unico spazio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center items-center">
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
          <div className="mt-6 w-full max-w-sm">< GoogleSignInButton/></div>
          
        </>
      )}

      {error && <p className="mt-6 text-red-300 text-sm text-center">{error}</p>}
    </div>
  );
}
