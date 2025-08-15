import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Building2,
  MapPin,
  Layers,
  ChevronDown,
  ChevronUp,
  LogOut,
  Moon,
  Sun
} from "lucide-react";

const sidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    id: "master",
    label: "Master",
    icon: Building2,
    children: [
      {
        id: "institusi",
        label: "Institusi",
        icon: Building2,
        path: "/institusi",
      },
      {
        id: "unit",
        label: "Unit",
        icon: Layers,
        path: "/unit",
      },
      {
        id: "sub-unit",
        label: "Sub Unit",
        icon: Layers,
        path: "/sub-unit",
      },
      {
        id: "lokasi",
        label: "Lokasi",
        icon: MapPin,
        path: "/lokasi",
      },
    ],
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState(["master"]);

  const token = sessionStorage.getItem("token");
  const [user, setUser] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser)); 
      }
      }
  }, [token, navigate]);

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        console.error("Logout gagal");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const renderSidebarItem = (item, depth = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = item.path ? isItemActive(item.path) : false;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              depth > 0 ? "ml-4" : ""
            } ${isActive ? "bg-blue-50 text-blue-700 font-medium" : ""}`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        ) : (
          <Link
            to={item.path || "#"}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              depth > 0 ? "ml-4" : ""
            } ${isActive ? "bg-gray-100 text-blue-700 font-medium" : ""}`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-gray-200 text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children?.map((child) => renderSidebarItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{user.name}</h1>
              <p className="text-xs text-gray-500">{user.username}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => renderSidebarItem(item))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;
