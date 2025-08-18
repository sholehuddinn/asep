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
  Menu,
  X
} from "lucide-react";
import Swal from 'sweetalert2';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Cek aktif untuk item dan parent
  const isItemActive = (item) => {
    if (item.path) {
      return location.pathname.startsWith(item.path);
    }
    if (item.children) {
      return item.children.some((child) =>
        location.pathname.startsWith(child.path)
      );
    }
    return false;
  };

  const handleLogoutConfirmation = () => {
    Swal.fire({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin keluar dari sistem?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000080',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    // Show loading alert
    Swal.fire({
      title: 'Sedang Logout...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Clear session storage
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      
      // Show success message
      Swal.fire({
        title: 'Logout Berhasil!',
        text: 'Anda berhasil keluar dari sistem',
        icon: 'success',
        confirmButtonColor: '#000080',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate("/login", { replace: true });
      });
      
    } catch (err) {
      console.error("Logout error:", err);
      
      // Show error message but still logout locally
      Swal.fire({
        title: 'Peringatan!',
        text: 'Terjadi kesalahan pada server, namun Anda tetap akan logout dari sistem',
        icon: 'warning',
        confirmButtonColor: '#000080'
      }).then(() => {
        // Even if API call fails, clear local storage and redirect
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login", { replace: true });
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderSidebarItem = (item, depth = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isItemActive(item);
    const hasChildren = item.children && item.children.length > 0;

    const activeClass = "bg-[#000080] text-white font-semibold";
    const inactiveClass = "text-gray-700 hover:text-white hover:font-semibold hover:bg-[#000080]";

    return (
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors ${
              depth > 0 ? "ml-4" : ""
            } ${isActive ? activeClass : inactiveClass}`}
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
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
              depth > 0 ? "ml-4" : ""
            } ${isActive ? activeClass : inactiveClass}`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1 pl-4 space-y-1">
            {item.children?.map((child) => renderSidebarItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const SidebarContent = () => (
    <>
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
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => renderSidebarItem(item))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={handleLogoutConfirmation}
          disabled={isLoggingOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
            isLoggingOut 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "text-gray-700 hover:text-white hover:font-semibold hover:bg-[#000080]"
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#000080] text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col
        fixed lg:static inset-y-0 left-0 z-40
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:ml-0 min-h-screen">
        <div className="pt-16 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Sidebar;