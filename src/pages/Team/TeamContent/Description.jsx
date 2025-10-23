import { useState } from "react";
import  { jwtDecode } from "jwt-decode";

export default function Description({ team, token, onUpdate, onDelete }) {
  const [desc, setDesc] = useState(team.description || "");
  const [savedDesc, setSavedDesc] = useState(team.description || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // 🔐 Decodifica il token per ottenere l'ID utente
  let currentUserId = null;
  try {
    const decoded = jwtDecode(token);
    currentUserId = decoded._id || decoded.id || decoded.userId || decoded.sub;
  } catch (err) {
    console.warn("⚠️ Token non valido:", err);
  }

  // 🛡️ Confronto sicuro tra stringhe per riconoscere l'admin
  const isAdmin = team?.members?.some(
    (m) => String(m.user?._id || m.user) === String(currentUserId) && (m.role === "Admin" || m.role === "Creator")
  );

  //Riconoscere il Creator
  const isCreator = team?.members?.some(
    (m) => String(m.user?._id || m.user) === String(currentUserId) && (m.role === "Creator")
  );

  const updateDescription = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/teams/${team._id}/description`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: desc }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(`❌ Errore: ${data.message}`);
      } else {
        setSavedDesc(desc);
        if (onUpdate) onUpdate(desc);
        setMessage("✅ Descrizione salvata con successo!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Errore di rete");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeam = async () => {
    const conferma = window.confirm("Vuoi davvero eliminare questo team? L'azione è irreversibile.");
    if (!conferma) return;

    try {
      const res = await fetch(`/api/teams/${team._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        if (onDelete) onDelete(); // ✅ aggiorna stato locale nel genitore
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
    <div className="p-4 border rounded">
      <h3 className="text-xl font-semibold mb-2">Descrizione del Team</h3>
      <p className="mb-2">
        Codice accesso: <strong>{team.accessCode}</strong>
      </p>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        disabled={!isAdmin}
        className="border p-2 w-full rounded"
      />

      {(isAdmin || isCreator) && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={updateDescription}
            disabled={saving || desc === savedDesc}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Salvataggio..." : "Salva"}
          </button>

          {isCreator && (
            <button
              onClick={handleDeleteTeam}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
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
