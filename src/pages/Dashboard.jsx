import { useEffect, useState } from "react";

export default function Dashboard({ token }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

    fetchUser();
  }, [token]);

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!user) return <div className="p-4">Caricamento utente...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.profilePicture || "https://placehold.co/100x100"}
          alt="Foto profilo"
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
        />
        <h1 className="text-3xl font-bold">Benvenuto, {user.nomeUtente} 👋</h1>
      </div>

      <p className="text-lg text-gray-700">
        Sei nella tua dashboard personale. Usa la barra di navigazione per accedere ai tuoi team o al tuo profilo.
      </p>
    </div>
  );
}
