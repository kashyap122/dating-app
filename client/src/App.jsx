import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Error from "./components/Error";
import Login from "./components/Login";
import Register from "./components/Register";
import SetPassword from "./components/SetPassword"; // For Google users
import Dashboard from "./components/Dashboard";
import AuthHandler from "./components/AuthHandler";

// Layout for public and private routes
const AppLayout = () => <Outlet />;

// PrivateRoute Component for auth protection
const PrivateRoute = () => {
  const token = localStorage.getItem("authToken");
  console.log("PrivateRoute → authToken:", token);
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "set-password", element: <SetPassword /> },
      { path: "auth-handler", element: <AuthHandler /> }, // new route here
      {
        element: <PrivateRoute />,
        children: [{ path: "dashboard", element: <Dashboard /> }],
      },
    ],
  },
]);
const App = () => <RouterProvider router={appRouter} />;

export default App;
