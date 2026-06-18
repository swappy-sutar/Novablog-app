import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const EditorNavbar = ({ onPublish, isPublishing, showPublish = true }) => {
  const location = useLocation();
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
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [isDark]);

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

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel !rounded-none border-t-0 border-x-0 bg-bg-base/70">
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Logo & Status */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold tracking-tighter">
            <span className="text-gradient">Nova</span>Blog
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500 border-l border-border-subtle pl-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Saved to Drafts
          </div>
        </div>

      {/* Center: Navigation */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors">Feed</Link>
        <Link to="#" className="text-gray-400 hover:text-white transition-colors">Explore</Link>
        <Link 
          to="/write" 
          className={location.pathname === '/write' ? "text-brand-purple relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-brand-purple after:rounded-full" : "text-gray-400 hover:text-white transition-colors"}
        >
          Write
        </Link>
        <Link 
          to="/my-blogs" 
          className={location.pathname === '/my-blogs' ? "text-brand-purple relative after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-brand-purple after:rounded-full" : "text-gray-400 hover:text-white transition-colors"}
        >
          My Blogs
        </Link>
      </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-border-subtle"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {/* Publish Button */}
          {showPublish && (
            <button 
              onClick={onPublish}
              disabled={isPublishing}
              className="bg-brand-purple hover:bg-brand-purple/90 text-white text-xs sm:text-sm font-semibold py-1.5 px-4 sm:px-6 rounded-full transition-colors disabled:opacity-70 flex-shrink-0"
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          )}

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center text-brand-purple font-bold text-xs flex-shrink-0 ml-1 sm:ml-2">
            {user?.firstname?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EditorNavbar;
