import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { io } from "socket.io-client";


export const socket = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("token") },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
