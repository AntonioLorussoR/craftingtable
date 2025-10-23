import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { io } from "socket.io-client";


export const socket = io(import.meta.env.VITE_API_BASE_URL, {
  auth: { token: localStorage.getItem("token") },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
