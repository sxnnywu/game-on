import React, { useState, useEffect } from 'react';
import './Auth.css';
import { Eye, EyeOff, Mail, Lock, User, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [puckPosition, setPuckPosition] = useState(0);
  const [error, setError] = useState('');

  {/* Animated puck movement */}
  useEffect(() => {
    const interval = setInterval(() => {
      setPuckPosition(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  {/* Handling Input */}
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  {/* Handling Submission */}
  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = process.env.REACT_APP_API_URL;
    const endpoint = isLogin
      ? `${API_URL}/api/auth/login`
      : `${API_URL}/api/auth/signup`;
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password, username: formData.username };
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        console.error("Failed to parse JSON:", jsonErr);
        return;
      }
      if (!response.ok) {
        setError(data.message || "Something went wrong");
        return;
      }
      setError('');
      localStorage.setItem('token', data.token);
      //localStorage.setItem('userId', data.userID);
      navigate('/dashboard');
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  {/* Inputs */}
  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', confirmPassword: '', username: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full h-px bg-white opacity-10 transform rotate-12"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-white opacity-10 transform -rotate-12"></div>
        <div className="absolute top-20 left-20 w-8 h-8 bg-white rounded-full opacity-5 animate-bounce"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 bg-white rounded-full opacity-5 animate-ping"></div>
        <div
          className="absolute top-1/3 w-4 h-4 bg-white rounded-full opacity-20 transition-all duration-100"
          style={{ left: `${puckPosition}%` }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen py-12">

        {/* Left Side - Branding */}
        <div className="text-center lg:text-left animate-fade-in">
          <div className="flex items-center justify-center lg:justify-start mb-4">
            <div className="relative">
              <Zap className="w-20 h-20 text-white animate-pulse" />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 tracking-wide leading-tight">
            Puck<span className="text-purple-300"> Yeah!</span>
          </h1>
          <p className="text-purple-200 text-xl lg:text-2xl mb-6 leading-relaxed">
            Women's Hockey. Reimagined.
          </p>
          <p className="text-purple-300 text-lg lg:text-xl max-w-lg mx-auto lg:mx-0">
            Build your ultimate team, compete with friends, and dominate the ice in an exciting fantasy hockey experience.
          </p>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-500 hover:scale-105">
            {/* Toggle Buttons */}
            <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${isLogin
                  ? 'bg-white text-purple-900 shadow-lg transform scale-105'
                  : 'text-white hover:bg-white/10'
                  }`}
              >
                LOGIN
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${!isLogin
                  ? 'bg-white text-purple-900 shadow-lg transform scale-105'
                  : 'text-white hover:bg-white/10'
                  }`}
              >
                SIGN UP
              </button>
            </div>
            {/* Form */}
            <div className="space-y-6">
              {/* Username (Sign Up only) */}
              {!isLogin && (
                <div className="relative group animate-slide-up">
                  <div className="absolute left-4 top-5 w-5 h-5 text-purple-300 group-hover:text-white transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  {/* Error message placeholder */}
                  <p className="text-white text-sm mt-1 min-h-[1rem]">{error}</p>
                </div>
              )}
              {/* Email */}
              <div className="relative group animate-slide-up">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300 group-hover:text-white transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {/* Password */}
              <div className="relative group animate-slide-up">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300 group-hover:text-white transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {/* Confirm Password (Sign Up only) */}
              {!isLogin && (
                <div className="relative group animate-slide-up">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300 group-hover:text-white transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              )}
              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-300 hover:from-purple-500 hover:to-purple-600 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-500/50 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isLogin ? 'ENTER THE RINK' : 'JOIN THE LEAGUE'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-purple-200 text-sm">
                {isLogin ? "New to Puck Yeah?" : "Already have an account?"}
                <button
                  onClick={switchMode}
                  className="ml-2 text-white font-semibold hover:text-purple-300 transition-colors underline decoration-2 underline-offset-4"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;