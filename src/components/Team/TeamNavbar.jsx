import LeaveTeamButton from "../LeaveTeamButton";

export default function TeamNavbar({
  activeTab,
  setActiveTab,
  team,
  token,
  setTeams,
  setSelectedTeam,
}) {
  if (!team) return null;
  
  const tabs = ["bacheca", "members", "description", "chat", "materiale", "altro"];
  const labels = {
    bacheca: "Bacheca",
    members: "Membri",
    description: "Descrizione",
    chat: "Chat",
    materiale: "Materiale condiviso",
    altro: "Telegram",
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 shadow">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded transition ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {labels[tab]}
          </button>
        ))}
      </div>

      <LeaveTeamButton
        teamId={team._id}
        token={token}
        onLeave={() => {
          setTeams((prev) => prev.filter((t) => t._id !== team._id));
          setSelectedTeam(null);
        }}
      />
    </div>
  );
}
