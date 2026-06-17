import { useState } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../lib/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import AuthBackground from '../components/auth/AuthBackground';
import Button from '../components/ui/Button';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      if (response.success) {
        toast.success("Reset link sent to your email!");
        setIsSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-white/[0.04] border border-border-subtle rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all text-sm";
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
          {isSent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-cyan">
                <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-4.8a2 2 0 012.22 0l8 4.8A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">Check your email</h1>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                We've sent a password reset link to <span className="text-white font-medium">{email}</span>. Click the link in the email to configure your new password.
              </p>
              <Link to="/signin">
                <Button variant="primary" className="inline-block tracking-wider text-xs py-3 px-6 uppercase shadow-[0_0_20px_rgba(139,92,246,0.3)] mx-auto">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Reset password</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Enter your registered email address and we'll send you instructions to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@nova.dev" 
                    className={inputClass}
                    required 
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  variant="primary"
                  className="w-full tracking-wider text-sm py-3.5 uppercase mt-8 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : "Send Reset Link"}
                </Button>
              </form>

              <div className="text-center mt-6">
                <Link to="/signin" className="text-sm text-brand-cyan hover:text-brand-blue transition-colors font-medium">
                  ← Back to login
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
