import { useState } from 'react';
import { motion } from 'framer-motion';
import { authAPI, getErrorMessage } from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthBackground from '../components/auth/AuthBackground';
import Button from '../components/ui/Button';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      toast.error(getErrorMessage(error, "Registration failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-white/[0.04] border border-border-subtle rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all text-sm";
  const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5";

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
          <div className="text-center mb-6">
          <div className="flex justify-center mb-5">
            <Link to="/">
              <img src="/svg/novablog-lockup-dark.svg" alt="NovaBlog" className="h-11 logo-lockup-dark" />
              <img src="/svg/novablog-lockup-light.svg" alt="NovaBlog" className="h-11 logo-lockup-light" />
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5 tracking-tight">
            Create an account
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm px-2">
            Join the playground for digital storytellers and developers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex items-center gap-3 py-0.5">
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

          <Button 
            type="submit" 
            disabled={isLoading}
            variant="primary"
            className="w-full tracking-wider text-sm py-3 uppercase mt-1 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : "Create Account"}
          </Button>
        </form>
        
        <p className="mt-5 text-center text-sm text-gray-400">
          Already have an account? <Link to="/signin" className="text-brand-cyan hover:text-brand-blue transition-colors font-medium">Log in</Link>
        </p>
      </motion.div>
    </div>
    </>
  );
};

export default SignUpPage;
