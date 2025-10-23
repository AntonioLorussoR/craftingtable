import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Bacheca({ team, token }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);

  let currentUserId = null;
  try {
    const decoded = jwtDecode(token);
    currentUserId = decoded._id || decoded.id || decoded.userId || decoded.sub;
  } catch (err) {
    console.warn("⚠️ Token non valido:", err);
  }

  const isAdmin = team?.members?.some(
    (m) =>
      String(m.user?._id || m.user) === String(currentUserId) &&
      (m.role === "Admin" || m.role === "Creator")
  );

  const fetchPosts = async () => {
    if (!token || !team?._id) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/teams/${team._id}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Errore fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [team]);

  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/teams/${team._id}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPost }),
      });
      if (!res.ok) throw new Error("Errore aggiunta post");
      const addedPost = await res.json();
      setPosts([addedPost, ...posts]);
      setNewPost("");

      // ✅ Notifica Telegram (opzionale: solo se vuoi feedback visivo lato frontend)
      console.log("✅ Post pubblicato e inoltrato su Telegram");

    } catch (err) {
      console.error("Errore handleAddPost:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/teams/${team._id}/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore eliminazione post");
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Errore handleDeletePost:", err);
    }
  };

  if (loading) return <div>Caricamento bacheca...</div>;

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="bg-white p-4 rounded shadow space-y-2">
          <textarea
            className="w-full border rounded p-2"
            placeholder="Scrivi un nuovo post..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button
            onClick={handleAddPost}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Pubblica
          </button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-gray-500">Nessun post nella bacheca.</div>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded shadow relative">
            <div className="text-gray-800">{post.content}</div>
            <div className="text-sm text-gray-500 mt-1">
              Pubblicato da {post.author?.nomeUtente || "Sconosciuto"} il{" "}
              {new Date(post.date).toLocaleString("it-IT")}
            </div>
            {isAdmin && (
              <button
                onClick={() => handleDeletePost(post._id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
              >
                X
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
