import { useState, useEffect } from "react";
import { Globe, Cpu, ArrowRight, Download, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const PrivacyPage = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "information-collection", label: "Information Collection" },
    { id: "data-usage", label: "Data Usage" },
    { id: "cookies-policy", label: "Cookies Policy" },
    { id: "user-rights", label: "User Rights" }
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // triggers when section is in upper-middle of viewport
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const navItemClass = (id) =>
    `w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
      activeSection === id
        ? "bg-brand-purple/15 text-brand-purple border-brand-purple/20"
        : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-border-subtle/30"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8 lg:gap-10 pb-20 pt-12 font-sans">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 shrink-0 lg:sticky lg:top-24 lg:self-start space-y-6">
        <div className="px-1">
          <p className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
            Privacy Hub
          </p>
        </div>

        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1 custom-scrollbar">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={navItemClass(sec.id)}
            >
              {sec.label}
            </button>
          ))}
        </nav>

        {/* Support widget widget */}
        <div className="hidden lg:block relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-card/40 p-5">
          <h4 className="text-sm font-bold text-white mb-2">Need help?</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Questions regarding your data can be directed to{" "}
            <a href="mailto:legal@novablog.tech" className="text-brand-cyan hover:underline font-semibold">
              legal@novablog.tech
            </a>
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 space-y-12">
        {/* Document Header */}
        <div id="overview" className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-3xl leading-relaxed">
            Last updated: May 24, 2026. This policy outlines our commitment to technical precision and user transparency regarding data sovereignty.
          </p>
        </div>

        {/* Section 1: Information Collection */}
        <section id="information-collection" className="space-y-6 pt-4 border-t border-border-subtle/40">
          <div className="glass-panel border border-border-subtle bg-bg-card p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Information Collection
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              At NovaBlog, we collect information essential for the delivery of high-performance blogging and engineering documentation. This includes:
            </p>

            <ul className="space-y-4 text-sm text-gray-400 leading-relaxed list-none pl-0">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                <span>
                  <strong className="text-white font-semibold">Account Metadata:</strong> Email addresses, cryptographically hashed passwords, and profile preferences.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                <span>
                  <strong className="text-white font-semibold">Technical Telemetry:</strong> Browser headers, IP addresses (obfuscated), and interaction metrics to optimize our aetheric flux rendering engine.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                <span>
                  <strong className="text-white font-semibold">Content Fragments:</strong> Transient storage of post drafts and embedded assets in our distributed edge network.
                </span>
              </li>
            </ul>
          </div>

          {/* Core Visual Dual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Secure Data Storage */}
            <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-card h-48 flex flex-col justify-end p-6 group">
              {/* SVG Glowing Microchip Circuit Board Illustration */}
              <div className="absolute top-4 right-4 w-32 h-32 opacity-25 group-hover:opacity-40 transition-opacity duration-300">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-brand-cyan stroke-[1.5]">
                  <rect x="25" y="25" width="50" height="50" rx="6" />
                  <rect x="35" y="35" width="30" height="30" rx="3" />
                  <path d="M50 10 V25 M50 75 V90 M10 50 H25 M75 50 H90 M20 20 L30 30 M80 20 L70 30 M20 80 L30 70 M80 80 L70 70" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="4" fill="currentColor" className="text-brand-cyan" />
                </svg>
              </div>
              <div className="relative z-10 space-y-1">
                <Cpu className="w-6 h-6 text-brand-cyan mb-2" />
                <h3 className="text-base font-bold text-white">Secure Data Storage</h3>
              </div>
            </div>

            {/* Card 2: Global Distributed Edge */}
            <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-card h-48 flex flex-col justify-end p-6 group">
              {/* SVG Glowing Network Globe Illustration */}
              <div className="absolute top-4 right-4 w-32 h-32 opacity-25 group-hover:opacity-40 transition-opacity duration-300">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-brand-purple stroke-[1.5]">
                  <circle cx="50" cy="50" r="35" />
                  <ellipse cx="50" cy="50" rx="35" ry="12" />
                  <ellipse cx="50" cy="50" rx="12" ry="35" />
                  <line x1="15" y1="50" x2="85" y2="50" />
                  <line x1="50" y1="15" x2="50" y2="85" />
                  <circle cx="28" cy="28" r="2" fill="currentColor" className="text-brand-purple" />
                  <circle cx="72" cy="28" r="2" fill="currentColor" className="text-brand-purple" />
                  <circle cx="50" cy="50" r="3" fill="currentColor" className="text-brand-purple" />
                </svg>
              </div>
              <div className="relative z-10 space-y-1">
                <Globe className="w-6 h-6 text-brand-purple mb-2" />
                <h3 className="text-base font-bold text-white">Global Distributed Edge</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Data Usage */}
        <section id="data-usage" className="space-y-6 pt-4 border-t border-border-subtle/40">
          <div className="glass-panel border border-border-subtle bg-bg-card p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Data Usage
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              We process your information based on a hierarchy of technical necessity and user-centric enhancement:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="rounded-xl border border-border-subtle/60 bg-white/[0.01] p-5 space-y-2">
                <h4 className="text-sm font-bold text-white">Infrastructure Optimization</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Using telemetry to predict load spikes and route traffic through our lowest-latency nodes.
                </p>
              </div>

              <div className="rounded-xl border border-border-subtle/60 bg-white/[0.01] p-5 space-y-2">
                <h4 className="text-sm font-bold text-white">Personalized Feed</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Algorithmic sorting based on engagement vectors to prioritize high-signal content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Cookies Policy */}
        <section id="cookies-policy" className="space-y-6 pt-4 border-t border-border-subtle/40">
          <div className="glass-panel border border-border-subtle bg-bg-card p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Cookies
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              NovaBlog utilizes "Aether-Trace" tokens (small browser files) to maintain your session state across our glass-morphic interface. These tokens are essential for:
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-purple/15 text-brand-purple border border-brand-purple/20">
                Auth Persistence
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-purple/15 text-brand-purple border border-brand-purple/20">
                Dark Mode Preferences
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-purple/15 text-brand-purple border border-brand-purple/20">
                API Throttling Metrics
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: User Rights */}
        <section id="user-rights" className="space-y-6 pt-4 border-t border-border-subtle/40">
          <div className="glass-panel border border-border-subtle bg-bg-card p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              User Rights
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              We adhere to global data protection protocols (GDPR, CCPA), granting you total control over your digital footprint:
            </p>

            <div className="space-y-3 pt-2">
              {/* Action 1 */}
              <button 
                onClick={() => toast.success("Data export initiated. Check your email shortly.")}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-border-subtle bg-white/[0.01] hover:bg-border-subtle/30 text-left text-sm text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-brand-cyan group-hover:scale-110 transition-transform" />
                  <span>Request full data export (JSON/CSV)</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Action 2 */}
              <button 
                onClick={() => toast("Redirecting to profile configuration settings...")}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-border-subtle bg-white/[0.01] hover:bg-border-subtle/30 text-left text-sm text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Edit className="w-4 h-4 text-brand-cyan group-hover:scale-110 transition-transform" />
                  <span>Modify and rectify stored metadata</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Action 3 */}
              <button 
                onClick={() => {
                  if (window.confirm("WARNING: This will permanently delete your account and all associated blog content. This action is irreversible. Proceed?")) {
                    toast.error("Account erasure request submitted. A verification link has been sent to your email.");
                  }
                }}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-left text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  <span>Permanent account and data erasure</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPage;
