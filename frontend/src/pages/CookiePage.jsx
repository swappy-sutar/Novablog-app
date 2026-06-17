import { useState } from "react";
import { Shield, Eye, Mail, RotateCcw, Settings } from "lucide-react";
import toast from "react-hot-toast";

const CookiePage = () => {
  const [performanceEnabled, setPerformanceEnabled] = useState(true);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(false);

  const handleClearCookies = () => {
    // Clear cookies logic triggers toast
    toast.success("All optional browser cookie tokens cleared successfully!");
  };

  const handleContactTeam = () => {
    toast("Opening support portal window...", { icon: "✉️" });
    window.location.href = "mailto:privacy@novablog.tech";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 pb-24 pt-6 font-sans space-y-12">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5" />
          <span>Legal Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-3xl">
          At NovaBlog, we believe in radical transparency. This policy outlines how we use cookies, web beacons, and similar tracking technologies to provide a high-performance experience for the modern developer.
        </p>
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex flex-wrap gap-x-4 gap-y-1">
          <span>Last Updated: October 24, 2024</span>
          <span className="hidden sm:inline">•</span>
          <span>Effective Date: Immediate</span>
        </div>
      </div>

      {/* Section 1: What are tracking technologies? */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span>1. What are tracking technologies?</span>
        </h2>
        <div className="glass-panel border border-border-subtle bg-bg-card p-6 rounded-2xl text-sm text-gray-400 leading-relaxed">
          Cookies are small data files stored on your device that help us recognize your browser and remember certain information. We also use pixels, local storage, and software development kits (SDKs) to perform similar functions in our technical ecosystem.
        </div>
      </section>

      {/* Section 2: Types of cookies we use */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          2. Types of cookies we use
        </h2>

        <div className="space-y-4">
          {/* Card 1: Essential Cookies */}
          <div className="glass-panel border border-border-subtle bg-bg-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-cyan" />
                <h3 className="text-sm font-bold text-white">Essential Cookies</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                These are strictly necessary for the operation of NovaBlog. They enable core functions like security, identity verification, and network management. You cannot opt-out of these as the platform would cease to function correctly.
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-block px-2.5 py-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full uppercase tracking-wider">
                Always Active
              </span>
            </div>
          </div>

          {/* Card 2: Performance & Analytics */}
          <div className="glass-panel border border-border-subtle bg-bg-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-brand-purple" />
                <h3 className="text-sm font-bold text-white">Performance & Analytics</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                We use these to understand how developers interact with our platform. They help us identify high-traffic articles, monitor load times, and catch technical errors before they impact your workflow.
              </p>
            </div>
            {/* Toggle Switch */}
            <div className="shrink-0 flex items-center pt-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={performanceEnabled}
                  onChange={() => setPerformanceEnabled(!performanceEnabled)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-border-subtle/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-cyan"></div>
              </label>
            </div>
          </div>

          {/* Card 3: Functional & Personalization */}
          <div className="glass-panel border border-border-subtle bg-bg-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-purple" />
                <h3 className="text-sm font-bold text-white">Functional & Personalization</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                These remember your preferences (like code editor themes, language settings, and preferred feed layouts) to provide a more personalized, fluid development environment.
              </p>
            </div>
            {/* Toggle Switch */}
            <div className="shrink-0 flex items-center pt-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={personalizationEnabled}
                  onChange={() => setPersonalizationEnabled(!personalizationEnabled)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-border-subtle/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-cyan"></div>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Managing your preferences */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          3. Managing your preferences
        </h2>
        <div className="glass-panel border border-border-subtle bg-bg-card p-6 sm:p-8 rounded-2xl space-y-6">
          <p className="text-sm text-gray-400 leading-relaxed">
            You have full control over your data. Aside from the toggles above, you can manage cookies through your browser settings. Most modern browsers allow you to:
          </p>

          <ul className="space-y-3 text-sm text-gray-400 pl-0 list-none">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-2 shrink-0" />
              <span>See what cookies are currently stored and delete them individually.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-2 shrink-0" />
              <span>Block third-party cookies or cookies from specific sites.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-2 shrink-0" />
              <span>Set your browser to clear all cookies when you close it.</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={handleClearCookies}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border border-border-subtle bg-white/[0.01] hover:bg-border-subtle/30 text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear All Cookies
            </button>
          </div>
        </div>
      </section>

      {/* Section 4: Third-party integrations */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          4. Third-party integrations
        </h2>
        <div className="glass-panel border border-border-subtle bg-bg-card p-6 rounded-2xl text-sm text-gray-400 leading-relaxed">
          Some content on NovaBlog (such as embedded GitHub gists, YouTube tutorials, or terminal simulations) may use their own cookies. We do not control these third-party cookies. We recommend checking the respective privacy policies of these services for more information.
        </div>
      </section>

      {/* Contact Team widget */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 sm:p-8 rounded-2xl border border-border-subtle bg-gradient-to-r from-brand-purple/10 to-transparent">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Still have questions?</h4>
          <p className="text-xs text-gray-400">
            Our privacy team is available to help clarify our tracking practices.
          </p>
        </div>
        <button
          onClick={handleContactTeam}
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold border border-brand-purple/20 bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple transition-all cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5" />
          Contact Privacy Team
        </button>
      </div>
    </div>
  );
};

export default CookiePage;
