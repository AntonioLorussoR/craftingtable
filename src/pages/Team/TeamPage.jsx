import { useContext, useState, useEffect } from "react";
import TeamNavbar from "../../components/Team/TeamNavbar";
import Bacheca from "./TeamContent/Bacheca";
import Members from "./TeamContent/Members";
import Description from "./TeamContent/Description";
import Chat from "./TeamContent/Chat";
import Materiale from "./TeamContent/Materiale";
import Other from "./TeamContent/Other";
import  { AuthContext } from "../../context/AuthContext";

export default function TeamPage({
  team: selectedTeam,
  setTeams,
  setSelectedTeam,
}) {
  const [activeTab, setActiveTab] = useState("bacheca");
  const [team, setTeam] = useState(selectedTeam); // stato locale
  const { token, socket } = useContext(AuthContext);


  useEffect(() => {
    setTeam(selectedTeam);
  }, [selectedTeam]);

  useEffect(() => {
    if (!team?._id) return;

    socket.emit("joinTeam", team._id); 

    const handleTelegramLinked = ({ chatId, title }) => {
      setTeam((prev) => ({
        ...prev,
        telegramChatId: chatId,
        telegramChatTitle: title,
      }));
    };

    socket.on("telegramLinked", handleTelegramLinked);

    return () => {
      socket.off("telegramLinked", handleTelegramLinked);
    };
  }, [team?._id]);

  if (!team || !team._id) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center text-gray-500 text-center text-sm sm:text-base">
        Caricamento team...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen overflow-hidden">
      <TeamNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        team={team}
        token={token}
        setTeams={setTeams}
        setSelectedTeam={setSelectedTeam}
      />

      <div className="p-4 flex-1 overflow-auto max-w-screen-lg mx-auto w-full">
        {activeTab === "bacheca" && <Bacheca team={team} token={token} />}
        {activeTab === "members" && <Members team={team} token={token} onTeamsUpdate={setTeam} />}
        {activeTab === "description" && (
          <Description
            team={team}
            token={token}
            onUpdate={(newDesc) => {
              setTeam((prev) => ({ ...prev, description: newDesc }));
            }}
            onDelete={() => {
              setTeams((prev) => prev.filter((t) => t._id !== selectedTeam._id));
              setSelectedTeam(null);
            }}
          />
        )}
        {activeTab === "chat" && <Chat team={team} token={token} />}
        {activeTab === "materiale" && <Materiale team={team} token={token} />}
        {activeTab === "altro" && <Other team={team} token={token} />}
      </div>
    </div>
  );
}
