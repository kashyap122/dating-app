// src/components/AuthHandler.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default AuthHandler;
