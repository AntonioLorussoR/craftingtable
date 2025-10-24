import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    cap: "",
    city: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setMessage("Token mancante. Effettua il login.");
      return;
    }

    fetch(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("Risposta non valida:", text);
          throw new Error("Errore nel caricamento profilo");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setFormData({
          firstName: data.nomeUtente || "",
          lastName: data.cognomeUtente || "",
          email: data.email || "",
          address: data.address || "",
          cap: data.cap || "",
          city: data.city || "",
        });
      })
      .catch((err) => {
        console.error(err);
        setMessage("Errore nel caricamento profilo");
      });
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const updated = await res.json();
      if (res.ok) {
        setUser((prev) => ({ ...prev, ...updated }));
        setMessage("✅ Profilo aggiornato con successo");
      } else {
        setMessage(updated.message || "Errore durante l'aggiornamento");
      }
    } catch {
      setMessage("Errore di connessione");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const formDataObj = new FormData();
    formDataObj.append("profilePicture", profilePicture);

    try {
      const res = await fetch(`${API_BASE}/api/users/me/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      });

      const updated = await res.json();
      if (res.ok) {
        setUser((prev) => ({ ...prev, profilePicture: updated.profilePicture }));
        setMessage("Foto aggiornata!");
      } else {
        setMessage(updated.message || "Errore durante l'upload");
      }
    } catch {
      setMessage("Errore di connessione");
    }
  };

  const handleRemovePicture = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const res = await fetch(`${API_BASE}/api/users/me/profile-picture`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Errore rimozione foto");

      const updated = await res.json();
      setUser((prev) => ({ ...prev, profilePicture: null }));
      setMessage("Foto profilo rimossa");
    } catch (err) {
      console.error("Errore handleRemovePicture:", err);
      setMessage("Errore durante la rimozione");
    }
  };

  const handleDeleteAccount = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const conferma = window.confirm("Vuoi davvero eliminare il tuo account? Questa azione è irreversibile.");
    if (!conferma) return;

    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMessage("Account eliminato");
        localStorage.clear();
        window.location.href = "/";
      } else {
        const data = await res.json();
        setMessage(data.message || "Errore durante l'eliminazione");
      }
    } catch {
      setMessage("Errore di connessione");
    }
  };

  return (
    <div className="max-w-screen-md w-full mx-auto px-4 py-6 sm:px-6 md:px-8 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">Profilo Utente</h2>

      {user ? (
        <div className="flex flex-col gap-4">
          {/* Foto profilo */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <img
              src={user.profilePicture || "https://placehold.co/100x100"}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border"
            />
            <div>
              <input
                type="file"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="border p-2 rounded text-sm sm:text-base"
              />
              <button
                onClick={handleUpload}
                className="bg-green-500 text-white px-4 py-2 rounded text-sm sm:text-base hover:bg-green-600 transition"
              >
                Carica foto
              </button>
              <button
                onClick={handleRemovePicture}
                className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-700 text-sm sm:text-base transition"
              >
                Rimuovi foto
              </button>
            </div>
          </div>

          {/* Form dati personali */}
          <form onSubmit={handleSave} className="flex flex-col gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="Nome"
              value={formData.firstName}
              onChange={handleChange}
              className="border p-2 rounded text-sm sm:text-base w-full"
              readOnly
            />
            <input
              type="text"
              name="lastName"
              placeholder="Cognome"
              value={formData.lastName}
              onChange={handleChange}
              className="border p-2 rounded text-sm sm:text-base w-full"
              readOnly
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded text-sm sm:text-base w-full"
              readOnly
            />
            <input
              type="text"
              name="address"
              placeholder="Indirizzo"
              value={formData.address}
              onChange={handleChange}
              className="border p-2 rounded text-sm sm:text-base w-full"
            />
            <input
              type="text"
              name="cap"
              placeholder="CAP"
              value={formData.cap}
              onChange={handleChange}
              className="border p-2 rounded text-sm sm:text-base w-full"
            />
            <input
              type="text"
              name="city"
              placeholder="Città"
              value={formData.city}
              onChange={handleChange}
              className="border p-2 rounded text-sm sm:text-base w-full"
            />

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Salva modifiche
            </button>
          </form>

          {/* Pulsante eliminazione account */}
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
          >
            Elimina account definitivamente
          </button>

          {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
        </div>
      ) : (
        <p className="text-red-500">{message || "Caricamento profilo..."}</p>
      )}
    </div>
  );
}
