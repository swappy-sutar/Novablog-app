import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../lib/api';
import toast from 'react-hot-toast';
import AuthBackground from '../components/auth/AuthBackground';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset token.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.resetPassword({
        token,
        password: formData.password
      });

      if (response.success) {
        toast.success("Password updated successfully! Redirecting...");
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired link. Please request a new one.");
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
          {!token ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">Invalid Reset Link</h1>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                This reset link is missing a valid signature token. Please check the email you received or request a new reset link.
              </p>
              <Link to="/forgot-password" className="inline-block bg-gradient-premium text-white font-bold tracking-wider text-xs py-3 px-6 rounded-md uppercase hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
                Request Reset Link
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">New password</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Provide a new, strong password to secure your developer space.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClass}>New Password</label>
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

                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className={inputClass}
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-premium hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] text-white font-bold tracking-wider text-sm py-3.5 rounded-md transition-all uppercase disabled:opacity-70 flex items-center justify-center gap-2 mt-8 cursor-pointer"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : "Update Password"}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
