import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI, getErrorMessage } from '../lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import AuthBackground from '../components/auth/AuthBackground';
import Button from '../components/ui/Button';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      toast.error(getErrorMessage(error, "Invalid or expired link. Please request a new one."));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-white/[0.04] border border-border-subtle rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all text-sm";
  const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2";

  return (
    <>
      <AuthBackground />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] max-w-md mx-auto px-4 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full glass-panel p-6 sm:p-8"
        >
          <div className="flex justify-center mb-5">
            <Link to="/">
              <img src="/svg/novablog-lockup-dark.svg" alt="NovaBlog" className="h-11 logo-lockup-dark" />
              <img src="/svg/novablog-lockup-light.svg" alt="NovaBlog" className="h-11 logo-lockup-light" />
            </Link>
          </div>
          {!token ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-5 text-red-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white mb-2 tracking-tight">Invalid Reset Link</h1>
              <p className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed">
                This reset link is missing a valid signature token. Please check the email you received or request a new reset link.
              </p>
              <Link to="/forgot-password">
                <Button variant="primary" className="inline-block tracking-wider text-xs py-2.5 px-6 uppercase shadow-[0_0_20px_rgba(139,92,246,0.3)] mx-auto">
                  Request Reset Link
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5 tracking-tight">New password</h1>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  Provide a new, strong password to secure your developer space.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>New Password</label>
                  <div className="relative flex items-center">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••" 
                      className={`${inputClass} pr-12`}
                      required 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <div className="relative flex items-center">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••" 
                      className={`${inputClass} pr-12`}
                      required 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  variant="primary"
                  className="w-full tracking-wider text-sm py-3.5 uppercase mt-8 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : "Update Password"}
                </Button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
