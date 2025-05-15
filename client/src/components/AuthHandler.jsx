import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../axios";

export default function AuthHandler() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      return navigate("/", { replace: true });
    }

    // Persist token & attach directly (no Bearer)
    localStorage.setItem("authToken", token);
    axios.defaults.headers.common["Authorization"] = token;

    axios
      .get("/api/profile/status")
      .then(({ data: { steps } }) => {
        if (!steps.photosCompleted)        navigate("/upload-photos");
        else if (!steps.basicInfoCompleted) navigate("/basic-info");
        else if (!steps.lifestyleCompleted) navigate("/lifestyle");
        else if (!steps.personalityCompleted) navigate("/personality");
        else if (!steps.intentionsCompleted)  navigate("/intentions");
        else                                 navigate("/dashboard");
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        navigate("/", { replace: true });
      });
  }, [params, navigate]);

  return null;
}
