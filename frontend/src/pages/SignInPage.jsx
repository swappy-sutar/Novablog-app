import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import AuthBackground from '../components/auth/AuthBackground';

const SignInPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);
      
      if (response.success) {
        toast.success("Welcome back!");
        
        // Save tokens
        localStorage.setItem('accessToken', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
        
        // Notify Navbar of auth change
        window.dispatchEvent(new Event('auth-change'));

        // Redirect to home/feed
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-transparent border border-border-subtle rounded-md px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple transition-colors text-sm";
  const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2";

  return (
    <>
      <AuthBackground />
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-md mx-auto px-4 relative z-10">
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full glass-panel p-8 sm:p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-400 text-sm px-4">
            Log in to continue where you left off.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@nova.dev" 
              className={inputClass}
              required 
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" className="text-xs text-brand-cyan hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                className={inputClass}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-premium hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] text-white font-bold tracking-wider text-sm py-3.5 rounded-md transition-all uppercase disabled:opacity-70 flex items-center justify-center gap-2 mt-8"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Log In"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account? <Link to="/signup" className="text-brand-cyan hover:text-brand-blue transition-colors font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
    </>
  );
};

export default SignInPage;
