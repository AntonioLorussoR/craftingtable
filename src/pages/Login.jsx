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
        console.log("Token salvato:", data.token);
        onLogin(data.token);
        navigate("/dashboard"); // vai alla dashboard
      } else {
        setError(data.error || "Errore login");
      }
    } catch (err) {
      console.error(err);
      setError("Errore di connessione");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6">Accedi</h2>
      <form
        onSubmit={handleSubmit}
        className="w-80 bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">
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
