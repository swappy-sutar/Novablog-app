import { useState } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import AuthBackground from '../components/auth/AuthBackground';
import Button from '../components/ui/Button';

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

          <Button 
            type="submit" 
            disabled={isLoading}
            variant="primary"
            className="w-full tracking-wider text-sm py-3.5 uppercase mt-8 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : "Log In"}
          </Button>
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
