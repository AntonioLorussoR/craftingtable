import { useEffect, useState } from "react";
import SidebarTeamList from "../components/SidebarTeamList";
import TeamPage from "./Team/TeamPage";
import CreateTeamModal from "../components/CreateTeamModal";

export default function Teams({ token }) {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchTeams = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTeams(data);
      else console.error(data.message);
    } catch (err) {
      console.error("Errore fetch teams:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarTeamList
        teams={teams}
        onSelectTeam={setSelectedTeam}
        fetchTeams={fetchTeams}
        onCreateTeam={() => setShowModal(true)}
      />

      {selectedTeam ? (
        <TeamPage
          team={selectedTeam}
          token={token}
          setTeams={setTeams}
          setSelectedTeam={setSelectedTeam}
        />
      ) : (
        <div className="flex-1 p-4">Seleziona un team dalla sidebar</div>
      )}

      <CreateTeamModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={fetchTeams}
        token={token}
      />
    </div>
  );
}
