import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Read token from the query parameter "token"
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      // Save token in localStorage under 'authToken'
      localStorage.setItem("authToken", token);
      // Clean up the URL (remove the query string)
      navigate("/dashboard", { replace: true });
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <button 
        className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200" 
        onClick={handleLogout}
      >
        Logout
      </button>
      <div className="mt-4">Welcome to your Dashboard!</div>
    </div>
  );
};

export default Dashboard;
