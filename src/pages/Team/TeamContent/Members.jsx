import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import ConfermaRimozione from "../../../components/ConfermaRimozione";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Members({ team, token, onTeamsUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [membroSelezionato, setMembroSelezionato] = useState(null);

  let currentUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded._id || decoded.id || decoded.userId || decoded.sub;
    } catch (err) {
      console.warn("Token non valido:", err);
    }
  }


  const isAdmin = team?.members?.some(
    (m) =>
      String(m.user?._id || m.user) === String(currentUserId) &&
      (m.role === "Admin" || m.role === "Creator")
  );

  const makeAdmin = async (memberId) => {
    try {
      const res = await fetch(`${API_BASE}/api/teams/${team._id}/admin/${memberId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) alert(data.message);
      else onTeamsUpdate(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRimozioneClick = (member) => {
    setMembroSelezionato(member);
    setShowModal(true);
  };

  const confermaRimozione = async () => {
    try {
      const memberId = membroSelezionato.user?._id || membroSelezionato.user;
      const res = await fetch(`${API_BASE}/api/teams/${team._id}/members/${memberId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) alert(data.message);
      else onTeamsUpdate(data);
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setMembroSelezionato(null);
    }
  };

  return (
    <div className="w-full max-w-screen-md mx-auto px-4 space-y-4">
      <h3 className="text-xl font-semibold mb-2 text-center sm:text-left">Membri del Team</h3>
      <ul>
        {team.members.map((member) => {
          const memberId = member.user?._id || member.user;
          const isSelf = String(memberId) === String(currentUserId);
          const isMemberCreator = member.role === "Creator";
          const isMemberAdmin = member.role === "Admin";

          return (
            <li
              key={memberId}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b gap-2 text-sm sm:text-base"
            >
              <span>
                {member.user.nomeUtente} {member.user.cognomeUtente} ({member.user.email})
                {isMemberCreator && (
                  <span className="ml-2 inline-block text-xs sm:text-sm font-semibold px-2 py-1 rounded bg-purple-100 text-purple-600">Creatore</span>
                )}
                {isMemberAdmin && (
                  <span className="ml-2 inline-block text-xs sm:text-sm font-semibold px-2 py-1 rounded bg-blue-100 text-blue-600">Admin</span>
                )}
              </span>

              {isAdmin && !isSelf && !isMemberCreator && (
                <div className="flex gap-2">
                  {!isMemberAdmin && !isMemberCreator && (
                    <button
                      onClick={() => makeAdmin(memberId)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm sm:text-base w-full sm:w-auto"
                    >
                      Nomina Admin
                    </button>
                  )}
                  <button
                    onClick={() => handleRimozioneClick(member)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm sm:text-base w-full sm:w-auto"
                  >
                    Rimuovi
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <ConfermaRimozione
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confermaRimozione}
        membro={membroSelezionato}
      />
    </div>
  );
}
