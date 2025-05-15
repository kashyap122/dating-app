// src/components/Login.jsx
import { useEffect, useState } from 'react';
import SignInImage from "../assets/SignInImage.jpg"; // ideally swap for a dating-themed illustration
import GoogleIcon  from "../assets/Google.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axios';

export default function Login() {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ email: "", password: "" });

  // If token exists, keep it
  useEffect(() => {
    const t = localStorage.getItem("authToken");
    if (!t) localStorage.removeItem("authToken");
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setCreds(prev => ({ ...prev, [name]: value }));
  };

  const handleGoogle = () => window.location.href = "/api/auth/google";

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/login", creds);
      localStorage.setItem("authToken", data.token);
      navigate("/upload-photos");
    } catch {
      alert("Login failed. Check your email & password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        
        {/* Illustration */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={SignInImage}
            alt="Find your match"
            className="object-cover h-full w-full"
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back
          </h1>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <img src={GoogleIcon} alt="Google" className="h-6 w-6" />
            <span className="font-medium text-gray-700">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-4 text-gray-500">or</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Email / Password */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={creds.email}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={creds.password}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="text-right">
              <Link to="#" className="text-sm text-pink-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
            >
              Log In
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            New here?{" "}
            <Link to="/register" className="text-pink-600 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
