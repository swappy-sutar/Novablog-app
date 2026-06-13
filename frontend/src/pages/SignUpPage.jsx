import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import AuthBackground from '../components/auth/AuthBackground';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    agreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      toast.error("Please agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);
    try {
      // Create payload matching backend requirements
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      const response = await authAPI.register(payload);
      
      if (response.success) {
        toast.success("Account created successfully!");
        // Auto login or redirect to signin
        navigate('/signin');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-transparent border border-border-subtle rounded-md px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple transition-colors text-sm";
  const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2";

  return (
    <>
      <AuthBackground />
      <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-md mx-auto px-4 relative z-10">
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full glass-panel p-8 sm:p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            Create an account
          </h1>
          <p className="text-gray-400 text-sm px-2">
            Join the playground for digital storytellers and developers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className={labelClass}>First Name</label>
              <input 
                type="text" 
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Alex" 
                className={inputClass}
                required 
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Last Name</label>
              <input 
                type="text" 
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Rivera" 
                className={inputClass}
                required 
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Username</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="arivera_dev" 
              className={inputClass}
              required 
            />
          </div>

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
            <label className={labelClass}>Password</label>
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

          <div className="flex items-center gap-3 py-1">
            <input 
              type="checkbox" 
              name="agreed"
              checked={formData.agreed}
              onChange={handleChange}
              id="terms" 
              className="w-4 h-4 rounded border-gray-600 bg-transparent text-brand-purple focus:ring-brand-purple focus:ring-offset-bg-base"
            />
            <label htmlFor="terms" className="text-xs text-gray-400">
              I agree to the <span className="text-white hover:underline cursor-pointer">Terms</span> and <span className="text-white hover:underline cursor-pointer">Privacy</span>.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-premium hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] text-white font-bold tracking-wider text-sm py-3.5 rounded-md transition-all uppercase disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Create Account"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <Link to="/signin" className="text-brand-cyan hover:text-brand-blue transition-colors font-medium">Log in</Link>
        </p>
      </motion.div>
    </div>
    </>
  );
};

export default SignUpPage;
