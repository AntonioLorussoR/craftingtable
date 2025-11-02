import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
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
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-700 text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-5xl font-bold mb-6">Crafting Table</h1>

        {user ? (
          <>
            <p className="text-lg mb-10">
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
            <p className="text-lg mb-10">
              Collabora con il tuo team, gestisci progetti e condividi idee in un unico spazio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-200 transition w-full sm:w-auto"
              >
                Accedi
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-transparent border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition w-full sm:w-auto"
              >
                Registrati
              </button>
            </div>
            <div className="w-full flex justify-center">
              <GoogleSignInButton />
            </div>
          </>
        )}

        {error && <p className="mt-6 text-red-300 text-sm">{error}</p>}
      </div>
    </div>
  );
}
