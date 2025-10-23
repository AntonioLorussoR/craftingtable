import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ onLogin }) {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeUtente: nome,
          cognomeUtente: cognome,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Token ricevuto:", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        onLogin(data.token);
        navigate("/dashboard"); // vai alla dashboard dopo la registrazione
      } else {
        setError(data.message || "Errore registrazione");
      }
    } catch (err) {
      console.error("Errore di connessione:", err);
      setError("Errore di connessione");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6">Registrati</h2>
      <form
        onSubmit={handleSubmit}
        className="w-80 bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Cognome"
          value={cognome}
          onChange={(e) => setCognome(e.target.value)}
          className="border p-2 rounded"
        />
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
          Registrati
        </button>
      </form>
      <p className="mt-4 text-sm">
        Hai già un account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-indigo-600 cursor-pointer hover:underline"
        >
          Accedi
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
