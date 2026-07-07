import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { notificationsAPI, authAPI } from "../../lib/api";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { connectSocket, disconnectSocket } from "../../lib/socket";
import toast from "react-hot-toast";

const searchPhrases = [
  "Search 'React hooks'...",
  "Search 'System Design'...",
  "Search 'Framer Motion'...",
  "Search 'Next.js 14'...",
];

const Navbar = () => {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");
  const [isDark, setIsDark] = useState(() => {
    try {
      const raw = localStorage.getItem('novablog_settings_prefs_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.theme === 'light') return false;
        if (parsed.theme === 'dark') return true;
      }
    } catch {
      /* ignore */
    }
    return !document.documentElement.classList.contains('light-mode');
  });
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isMyBlogs = location.pathname === "/my-blogs";
  const isFeed = location.pathname === "/feed";
  const isExplore = location.pathname === "/explore";
  const isAbout = location.pathname === "/about";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
    }
  };

  const linkActiveStyle =
    "text-brand-purple relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-brand-purple after:rounded-full";
  const linkInactiveStyle = "text-text-muted hover:text-text-input transition-colors";

  useEffect(() => {
    // Check theme
    if (isDark) {
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
    }
  }, [isDark]);

  useEffect(() => {
    // Sync auth status across tabs and within the app
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          console.error("Failed to parse user from local storage");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    // Also listen to raw storage events in case of cross-tab logout
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    const syncTheme = () => {
      try {
        const raw = localStorage.getItem('novablog_settings_prefs_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          setIsDark(parsed.theme !== 'light');
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    try {
      const key = 'novablog_settings_prefs_v1';
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : { theme: 'dark' };
      parsed.theme = nextDark ? 'dark' : 'light';
      localStorage.setItem(key, JSON.stringify(parsed));
      window.dispatchEvent(new Event('storage'));
    } catch {
      /* ignore */
    }
  };

  const notificationsRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const profileDropdownRef = useRef(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showProfileDropdown]);

  const handleLogout = () => {
    authAPI.logout();
    setShowProfileDropdown(false);
    navigate("/signin");
  };

  // Load and subscribe to notifications
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        setNotifications([]);
      }, 0);
      disconnectSocket();
      return () => clearTimeout(timer);
    }

    const loadNotifications = async () => {
      try {
        const res = await notificationsAPI.getNotifications();
        if (res.success && res.data) {
          setNotifications(res.data);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };

    loadNotifications();

    const socketInstance = connectSocket();
    if (socketInstance) {
      const handleIncomingNotification = (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        toast.success(newNotification.message, {
          icon: "🔔",
          duration: 4000,
          style: {
            background: "#0f0f23",
            color: "#fff",
            border: "1px solid rgba(6, 182, 212, 0.2)",
          },
        });
      };
      
      socketInstance.on("notification", handleIncomingNotification);

      return () => {
        socketInstance.off("notification", handleIncomingNotification);
      };
    }
  }, [user]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showNotifications]);

  const handleMarkAllRead = async () => {
    try {
      const res = await notificationsAPI.markAllAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      const res = await notificationsAPI.markAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error(`Failed to mark notification ${id} as read:`, err);
    }
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return "";
    }
  };

  const handleNavClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
    }
  };


  const [placeholder, setPlaceholder] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = searchPhrases[phraseIdx];

    if (!isDeleting && charIdx === currentPhrase.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIdx === 0) {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % searchPhrases.length);
      }, 500);
      return () => clearTimeout(timeout);
    }

    const typingSpeed = isDeleting ? 40 : 100;
    const timeout = setTimeout(() => {
      setCharIdx((prev) => prev + (isDeleting ? -1 : 1));
      setPlaceholder(
        currentPhrase.substring(0, charIdx + (isDeleting ? -1 : 1)),
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, phraseIdx]);

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel !rounded-none border-t-0 border-x-0 bg-bg-base/70">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/svg/novablog-lockup-dark.svg" alt="NovaBlog" className="h-12 logo-lockup-dark" />
          <img src="/svg/novablog-lockup-light.svg" alt="NovaBlog" className="h-12 logo-lockup-light" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/feed"
            onClick={(e) => handleNavClick(e, "/feed")}
            className={isFeed ? linkActiveStyle : linkInactiveStyle}
          >
            Feed
          </Link>
          <Link
            to="/explore"
            onClick={(e) => handleNavClick(e, "/explore")}
            className={isExplore ? linkActiveStyle : linkInactiveStyle}
          >
            Explore
          </Link>
          <Link
            to="/my-blogs"
            onClick={(e) => handleNavClick(e, "/my-blogs")}
            className={isMyBlogs ? linkActiveStyle : linkInactiveStyle}
          >
            My Blogs
          </Link>
          <Link
            to="/about"
            onClick={(e) => handleNavClick(e, "/about")}
            className={isAbout ? linkActiveStyle : linkInactiveStyle}
          >
            About Us
          </Link>
        </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex relative items-center group">
              <svg
                className="w-4 h-4 absolute left-3 text-gray-400 group-focus-within:text-brand-cyan transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder={placeholder}
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="bg-border-subtle/30 border border-border-subtle focus:border-brand-cyan/50 rounded-full py-2 pl-10 pr-4 text-sm text-text-input placeholder-text-muted/50 w-64 transition-all duration-300 focus:w-80 focus:outline-none focus:bg-border-subtle/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              />
            </form>

            <button
              onClick={toggleTheme}
              className="relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors rounded-full hover:bg-border-subtle"
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.svg
                    key="moon"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 absolute"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="sun"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 absolute"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-4 border-l border-border-subtle pl-4 ml-2 min-w-[150px] justify-end">
              <AnimatePresence mode="wait">
                {user ? (
                  <motion.div
                    key="logged-in"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-4"
                  >
                    {/* Notifications */}
                    <div className="relative" ref={notificationsRef}>
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors rounded-full hover:bg-border-subtle cursor-pointer"
                        aria-label="Notifications"
                      >
                        <Bell className="w-5 h-5" />
                         {notifications.some((n) => !n.isRead) && (
                           <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-purple rounded-full shadow-[0_0_8px_#8b5cf6] animate-pulse" />
                         )}
                      </button>

                      <AnimatePresence>
                        {showNotifications && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-3 w-80 p-4 shadow-2xl z-50 bg-bg-dropdown border border-border-subtle/80 rounded-2xl flex flex-col gap-3"
                          >
                            <div className="flex items-center justify-between border-b border-border-subtle/60 pb-2">
                              <h3 className="text-sm font-bold text-white">Notifications</h3>
                              {notifications.some((n) => !n.isRead) && (
                                <button
                                  onClick={handleMarkAllRead}
                                  className="text-[10px] font-bold text-brand-purple hover:underline uppercase tracking-wider cursor-pointer"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                              {notifications.length === 0 ? (
                                <div className="text-center py-6 text-gray-500 text-xs">
                                  No new notifications
                                </div>
                              ) : (
                                notifications.map((n) => (
                                  <div
                                    key={n.id}
                                    onClick={() => !n.isRead && handleMarkSingleRead(n.id)}
                                    className={`p-2.5 rounded-xl border transition-colors flex flex-col gap-1 text-left ${
                                      !n.isRead
                                        ? "bg-brand-purple/5 border-brand-purple/20 cursor-pointer hover:bg-brand-purple/10"
                                        : "bg-white/[0.01] border-transparent hover:bg-white/[0.03]"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <span
                                        className={`text-xs font-bold ${
                                          !n.isRead ? "text-white" : "text-gray-300"
                                        }`}
                                      >
                                        {n.title}
                                      </span>
                                      <span className="text-[9px] text-gray-500 font-medium tracking-tight">
                                        {formatRelativeTime(n.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-normal">
                                      {n.message}
                                    </p>
                                  </div>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Link to="/write">
                      <Button variant="primary" className="py-2 px-5 text-sm">
                        Write
                      </Button>
                    </Link>

                     <div className="relative" ref={profileDropdownRef}>
                       <button
                         onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                         className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center text-brand-purple font-bold text-xs hover:bg-brand-purple/40 transition-colors cursor-pointer focus:outline-none"
                         aria-label="Toggle profile dropdown"
                       >
                         {user.firstname?.[0]?.toUpperCase() || "U"}
                       </button>

                       <AnimatePresence>
                         {showProfileDropdown && (
                           <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 mt-1.5 w-36 p-1 shadow-xl z-50 bg-bg-dropdown border border-border-subtle/80 rounded-xl flex flex-col gap-0.5 text-left"
                            >
                              <Link
                                to="/profile"
                                onClick={() => setShowProfileDropdown(false)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-text-muted hover:text-text-input hover:bg-border-subtle transition-colors text-left block"
                              >
                                <User className="w-3.5 h-3.5 opacity-80" />
                                <span>My Profile</span>
                              </Link>
                              <Link
                                to="/profile/settings"
                                onClick={() => setShowProfileDropdown(false)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-text-muted hover:text-text-input hover:bg-border-subtle transition-colors text-left block"
                              >
                                <Settings className="w-3.5 h-3.5 opacity-80" />
                                <span>Settings</span>
                              </Link>
                              <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-colors text-left w-full cursor-pointer mt-0.5 pt-1.5 border-t border-border-subtle/20"
                              >
                                <LogOut className="w-3.5 h-3.5 opacity-80" />
                                <span>Logout</span>
                              </button>
                            </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="logged-out"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-4"
                  >
                    <Link
                      to="/signin"
                      className="text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link to="/signup">
                      <Button variant="primary" className="py-2 px-5 text-sm">
                        Sign Up
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-gray-200 ml-2 cursor-pointer focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border-subtle/40 bg-bg-base/95 backdrop-blur-lg overflow-hidden flex flex-col px-6 py-5 gap-5 shadow-2xl"
            >
              {/* Search Form for Mobile */}
              <form onSubmit={handleSearchSubmit} className="relative flex items-center group w-full">
                <svg
                  className="w-4 h-4 absolute left-3 text-gray-400 group-focus-within:text-brand-cyan transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-border-subtle/30 border border-border-subtle focus:border-brand-cyan/50 rounded-full py-2.5 pl-10 pr-4 text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:bg-border-subtle/50"
                />
              </form>

              {/* Navigation Links */}
              <div className="flex flex-col gap-4 text-base font-semibold">
                <Link
                  to="/feed"
                  onClick={(e) => {
                    handleNavClick(e, "/feed");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-1.5 ${isFeed ? "text-brand-cyan" : "text-gray-400 hover:text-gray-200"}`}
                >
                  Feed
                </Link>
                <Link
                  to="/explore"
                  onClick={(e) => {
                    handleNavClick(e, "/explore");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-1.5 ${isExplore ? "text-brand-cyan" : "text-gray-400 hover:text-gray-200"}`}
                >
                  Explore
                </Link>
                <Link
                  to="/my-blogs"
                  onClick={(e) => {
                    handleNavClick(e, "/my-blogs");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-1.5 ${isMyBlogs ? "text-brand-cyan" : "text-gray-400 hover:text-gray-200"}`}
                >
                  My Blogs
                </Link>
                <Link
                  to="/about"
                  onClick={(e) => {
                    handleNavClick(e, "/about");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-1.5 ${isAbout ? "text-brand-cyan" : "text-gray-400 hover:text-gray-200"}`}
                >
                  About Us
                </Link>
              </div>

              {/* Actions: Theme toggle, write button, profile/signin */}
              <div className="border-t border-border-subtle/30 pt-4 flex flex-col gap-4">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <Link 
                      to="/write"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full"
                    >
                      <Button variant="primary" className="py-2.5 w-full text-center text-sm">
                        Write new post
                      </Button>
                    </Link>
                    <div className="flex items-center justify-between border-t border-border-subtle/20 pt-4">
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-sm text-white font-medium"
                      >
                        <div className="w-9 h-9 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center text-brand-purple font-bold text-sm">
                          {user.firstname?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span>{user.firstname} {user.lastname || ""}</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 w-full">
                    <Link
                      to="/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl border border-border-subtle text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      Log In
                    </Link>
                    <Link 
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex-1"
                    >
                      <Button variant="primary" className="py-2.5 w-full text-sm">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
  );
};

export default Navbar;
