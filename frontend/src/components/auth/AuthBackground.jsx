import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const generateStaticNodes = () => {
  return Array.from({ length: 20 }).map((_, i) => {
    // Pure deterministic pseudo-random generator using sine wave values
    const pseudoRandom = (seed) => {
      const val = Math.sin(seed) * 10000;
      return val - Math.floor(val);
    };
    return {
      id: i,
      x: pseudoRandom(i + 1) * 100,
      y: pseudoRandom(i + 2) * 100,
      size: pseudoRandom(i + 3) * 3 + 2, // slightly larger squares
      duration: pseudoRandom(i + 4) * 25 + 20,
      delay: pseudoRandom(i + 5) * 10,
      animX: pseudoRandom(i + 6) * 60 - 30,
    };
  });
};

const AuthBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate random data nodes once on mount
  const nodes = useMemo(() => generateStaticNodes(), []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-gradient-to-b from-[#020b11] via-[#051520] to-[#010609]">
      {/* Ambient Mouse Tracking Glow (coordinated to cyan/blue theme) */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-brand-cyan/12 to-brand-blue/8 blur-[90px] pointer-events-none hidden md:block"
        animate={{
          x: mousePosition.x - 225,
          y: mousePosition.y - 225,
        }}
        transition={{
          type: "tween",
          ease: "backOut",
          duration: 0.6
        }}
      />

      {/* SVG Fine Square Grid Pattern (solid lines forming clean squares) */}
      <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="squares-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="none" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#squares-grid)" />
      </svg>

      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[0]">
        <h1 
          className="text-[24vw] md:text-[350px] font-black text-[#081b27] opacity-35 uppercase select-none leading-none text-center"
          style={{ 
            fontFamily: "'Archivo Black', 'Archivo', sans-serif",
            WebkitTextStroke: "2px rgba(255, 255, 255, 0.2)",
            letterSpacing: "0.25em",
            paddingLeft: "0.125em"
          }}
        >
          NOVA
        </h1>
      </div> */}

      {/* Floating Data Nodes (slow & subtle glowing squares) */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-[2px] bg-brand-cyan/25 shadow-[0_0_8px_rgba(6,182,212,0.4)] pointer-events-none"
          style={{
            width: node.size,
            height: node.size,
            left: `${node.x}%`,
            top: `${node.y}%`,
          }}
          animate={{
            y: [0, -120, 0],
            x: [0, node.animX, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: node.duration,
            repeat: Infinity,
            delay: node.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Tech / Dev Symbols */}
      <motion.div
        animate={{ y: [0, -25, 0], opacity: [0.08, 0.25, 0.08], rotate: [0, 3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[8%] text-6xl font-mono text-brand-cyan/20 select-none hidden md:block"
      >
        {`{ }`}
      </motion.div>
      <motion.div
        animate={{ y: [0, 30, 0], opacity: [0.08, 0.3, 0.08], rotate: [0, -5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[25%] right-[8%] text-5xl font-mono text-brand-cyan/25 select-none hidden md:block"
      >
        {`</>`}
      </motion.div>
      <motion.div
        animate={{ y: [0, -40, 0], opacity: [0.05, 0.2, 0.05], rotate: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[65%] left-[12%] text-4xl font-mono text-brand-blue/20 select-none hidden md:block"
      >
        #
      </motion.div>
    </div>
  );
};

export default AuthBackground;
