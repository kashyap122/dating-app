// src/components/Register.jsx
import React, { useState } from 'react';
import RegisterImage from "../assets/Registration.jpg";
import GoogleIcon from "../assets/Google.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "", lastname: "", username: "",
    email: "", password: "", confirmPassword: ""
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleGoogle = () => window.location.href = "/api/auth/google";

  const handleRegister = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("Passwords must match");
    }
    try {
      await axios.post("/api/auth/register", form);
      navigate("/");
    } catch {
      alert("Registration failed. Try another email or username.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">

        {/* Illustration */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-white">
          <img
            src={RegisterImage}
            alt="Join us"
            className="w-full h-full object-contain"
          />
        </div>


        {/* Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create Your Account
          </h1>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
          >
            <img src={GoogleIcon} alt="Google" className="h-6 w-6" />
            <span className="font-medium text-gray-700">Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-4 text-gray-500">or</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Name, Username, Email, Password */}
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already a member?{" "}
            <Link to="/" className="text-pink-600 font-medium hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
