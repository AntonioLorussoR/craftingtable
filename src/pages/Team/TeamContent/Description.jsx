import { useState } from "react";
import getCurrentUserId from "src/utils/getCurrentUserId.js";

export default function Description({ team, token, onUpdate, onDelete }) {
  const [desc, setDesc] = useState(team.description || "");
  const [savedDesc, setSavedDesc] = useState(team.description || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");

const API_BASE = import.meta.env.VITE_API_BASE_URL;

  
const currentUserId = getCurrentUserId(token);


  const isAdmin = team?.members?.some(
    (m) => String(m.user?._id || m.user) === String(currentUserId) && (m.role === "Admin" || m.role === "Creator")
  );


  const isCreator = team?.members?.some(
    (m) => String(m.user?._id || m.user) === String(currentUserId) && (m.role === "Creator")
  );

  const updateDescription = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/teams/${team._id}/description`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: desc }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(`Errore: ${data.message}`);
      } else {
        setSavedDesc(desc);
        if (onUpdate) onUpdate(desc);
        setMessage("Descrizione salvata con successo!");
      }
    } catch (err) {
      console.error(err);
      setMessage("Errore di rete");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeam = async () => {
    const conferma = window.confirm("Vuoi davvero eliminare questo team? L'azione è irreversibile.");
    if (!conferma) return;

    try {
      const res = await fetch(`${API_BASE}/api/teams/${team._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        if (onDelete) onDelete(); 
      } else {
        const data = await res.json();
        setDeleteError(data.message || "Errore durante l'eliminazione del team");
      }
    } catch (err) {
      console.error("Errore eliminazione team:", err);
      setDeleteError("Errore di connessione al server");
    }
  };

  return (
    <div className="p-4 border rounded w-full max-w-screen-md mx-auto">
      <h3 className="text-xl font-semibold mb-2">Descrizione del Team</h3>
      <p className="mb-2">
        Codice accesso: <strong>{team.accessCode}</strong>
      </p>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        disabled={!isAdmin}
        className="border p-2 w-full rounded text-sm sm:text-base"
      />

      {(isAdmin || isCreator) && (
        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-between items-center">
          <button
            onClick={updateDescription}
            disabled={saving || desc === savedDesc}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto">
            {saving ? "Salvataggio..." : "Salva"}
          </button>

          {isCreator && (
            <button
              onClick={handleDeleteTeam}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto">
              Elimina team
            </button>
        )}
  </div>
)}


      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      {deleteError && <p className="mt-2 text-sm text-red-600">{deleteError}</p>}
    </div>
  );
}
