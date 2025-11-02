import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext();

let socket;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

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
  };

  useEffect(() => {
    if (token) {
      if (!socket) {
        socket = io(import.meta.env.VITE_API_BASE_URL, {
          transports: ["websocket", "polling"],
          withCredentials: true,
          auth: { token },
        });
      } else {
        socket.auth = { token };
        socket.connect();
      }
    } else {
      if (socket) socket.disconnect();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
}
