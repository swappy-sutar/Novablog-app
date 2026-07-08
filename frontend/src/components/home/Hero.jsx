import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import GradientText from '../ui/GradientText';
import GlassCard from '../ui/GlassCard';

const TerminalMockup = () => {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const scrollRef = useRef(null);

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
        // Reset script after 5 seconds to loop continuously
        timer = setTimeout(() => {
          setHistory([]);
          setCurrentInput('');
          scriptIdx = 0;
          charIdx = 0;
          runScript();
        }, 5000);
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
        timer = setTimeout(runScript, 400);
      }
    };

    timer = setTimeout(runScript, 800);
    return () => clearTimeout(timer);
  }, []);

  const renderHighlightedInput = (text) => {
    const parts = text.split(' ');
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-emerald-400 font-bold">&gt;</span>
        {parts.map((word, idx) => {
          let color = 'text-white font-semibold';
          if (word === 'novablog') color = 'text-brand-cyan font-bold';
          else if (['search', 'publish', 'analytics'].includes(word)) color = 'text-brand-purple';
          else if (word.startsWith('--') || word.startsWith('"') || word.endsWith('"')) color = 'text-orange-400 font-mono';
          return <span key={idx} className={color}>{word}</span>;
        })}
      </div>
    );
  };

  const renderHighlightedOutput = (line, idx) => {
    if (line.text.startsWith('✓')) {
      const parts = line.text.split('·');
      return (
        <p key={idx} className="mt-0.5 text-emerald-400/90 font-medium">
          {parts.map((part, pIdx) => {
            if (pIdx > 0) {
              const subParts = part.split(':');
              return (
                <span key={pIdx}>
                  <span className="text-gray-500 font-mono"> ·</span>
                  <span className="text-gray-400"> {subParts[0]}</span>
                  {subParts[1] && <span className="text-brand-cyan font-semibold">:{subParts[1]}</span>}
                </span>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </p>
      );
    }
    if (line.text.startsWith('#')) {
      return (
        <p key={idx} className="mt-0.5 text-gray-500 font-mono italic">
          {line.text}
        </p>
      );
    }
    return <p key={idx} className={`mt-0.5 ${line.color || 'text-gray-300'}`}>{line.text}</p>;
  };

  return (
    <GlassCard className="relative border border-border-subtle bg-[#090915]/95 shadow-2xl overflow-hidden flex flex-col p-4 sm:p-6 h-[280px] sm:h-[360px] font-mono text-xs sm:text-sm text-gray-300">
      <div className="flex items-center justify-between pb-4 border-b border-white/5 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] text-gray-500 ml-2 font-mono">novablog ~ terminal</span>
        </div>
      </div>

      <div ref={scrollRef} className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-left overflow-y-auto leading-relaxed flex-1 scrollbar-hide">
        {history.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {line.type === 'input' ? renderHighlightedInput(line.text) : renderHighlightedOutput(line, idx)}
          </motion.div>
        ))}

        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold">&gt;</span>
          {currentInput && renderHighlightedInput(currentInput).props.children[1]}
          <span className="w-1.5 h-3.5 bg-brand-cyan animate-pulse inline-block" />
        </div>
      </div>
    </GlassCard>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: x * 10, y: -y * 10 }); // Tilt up to 10 degrees
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleScrollClick = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    });
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-40 lg:pb-35 overflow-hidden"
    >
      {/* Dotted Grid Background */}
      <div className="absolute inset-0 bg-dot-grid mask-radial-fade -z-20 opacity-80 pointer-events-none" />

      {/* Cinematic Mouse Spotlight Glow */}
      <div 
        className="absolute inset-0 pointer-events-none -z-20 transition-opacity duration-700"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `
            radial-gradient(650px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.09), transparent 45%),
            radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.05), transparent 45%)
          `
        }}
      />

      {/* Twinkling Star/Cross Particles */}
      {[
        { top: '15%', left: '12%', delay: 0 },
        { top: '30%', left: '78%', delay: 1.5 },
        { top: '80%', left: '8%', delay: 3 },
        { top: '70%', left: '88%', delay: 4.5 },
      ].map((pos, idx) => (
        <motion.div
          key={idx}
          animate={{
            opacity: [0.15, 0.7, 0.15],
            scale: [0.75, 1.25, 0.75],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: pos.delay,
            ease: "easeInOut"
          }}
          className="absolute -z-10 text-brand-cyan/30 pointer-events-none hidden sm:block font-sans text-xs select-none"
          style={{ top: pos.top, left: pos.left }}
        >
          ✦
        </motion.div>
      ))}

      {/* Animated Glow Blobs */}
      <motion.div
        animate={{
          x: [0, 30, -15, 0],
          y: [0, -40, 25, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/20 dark:bg-brand-purple/12 rounded-full blur-[125px] -z-10 pointer-events-none hero-blob-purple"
      />
      <motion.div
        animate={{
          x: [0, -25, 35, 0],
          y: [0, 30, -30, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-brand-cyan/18 dark:bg-brand-cyan/12 rounded-full blur-[105px] -z-10 pointer-events-none hero-blob-cyan"
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
                <Button variant="primary" className="py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2 group bg-gradient-to-r from-brand-purple via-brand-blue to-brand-cyan border-0 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] transition-all duration-300">
                  Start Reading
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" className="py-3 px-6 text-xs font-bold uppercase tracking-wider hover:border-brand-cyan/60 hover:text-brand-cyan transition-colors duration-300">
                  Explore Topics
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Premium 3D Glass Status Board */}
        <div 
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className="lg:col-span-5 w-full flex flex-col transition-transform duration-200 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-grow flex flex-col"
          >
            <TerminalMockup />
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
