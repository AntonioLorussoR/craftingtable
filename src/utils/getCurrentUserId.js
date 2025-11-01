import { jwtDecode } from "jwt-decode";

export default function getCurrentUserId(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded._id || decoded.id || decoded.userId || decoded.sub || null;
  } catch (err) {
    console.warn("Token non valido:", err);
    return null;
  }
}
