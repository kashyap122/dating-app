import React, { useState } from 'react';
import RegisterImage from "../assets/Registration.jpg";
import GoogleIcon from "../assets/Google.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      console.log("Registration successful:", response.data);
      navigate("/")
      // Optional: Redirect to login or clear form
      setFormData({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
    }
  };

  return (
    <div className='bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center min-h-screen'>
      <div className='flex flex-col lg:flex-row max-w-4xl w-full m-2 bg-white rounded-lg shadow-lg overflow-hidden'>

        <div className='hidden lg:block lg:w-1/2'>
          <img src={RegisterImage} alt="Register" className='w-full h-full object-contain' />
        </div>

        <div className='w-full lg:w-1/2 p-6 sm:p-8'>
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create Account</h1>

          <button className="w-full py-2 border border-gray-300 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition duration-200" onClick={handleGoogleLogin}>
            <div className="flex justify-center items-center space-x-3">
              <img src={GoogleIcon} alt="google icon" className='w-5 h-5 object-contain' />
              <span>Register with Google</span>
            </div>
          </button>

          <div className="flex items-center my-4">
            <hr className="w-full border-gray-300" />
            <span className="mx-4 text-gray-600">or</span>
            <hr className="w-full border-gray-300" />
          </div>

          <form className='space-y-4' onSubmit={handleRegister}>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="First Name"
                required
              />
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Last Name"
                required
              />
            </div>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              required
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm Password"
              required
            />

            <button type="submit" className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200">
              Register
            </button>

            <p className="text-sm text-center">
              Already have an account? <Link to="/" className="text-blue-600 hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
