import { useState } from "react";

export default function LeaveTeamButton({ teamId, token, onLeave }) {
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  
  const handleLeave = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await fetch(`${API_BASE}/api/teams/${teamId}/leave`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      onLeave(); 
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Errore durante l'abbandono del team");
    }
  } catch (err) {
    console.error("Errore abbandono team:", err);
    setError("Errore di connessione al server");
  } finally {
    setLoading(false);
    setConfirming(false);
  }
};


  return (
    <div className="flex flex-col items-end">
      {confirming ? (
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-700">Sei sicuro?</span>
          <button
            onClick={handleLeave}
            disabled={loading}
            className="px-2 py-1 text-sm bg-red-600 text-white rounded"
          >
            {loading ? "Uscita..." : "Conferma"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="px-2 py-1 text-sm bg-gray-300 rounded"
          >
            Annulla
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="px-3 py-2 bg-red-500 text-white rounded text-sm"
        >
          Abbandona il team
        </button>
      )}

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
