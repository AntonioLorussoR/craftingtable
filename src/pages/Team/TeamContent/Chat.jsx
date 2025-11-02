import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Chat({ team }) {
  const { token, user, socket } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!team || !socket) return;

    socket.emit("joinTeam", team._id);

    socket.emit("getMessages", team._id, (historical) => {
      setMessages(historical);
    });

    const handleIncoming = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chatMessage", handleIncoming);

    return () => {
      socket.off("chatMessage", handleIncoming);
    };
  }, [team, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    socket.emit("sendMessage", {
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
              msg.author?._id === user?.id
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
