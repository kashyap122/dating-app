import React, { useEffect, useState } from 'react';
import SignInImage from "../assets/SignInImage.jpg";
import GoogleIcon from "../assets/Google.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [authToken] = useState(localStorage.getItem("authToken"));

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", credentials);
      // Directly store the token in localStorage
      localStorage.setItem("authToken", response.data.token);
      console.log("Login successful:", response.data);
      // Optionally update any state if needed:
      // setAuthToken(response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  }
  

  return (
    <div className='bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 w-screen h-screen flex justify-center items-center'>
      <div className='flex rounded-lg shadow-lg overflow-hidden max-w-4xl w-full bg-white'>

        <div className='hidden lg:block w-1/2'>
          <img className='w-full h-full object-cover' src={SignInImage} alt="Sign-In" />
        </div>

        <div className='w-full lg:w-1/2 p-8'>
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h1>

          <button className="w-full py-2 border border-gray-300 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition duration-200" onClick={handleGoogleLogin}>
            <div className="flex justify-center items-center space-x-3 hover:cursor-pointer">
              <img src={GoogleIcon} alt="Google icon" className='w-6 h-6 object-contain' />
              <span>Login with Google</span>
            </div>
          </button>

          <div className="flex items-center my-4">
            <hr className="w-full border-gray-300" />
            <span className="mx-4 text-gray-600">or</span>
            <hr className="w-full border-gray-300" />
          </div>

          <form className='space-y-4' onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              required
            />

            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              required
            />

            <div className="text-right">
              <a href="#" className="text-sm text-blue-500 hover:underline">Forgot your password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
              Login
            </button>

            <div className="text-sm text-center">
              Not registered yet?&nbsp;
              <Link to="/register" className="text-blue-500 hover:underline">Create an Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
