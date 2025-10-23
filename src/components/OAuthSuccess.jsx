import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccess({ onLogin }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      onLogin?.(token);
      navigate("/dashboard", { replace: true }); //vai direttamente alla dashboard
    } else {
      navigate("/", { replace: true }); // fallback se manca il token
    }
  }, [params, navigate, onLogin]);

  return null;
}
