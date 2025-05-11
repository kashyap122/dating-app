import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId"); // passed in Google callback

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !password) return;

    try {
      const res = await axios.post("http://localhost:3000/api/auth/set-password", {
        userId,
        newPassword: password,
      });

      setMsg(res.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      setMsg("Failed to set password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h2 className="text-xl font-semibold">Set Your Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="Enter new password"
          className="p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Set Password
        </button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default SetPassword;
