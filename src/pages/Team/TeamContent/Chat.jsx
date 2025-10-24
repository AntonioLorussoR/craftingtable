import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

export default function Chat({ team, token, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  
  useEffect(() => {
    if (!team) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(`${API_BASE}`, {
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connesso!");
      setSocketConnected(true);
      socketRef.current.emit("joinTeam", team._id);
    });

    socketRef.current.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.emit("getMessages", team._id, (historical) => {
      setMessages(historical);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [team, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socketConnected) return;
    socketRef.current.emit("sendMessage", {
      teamId: team._id,
      content: newMessage,
    });
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-full border rounded p-2 w-full max-w-screen-md mx-auto">
      <h3 className="text-xl font-semibold mb-2">Chat del Team</h3>
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded text-sm sm:text-base ${
              msg.author?._id === currentUserId
              ? "bg-blue-100 text-right"
              : "bg-gray-100 text-left"
            }`}
          >
            <div>
              <strong>
                {msg.author?.nomeUtente || "Anonimo"}{" "}
                {msg.author?.cognomeUtente || ""}
              </strong>
              <span className="text-sm text-gray-500">
                {" "}
                ({msg.author?.email || "email sconosciuta"})
              </span>
            </div>
            <div>{msg.content}</div>
            <div className="text-xs text-gray-400">
              {new Date(msg.date).toLocaleString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Scrivi un messaggio..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="border rounded p-2 text-sm sm:text-base w-full"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
        >
          Invia
        </button>
      </div>
    </div>
  );
}
