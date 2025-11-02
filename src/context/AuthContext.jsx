import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [socket, setSocket] = useState(null);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    if (socket) socket.disconnect();
    setSocket(null);
  };

  useEffect(() => {
    if (token) {
      const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        auth: { token },
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
}
