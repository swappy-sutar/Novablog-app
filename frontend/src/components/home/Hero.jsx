import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import GradientText from '../ui/GradientText';
import GlassCard from '../ui/GlassCard';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 lg:pt-40 lg:pb-35 overflow-hidden">
      {/* Dotted Grid Background */}
      <div className="absolute inset-0 bg-dot-grid mask-radial-fade -z-20 opacity-80 pointer-events-none" />

      {/* Animated Glow Blobs */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/20 dark:bg-brand-purple/15 rounded-full blur-[120px] -z-10 pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -30, 45, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-brand-cyan/20 dark:bg-brand-cyan/15 rounded-full blur-[100px] -z-10 pointer-events-none"
      />

      {/* Floating Spatial Accent Particles */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[20%] right-[10%] w-16 h-16 rounded-full border border-brand-purple/20 dark:border-brand-purple/10 bg-gradient-to-tr from-brand-purple/5 to-transparent -z-10 blur-[2px] pointer-events-none hidden sm:block"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[25%] left-[5%] w-8 h-8 rounded-full bg-brand-cyan/10 dark:bg-brand-cyan/5 -z-10 blur-[1px] pointer-events-none hidden md:block"
      />
      <motion.div
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[60%] left-[45%] w-12 h-12 rounded-full border border-brand-blue/20 dark:border-brand-blue/10 bg-gradient-to-br from-brand-blue/5 to-transparent -z-10 blur-[3px] pointer-events-none hidden lg:block"
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        {/* Left Column: Copy */}
        <div className="lg:col-span-7 space-y-6 text-left flex flex-col justify-center">
          <div className="space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block py-1.5 px-4 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-brand-purple text-[10px] font-bold tracking-wider uppercase"
            >
              • v2.0 ARCHITECTURE NOW LIVE
            </motion.span>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="block"
              >
                The Future of
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="block"
              >
                <GradientText className="from-brand-cyan via-brand-blue to-brand-purple">Developer</GradientText> Writing
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed"
            >
              An immersive, distraction-free environment built for the technical writer. Document, discover, and deploy knowledge across the global engineering mesh.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link to="/feed">
                <Button variant="primary" className="py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2 group shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  Start Reading
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" className="py-3 px-6 text-xs font-bold uppercase tracking-wider bg-transparent">
                  Explore Topics
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Premium Glass Status Board */}
        <div className="lg:col-span-5 w-full flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-grow flex flex-col"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex-grow flex flex-col"
            >
              <GlassCard className="relative border border-border-subtle bg-bg-card/75 shadow-2xl overflow-hidden group flex-grow flex flex-col justify-between p-6 min-h-[260px] sm:min-h-[340px]">
                {/* Header Status Bar */}
                <div className="flex items-center justify-between z-10 relative">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-base/60 backdrop-blur-md border border-border-subtle/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono tracking-widest text-gray-300 uppercase">NETWORK_STATUS</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-bg-base/60 backdrop-blur-md border border-border-subtle/60 text-[9px] font-mono font-bold text-emerald-400">
                    99.9% UPTIME
                  </div>
                </div>

                {/* Crystal Network Asset */}
                <div className="absolute inset-0 w-full h-full -z-10">
                  <img
                    src="/crystal_network_status.png"
                    alt="Network Status Grid"
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent" />
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
