import React, { useState } from "react";
import { 
  BookOpen, 
  Layers, 
  Settings, 
  HelpCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Share2
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

const MANIFESTO_SECTIONS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "why-created", label: "Why NovaBlog?", icon: HelpCircle },
  { id: "how-it-works", label: "How It Works", icon: Settings },
  { id: "how-built", label: "How It's Built", icon: Layers },
];

const ManifestoPage = () => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-bg-base text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none -z-10 opacity-60 dark:opacity-100" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[160px] pointer-events-none -z-10 opacity-60 dark:opacity-100" />

      {/* Cinematic dot matrix layout */}
      <div 
        className="absolute inset-0 pointer-events-none cinematic-dots -z-10 opacity-30"
        style={{ backgroundSize: "24px 24px" }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Page title */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-xs text-[#a78bfa] dark:text-[#a78bfa] font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            NovaBlog Manifesto
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Our <span className="text-gradient">Manifesto</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-2xl">
            A look under the hood of NovaBlog: our purpose, our mechanisms, and our architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* LEFT: Sidebar Navigation */}
          <GlassCard className="lg:col-span-1 p-4 space-y-1.5 lg:sticky lg:top-24">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Navigation
            </div>
            {MANIFESTO_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-brand-purple/20 to-brand-cyan/20 border border-brand-purple/30 text-white shadow-md shadow-brand-purple/5"
                      : "border border-transparent text-gray-400 hover:text-white hover:bg-bg-input"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#a78bfa]" : "text-gray-500"}`} />
                  {sec.label}
                </button>
              );
            })}
          </GlassCard>

          {/* RIGHT: Document Content Area */}
          <GlassCard className="lg:col-span-3 p-6 sm:p-8 min-h-[500px]">
            
            {/* OVERVIEW SECTION */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black border-b border-border-subtle pb-3 text-white flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-[#a78bfa]" />
                  Overview
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  NovaBlog is a modern technical publishing platform designed to bridge the gap between rich developer thoughts and immersive reader experiences. Our platform replaces clunky interfaces and distracting layouts with a fast, high-performance, glassmorphic layout tailored for long-form knowledge sharing.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-5 rounded-2xl border border-border-subtle bg-bg-card-sub space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Clean Web Interface
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-normal font-medium">
                      Built for modern browsers using React 19 and Vite. Responsively scales from smartphones to ultra-wide displays.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-border-subtle bg-bg-card-sub space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Scalable Services
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-normal font-medium">
                      Powered by a modular NestJS server using PostgreSQL for persistence and Redis for caching.
                    </p>
                  </div>
                </div>

                <div className="pt-6 space-y-4">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider text-gray-400">Core Platform Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border-subtle bg-bg-card-sub-light space-y-1.5">
                      <h4 className="text-xs font-bold text-[#818cf8] dark:text-[#a78bfa]">🔒 Auth & 2FA Security</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                        JWT Token rotation, password lockout security parameters, and strict Google Authenticator 2FA integrations keep profiles completely secured.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border-subtle bg-bg-card-sub-light space-y-1.5">
                      <h4 className="text-xs font-bold text-brand-cyan">✍️ TipTap Canvas</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                        An immersive WYSIWYG editor containing clean code highlighting, link cleaning mechanisms, header layout triggers, and S3 media upload pipelines.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border-subtle bg-bg-card-sub-light space-y-1.5">
                      <h4 className="text-xs font-bold text-[#818cf8] dark:text-[#a78bfa]">💬 Social Engagement</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                        A dynamic comments ecosystem featuring threaded replies, instant bookmark lists, post like counters, and automated real-time notification gates.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border-subtle bg-bg-card-sub-light space-y-1.5">
                      <h4 className="text-xs font-bold text-brand-cyan">🏆 Progression Badging</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                        Calculates active reading behaviors, unlocking six distinct tier achievements shown proudly on author profile headers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WHY CREATED SECTION */}
            {activeSection === "why-created" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black border-b border-border-subtle pb-3 text-white flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-[#a78bfa]" />
                  Why NovaBlog?
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Most modern blogging engines have drifted away from clean readability. They are clogged with ads, require heavy tracking cookies, and offer sluggish editors that break layout structures. 
                </p>

                <div className="space-y-4 pt-2">
                  <h3 className="text-base font-bold text-white">We created NovaBlog to satisfy three core principles:</h3>
                  <ul className="space-y-4 text-xs text-gray-300">
                    <li className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block mb-0.5">Readability First</strong>
                        We utilize selected modern typography, soft ambient glass background frames, and structured spacing rules to let readers concentrate fully on technical insights.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block mb-0.5">High Performance</strong>
                        Every asset loads immediately. By utilizing server-side pagination, structured database indexes, and Redis caching layers, NovaBlog ensures latency is kept to a minimum.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block mb-0.5">Writer Empowerment</strong>
                        Writers should focus on writing, not markdown formatting errors. Our rich text canvas automatically cleans inputs, processes images seamlessly via S3 storage, and tracks post lifecycles accurately.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* HOW IT WORKS SECTION */}
            {activeSection === "how-it-works" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black border-b border-border-subtle pb-3 text-white flex items-center gap-3">
                  <Settings className="w-6 h-6 text-[#a78bfa]" />
                  How It Works
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  NovaBlog organizes content production and discovery into four main modules:
                </p>

                <div className="space-y-6 pt-2">
                  {/* Auth */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0 border border-brand-purple/30">
                      <ShieldCheck className="w-5 h-5 text-brand-purple" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">1. Secure Authentication & Identity</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Users register accounts with verified emails. Sessions use secure JSON Web Tokens (JWT) split into short-term Access tokens and long-term Refresh tokens. Two-Factor Authentication (2FA) via Authenticator apps is built-in for account safety.
                      </p>
                    </div>
                  </div>

                  {/* Editor */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center shrink-0 border border-brand-cyan/30">
                      <Sparkles className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">2. Auto-Saving Writing Canvas</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        The writing dashboard features a distraction-free WYSIWYG editor using the TipTap framework. It handles headings, custom inline links, block quotes, and media uploads automatically. Banners are stored securely using cloud objects.
                      </p>
                    </div>
                  </div>

                  {/* Social */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0 border border-brand-purple/30">
                      <Share2 className="w-5 h-5 text-brand-purple" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">3. Social Interactivity & Feeds</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Readers interact through targeted likes, bookmarks, and threaded nested comments. An interactive home feed lists updates from followed writers in real-time, backed by WebSocket event pathways.
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center shrink-0 border border-brand-cyan/30">
                      <CheckCircle2 className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">4. Gamified Badge Progression</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Reading records are tracked automatically. As you read more articles, your account progresses through six unique levels (Seedling, Contributor, Influencer, Rising Writer, Legend, and Established), unlocking visual profile badges.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HOW BUILT SECTION */}
            {activeSection === "how-built" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black border-b border-border-subtle pb-3 text-white flex items-center gap-3">
                  <Layers className="w-6 h-6 text-[#a78bfa]" />
                  How It's Built
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  NovaBlog is engineered using modern, proven technologies structured in a decoupled frontend-backend architecture:
                </p>

                <div className="space-y-4 pt-2">
                  <div className="border-l-2 border-brand-purple pl-4 py-1 space-y-1">
                    <h4 className="text-sm font-bold text-white">React 19 & Vite</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Used to render the client interface. Vite guarantees extremely fast bundling, hot-reloading during development, and small build sizes for lightning-fast loads.
                    </p>
                  </div>

                  <div className="border-l-2 border-brand-cyan pl-4 py-1 space-y-1">
                    <h4 className="text-sm font-bold text-white">NestJS (TypeScript)</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Powering the backend. It offers a structured, modular controller-service model with built-in validation pipes, guards, interceptors, and strict TypeScript types.
                    </p>
                  </div>

                  <div className="border-l-2 border-brand-purple pl-4 py-1 space-y-1">
                    <h4 className="text-sm font-bold text-white">Prisma ORM & PostgreSQL</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Our database layer. Prisma ORM handles strict schema definitions and generates type-safe database queries. PostgreSQL stores users, posts, comments, likes, and bookmarks reliably.
                    </p>
                  </div>

                  <div className="border-l-2 border-brand-cyan pl-4 py-1 space-y-1">
                    <h4 className="text-sm font-bold text-white">Redis Caching & BullMQ Queues</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Ensures backend performance remains high. Redis cache stores hot server responses, and acts as the broker for BullMQ background queues to handle heavy mail jobs asynchronously.
                    </p>
                  </div>
                </div>

                {/* Architecture visualization in boxy ASCII format */}
                <div className="pt-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">System Flow Map</h4>
                  <div className="p-4 rounded-xl border border-border-subtle bg-bg-card-sub font-mono text-[10px] text-emerald-600 dark:text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
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
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ManifestoPage;
