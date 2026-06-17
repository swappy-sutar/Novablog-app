import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout, Cpu, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-24 space-y-28 font-sans">
      {/* 1. Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-8 pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 shadow-sm"
        >
          <span className="text-[10px] font-bold text-[#c4b5fd] tracking-widest uppercase">
            Est. 2024
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
        >
          Engineering the Future of <br className="hidden sm:inline" />
          <span className="text-gradient">Developer Narrative</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto"
        >
          A high-fidelity digital habitat built for the architects of the digital world. We provide the precision tools for your technical expression.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Link to="/write">
            <Button
              variant="primary"
              className="!rounded-xl !py-3.5 !px-8 text-sm bg-gradient-to-r from-brand-cyan to-brand-purple hover:opacity-90 font-semibold"
            >
              Start Writing
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
        </motion.div>
      </section>

      {/* 2. Philosophy Section */}
      <section id="philosophy" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8">
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-bold text-brand-purple uppercase tracking-widest pl-0.5">
              The Vision
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              The Aetheric Flux <span className="text-brand-cyan">Philosophy</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            At NovaBlog, we believe that technical writing is not just documentation—it is an art form. Our 'Aetheric Flux' philosophy treats every byte of content as a dynamic stream of energy.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex gap-4 p-4 rounded-xl border border-border-subtle bg-white/[0.01]">
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

            <div className="flex gap-4 p-4 rounded-xl border border-border-subtle bg-white/[0.01]">
              <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0 mt-0.5">
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
      </section>

      {/* 3. Built on Core Axioms */}
      <section className="space-y-8 pt-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Built on Core Axioms</h2>
          <p className="text-sm text-gray-400">The principles that define our engineering DNA.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Precision */}
          <GlassCard className="p-6 md:p-8 flex flex-col justify-between h-[280px] hover:border-white/10 hover:bg-bg-card-hover/40 transition-all border border-white/5 group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/25 flex items-center justify-center text-brand-cyan">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Precision</h3>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                Every pixel and every line of code is measured for performance. We obsess over the details so you can focus on your narrative without distraction.
              </p>
            </div>
            <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase pt-4 border-t border-border-subtle">
              01 // OPERATIONAL EXCELLENCE
            </div>
          </GlassCard>

          {/* Card 2: Transparency */}
          <GlassCard className="p-6 md:p-8 flex flex-col justify-between h-[280px] hover:border-white/10 hover:bg-bg-card-hover/40 transition-all border border-white/5 group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-brand-purple/10 border border-brand-purple/25 flex items-center justify-center text-brand-purple">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Transparency</h3>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                Open collaboration is our default state. Our platform is built by the community, for the community, with radical openness at every stage.
              </p>
            </div>
            <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase pt-4 border-t border-border-subtle">
              02 // OPEN SOURCE ETHOS
            </div>
          </GlassCard>

          {/* Card 3: Community */}
          <GlassCard className="p-6 md:p-8 flex flex-col justify-between h-[280px] hover:border-white/10 hover:bg-bg-card-hover/40 transition-all border border-white/5 group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-pink-400">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Community</h3>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                Developers are the heart of the digital age. NovaBlog is the agora where the brightest minds meet to share knowledge and inspire.
              </p>
            </div>
            <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase pt-4 border-t border-border-subtle">
              03 // COLLECTIVE INTELLIGENCE
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 4. The Architects */}
      <section className="space-y-8 pt-8">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">The Architects</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">The visionary architect behind the Nova platform.</p>
          </div>
          <button 
            onClick={() => window.open("https://github.com", "_blank")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border-subtle bg-white/[0.01] hover:bg-white/[0.04] text-xs font-semibold text-white tracking-wide transition-all cursor-pointer"
          >
            Join the Team
          </button>
        </div>

        {/* Architect Profile Grid */}
        <div className="flex justify-center">
          <GlassCard className="p-8 w-full max-w-sm border border-white/5 text-center space-y-6 hover:border-white/10 transition-colors">
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-brand-cyan/30 bg-bg-card flex items-center justify-center">
              {/* Profile Image (Initials placeholder matching the mock styling) */}
              <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-[#10132c] to-cyan-950 flex items-center justify-center text-4xl font-extrabold text-brand-cyan">
                SS
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">Swapnil Sutar</h3>
              <p className="text-xs text-brand-cyan font-semibold uppercase tracking-wider">Lead Architect & Creator</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
              Crafting premium high-fidelity tools to elevate developer storytelling and open source collaboration.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* 5. Call to Action Card */}
      <section className="pt-8">
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
                  className="!rounded-xl !py-3 !px-6 text-xs sm:text-sm bg-gradient-to-r from-brand-cyan to-brand-purple hover:opacity-90 font-semibold"
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
      </section>
    </div>
  );
};

export default AboutPage;
