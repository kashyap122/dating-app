// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import Error       from "./components/Error";
import Login       from "./components/Login";
import Register    from "./components/Register";
import SetPassword from "./components/SetPassword";
import AuthHandler from "./components/AuthHandler";
import UserPhotos  from "./components/UserPhotos";
import BasicInfo   from "./components/BasicInfo";
import Lifestyle   from "./components/Lifestyle";
import Personality from "./components/Personality";
import Intentions  from "./components/Intentions";
import Dashboard   from "./components/Dashboard";

const AppLayout = () => <Outlet />;

function StepGuard() {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.get("/api/profile/status")
      .then(res => setSteps(res.data.steps))
      .catch(() => localStorage.removeItem("authToken"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading…</div>;
  if (!steps)  return <Navigate to="/" replace />;

  const path = window.location.pathname;
  if (!steps.photosCompleted && path !== "/upload-photos")      return <Navigate to="/upload-photos" replace />;
  if (!steps.basicInfoCompleted)   return <Navigate to="/basic-info" replace />;
  if (!steps.lifestyleCompleted)   return <Navigate to="/lifestyle" replace />;
  if (!steps.personalityCompleted) return <Navigate to="/personality" replace />;
  if (!steps.intentionsCompleted)  return <Navigate to="/intentions" replace />;

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { index: true,             element: <Login /> },
      { path: "register",        element: <Register /> },
      { path: "set-password",    element: <SetPassword /> },
      { path: "auth-handler",    element: <AuthHandler /> },
      {
        element: <StepGuard />,
        children: [
          { path: "upload-photos", element: <UserPhotos /> },
          { path: "basic-info",    element: <BasicInfo /> },
          { path: "lifestyle",     element: <Lifestyle /> },
          { path: "personality",   element: <Personality /> },
          { path: "intentions",    element: <Intentions /> },
          { path: "dashboard",     element: <Dashboard /> }
        ]
      }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
