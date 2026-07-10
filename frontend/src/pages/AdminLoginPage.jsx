import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ShieldCheck, Lock, Mail, AlertTriangle } from 'lucide-react';
import { authAPI, getErrorMessage } from '../lib/api';
import toast from 'react-hot-toast';
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
      role: data.role,
    })
  );
};

// Animated grid background
const AdminBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Deep dark base */}
    <div className="absolute inset-0 bg-[#05050f]" />

    {/* Grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(139,92,246,0.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139,92,246,0.8) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}
    />

    {/* Center glow — red/orange for "admin danger" aesthetic */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/5 blur-[100px]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-brand-purple/8 blur-[60px]" />

    {/* Corner accents */}
    <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-red-900/5 blur-[80px]" />
    <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-purple-900/6 blur-[80px]" />

    {/* Floating particles */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-red-500/30"
        style={{
          left: `${15 + i * 14}%`,
          top: `${20 + (i % 3) * 25}%`,
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 3 + i * 0.5,
          repeat: Infinity,
          delay: i * 0.4,
        }}
      />
    ))}
  </div>
);

const AdminLoginPage = () => {
  useDocumentTitle('Admin Login — NovaBlog');

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored && stored !== 'undefined') {
      try {
        const user = JSON.parse(stored);
        if (user?.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          // Logged in but not admin — don't redirect, let them try
        }
      } catch (_) {}
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);

      if (response.success) {
        const user = response.data?.user;

        // Check ADMIN role
        if (user?.role !== 'ADMIN') {
          setAttempts((p) => p + 1);
          setError('Access denied. This portal is restricted to administrators only.');
          setIsLoading(false);
          return;
        }

        // Save tokens and user
        localStorage.setItem('accessToken', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        saveUserToLocalStorage(user);
        window.dispatchEvent(new Event('auth-change'));

        toast.success(`Welcome back, ${user.firstname || 'Admin'}!`);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setAttempts((p) => p + 1);
      const msg = getErrorMessage(err, 'Invalid credentials. Please try again.');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <AdminBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Header badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            Restricted Access
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative bg-[#0b0c1e]/80 backdrop-blur-xl border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Top red accent line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent" />

          {/* Corner glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-red-500/5 blur-2xl pointer-events-none" />

          <div className="p-8 sm:p-10">
            {/* Logo + Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-purple-600/20 border border-red-500/20 mb-4">
                <Lock className="w-7 h-7 text-red-400" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Nova<span className="text-red-400">Blog</span> Admin
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                Sign in to access the admin dashboard
              </p>
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Too many attempts warning */}
            {attempts >= 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-5 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs text-center"
              >
                Multiple failed attempts detected. Ensure you are using admin credentials.
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide uppercase">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@novablog.com"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide uppercase">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-900/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Sign In to Admin Panel
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer note */}
            <p className="text-center text-xs text-gray-600 mt-6">
              Not an admin?{' '}
              <a href="/signin" className="text-gray-400 hover:text-gray-200 transition-colors underline underline-offset-2">
                Go to regular sign in
              </a>
            </p>
          </div>
        </motion.div>

        {/* Security note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-[10px] text-gray-700 mt-5 tracking-wide"
        >
          🔒 This is a secured admin portal. All access attempts are logged.
        </motion.p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
