import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function CreateTeamModal({ isOpen, onClose, onCreate }) {
  const { token } = useContext(AuthContext);
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async () => {
    if (!teamName.trim()) {
      setError("Inserisci un nome valido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: teamName, description }),
      });

      const data = await res.json();
      console.log("Team ricevuto dal backend:", JSON.stringify(data, null, 2));

      if (res.ok) {
        onCreate();
        onClose();
        setTeamName("");
        setDescription("");
      } else {
        setError(data.message || "Errore nella creazione del team");
      }
    } catch (err) {
      setError("Errore di connessione");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-4 sm:mx-0">
        <h2 className="text-lg font-semibold mb-4">Crea un nuovo team</h2>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Nome del team"
          className="w-full px-3 py-2 border rounded text-sm sm:text-base"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione (facoltativa)"
          className="w-full px-3 py-2 border rounded text-sm sm:text-base"
        />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
            disabled={loading}
          >
            Annulla
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? "Creazione..." : "Crea"}
          </button>
        </div>
      </div>
    </div>
  );
}
