import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { newsletterAPI, getErrorMessage } from "../../lib/api";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await newsletterAPI.subscribe(email);
      if (res.success) {
        toast.success(res.message || "Subscribed successfully! Welcome to NovaBlog.");
        setEmail("");
      } else {
        toast.error("Subscription failed.");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Subscription failed."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative border-t border-border-subtle bg-bg-base pt-15 pb-5 mt-0 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-purple/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-10 pb-10">
          
          {/* Brand & Description */}
          <div className="col-span-2 md:col-span-4 flex flex-col justify-between gap-6 md:gap-0">
            <div>
              <Link to="/" className="mb-5 inline-block group transition-transform duration-300 hover:scale-[1.01]">
                <img src="/svg/novablog-lockup-dark.svg" alt="NovaBlog" className="h-12 logo-lockup-dark" />
                <img src="/svg/novablog-lockup-light.svg" alt="NovaBlog" className="h-12 logo-lockup-light" />
              </Link>
              <p className="text-sm text-text-muted mb-6 max-w-sm leading-relaxed">
                Building the future of technical writing. A premium workspace for developers where code precision meets storytelling clarity.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-bg-input border border-border-subtle flex items-center justify-center text-text-muted hover:text-white hover:bg-brand-purple/10 hover:border-brand-purple/35 transition-all duration-300 shadow-sm"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-bg-input border border-border-subtle flex items-center justify-center text-text-muted hover:text-brand-cyan hover:bg-brand-cyan/10 hover:border-brand-cyan/35 transition-all duration-300 shadow-sm"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-bg-input border border-border-subtle flex items-center justify-center text-text-muted hover:text-brand-blue hover:bg-brand-blue/10 hover:border-brand-blue/35 transition-all duration-300 shadow-sm"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Column */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold text-xs uppercase tracking-wider mb-5 text-text-input">Platform</h4>
            <ul className="space-y-3.5 text-sm text-text-muted">
              <li>
                <Link to="/feed" className="hover:text-brand-cyan hover:translate-x-1 inline-block transition-all duration-200">
                  Feed
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-brand-cyan hover:translate-x-1 inline-block transition-all duration-200">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-cyan hover:translate-x-1 inline-block transition-all duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-brand-cyan hover:translate-x-1 inline-block transition-all duration-200">
                  Developer Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold text-xs uppercase tracking-wider mb-5 text-text-input">Legal</h4>
            <ul className="space-y-3.5 text-sm text-text-muted">
              <li>
                <Link to="/terms" className="hover:text-brand-cyan hover:translate-x-1 inline-block transition-all duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-brand-cyan hover:translate-x-1 inline-block transition-all duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-brand-cyan hover:translate-x-1 inline-block transition-all duration-200">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-span-2 md:col-span-4">
            <h4 className="font-semibold text-xs uppercase tracking-wider mb-5 text-text-input">Stay Updated</h4>
            <p className="text-sm text-text-muted mb-5 leading-relaxed">
              Subscribe to the newsletter for coding trends, developer insights, and community news.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <div className="relative w-full">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-input border border-border-subtle focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 rounded-xl px-4 py-3 pr-12 text-sm text-text-input placeholder-gray-500 focus:outline-none transition-all"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-brand-purple hover:bg-brand-purple/95 flex items-center justify-center text-white cursor-pointer transition-all hover:scale-[1.02] shadow-[0_0_10px_rgba(139,92,246,0.3)] active:scale-[0.98]"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left">
            <p>© 2026 <a href="https://er-swapppy.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-brand-purple hover:underline transition-colors font-medium">Swapnil Sutar</a>. All rights reserved.</p>
            <span className="hidden sm:inline text-border-subtle">|</span>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-brand-purple fill-brand-purple inline animate-pulse" /> by <a href="https://er-swapppy.vercel.app" target="_blank" rel="noopener noreferrer" className="text-brand-purple underline transition-colors font-medium">Er-Swappy</a> for developers.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-mono text-[10px] tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            All systems operational
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
