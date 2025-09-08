import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("username", username); 
      payload.append("password", password);

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          title: "Login failed!",
          text: data.message || "An error occurred during login.",
          icon: "error",
          confirmButtonText: "OK"
        });
         setIsLoading(false);
        return;
      }

      if (data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.users));
      }

      Swal.fire({
        title: "Login successful!",
        text: "Welcome back!",
        icon: "success",
        confirmButtonText: "OK"
      });
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      console.error("Error during login:", err);
      Swal.fire({
        title: "Login failed!",
        text: "Please check your credentials and try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center transform -rotate-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg"></div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            SIM ASET YPCU
          </h1>
          <p className="text-gray-500">Asset Management System</p>
        </div>

        {/* Login Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h2>
            <p className="text-gray-600">
              Sign in to continue managing your assets
            </p>
          </div>

          <div className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Username</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={`w-full pl-12 pr-4 h-14 bg-gray-50/50 border-2 rounded-2xl transition-all duration-200 focus:outline-none focus:bg-white group ${
                    errors.username 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
                  required
                />
                {username && !errors.username && (
                  <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm flex items-center gap-1 ml-1 animate-in slide-in-from-left-1 duration-200">
                  <AlertCircle className="w-4 h-4" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full pl-12 pr-16 h-14 bg-gray-50/50 border-2 rounded-2xl transition-all duration-200 focus:outline-none focus:bg-white ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1 ml-1 animate-in slide-in-from-left-1 duration-200">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 border-2 border-gray-300 rounded-lg text-indigo-600 focus:ring-indigo-500 focus:ring-2 transition-all"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="group relative w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>


          </div>

          {/* Register Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors">
                Create account
              </a>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            🔒 Your connection is secured with enterprise-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
}