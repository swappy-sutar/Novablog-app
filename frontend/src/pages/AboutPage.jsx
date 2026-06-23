import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Layout, 
  Cpu, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Mail, 
  Code2, 
  Database, 
  Zap, 
  Layers, 
  Globe,
  ArrowRight,
  Terminal,
  Activity
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const techStack = [
  {
    name: "React & Vite",
    category: "Frontend Engine",
    desc: "Lightning-fast client rendering with hot module replacement and component-based user interface architecture.",
    icon: <Code2 className="w-5 h-5 text-brand-cyan" />,
    color: "from-brand-cyan/20 to-brand-blue/5"
  },
  {
    name: "NestJS",
    category: "Backend Services",
    desc: "A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.",
    icon: <Cpu className="w-5 h-5 text-red-400" />,
    color: "from-red-500/10 to-brand-purple/5"
  },
  {
    name: "PostgreSQL",
    category: "Data Store",
    desc: "Relational database mapping rich models, indexes, and constraints with high integrity and transaction speeds.",
    icon: <Database className="w-5 h-5 text-brand-blue" />,
    color: "from-brand-blue/20 to-brand-cyan/5"
  },
  {
    name: "Redis",
    category: "Caching & Sessions",
    desc: "Sub-millisecond latency caching layer managing global rate limits, user sessions, and temporary security states.",
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    color: "from-yellow-500/15 to-orange-500/5"
  },
  {
    name: "BullMQ & Redis",
    category: "Job Queue System",
    desc: "Robust, asynchronous background worker queuing managing transactional emails, notifications, and resource processing.",
    icon: <Layers className="w-5 h-5 text-brand-purple" />,
    color: "from-brand-purple/20 to-pink-500/5"
  },
  {
    name: "Tailwind CSS v4",
    category: "UI Styling",
    desc: "High-performance, utility-first CSS engine enabling dynamic themes, smooth glassmorphism, and responsive design systems.",
    icon: <Globe className="w-5 h-5 text-brand-cyan" />,
    color: "from-brand-cyan/20 to-brand-purple/5"
  }
];

const AboutPage = () => {
  return (
    <div className="relative min-h-screen bg-bg-base overflow-hidden bg-dot-grid">
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-purple/10 blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-cyan/10 blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-[600px] h-[600px] rounded-full bg-brand-blue/5 blur-3xl opacity-30 pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-24 space-y-32 font-sans relative z-10"
      >
        {/* 1. Hero Section */}
        <motion.section variants={itemVariants} className="text-center max-w-4xl mx-auto space-y-8 pt-8">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 shadow-sm">
            <span className="text-[10px] font-bold text-[#c4b5fd] tracking-widest uppercase">
              Est. 2024
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Engineering the Future of <br className="hidden sm:inline" />
            <span className="text-gradient">Developer Narrative</span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            A high-fidelity digital habitat built for the architects of the digital world. We provide the precision tools for your technical expression.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/write">
              <Button
                variant="primary"
                className="!rounded-xl !py-3.5 !px-8 text-sm font-semibold"
              >
                Start Writing <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a href="#philosophy">
              <Button
                variant="secondary"
                className="!rounded-xl !py-3.5 !px-8 text-sm border border-border-subtle hover:bg-white/[0.04] text-white font-semibold"
              >
                Our Manifesto
              </Button>
            </a>
          </div>
        </motion.section>

        {/* 2. Philosophy Section */}
        <motion.section 
          variants={itemVariants}
          id="philosophy" 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-8"
        >
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest pl-0.5">
                The Vision
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                The Aetheric Flux <span className="text-brand-purple">Philosophy</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              At NovaBlog, we believe that technical writing is not just documentation—it is an art form. Our 'Aetheric Flux' philosophy treats every byte of content as a dynamic stream of knowledge, evolving in unison with the developer ecosystem.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 p-4 rounded-xl border border-border-subtle bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0 mt-0.5">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Structural Integrity</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Ensuring every blog post maintains a logical flow as robust as the systems you build.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl border border-border-subtle bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0 mt-0.5">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Dynamic Refinement</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Continuous evolution of the platform to match the rapid expansion of modern tech stacks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-2xl blur-xl opacity-20 group-hover:opacity-35 transition duration-1000" />
            <GlassCard className="relative overflow-hidden p-0 rounded-2xl border border-white/5 h-[340px] md:h-[400px]">
              <img
                src="/dark_server_room_rack.png"
                alt="High Tech server racks"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
            </GlassCard>
          </div>
        </motion.section>

        {/* 3. Core Tech Stack Section */}
        <motion.section variants={itemVariants} className="space-y-10 pt-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
              The Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Powering the Platform</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              NovaBlog runs on a bleeding-edge stack engineered for latency, high availability, and structural reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <GlassCard key={index} className="p-6 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between h-[230px] group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tech.color} blur-2xl opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none`} />
                <div className="space-y-4 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {tech.icon}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{tech.category}</span>
                    <h3 className="text-base font-bold text-white tracking-tight mt-0.5">{tech.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                    {tech.desc}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.section>

        {/* 4. Built on Core Axioms */}
        <motion.section variants={itemVariants} className="space-y-8 pt-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#c4b5fd] uppercase tracking-widest">
              Our Core Principles
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Built on Core Axioms</h2>
            <p className="text-sm text-gray-400">The principles that define our engineering DNA.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Axiom 1: Precision */}
            <GlassCard className="p-6 md:p-8 flex flex-col justify-between h-[280px] hover:border-white/10 hover:bg-bg-card-hover/40 transition-all border border-white/5 group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-brand-purple/10 border border-brand-purple/25 flex items-center justify-center text-brand-purple">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Precision</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Every pixel and every line of code is measured for performance. We obsess over the details so you can focus on your narrative without distraction.
                </p>
              </div>
              <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase pt-4 border-t border-border-subtle">
                01 // OPERATIONAL EXCELLENCE
              </div>
            </GlassCard>

            {/* Axiom 2: Transparency */}
            <GlassCard className="p-6 md:p-8 flex flex-col justify-between h-[280px] hover:border-white/10 hover:bg-bg-card-hover/40 transition-all border border-white/5 group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/25 flex items-center justify-center text-brand-cyan">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Security & Trust</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Engineered with global security headers, Redis rate limits, and secure lockout mechanisms to guarantee integrity and protect sensitive user data.
                </p>
              </div>
              <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase pt-4 border-t border-border-subtle">
                02 // ENTERPRISE INTEGRITY
              </div>
            </GlassCard>

            {/* Axiom 3: Community */}
            <GlassCard className="p-6 md:p-8 flex flex-col justify-between h-[280px] hover:border-white/10 hover:bg-bg-card-hover/40 transition-all border border-white/5 group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-pink-400">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Community agora</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Developers are the heart of the digital age. NovaBlog is the agora where the brightest minds meet to share knowledge, inspire, and learn.
                </p>
              </div>
              <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase pt-4 border-t border-border-subtle">
                03 // COLLECTIVE INTELLIGENCE
              </div>
            </GlassCard>
          </div>
        </motion.section>

        {/* 5. The Architects */}
        <motion.section variants={itemVariants} className="space-y-10 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
            <div>
              <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest pl-0.5">
                The Team
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">The Architects</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">The engineering minds designing and driving the Nova platform.</p>
            </div>
            <button 
              onClick={() => window.open("https://github.com", "_blank")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border-subtle bg-white/[0.01] hover:bg-white/[0.04] text-xs font-semibold text-white tracking-wide transition-all cursor-pointer hover:border-white/20 hover:scale-105"
            >
              Join the Team
            </button>
          </div>

          {/* Premium Creator Card */}
          <GlassCard className="p-8 w-full max-w-2xl border border-white/5 mx-auto relative overflow-hidden group">
            {/* Dynamic Background Glow on Hover */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-brand-purple/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-brand-cyan/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-8 items-center text-left">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-cyan to-brand-purple opacity-30 group-hover:opacity-70 blur transition duration-500" />
                <div className="relative w-32 h-32 rounded-full overflow-hidden border border-white/10 bg-bg-card flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-[#10132c] to-purple-950 flex items-center justify-center text-4xl font-extrabold text-white">
                    SS
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 w-full">
                <div>
                  <span className="text-[10px] font-bold text-brand-purple tracking-widest uppercase bg-brand-purple/10 px-2.5 py-1 rounded-md border border-brand-purple/20">
                    Lead Architect & Creator
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-3">Swapnil Sutar</h3>
                  <p className="text-xs text-gray-400 mt-1 font-mono">Full Stack Engineer // Creator</p>
                </div>
                
                <p className="text-xs text-gray-400 leading-relaxed">
                  Obsessed with creating high-performance developer ecosystems, clean code structures, and beautiful visual experiences. Creator of NovaBlog, designed to elevate technical writing and open-source collaboration to premium-tier narratives.
                </p>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  {["React", "NodeJS", "NestJS", "PostgreSQL", "Redis", "Docker", "Typescript"].map(tech => (
                    <span key={tech} className="text-[9px] font-semibold text-gray-300 bg-white/[0.03] px-2 py-0.5 rounded border border-white/5">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg border border-border-subtle bg-white/[0.01] hover:bg-white/[0.05] hover:text-white flex items-center justify-center text-gray-400 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg border border-border-subtle bg-white/[0.01] hover:bg-white/[0.05] hover:text-white flex items-center justify-center text-gray-400 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <a 
                    href="mailto:contact@novablog.com"
                    className="w-8 h-8 rounded-lg border border-border-subtle bg-white/[0.01] hover:bg-white/[0.05] hover:text-white flex items-center justify-center text-gray-400 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {/* 6. Call to Action Card */}
        <motion.section variants={itemVariants} className="pt-8">
          <div className="relative group rounded-3xl overflow-hidden">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan to-brand-purple rounded-3xl blur opacity-25 group-hover:opacity-35 transition duration-1000" />
            <GlassCard className="relative p-10 md:p-14 border border-white/10 bg-gradient-to-b from-[#11122a]/90 to-bg-base/90 text-center space-y-6 max-w-4xl mx-auto rounded-3xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Ready to <span className="text-gradient">Initialize</span>?
              </h2>
              <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
                Join 10,000+ engineers building the future of documentation and technical thought leadership.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link to="/signup">
                  <Button
                    variant="primary"
                    className="!rounded-xl !py-3 !px-6 text-xs sm:text-sm font-semibold"
                  >
                    Create Account
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button
                    variant="secondary"
                    className="!rounded-xl !py-3 !px-6 text-xs sm:text-sm border border-border-subtle hover:bg-white/[0.04] text-white font-semibold"
                  >
                    View Documentation
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default AboutPage;
