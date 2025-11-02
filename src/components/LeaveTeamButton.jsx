import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LeaveTeamButton({ teamId, onLeave }) {
  const { token } = useContext(AuthContext);
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
        <div className="flex flex-col sm:flex-row gap-2 items-center sm:items-start text-center sm:text-left">
          <span className="text-sm text-gray-700">Sei sicuro?</span>
          <button
            onClick={handleLeave}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 text-sm sm:text-base w-full sm:w-auto rounded hover:bg-red-700 transition"
          >
            {loading ? "Uscita..." : "Conferma"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="border border-gray-300 px-4 py-2 text-sm sm:text-base w-full sm:w-auto rounded hover:bg-gray-100 transition"
          >
            Annulla
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="bg-red-600 text-white px-4 py-2 text-sm sm:text-base w-full sm:w-auto rounded hover:bg-red-700 transition"
        >
          Abbandona il team
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2 text-center sm:text-right">{error}</p>
      )}
    </div>
  );
}
