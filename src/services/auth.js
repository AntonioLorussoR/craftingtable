export async function getNewAccessToken() {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "GET",
      credentials: "include", 
    });

    if (!res.ok) throw new Error("Refresh token non valido");

    const data = await res.json();
    return data.token;
  } catch (err) {
    console.error("Errore nel refresh:", err);
    return null;
  }
}
