import { useEffect, useState } from "react";
import getCurrentUserId from "../teamUtils/getCurrentUserId.js";


export default function Bacheca({ team, token }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const currentUserId = getCurrentUserId(token);

  const isAdmin = team?.members?.some(
    (m) =>
      String(m.user?._id || m.user) === String(currentUserId) &&
      (m.role === "Admin" || m.role === "Creator")
  );

  const fetchPosts = async () => {
    if (!token || !team?._id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/teams/${team._id}/posts`, {
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
      const res = await fetch(`${API_BASE}/api/teams/${team._id}/posts`, {
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

      // Notifica Telegram

    } catch (err) {
      console.error("Errore handleAddPost:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`${API_BASE}/api/teams/${team._id}/posts/${postId}`, {
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
    <div className="space-y-4 max-w-screen-md mx-auto px-4">
      {isAdmin && (
        <div className="bg-white p-4 rounded shadow space-y-2">
          <textarea
            className="w-full border rounded p-2 text-sm sm:text-base"
            placeholder="Scrivi un nuovo post..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button
            onClick={handleAddPost}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm sm:text-base w-full sm:w-auto"
          >
            Pubblica
          </button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-gray-500 text-center text-sm sm:text-base">Nessun post nella bacheca.</div>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded shadow relative text-sm sm:text-base">
            <div className="text-gray-800">{post.content}</div>
            <div className="text-sm text-gray-500 mt-1">
              Pubblicato da {post.author?.nomeUtente || "Sconosciuto"} il{" "}
              {new Date(post.date).toLocaleString("it-IT")}
            </div>
            {isAdmin && (
              <button
                onClick={() => handleDeletePost(post._id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-sm"
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
