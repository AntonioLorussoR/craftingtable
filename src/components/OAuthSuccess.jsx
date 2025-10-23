import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccess({ onLogin }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token && typeof window !== "undefined") {
      localStorage.setItem("token", token);
      onLogin?.(token);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true }); // fallback se manca il token
    }
  }, [params, navigate, onLogin]);

  return null;
}
