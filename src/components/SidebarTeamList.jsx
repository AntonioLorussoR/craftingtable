import { useState } from "react";

export default function SidebarTeamList({ teams, onSelectTeam, onCreateTeam, fetchTeams }) {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState(null); 

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  
  const handleJoinTeam = async (e) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/teams/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accessCode }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchTeams();
        setAccessCode("");
        setError("");
      } else {
        setError(data.message || "Errore durante l'accesso al team");
      }
    } catch (err) {
      console.error("Errore join team:", err);
      setError("Errore di connessione");
    }
  };

  const handleSelectTeam = (team) => {
    setSelectedTeamId(team._id); 
    onSelectTeam(team);
  };

  return (
    <div className="sidebar bg-white shadow-md p-4 w-64 min-h-screen flex flex-col justify-between">
      <div>
        <h3 className="font-semibold mb-2">I tuoi Team</h3>
        {Array.isArray(teams) && teams.length > 0 ? (
          <ul>
            {teams.map((team) => (
              <li key={team._id}>
                <button
                  onClick={() => handleSelectTeam(team)}
                  className={`w-full text-left px-2 py-1 rounded transition ${
                    selectedTeamId === team._id
                      ? "bg-blue-100 border border-blue-600 font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {team.name || "Team senza nome"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 mt-4">
            Nessun team disponibile.
            <br />
            Puoi crearne uno nuovo o unirti con un codice.
          </div>
        )}

        <form onSubmit={handleJoinTeam} className="mt-6 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Codice di accesso"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="border p-2 rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
            Unisciti al team
          </button>
        </form>
      </div>

      <button
        onClick={onCreateTeam}
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition w-full"
      >
        + Crea nuovo team
      </button>
    </div>
  );
}
