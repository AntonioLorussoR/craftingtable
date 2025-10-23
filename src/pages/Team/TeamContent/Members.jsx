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
    <div>
      <h3 className="text-xl font-semibold mb-2">Membri del Team</h3>
      <ul>
        {team.members.map((member) => {
          const memberId = member.user?._id || member.user;
          const isSelf = String(memberId) === String(currentUserId);
          const isMemberCreator = member.role === "Creator";
          const isMemberAdmin = member.role === "Admin";

          return (
            <li
              key={memberId}
              className="flex justify-between items-center py-1 border-b"
            >
              <span>
                {member.user.nomeUtente} {member.user.cognomeUtente} ({member.user.email})
                {isMemberCreator && (
                  <span className="text-purple-600 font-semibold ml-2">Creatore</span>
                )}
                {isMemberAdmin && (
                  <span className="text-blue-600 font-semibold ml-2">Admin</span>
                )}
              </span>

              {isAdmin && !isSelf && !isMemberCreator && (
                <div className="flex gap-2">
                  {!isMemberAdmin && !isMemberCreator && (
                    <button
                      onClick={() => makeAdmin(memberId)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Nomina Admin
                    </button>
                  )}
                  <button
                    onClick={() => handleRimozioneClick(member)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
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
