import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, Shield, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [detailRoles, setDetailRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [roleMap, setRoleMap] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    role: "",
    detailRole: "",
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${BASE_URL}/role`);
        const data = await res.json();
        setRoles(data.roles || []);

        // bikin mapping otomatis
        const mapping = {};
        data.roles.forEach(role => {
          const name = role.name.toLowerCase();
          if (name.includes("institute")) mapping[role.id] = "institute";
          else if (name.includes("unit") && !name.includes("sub")) mapping[role.id] = "unit";
          else if (name.includes("sub")) mapping[role.id] = "subunit";
          else if (name.includes("lokasi") || name.includes("location")) mapping[role.id] = "location";
        });
        setRoleMap(mapping);

      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);


  const defaultDetailRole = {
    1: 1,
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const levels = [
      { strength: 0, text: "Very Weak", color: "bg-red-500" },
      { strength: 1, text: "Weak", color: "bg-red-400" },
      { strength: 2, text: "Fair", color: "bg-yellow-400" },
      { strength: 3, text: "Good", color: "bg-blue-400" },
      { strength: 4, text: "Strong", color: "bg-green-400" },
      { strength: 5, text: "Very Strong", color: "bg-green-500" },
    ];

    return levels[score];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Username is required";
    if (!formData.role) newErrors.role = "Role selection is required";
    if (detailRoles.length > 0 && !formData.detailRole) newErrors.detailRole = "Detail role selection is required";
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    if (!formData.agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${BASE_URL}/role`);
        const data = await res.json();
        setRoles(data.roles || []);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  // Fetch detail roles
  useEffect(() => {
    const fetchDetailRoles = async () => {
      const roleId = parseInt(formData.role);
      if (!roleId) {
        setDetailRoles([]);
        setFormData(prev => ({ ...prev, detailRole: "" }));
        return;
      }

      if (defaultDetailRole[roleId]) {
        setDetailRoles([]);
        setFormData(prev => ({ ...prev, detailRole: defaultDetailRole[roleId] }));
        return;
      }

      const endpoint = roleMap[roleId];
      if (!endpoint) return;

      try {
        const res = await fetch(`${BASE_URL}/${endpoint}`);
        const data = await res.json();

        let list = [];
        switch (endpoint) {
          case "unit":
            list = data.units || [];
            break;
          case "institute":
            list = data.institutes || [];
            break;
          case "subunit":
            list = data.subunits || [];
            break;
          case "location":
            list = data.locations || [];
            break;
          default:
            list = [];
        }

        setDetailRoles(list);
        setFormData(prev => ({ ...prev, detailRole: "" }));
      } catch (err) {
        console.error("Error fetching detail roles:", err);
      }
    };

    fetchDetailRoles();
  }, [formData.role]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      payload.append("username", formData.email);
      payload.append("password", formData.password);
      payload.append("name", formData.fullName);
      payload.append("role_id", formData.role);
      payload.append("detail_id", formData.detailRole);

      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed!");
        return;
      }

      alert("Registration successful!");
      window.location.href = "/login";
    } catch (err) {
      console.error("Error during registration:", err);
      alert("An error occurred while registering.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-lg flex items-center justify-center transform rotate-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center transform -rotate-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl"></div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SIM ASET YPCU
          </h1>
          <p className="text-gray-500 text-sm mt-1">Asset Management System</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Create Account</h2>
            <p className="text-gray-600">
              Join us to manage assets and projects efficiently
            </p>
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={e => handleInputChange("fullName", e.target.value)}
                  className={`w-full pl-12 pr-4 h-14 bg-gray-50/50 border-2 rounded-2xl transition-all duration-200 focus:outline-none focus:bg-white ${
                    errors.fullName 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
                  required
                />
                {formData.fullName && !errors.fullName && (
                  <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm flex items-center gap-1 ml-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={formData.email}
                  onChange={e => handleInputChange("email", e.target.value)}
                  className={`w-full pl-12 pr-4 h-14 bg-gray-50/50 border-2 rounded-2xl transition-all duration-200 focus:outline-none focus:bg-white ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
                  required
                />
                {formData.email && !errors.email && (
                  <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center gap-1 ml-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Role</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={formData.role}
                  onChange={e => handleInputChange("role", e.target.value)}
                  className={`w-full pl-12 pr-12 h-14 bg-gray-50/50 border-2 rounded-2xl appearance-none transition-all duration-200 focus:outline-none focus:bg-white ${
                    errors.role 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
                  required
                >
                  <option value="">Select your role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm flex items-center gap-1 ml-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.role}
                </p>
              )}
            </div>

            {/* Detail Role */}
            {detailRoles.length > 0 && (
              <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                <label className="text-sm font-medium text-gray-700 ml-1">Detail Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={formData.detailRole}
                    onChange={e => handleInputChange("detailRole", e.target.value)}
                    className={`w-full pl-12 pr-12 h-14 bg-gray-50/50 border-2 rounded-2xl appearance-none transition-all duration-200 focus:outline-none focus:bg-white ${
                      errors.detailRole 
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                    }`}
                    required
                  >
                    <option value="">Select detail role</option>
                    {detailRoles.map(dr => (
                      <option key={dr.id} value={dr.id}>{dr.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
                {errors.detailRole && (
                  <p className="text-red-500 text-sm flex items-center gap-1 ml-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.detailRole}
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={e => handleInputChange("password", e.target.value)}
                  className={`w-full pl-12 pr-16 h-14 bg-gray-50/50 border-2 rounded-2xl transition-all duration-200 focus:outline-none focus:bg-white ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Password strength</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength >= 3 ? 'text-green-600' : 
                      passwordStrength.strength >= 2 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1 ml-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={e => handleInputChange("confirmPassword", e.target.value)}
                  className={`w-full pl-12 pr-16 h-14 bg-gray-50/50 border-2 rounded-2xl transition-all duration-200 focus:outline-none focus:bg-white ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <CheckCircle2 className="absolute right-12 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm flex items-center gap-1 ml-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3 p-4 bg-gray-50/50 rounded-2xl">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={e => handleInputChange("agreeToTerms", e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                  I agree to the{" "}
                  <a href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm flex items-center gap-1 ml-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}