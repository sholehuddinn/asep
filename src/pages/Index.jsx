import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        {/* Logo and Brand */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-800 rounded-3xl flex items-center justify-center">
            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-xl"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SIM ASET YPCU</h1>
          <p className="text-gray-600 text-lg">
            Sistem Informasi Manajemen Aset
          </p>
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome to SIM ASET YPCU
          </h2>
          <p className="text-gray-600 mb-6">
            Manage your assets and projects efficiently with our comprehensive system.
            Please sign in to your account or create a new one to get started.
          </p>

        {/* Action Buttons */}
          <div className="space-y-3">
            <Link to="/login" className="block">
              <button
                type="button"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl inline-flex items-center justify-center"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </button>
            </Link>

            <Link to="/register" className="block">
              <button
                type="button"
                className="w-full h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-xl inline-flex items-center justify-center"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500">
          © 2024 YPCU. All rights reserved.
        </p>
      </div>
    </div>
  );
}
