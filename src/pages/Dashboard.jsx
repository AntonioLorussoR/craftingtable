import { useEffect, useState } from "react";

export default function Dashboard({ token }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          setError(data.message || "Errore nel recupero dell'utente");
        }
      } catch (err) {
        setError("Errore di connessione");
        console.error("Errore fetch user:", err);
      }
    };

    if (token) fetchUser();
  }, [token, API_BASE]);

  const getProfileImageSrc = () => {
    if (!user?.profilePicture?.data) return "https://placehold.co/100x100";

    // Converti Buffer MongoDB in base64
    const binary = new Uint8Array(user.profilePicture.data.data);
    const base64String = btoa(binary.reduce((data, byte) => data + String.fromCharCode(byte), ""));
    return `data:${user.profilePicture.contentType};base64,${base64String}`;
  };

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!user) return <div className="p-4">Caricamento utente...</div>;

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 max-w-screen-lg mx-auto">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 text-center sm:text-left">
        <img
          src={getProfileImageSrc()}
          alt="Foto profilo"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-gray-300"
        />
        <h1 className="text-3xl font-bold">Benvenuto, {user?.nomeUtente}</h1>
      </div>

      <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
        Sei nella tua dashboard personale. Usa la barra di navigazione per accedere ai tuoi team o al tuo profilo.
      </p>
    </div>
  );
}
