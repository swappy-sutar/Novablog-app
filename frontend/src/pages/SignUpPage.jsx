import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authAPI, getErrorMessage } from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Loader2 } from 'lucide-react';
import AuthBackground from '../components/auth/AuthBackground';
import Button from '../components/ui/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';

const SignUpPage = () => {
  useDocumentTitle("Sign Up");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      navigate("/");
    }
  }, [navigate]);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    agreed: false
  });

  const handleResend = async () => {
    setIsResending(true);
    try {
      const response = await authAPI.resendVerification(formData.email);
      if (response.success) {
        toast.success("Verification link resent to your email!");
        setResendTimer(60);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to resend verification email."));
    } finally {
      setIsResending(false);
    }
  };

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
        toast.success("Account created successfully! Please verify your email.");
        setIsRegistered(true);
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
          {isRegistered ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center border border-brand-purple/20">
                  <Mail className="w-8 h-8 text-brand-purple" />
                </div>
                <div className="absolute inset-0 rounded-full bg-brand-purple/20 blur-xl animate-pulse" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Check your email</h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  We've sent a verification link to <span className="text-brand-cyan font-medium">{formData.email}</span>. Please click the link to activate your account.
                </p>
                <p className="text-gray-400 text-xs">
                  Didn't receive the email? Check your spam folder or try requesting another one.
                </p>
              </div>

              <div className="w-full space-y-3 pt-2">
                <Button 
                  onClick={handleResend}
                  disabled={isResending || resendTimer > 0}
                  variant="secondary"
                  className="w-full !rounded-xl py-2.5 text-xs font-semibold bg-white/[0.06] border border-border-subtle hover:bg-white/[0.1] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Resending Link...
                    </>
                  ) : resendTimer > 0 ? (
                    `Resend in ${resendTimer}s`
                  ) : (
                    "Resend Verification Link"
                  )}
                </Button>
                
                <Link to="/signin" className="block w-full">
                  <Button variant="primary" className="w-full !rounded-xl py-3 text-sm font-semibold">
                    Go to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
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
          </>
        )}
      </motion.div>
    </div>
    </>
  );
};

export default SignUpPage;
