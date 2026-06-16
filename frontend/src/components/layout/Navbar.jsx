import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { authAPI } from "../../lib/api";

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const isMyBlogs = location.pathname === "/my-blogs";
  const isFeed = location.pathname === "/";
  const isExplore = location.pathname === "/explore";
  const isAbout = location.pathname === "/about";

  const linkActiveStyle =
    "text-brand-cyan relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-brand-cyan after:rounded-full";
  const linkInactiveStyle = "text-gray-400 hover:text-white transition-colors";

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
        } catch (e) {
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

  const toggleTheme = () => setIsDark(!isDark);

  const handleNavClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
    }
  };

  // Typing placeholder effect
  const searchPhrases = [
    "Search 'React hooks'...",
    "Search 'System Design'...",
    "Search 'Framer Motion'...",
    "Search 'Next.js 14'...",
  ];
  const [placeholder, setPlaceholder] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = searchPhrases[phraseIdx];
    let typingSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIdx === currentPhrase.length) {
      typingSpeed = 2000;
      setIsDeleting(true);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % searchPhrases.length);
      typingSpeed = 500;
    }

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
        <Link to="/" className="text-2xl font-bold tracking-tighter">
          <span className="text-gradient">Nova</span>Blog
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/"
            onClick={(e) => handleNavClick(e, "/")}
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
            <div className="hidden lg:flex relative items-center group">
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
                className="bg-border-subtle/30 border border-border-subtle focus:border-brand-cyan/50 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 w-64 transition-all duration-300 focus:w-80 focus:outline-none focus:bg-border-subtle/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              />
            </div>

            <button className="lg:hidden text-gray-400 hover:text-white transition-colors">
              <svg
                className="w-5 h-5"
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
            </button>

            <button
              onClick={toggleTheme}
              className="relative w-10 h-10 items-center justify-center text-gray-400 hover:text-white transition-colors hidden sm:flex rounded-full hover:bg-border-subtle"
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
                    <Link to="/write">
                      <Button variant="primary" className="py-2 px-5 text-sm">
                        Write
                      </Button>
                    </Link>

                    <Link
                      to="/profile"
                      className="w-8 h-8 rounded-full bg-brand-cyan/20 border border-brand-cyan flex items-center justify-center text-brand-cyan font-bold text-xs hover:bg-brand-cyan/40 transition-colors"
                      title="Profile"
                      aria-label="View profile"
                    >
                      {user.firstname?.[0]?.toUpperCase() || "U"}
                    </Link>
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
                      className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
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
            <button className="md:hidden text-gray-400 hover:text-white ml-2">
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
            </button>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;
