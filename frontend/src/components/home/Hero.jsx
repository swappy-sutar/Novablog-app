import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import GradientText from '../ui/GradientText';
import GlassCard from '../ui/GlassCard';

const TerminalMockup = () => {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const scrollRef = useRef(null);

  // 3D mouse perspective values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  // Spring configuration for lag-free buttery motion
  const springConfig = { damping: 22, stiffness: 220, mass: 0.4 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Glow position following cursor
  const glowX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const script = [
    { type: 'input', text: 'novablog search "react hooks"' },
    { type: 'output', text: '# Searching 50k+ articles...', color: 'text-gray-500' },
    { type: 'output', text: '✓ Found 342 results', color: 'text-indigo-400' },
    { type: 'input', text: 'novablog publish --draft' },
    { type: 'output', text: '✓ Draft saved · slug: react-hooks-deep-dive', color: 'text-indigo-400' },
    { type: 'output', text: '✓ Estimated read: 8 min · SEO score: 94', color: 'text-indigo-400' },
    { type: 'input', text: 'novablog analytics --week' },
    { type: 'output', text: '# Views +24% · Followers +12', color: 'text-gray-500' },
    { type: 'output', text: '✓ Top post: "TypeScript Generics" · 4.2k views', color: 'text-indigo-400' }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentInput]);

  useEffect(() => {
    let scriptIdx = 0;
    let charIdx = 0;
    let timer;

    const runScript = () => {
      if (scriptIdx >= script.length) {
        return;
      }

      const step = script[scriptIdx];

      if (step.type === 'input') {
        if (charIdx < step.text.length) {
          setCurrentInput(step.text.slice(0, charIdx + 1));
          charIdx++;
          timer = setTimeout(runScript, 50);
        } else {
          setHistory(prev => [...prev, { type: 'input', text: step.text }]);
          setCurrentInput('');
          scriptIdx++;
          charIdx = 0;
          timer = setTimeout(runScript, 600);
        }
      } else if (step.type === 'output') {
        setHistory(prev => [...prev, { type: 'output', text: step.text, color: step.color }]);
        scriptIdx++;
        timer = setTimeout(runScript, 300);
      }
    };

    timer = setTimeout(runScript, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="relative w-full h-[280px] sm:h-[360px] group select-none"
      style={{ perspective: 1000 }}
    >
      {/* Ambient shadow glow behind the terminal card */}
      <motion.div
        className="absolute inset-0 -z-10 blur-2xl rounded-2xl opacity-35 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--color-brand-purple), var(--color-brand-cyan))',
          rotateX: springRotateX,
          rotateY: springRotateY,
          x: useTransform(x, [-0.5, 0.5], [-12, 12]),
          y: useTransform(y, [-0.5, 0.5], [-12, 12]),
          willChange: 'transform'
        }}
      />

      {/* Main 3D Card Container */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        }}
        className="w-full h-full border border-white/10 bg-[#090915]/95 shadow-2xl rounded-2xl overflow-hidden flex flex-col p-4 sm:p-6 font-mono text-xs sm:text-sm text-gray-300 relative"
      >
        {/* Dynamic spotlight reflection shine glare overlay */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 180px at ${glowX} ${glowY}, rgba(255,255,255,0.06), transparent 85%)`
          }}
        />

        <div className="flex items-center justify-between pb-4 border-b border-white/5 select-none relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-gray-500 ml-2 font-mono">novablog ~ terminal</span>
          </div>
        </div>

        <div ref={scrollRef} className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-left overflow-y-auto leading-relaxed flex-1 scrollbar-hide relative z-10">
          {history.map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {line.type === 'input' ? (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">&gt;</span>
                  <span className="text-white font-bold">{line.text}</span>
                </div>
              ) : (
                <p className={`mt-0.5 ${line.color || 'text-gray-300'}`}>{line.text}</p>
              )}
            </motion.div>
          ))}

          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">&gt;</span>
            <span className="text-white font-bold">{currentInput}</span>
            <span className="w-2 h-4 bg-gray-400 animate-pulse inline-block" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Hero = () => {
  const handleScrollClick = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-40 lg:pb-35 overflow-hidden">
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
        style={{ willChange: 'transform' }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/20 dark:bg-brand-purple/15 rounded-full blur-[120px] -z-10 pointer-events-none hero-blob-purple"
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
        style={{ willChange: 'transform' }}
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-brand-cyan/20 dark:bg-brand-cyan/15 rounded-full blur-[100px] -z-10 pointer-events-none hero-blob-cyan"
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
        style={{ willChange: 'transform' }}
        className="absolute top-[20%] right-[10%] w-16 h-16 rounded-full border border-brand-purple/20 dark:border-brand-purple/10 bg-gradient-to-tr from-brand-purple/5 to-transparent -z-10 blur-[2px] pointer-events-none hidden sm:block"
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
        style={{ willChange: 'transform' }}
        className="absolute top-[60%] left-[45%] w-12 h-12 rounded-full border border-brand-blue/20 dark:border-brand-blue/10 bg-gradient-to-br from-brand-blue/5 to-transparent -z-10 blur-[3px] pointer-events-none hidden lg:block"
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-stretch">
        {/* Left Column: Copy */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left flex flex-col justify-center">
          <div className="space-y-4 sm:space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block py-1.5 px-4 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-brand-purple text-[10px] font-bold tracking-wider uppercase"
            >
              • v2.0 ARCHITECTURE NOW LIVE
            </motion.span>

            <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
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
              className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2"
            >
              <Link to="/feed">
                <Button variant="primary" className="py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2 group shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  Start Reading
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" className="py-3 px-6 text-xs font-bold uppercase tracking-wider">
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
              <TerminalMockup />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={handleScrollClick}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 select-none cursor-pointer pointer-events-auto z-10 hidden sm:flex border-none bg-transparent outline-none focus:outline-none group"
      >
        <div className="flex flex-col items-center">
          {[0, 1, 2].map((idx) => (
            <motion.svg
              key={idx}
              animate={{
                opacity: [0.15, 1, 0.15],
                y: [0, 2, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: idx * 0.25,
                ease: "easeInOut"
              }}
              className="w-4 h-4 text-brand-cyan/60 group-hover:text-brand-cyan transition-colors duration-300 -mt-2.5 first:-mt-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          ))}
        </div>
        <span className="text-[7.5px] font-mono tracking-[0.4em] text-gray-500 uppercase mt-1 group-hover:text-brand-cyan/80 transition-colors duration-300">
          Scroll
        </span>
      </button>
    </section>
  );
};

export default Hero;
