import { useState } from "react";

export default function CreateTeamModal({ isOpen, onClose, onCreate, token }) {
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
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">Crea un nuovo team</h2>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Nome del team"
          className="w-full px-3 py-2 border rounded mb-2"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione (facoltativa)"
          className="w-full px-3 py-2 border rounded mb-2"
        />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
            disabled={loading}
          >
            Annulla
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Creazione..." : "Crea"}
          </button>
        </div>
      </div>
    </div>
  );
}
