import React, { useState } from "react";
import { Shield, BookOpen, UserCheck, AlertOctagon, FileWarning, HelpCircle, Download, ArrowRight, Info, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", num: "01", label: "Introduction" },
    { id: "account-responsibilities", num: "02", label: "Account Responsibilities" },
    { id: "content-ownership", num: "03", label: "Content Ownership (IP)" },
    { id: "acceptable-use", num: "04", label: "Acceptable Use" },
    { id: "termination", num: "05", label: "Termination" },
    { id: "limitation-of-liability", num: "06", label: "Limitation of Liability" }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
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

  const handleDownloadPDF = () => {
    toast.success("Generating Terms of Service PDF summary... Download starting.");
    // Mock download window trigger
    setTimeout(() => {
      window.open("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "_blank");
    }, 1200);
  };

  const navItemClass = (id) =>
    `w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
      activeSection === id
        ? "bg-brand-purple/15 text-brand-purple border-brand-purple/20"
        : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-border-subtle/30"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8 lg:gap-10 pb-20 pt-4 font-sans">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 shrink-0 lg:sticky lg:top-24 lg:self-start space-y-6">
        <div className="px-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            On this page
          </p>
        </div>

        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1 custom-scrollbar">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={navItemClass(sec.id)}
            >
              <span className="text-[10px] font-mono opacity-50 shrink-0">{sec.num}</span>
              <span className="truncate">{sec.label}</span>
            </button>
          ))}
        </nav>

        {/* PDF Download Summary Widget */}
        <div className="hidden lg:block relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-card/40 p-5">
          <h4 className="text-xs font-bold text-gray-400 mb-3">Need a summary?</h4>
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold border border-border-subtle bg-white/[0.01] hover:bg-border-subtle/30 text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-brand-purple" />
            Download PDF
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 space-y-12">
        {/* Document Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            <span>Legal Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-3xl leading-relaxed">
            Welcome to NovaBlog. These terms outline our agreement with you regarding the use of our platform, governing the relationship between creators, engineers, and our technology.
          </p>
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Last updated: June 16, 2024
          </div>
        </div>

        {/* Section 1: Introduction */}
        <section id="introduction" className="space-y-4 pt-4 border-t border-border-subtle/40">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-mono text-brand-cyan select-none">01</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Introduction</h2>
          </div>
          <div className="glass-panel border border-border-subtle bg-bg-card p-6 sm:p-8 rounded-2xl text-sm text-gray-400 leading-relaxed space-y-4">
            <p>
              By accessing or using NovaBlog (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service. NovaBlog is a platform for engineers, designers, and creators to share knowledge and build communities.
            </p>
            <p>
              These terms constitute a legally binding agreement between you and NovaBlog Corp. regarding your use of the website and any associated software or services provided.
            </p>
          </div>
        </section>

        {/* Section 2: Account Responsibilities */}
        <section id="account-responsibilities" className="space-y-4 pt-4 border-t border-border-subtle/40">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-mono text-brand-cyan select-none">02</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Account Responsibilities</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            When you register an account with us, you accept responsibility for maintaining core security guidelines:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Card 1: Security */}
            <div className="glass-panel border border-border-subtle bg-bg-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-brand-purple">
                <BookOpen className="w-4 h-4" />
                <h4 className="text-sm font-bold text-white">Security</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
              </p>
            </div>

            {/* Card 2: Accuracy */}
            <div className="glass-panel border border-border-subtle bg-bg-card p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-brand-purple">
                <UserCheck className="w-4 h-4" />
                <h4 className="text-sm font-bold text-white">Accuracy</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                You must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Content Ownership */}
        <section id="content-ownership" className="space-y-4 pt-4 border-t border-border-subtle/40">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-mono text-brand-cyan select-none">03</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Content Ownership (IP)</h2>
          </div>

          <div className="rounded-2xl border-l-4 border-brand-cyan bg-bg-card p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Part 1 */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Your Content stays Yours</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights. We claim no ownership over the intellectual property of our users.
              </p>
            </div>

            <div className="h-px bg-border-subtle" />

            {/* Part 2 */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">License to NovaBlog</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. This license is for the sole purpose of enabling us to provide the Service to you and other users.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Acceptable Use */}
        <section id="acceptable-use" className="space-y-4 pt-4 border-t border-border-subtle/40">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-mono text-brand-cyan select-none">04</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Acceptable Use</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            You agree not to engage in any of the following prohibited activities:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Rules Grid */}
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-white/[0.01]">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-xs text-gray-400">Spamming or mass automated messaging.</span>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-white/[0.01]">
              <Shield className="w-4 h-4 text-brand-cyan shrink-0" />
              <span className="text-xs text-gray-400">Exploiting or probing system vulnerabilities.</span>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-white/[0.01]">
              <FileWarning className="w-4 h-4 text-brand-purple shrink-0" />
              <span className="text-xs text-gray-400">Uploading illegal or infringing content.</span>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-white/[0.01]">
              <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
              <span className="text-xs text-gray-400">Impersonating NovaBlog employees or users.</span>
            </div>
          </div>
        </section>

        {/* Section 5: Termination */}
        <section id="termination" className="space-y-4 pt-4 border-t border-border-subtle/40">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-mono text-brand-cyan select-none">05</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Termination</h2>
          </div>
          <div className="glass-panel border border-border-subtle bg-bg-card p-6 sm:p-8 rounded-2xl text-sm text-gray-400 leading-relaxed">
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination.
          </div>
        </section>

        {/* Section 6: Limitation of Liability */}
        <section id="limitation-of-liability" className="space-y-4 pt-4 border-t border-border-subtle/40">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-mono text-brand-cyan select-none">06</span>
            <h2 className="text-lg font-bold text-white tracking-tight">Limitation of Liability</h2>
          </div>
          <div className="glass-panel border border-red-500/20 bg-red-500/5 p-6 sm:p-8 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest">Important Notice</h4>
            <p className="text-sm text-red-200/80 leading-relaxed font-medium">
              In no event shall NovaBlog, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service.
            </p>
          </div>
        </section>

        {/* Bottom framework brand banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-card h-44 flex flex-col justify-end p-8 group">
          {/* Subtle grid lines background overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/10 to-transparent opacity-60" />
          <div className="absolute top-0 right-0 w-36 h-36 opacity-10">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-white stroke-[1.5]">
              <path d="M10 10 L90 90 M90 10 L10 90" />
              <circle cx="50" cy="50" r="25" />
            </svg>
          </div>
          <div className="relative z-10 space-y-1">
            <h3 className="text-lg font-extrabold text-white tracking-tight">Built for the future of engineering.</h3>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider font-mono">NovaBlog framework 2.0</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
