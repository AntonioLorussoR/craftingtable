import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);

        // Recupera profilo completo
        const userRes = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        const userData = await userRes.json();

        if (userRes.ok) {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        onLogin(data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Errore login");
      }
    } catch (err) {
      console.error("Errore connessione login:", err);
      setError("Errore di connessione");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 md:px-8">
      <h2 className="text-3xl font-bold mb-6">Accedi</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded text-sm sm:text-base"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded text-sm sm:text-base"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition text-sm sm:text-base">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-center px-2">
        Non hai un account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-indigo-600 cursor-pointer hover:underline"
        >
          Registrati ora!
        </span>
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 text-sm text-indigo-600 hover:underline"
      >
        ⬅ Torna alla Home
      </button>
    </div>
  );
}
