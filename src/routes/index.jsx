import { createBrowserRouter } from "react-router-dom";

import Index from "../pages/Index";
import Sidebar from "../layout/Sidebar";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Institusi from "../pages/Institusi";
import Unit from "../pages/Unit";
import SubUnit from "../pages/SubUnit";
import Lokasi from "../pages/Lokasi";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/",
    element: <Sidebar />, 
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "institusi", element: <Institusi /> },
      { path: "unit", element: <Unit /> },
      { path: "sub-unit", element: <SubUnit /> },
      { path: "lokasi", element: <Lokasi /> },
    ],
  },
]);

export default router;
