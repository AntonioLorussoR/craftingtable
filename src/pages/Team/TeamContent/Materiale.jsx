import { useState, useEffect } from "react";
import getCurrentUserId from "../teamUtils/getCurrentUserId.js";

export default function Materiale({ team, token }) {
  const [file, setFile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  
  const currentUserId = getCurrentUserId(token);

  const isAdmin = team?.members?.some(
    (m) => String(m.user?._id || m.user) === String(currentUserId) && (m.role === "Admin" || m.role === "Creator")
  );

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/teams/${team._id}/materials`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setMaterials(data);
        } else {
          setError(data.message || "Errore nel caricamento dei materiali");
        }
      } catch {
        setError("Errore di connessione");
      }
    };
    fetchMaterials();
  }, [team._id, token]);

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/teams/${team._id}/materials`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMaterials((prev) => [data, ...prev]);
        setFile(null);
      } else {
        setError(data.message || "Errore durante l'upload");
      }
    } catch {
      setError("Errore di connessione");
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (materialId) => {
    try {
      const res = await fetch(`${API_BASE}/api/teams/${team._id}/materials/${materialId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m._id !== materialId));
      } else {
        setError(data.message || "Errore durante l'eliminazione");
      }
    } catch {
      setError("Errore di connessione");
    }
  };

  return (
    <div className="space-y-6 w-full max-w-screen-md mx-auto px-4">
      <h3 className="text-xl font-semibold text-center sm:text-left">Materiale Condiviso</h3>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded bg-white text-sm sm:text-base w-full sm:w-auto"
        />
        <button
          onClick={uploadFile}
          disabled={loading || !file}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
        >
          {loading ? "Caricamento..." : "Carica"}
        </button>
      </div>
      {error && <p className="text-red-600 text-sm text-center sm:text-left">{error}</p>}

      <ul className="space-y-4">
        {materials.map((item) => (
          <li key={item._id} className="bg-white p-4 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <p className="font-medium text-sm sm:text-base break-words">{item.name}</p>
              <p className="text-sm text-gray-500">
                Caricato il {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <a
                href={`${API_BASE}/uploads/contentShared/${item.url.split("/").pop()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm sm:text-base w-full sm:w-auto text-center"
              >
                Apri
              </a>
              {isAdmin && (
                <button
                  onClick={() => deleteMaterial(item._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm sm:text-base w-full sm:w-auto"
                >
                  Elimina
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
