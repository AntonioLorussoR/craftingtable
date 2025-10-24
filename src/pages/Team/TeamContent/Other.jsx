import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Other({ team, token }) {
  const [inviteLink, setInviteLink] = useState(team?.telegramInviteLink || "");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  
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

  const handleSaveLink = async () => {
    if (!inviteLink.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/teams/${team._id}/telegram-invite`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ link: inviteLink }),
      });
      if (!res.ok) throw new Error("Errore salvataggio link");
    } catch (err) {
      console.error("Errore salvataggio link:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full max-w-screen-md mx-auto px-4">
      <h2 className="text-xl font-semibold text-center sm:text-left">🔗 Collegamento Telegram</h2>

      {team?.telegramChatTitle && (
        <div className="text-gray-700">
          Gruppo Telegram accoppiato: <strong>{team.telegramChatTitle}</strong>
        </div>
      )}

      {isAdmin ? (
        <div className="space-y-4">
          <p className="text-gray-700">
            Per accoppiare il gruppo Telegram al team, invia questo comando nel gruppo:
          </p>
          <pre className="bg-gray-100 p-2 rounded border border-gray-300 text-sm">
            /accoppia {team.telegramCode}
          </pre>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Link di invito al gruppo Telegram
            </label>
            <input
              type="text"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              className="w-full border rounded p-2 text-sm sm:text-base"
              placeholder="https://t.me/joinchat/..."
            />
            <button
              onClick={handleSaveLink}
              disabled={saving}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm sm:text-base w-full sm:w-auto"
            >
              {saving ? "Salvataggio..." : "Salva link"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <p className="text-gray-700">Puoi entrare nel gruppo Telegram tramite questo link:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="w-full border rounded p-2 bg-gray-100 text-gray-700"
            />
            <button
              onClick={handleCopy}
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm sm:text-base w-full sm:w-auto"
            >
              {copied ? "Copiato!" : "Copia"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
