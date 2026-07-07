import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authAPI, getErrorMessage } from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthBackground from '../components/auth/AuthBackground';
import Button from '../components/ui/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';

const saveUserToLocalStorage = (data) => {
  if (!data) return;
  localStorage.setItem(
    'user',
    JSON.stringify({
      id: data.id,
      firstname: data.firstname,
      lastname: data.lastname,
      username: data.username,
      email: data.email,
      avatar: data.avatar,
      bio: data.bio,
      websiteUrl: data.websiteUrl,
      githubUrl: data.githubUrl,
      techStack: data.techStack,
      role: data.role,
    })
  );
};

const SignInPage = () => {
  useDocumentTitle("Sign In");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      navigate("/");
    }
  }, [navigate]);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);
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
    email: '',
    password: ''
  });

  // 2FA login states
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [tempUserId, setTempUserId] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);
      
      if (response.success) {
        if (response.data?.isTwoFactorRequired) {
          setIs2FARequired(true);
          setTempUserId(response.data.userId);
          setIsLoading(false);
          return;
        }

        toast.success("Welcome back!");
        
        // Save tokens
        localStorage.setItem('accessToken', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        saveUserToLocalStorage(response.data.user); 
        
        // Notify Navbar of auth change
        window.dispatchEvent(new Event('auth-change'));

        // Redirect to home/feed
        navigate('/');
      }
    } catch (error) {
      const errMsg = getErrorMessage(error, "Invalid credentials. Please try again.");
      toast.error(errMsg);
      if (errMsg.toLowerCase().includes("verify your email")) {
        setShowResendOption(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsResending(true);
    try {
      const response = await authAPI.resendVerification(formData.email);
      if (response.success) {
        toast.success("Verification link sent! Check your inbox.");
        setResendTimer(60);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to resend verification email."));
    } finally {
      setIsResending(false);
    }
  };

  const handle2FAVerifySubmit = async (e) => {
    e.preventDefault();
    if (twoFactorCode.trim().length !== 6) {
      toast.error('Please enter a 6-digit verification code');
      return;
    }
    setIsVerifying2FA(true);
    try {
      const response = await authAPI.verify2FALogin({
        userId: tempUserId,
        code: twoFactorCode.trim(),
      });
      if (response.success) {
        toast.success("Welcome back!");
        localStorage.setItem('accessToken', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        saveUserToLocalStorage(response.data.user); 
        
        window.dispatchEvent(new Event('auth-change'));
        navigate('/');
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Invalid verification code. Please try again."));
    } finally {
      setIsVerifying2FA(false);
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
        <div className="text-center mb-6">
          <div className="flex justify-center mb-5">
            <Link to="/">
              <img src="/svg/novablog-lockup-dark.svg" alt="NovaBlog" className="h-11 logo-lockup-dark" />
              <img src="/svg/novablog-lockup-light.svg" alt="NovaBlog" className="h-11 logo-lockup-light" />
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5 tracking-tight">
            {is2FARequired ? "Two-Factor Auth" : "Welcome back"}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm px-4">
            {is2FARequired ? "Enter the 6-digit code from your authenticator app." : "Log in to continue where you left off."}
          </p>
        </div>

        {is2FARequired ? (
          <form onSubmit={handle2FAVerifySubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Verification Code</label>
              <input 
                type="text" 
                name="twoFactorCode"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000" 
                className="w-full bg-white/[0.04] border border-border-subtle rounded-xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all"
                required 
                maxLength={6}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isVerifying2FA || twoFactorCode.length !== 6}
              variant="primary"
              className="w-full tracking-wider text-sm py-3.5 uppercase mt-8 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              {isVerifying2FA ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : "Verify & Log In"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setIs2FARequired(false);
                setTwoFactorCode('');
              }}
              className="w-full text-center text-xs text-brand-cyan hover:underline mt-4 cursor-pointer block"
            >
              Back to Login
            </button>
          </form>
        ) : (
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

            {showResendOption && (
              <div className="text-xs text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 p-3 rounded-xl flex items-center justify-between">
                <span>Email not verified yet?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending || resendTimer > 0}
                  className="font-bold underline hover:text-brand-blue transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : resendTimer > 0 ? (
                    `Resend in ${resendTimer}s`
                  ) : (
                    "Resend Link"
                  )}
                </button>
              </div>
            )}

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
        )}
        
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account? <Link to="/signup" className="text-brand-cyan hover:text-brand-blue transition-colors font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
    </>
  );
};

export default SignInPage;
