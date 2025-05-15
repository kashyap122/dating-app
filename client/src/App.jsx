// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation
} from "react-router-dom";
import axios from "./axios";

import Error from "./components/Error";
import Login from "./components/Login";
import Register from "./components/Register";
import SetPassword from "./components/SetPassword";
import AuthHandler from "./components/AuthHandler";
import UserPhotos from "./components/UserPhotos";
import BasicInfo from "./components/BasicInfo";
import Lifestyle from "./components/Lifestyle";
import Personality from "./components/Personality";
import Intentions from "./components/Intentions";
import Dashboard from "./components/Dashboard";

const AppLayout = () => <Outlet />;

function StepGuard() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState(null);

  // Re-fetch status on every path change:
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setSteps(null);
      setLoading(false);
      return;
    }

    axios.defaults.headers.common["Authorization"] = token;
    setLoading(true);

    axios
      .get("/api/profile/status")
      .then(res => setSteps(res.data.steps))
      .catch(() => {
        localStorage.removeItem("authToken");
        setSteps(null);
      })
      .finally(() => setLoading(false));

    // Notice dependency on location.pathname
  }, [location.pathname]);

  if (loading) {
    return <div className="p-4 text-center">Loading…</div>;
  }

  const token = localStorage.getItem("authToken");
  // If no token or failed fetch → login
  if (!token || !steps) {
    return <Navigate to="/" replace />;
  }

  const p = location.pathname;

  // Guard logic: only redirect if trying to skip ahead
  if (p.startsWith("/basic-info") && !steps.photosCompleted) return <Navigate to="/upload-photos" replace />;
  if (p.startsWith("/lifestyle") && !steps.basicInfoCompleted) return <Navigate to="/basic-info" replace />;
  if (p.startsWith("/personality") && !steps.lifestyleCompleted) return <Navigate to="/lifestyle" replace />;
  if (p.startsWith("/intentions") && !steps.personalityCompleted) return <Navigate to="/personality" replace />;
  if (p.startsWith("/dashboard") && !steps.intentionsCompleted) return <Navigate to="/intentions" replace />;

  // Otherwise render the requested route
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "set-password", element: <SetPassword /> },
      { path: "auth-handler", element: <AuthHandler /> },

      // Protected & guarded routes
      {
        element: <StepGuard />,
        children: [
          { path: "upload-photos", element: <UserPhotos /> },
          { path: "basic-info", element: <BasicInfo /> },
          { path: "lifestyle", element: <Lifestyle /> },
          { path: "personality", element: <Personality /> },
          { path: "intentions", element: <Intentions /> },
          { path: "dashboard", element: <Dashboard /> }
        ]
      }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
