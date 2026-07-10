import React, { useState } from "react";
import { 
  BookOpen, 
  Layers, 
  Terminal, 
  Database, 
  Globe, 
  Search, 
  Code,
  ArrowRight,
  Sparkles,
  Check,
  Copy
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

const DOCS_SECTIONS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "architecture", label: "Architecture", icon: Layers },
  { id: "setup", label: "Setup Guide", icon: Terminal },
  { id: "api", label: "API Reference", icon: Database },
  { id: "routes", label: "Frontend Routes", icon: Globe },
];

const API_ENDPOINTS = [
  { method: "GET", path: "/health", auth: false, desc: "Bypasses prefix, returns raw backend service status" },
  { method: "POST", path: "/auth/register", auth: false, desc: "Create a new user account on the platform" },
  { method: "POST", path: "/auth/login", auth: false, desc: "Authenticate user and receive Access & Refresh JWTs" },
  { method: "GET", path: "/auth/profile", auth: true, desc: "Retrieve active user profile data" },
  { method: "PATCH", path: "/auth/profile", auth: true, desc: "Update user meta information (bio, social links, name)" },
  { method: "POST", path: "/auth/upload-profile", auth: true, desc: "Upload avatar image to S3 bucket" },
  { method: "POST", path: "/auth/refresh-token", auth: false, desc: "Generate a new access token using rotate strategy" },
  { method: "POST", path: "/auth/logout", auth: true, desc: "Blacklist active refresh token and end session" },
  { method: "POST", path: "/auth/forgot-password", auth: false, desc: "Send secure reset token via Resend email service" },
  { method: "POST", path: "/auth/reset-password", auth: false, desc: "Update password using forgot-password token" },
  { method: "POST", path: "/auth/setup-2fa", auth: true, desc: "Generate secret and QR code for Authenticator" },
  { method: "POST", path: "/auth/verify-2fa", auth: true, desc: "Enable TOTP verification on profile" },
  { method: "POST", path: "/blog/create-blog", auth: true, desc: "Create a new draft or published blog post" },
  { method: "GET", path: "/blog/get-all-blogs", auth: false, desc: "Retrieve public blogs (paginated, supports tag & category filters)" },
  { method: "GET", path: "/blog/my-blogs", auth: true, desc: "Retrieve all blogs created by current user" },
  { method: "GET", path: "/blog/get-blog/:id", auth: false, desc: "Get full details of a specific blog post" },
  { method: "PATCH", path: "/blog/update-blog/:id", auth: true, desc: "Modify draft or published details of a blog post" },
  { method: "DELETE", path: "/blog/delete-blog/:id", auth: true, desc: "Remove blog post from database" },
  { method: "POST", path: "/comments/create-comment/:blogId", auth: true, desc: "Add a comment (supports threaded/nested replies)" },
  { method: "GET", path: "/comments/get-comment/:blogId", auth: false, desc: "Fetch comments hierarchy for a post" },
  { method: "PATCH", path: "/comments/update-comment/:commentId", auth: true, desc: "Update text of own comment" },
  { method: "DELETE", path: "/comments/delete-comment/:commentId", auth: true, desc: "Delete comment" },
  { method: "POST", path: "/likes/toggle/:blogId", auth: true, desc: "Toggle like status of an article" },
  { method: "POST", path: "/bookmarks/toggle/:blogId", auth: true, desc: "Toggle bookmark status of an article" },
  { method: "GET", path: "/bookmarks/my-bookmarks", auth: true, desc: "List saved posts" },
  { method: "POST", path: "/review/create", auth: false, desc: "Submit user feedback/review about the platform" },
  { method: "GET", path: "/admin/dashboard", auth: true, admin: true, desc: "Admin metric aggregates" },
  { method: "GET", path: "/admin/analytics", auth: true, admin: true, desc: "Historical user and post analytics logs" },
  { method: "GET", path: "/admin/users", auth: true, admin: true, desc: "Search and paginate platform users" },
  { method: "PATCH", path: "/admin/users/:id/status", auth: true, admin: true, desc: "Suspend or reactivate accounts" },
  { method: "GET", path: "/admin/reviews", auth: true, admin: true, desc: "Fetch all platform reviews for moderation" },
  { method: "PATCH", path: "/admin/reviews/:id", auth: true, admin: true, desc: "Update details or visibility status of a review" },
  { method: "DELETE", path: "/admin/reviews/:id", auth: true, admin: true, desc: "Permanently purge a review from the system" },
];

const FRONTEND_ROUTES = [
  { path: "/", scope: "Public", desc: "Landing page, testimonials, recent blogs, progression map" },
  { path: "/explore", scope: "Public", desc: "Interactive feed searching, categorizing, and filtering blogs" },
  { path: "/signin / signup", scope: "Public", desc: "Aesthetic neon signup, signin, email verification, 2FA prompt" },
  { path: "/write", scope: "Protected Writer", desc: "Auto-saving TipTap rich text canvas with category selection & image upload" },
  { path: "/my-blogs", scope: "Protected Writer", desc: "Management dashboard for drafts, published, and archived work" },
  { path: "/profile/:username", scope: "Public", desc: "User statistics, bio, follow button, unlocks, and badging map" },
  { path: "/settings", scope: "Protected User", desc: "Manage name, profile images, tech stack tags, and configure 2FA" },
  { path: "/admin/dashboard", scope: "Protected Admin", desc: "Interactive server analytics logs, review/content deletion suite" },
];

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedText, setCopiedText] = useState("");
  const [apiSearch, setApiSearch] = useState("");

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const filteredApi = API_ENDPOINTS.filter(
    (ep) =>
      ep.path.toLowerCase().includes(apiSearch.toLowerCase()) ||
      ep.method.toLowerCase().includes(apiSearch.toLowerCase()) ||
      ep.desc.toLowerCase().includes(apiSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07070d] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Cinematic dot matrix layout */}
      <div 
        className="absolute inset-0 pointer-events-none cinematic-dots -z-10 opacity-30"
        style={{ backgroundSize: "24px 24px" }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Page title */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-xs text-[#a78bfa] font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Developer Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            NovaBlog <span className="text-gradient">Documentation</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-2xl">
            Explore architecture blueprints, setup workflows, local deployment targets, and full REST API routes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* LEFT: Sidebar Navigation */}
          <GlassCard className="lg:col-span-1 p-4 space-y-1.5 lg:sticky lg:top-24">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Documentation Chapters
            </div>
            {DOCS_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-brand-purple/20 to-brand-cyan/20 border border-brand-purple/30 text-white shadow-md shadow-brand-purple/5"
                      : "border border-transparent text-gray-400 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#a78bfa]" : "text-gray-500"}`} />
                  {sec.label}
                </button>
              );
            })}
          </GlassCard>

          {/* RIGHT: Document Content Area */}
          <GlassCard className="lg:col-span-3 p-6 sm:p-8 min-h-[600px]">
            {/* OVERVIEW SECTION */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black border-b border-border-subtle pb-3 text-white flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-[#a78bfa]" />
                  Project Overview
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  NovaBlog is a modern, high-performance, developer-centric blogging platform designed for rich knowledge sharing, bookmarking, and public profiles. Built with a decoupled design system, it pairs a fast, dynamic React 19 UI with a robust NestJS backend.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-5 rounded-2xl border border-border-subtle bg-[#0a0a14] space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Client Architecture
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-normal">
                      Built on React 19, Vite, Tailwind CSS, Framer Motion, and TipTap Rich Editor.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-border-subtle bg-[#0a0a14] space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Server Architecture
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-normal">
                      Powered by NestJS framework, Prisma ORM, PostgreSQL database, and Upstash Redis.
                    </p>
                  </div>
                </div>

                <div className="pt-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Platform Core Vision</h3>
                  <ul className="space-y-2.5 text-xs text-gray-300">
                    <li className="flex items-start gap-2.5">
                      <ArrowRight className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                      <span><strong>Distraction-Free Writing:</strong> Auto-saving editor tailored with live preview, header formatting, and direct code highlighting block.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <ArrowRight className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                      <span><strong>Level-Up Progression:</strong> High engagement system calculating reader habits and awarding profile badges sequentially.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <ArrowRight className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                      <span><strong>Reliable Task Handling:</strong> Background thread queuing (email delivery and verification checks) built with BullMQ queue systems.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* ARCHITECTURE SECTION */}
            {activeSection === "architecture" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black border-b border-border-subtle pb-3 text-white flex items-center gap-3">
                  <Layers className="w-6 h-6 text-[#a78bfa]" />
                  System Architecture
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  NovaBlog leverages a clean, high-concurrency architecture that decouples frontend delivery from transaction handling, event emission, and media storing.
                </p>

                {/* Architecture Diagram */}
                <div className="p-5 rounded-2xl border border-border-subtle bg-[#08080f] font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
{`┌─────────────────────────────────────────────────────┐
│                     Client Browser                  │
│              React 19 + Vite (Tailwind CSS)          │
└─────────────────┬───────────────────────────────────┘
                  │ HTTPS REST / WebSockets (WSS)
┌─────────────────▼───────────────────────────────────┐
│               NestJS Gateway API Router             │
│    JWT Auth Guards · Rate Limiter · WebSocket Hub   │
├──────────┬──────────────┬────────────┬──────────────┤
│  Prisma  │   BullMQ     │  Socket.IO │    AWS S3    │
│  ORM API │  Queue Hub   │ Notifications│ (File Store)│
│  + Neon  │  + Upstash   │  Streamer  │              │
│ Postgres │    Redis     │            │              │
└──────────┴──────────────┴────────────┴──────────────┘`}
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Database Models Overview</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 border border-border-subtle bg-white/[0.01] rounded-xl text-center">
                      <span className="text-white font-bold text-xs">User Model</span>
                      <p className="text-[10px] text-gray-500 mt-1">Credentials, Profile, Tech Stack, 2FA Setup</p>
                    </div>
                    <div className="p-3 border border-border-subtle bg-white/[0.01] rounded-xl text-center">
                      <span className="text-white font-bold text-xs">Blog Model</span>
                      <p className="text-[10px] text-gray-500 mt-1">Title, Content, Category, Status (DRAFT/PUBLISHED)</p>
                    </div>
                    <div className="p-3 border border-border-subtle bg-white/[0.01] rounded-xl text-center">
                      <span className="text-white font-bold text-xs">Review Model</span>
                      <p className="text-[10px] text-gray-500 mt-1">Feedback text, star rating, location, status</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SETUP GUIDE SECTION */}
            {activeSection === "setup" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black border-b border-border-subtle pb-3 text-white flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-[#a78bfa]" />
                  Setup Guide
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  NovaBlog is optimized for lightning-fast setup using standard Docker orchestration.
                </p>

                <div className="space-y-5">
                  {/* Step 1 */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#818cf8]">STEP 1: Clone and Configure Env</span>
                    <p className="text-xs text-gray-400">Clone the codebase from GitHub and copy the env template config to the root directory.</p>
                    <div className="relative">
                      <pre className="p-4 rounded-xl bg-[#08080f] border border-border-subtle font-mono text-xs text-gray-300 overflow-x-auto">
                        {`git clone https://github.com/swappy-sutar/Novablog-app.git\ncd Novablog-app\ncp .env.example .env`}
                      </pre>
                      <button
                        onClick={() => handleCopy(`git clone https://github.com/swappy-sutar/Novablog-app.git\ncd Novablog-app\ncp .env.example .env`, "step1")}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedText === "step1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#818cf8]">STEP 2: Boot Services via Docker Compose</span>
                    <p className="text-xs text-gray-400">Start the PostgreSQL database, Redis store, and NestJS API services.</p>
                    <div className="relative">
                      <pre className="p-4 rounded-xl bg-[#08080f] border border-border-subtle font-mono text-xs text-gray-300 overflow-x-auto">
                        {`docker compose up -d db redis backend`}
                      </pre>
                      <button
                        onClick={() => handleCopy("docker compose up -d db redis backend", "step2")}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedText === "step2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#818cf8]">STEP 3: Run Frontend Dev Server</span>
                    <p className="text-xs text-gray-400">Boot the local Vite web UI server to start coding or reading.</p>
                    <div className="relative">
                      <pre className="p-4 rounded-xl bg-[#08080f] border border-border-subtle font-mono text-xs text-gray-300 overflow-x-auto">
                        {`cd frontend\nnpm install\nnpm run dev`}
                      </pre>
                      <button
                        onClick={() => handleCopy(`cd frontend\nnpm install\nnpm run dev`, "step3")}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedText === "step3" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API REFERENCE SECTION */}
            {activeSection === "api" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black border-b border-border-subtle pb-3 text-white flex items-center gap-3">
                  <Database className="w-6 h-6 text-[#a78bfa]" />
                  API Reference
                </h2>

                {/* API Route Search bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search API endpoints (e.g. /auth, POST)..."
                    value={apiSearch}
                    onChange={(e) => setApiSearch(e.target.value)}
                    className="w-full bg-[#08080f] border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#6366f1]/60 transition-colors"
                  />
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {filteredApi.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-6">No matching endpoints found.</p>
                  ) : (
                    filteredApi.map((ep, i) => {
                      const isPost = ep.method === "POST";
                      const isPatch = ep.method === "PATCH";
                      const isDelete = ep.method === "DELETE";
                      let badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                      if (isPost) badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                      if (isPatch) badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                      if (isDelete) badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";

                      return (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border-subtle bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}>
                              {ep.method}
                            </span>
                            <span className="font-mono text-xs text-white">{ep.path}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] text-gray-400 max-w-sm text-left sm:text-right">{ep.desc}</p>
                            <div className="flex gap-1 shrink-0">
                              {ep.auth && (
                                <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/20">
                                  🔒 Auth
                                </span>
                              )}
                              {ep.admin && (
                                <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/25">
                                  🛡 Admin
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* FRONTEND ROUTES SECTION */}
            {activeSection === "routes" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black border-b border-border-subtle pb-3 text-white flex items-center gap-3">
                  <Globe className="w-6 h-6 text-[#a78bfa]" />
                  Frontend Routes
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Frontend routing configuration map with viewport scope settings.
                </p>

                <div className="space-y-2.5">
                  {FRONTEND_ROUTES.map((route, i) => {
                    const isAdmin = route.scope.includes("Admin");
                    const isProtected = route.scope.includes("Protected");
                    let badgeColor = "bg-gray-800 text-gray-400 border-gray-700";
                    if (isAdmin) badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                    else if (isProtected) badgeColor = "bg-[#6366f1]/10 text-[#818cf8] border-[#6366f1]/20";

                    return (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border-subtle bg-white/[0.01]"
                      >
                        <div className="flex items-center gap-3">
                          <Code className="w-3.5 h-3.5 text-gray-500" />
                          <span className="font-mono text-xs text-white">{route.path}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] text-gray-400 text-left sm:text-right">{route.desc}</p>
                          <span className={`text-[8px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded border shrink-0 ${badgeColor}`}>
                            {route.scope}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
