import { useState } from "react";

export default function ConfermaRimozione({ isOpen, onClose, onConfirm, membro }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await onConfirm(); // la logica di rimozione è gestita dal componente padre
      onClose();
    } catch (err) {
      setError("Errore durante la rimozione");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !membro) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-4 sm:mx-0">
        <h2 className="text-lg font-semibold mb-4">Conferma rimozione</h2>
        <p className="mb-4 text-gray-700">
          Vuoi davvero rimuovere <strong>{membro.user.nomeUtente}</strong> dal team?
        </p>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
            disabled={loading}
          >
            Annulla
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? "Rimozione..." : "Rimuovi"}
          </button>
        </div>
      </div>
    </div>
  );
}
