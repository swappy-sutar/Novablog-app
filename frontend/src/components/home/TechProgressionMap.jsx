import React, { useState } from 'react';
import { Sprout, Flame, FileText, Crown, Award, Pencil } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const LEVELS_DATA = [
  {
    level: 'LEVEL 1',
    title: 'SEEDLING',
    id: 'seedling',
    image: '/badge_seedling.png',
    gradientFrom: '#00b4db',
    gradientTo: '#0083b0',
    textColor: 'text-[#005c7c]',
    readsColor: 'text-[#52525b] font-bold',
    badgeBg: '#005c7c',
    badgeText: 'text-[#ffffff]',
    iconColor: '#ffffff',
    iconBg: 'rgba(0, 180, 219, 0.08)',
    iconBorder: '#00b4db',
    summary: '0 Reads',
    description: 'Read 1 or more technical articles on the platform to unlock this badge.',
    tooltipAlign: 'left-0 translate-x-0',
    pointerAlign: 'left-8 -translate-x-1/2'
  },
  {
    level: 'LEVEL 2',
    title: 'CONTRIBUTOR',
    id: 'contributor',
    image: '/badge_contributor.png',
    gradientFrom: '#98ec2d',
    gradientTo: '#5bb300',
    textColor: 'text-[#2a5c00]',
    readsColor: 'text-[#52525b] font-bold',
    badgeBg: '#1a3c00',
    badgeText: 'text-[#ffffff]',
    iconColor: '#1a3c00',
    iconBg: 'rgba(91, 179, 0, 0.08)',
    iconBorder: '#5bb300',
    summary: '50+ Reads',
    description: 'Read 50 or more technical articles on the platform to unlock this badge.',
    tooltipAlign: 'left-1/2 -translate-x-1/2',
    pointerAlign: 'left-1/2 -translate-x-1/2'
  },
  {
    level: 'LEVEL 3',
    title: 'INFLUENCER',
    id: 'influencer',
    image: '/badge_influencer.png',
    gradientFrom: '#f97316',
    gradientTo: '#ea580c',
    textColor: 'text-[#ea580c]',
    readsColor: 'text-[#52525b] font-bold',
    badgeBg: '#ea580c',
    badgeText: 'text-[#ffffff]',
    iconColor: '#f97316',
    iconBg: 'rgba(234, 88, 12, 0.08)',
    iconBorder: '#ea580c',
    summary: '250+ Reads',
    description: 'Read 250 or more technical articles on the platform to unlock this badge.',
    tooltipAlign: 'left-1/2 -translate-x-1/2',
    pointerAlign: 'left-1/2 -translate-x-1/2'
  },
  {
    level: 'LEVEL 4',
    title: 'RISING WRITER',
    id: 'rising_writer',
    image: '/badge_rising_writer.png',
    gradientFrom: '#d69bf7',
    gradientTo: '#7c3aed',
    textColor: 'text-[#581c87]',
    readsColor: 'text-[#52525b] font-bold',
    badgeBg: '#581c87',
    badgeText: 'text-[#ffffff]',
    iconColor: '#ffffff',
    iconBg: 'rgba(124, 58, 237, 0.08)',
    iconBorder: '#7c3aed',
    summary: '1,000+ Reads',
    description: 'Read 1,000 or more technical articles on the platform to unlock this badge.',
    tooltipAlign: 'left-1/2 -translate-x-1/2',
    pointerAlign: 'left-1/2 -translate-x-1/2'
  },
  {
    level: 'LEVEL 5',
    title: 'LEGEND',
    image: '/badge_legend.png',
    id: 'legend',
    gradientFrom: '#3a7bd5',
    gradientTo: '#3a6073',
    textColor: 'text-[#1e3a8a]',
    readsColor: 'text-[#52525b] font-bold',
    badgeBg: '#1e3a8a',
    badgeText: 'text-[#ffffff]',
    iconColor: '#ffffff',
    iconBg: 'rgba(58, 123, 213, 0.08)',
    iconBorder: '#3a7bd5',
    summary: '5,000+ Reads',
    description: 'Read 5,000 or more technical articles on the platform to unlock this badge.',
    tooltipAlign: 'left-1/2 -translate-x-1/2',
    pointerAlign: 'left-1/2 -translate-x-1/2'
  },
  {
    level: 'LEVEL 6',
    title: 'ESTABLISHED',
    id: 'established',
    image: '/badge_established.png',
    gradientFrom: '#ffe8be',
    gradientTo: '#d4a359',
    textColor: 'text-[#5c401f]',
    readsColor: 'text-[#52525b] font-bold',
    badgeBg: '#5c401f',
    badgeText: 'text-[#ffffff]',
    iconColor: '#a77b3b',
    iconBg: 'rgba(212, 163, 89, 0.08)',
    iconBorder: '#d4a359',
    summary: '10,000+ Reads',
    description: 'Read 10,000 or more technical articles on the platform to unlock this badge.',
    tooltipAlign: 'right-0 left-auto translate-x-0',
    pointerAlign: 'right-8 translate-x-1/2'
  }
];

const TechProgressionMap = () => {
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const [expandedLevel, setExpandedLevel] = useState(null);

  const handleCardClick = (id) => {
    if (window.innerWidth < 640) {
      setExpandedLevel(expandedLevel === id ? null : id);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24 overflow-visible relative pt-0">
      {/* Wavy Divider Transition */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 h-20 md:h-28 overflow-visible pointer-events-none mb-2 -mt-16 z-10">

        {/* Glow backdrop mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-12 bg-gradient-to-r from-brand-purple/10 via-brand-cyan/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />
        
        {/* Curved boundary line with layered neon glow */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1440 120" preserveAspectRatio="none">
          {/* Layer 1: Outer Soft Glow */}
          <path 
            d="M0,50 C240,10 480,90 720,40 C960,-10 1200,70 1440,30" 
            fill="none" 
            stroke="url(#divider-line-grad)" 
            strokeWidth="6"
            className="opacity-25 blur-[3px]"
          />
          {/* Layer 2: Inner Crisp Laser Line */}
          <path 
            d="M0,50 C240,10 480,90 720,40 C960,-10 1200,70 1440,30" 
            fill="none" 
            stroke="url(#divider-line-grad)" 
            strokeWidth="2"
            className="opacity-80"
          />
          <defs>
            <linearGradient id="divider-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-brand-purple)" stopOpacity="0" />
              <stop offset="25%" stopColor="var(--color-brand-purple)" stopOpacity="0.9" />
              <stop offset="75%" stopColor="var(--color-brand-cyan)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--color-brand-cyan)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Full-bleed Cinematic Dotted Grid Background */}
      <div 
        className="absolute inset-y-0 w-screen left-1/2 -translate-x-1/2 pointer-events-none cinematic-dots -z-10"
        style={{
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.15) 12%, rgba(0,0,0,0.6) 24%, black 36%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.15) 12%, rgba(0,0,0,0.6) 24%, black 36%, black 85%, transparent)'
        }}
      />

      {/* SVG ClipPath Definition for Rounded Chevrons */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="rounded-chevron-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.18 Q 0,0.12 0.04,0.11 L 0.46,0.01 Q 0.5,0 0.54,0.01 L 0.96,0.11 Q 1,0.12 1,0.18 L 1,0.94 Q 1,1 0.94,1 L 0.06,1 Q 0,1 0,0.94 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Self-contained CSS styles for cinematic glass chevrons & animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes laser-flow {
          to { stroke-dashoffset: -340; }
        }
        .animate-laser-flow {
          animation: laser-flow 4.5s linear infinite;
        }
        .cinematic-chevron-border {
          clip-path: url(#rounded-chevron-clip);
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: transform, filter;
          background-color: #ffffff;
        }
        .cinematic-chevron-inner {
          clip-path: url(#rounded-chevron-clip);
        }
        
        .cinematic-dots {
          background-image: radial-gradient(rgba(15, 23, 42, 0.16) 1.5px, transparent 1.5px);
        }
        :root:not(.light-mode) .cinematic-dots {
          background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px) !important;
        }
        
        /* Dark mode overrides aligned with website theme state */
        :root:not(.light-mode) .cinematic-chevron-border {
          background-color: #111827 !important;
        }
        :root:not(.light-mode) .cinematic-level-title {
          color: #ffffff !important;
        }
        :root:not(.light-mode) .cinematic-level-reads {
          color: #d1d5db !important;
        }
        .cinematic-section-title {
          color: #0f172a;
        }
        .cinematic-section-subtitle {
          color: #4b5563;
        }
        :root:not(.light-mode) .cinematic-section-title {
          color: #ffffff !important;
        }
        :root:not(.light-mode) .cinematic-section-subtitle {
          color: #9ca3af !important;
        }
        
        @media (min-width: 640px) {
          .cinematic-group:hover .cinematic-chevron-border {
            transform: translateY(-8px);
          }
        }
        @media (min-width: 1280px) {
          .staircase-card-0 { transform: translateY(0px); }
          .staircase-card-1 { transform: translateY(-24px); }
          .staircase-card-2 { transform: translateY(-48px); }
          .staircase-card-3 { transform: translateY(-72px); }
          .staircase-card-4 { transform: translateY(-96px); }
          .staircase-card-5 { transform: translateY(-120px); }
        }
      `}} />

      {/* Header */}
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight cinematic-section-title">
          Level Up As You <span className="text-gradient">Read</span>
        </h2>
        <p className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed cinematic-section-subtitle">
          Unlock exclusive badges on your user profile as your technical knowledge expands.
        </p>
      </div>

      {/* Dynamic Laser Connection Path representing Evolution Path */}
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        className="hidden xl:block absolute left-0 right-0 top-36 w-full h-[calc(100%-120px)] pointer-events-none z-0 overflow-visible"
      >
        <defs>
          <linearGradient id="laser-path-grad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#00b4db" />
            <stop offset="20%" stopColor="#98ec2d" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#7c3aed" />
            <stop offset="80%" stopColor="#3a7bd5" />
            <stop offset="100%" stopColor="#d4a359" />
          </linearGradient>
          <filter id="laser-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        {/* Ambient Glow path */}
        <path 
          d="M 8.3 80 C 16.6 80, 16.6 70, 25 68 C 33.3 66, 33.3 58, 41.6 56 C 50 54, 50 46, 58.3 44 C 66.6 42, 66.6 34, 75 32 C 83.3 30, 83.3 22, 91.6 20" 
          fill="none" 
          stroke="url(#laser-path-grad)" 
          strokeWidth="6" 
          opacity="0.35" 
          filter="url(#laser-blur)"
        />
        {/* Foreground sharp sweeping path */}
        <path 
          d="M 8.3 80 C 16.6 80, 16.6 70, 25 68 C 33.3 66, 33.3 58, 41.6 56 C 50 54, 50 46, 58.3 44 C 66.6 42, 66.6 34, 75 32 C 83.3 30, 83.3 22, 91.6 20" 
          fill="none" 
          stroke="url(#laser-path-grad)" 
          strokeWidth="2.5" 
        />
      </svg>

      {/* CINEMATIC CHEVRON GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-stretch select-none xl:pt-32 relative z-10">
        {LEVELS_DATA.map((lvl, index) => {
          const isHovered = hoveredLevel === lvl.id;
          const isExpanded = expandedLevel === lvl.id;
          return (
            <div 
              key={lvl.level} 
              className={`relative flex flex-col cinematic-group cursor-pointer sm:cursor-default staircase-card-${index}`}
              onMouseEnter={() => setHoveredLevel(lvl.id)}
              onMouseLeave={() => setHoveredLevel(null)}
              onClick={() => handleCardClick(lvl.id)}
            >
              
              {/* Backlight Ambient Glow behind the card */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none z-0"
                style={{
                  backgroundImage: `radial-gradient(circle, ${lvl.gradientFrom}35 0%, ${lvl.gradientTo}10 45%, transparent 70%)`
                }}
              />
 
              {/* CINEMATIC TOOLTIP POPOVER (Hidden on Mobile, Displayed on Desktop hover) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`hidden sm:block absolute bottom-full mb-5 w-64 p-4 rounded-2xl bg-bg-dropdown border shadow-2xl backdrop-blur-xl pointer-events-none z-50 text-left font-sans ${lvl.tooltipAlign}`}
                    style={{ 
                      borderColor: `${lvl.gradientFrom}50`, 
                      boxShadow: `0 0 25px ${lvl.gradientFrom}20, 0 10px 30px rgba(0,0,0,0.15)`
                    }}
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2.5 border-b border-white/5 pb-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center border-2" style={{ borderColor: lvl.iconBorder, backgroundColor: lvl.iconBg }}>
                          <img src={lvl.image} alt={lvl.title} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <h5 className="text-[10px] font-extrabold text-white tracking-widest">{lvl.level} - {lvl.title}</h5>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block">How to Unlock</span>
                        <p className="text-[10px] text-gray-300 leading-relaxed font-medium">
                          {lvl.description}
                        </p>
                      </div>
                    </div>
 
                    {/* Glowing rotated-square tooltip pointer that matches the glowing outline */}
                    <div 
                      className={`absolute top-full -mt-1.5 w-2.5 h-2.5 rotate-45 border-r border-b bg-bg-dropdown pointer-events-none ${lvl.pointerAlign}`}
                      style={{ 
                        borderColor: `transparent ${lvl.gradientFrom}50 ${lvl.gradientFrom}50 transparent`
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3D Solid Colored Card Body Container */}
              <div 
                className="flex-grow pt-[1px] px-0 pb-0 cinematic-chevron-border z-10"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 35%, ${lvl.gradientTo}40 100%)`,
                  filter: isHovered
                    ? `drop-shadow(0 0 22px ${lvl.gradientFrom}80) drop-shadow(0 16px 36px rgba(0, 0, 0, 0.45))`
                    : `drop-shadow(0 8px 20px rgba(0, 0, 0, 0.35))`
                }}
              >
                
                {/* Glossy Reflective Card Face Overlay */}
                <div 
                  className="w-full h-full pt-12 pb-6 px-4.5 flex flex-col items-center text-center cinematic-chevron-inner relative group"
                  style={{
                    background: 'transparent',
                    backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 50%)'
                  }}
                >
                  
                  {/* Glowing Icon Shield Wrapper (Colored background on rest) */}
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6.5 border-2 shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)] overflow-hidden"
                    style={{
                      borderColor: lvl.iconBorder,
                      backgroundColor: lvl.iconBg,
                    }}
                  >
                    <img 
                      src={lvl.image} 
                      alt={lvl.title} 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>

                  {/* Level Name */}
                  <h3 
                    className={`text-xs font-black tracking-widest mb-3.5 transition-all duration-300 ${lvl.textColor} cinematic-level-title`}
                  >
                    {lvl.title}
                  </h3>

                  {/* Reads requirement count */}
                  <p className={`text-[10px] leading-relaxed font-sans font-bold px-1 flex-grow mb-6.5 ${lvl.readsColor} cinematic-level-reads`}>
                    {lvl.summary}
                  </p>

                  {/* MOBILE EXPANDABLE DETAILS: Slide open inline details when tapped on touch screen */}
                  <div className="w-full sm:hidden overflow-hidden block">
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginBottom: 18 }}
                          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="text-left pt-3 border-t border-white/10 w-full"
                        >
                          <span className={`text-[7.5px] font-bold uppercase tracking-wider block mb-1 ${lvl.textColor} cinematic-level-title`}>How to Unlock</span>
                          <p className={`text-[10px] leading-relaxed font-sans font-medium ${lvl.readsColor} cinematic-level-reads`}>
                            {lvl.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Step Level Identifier Badge (Vibrant theme-colored glass button) */}
                  <div 
                    className="mt-auto py-1.5 px-4 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15),_inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/5"
                    style={{
                      backgroundColor: lvl.badgeBg,
                    }}
                  >
                    <span 
                      className={`text-[9px] font-black tracking-widest font-mono uppercase transition-colors duration-300 ${lvl.badgeText}`}
                    >
                      {lvl.level}
                    </span>
                    
                    {/* Expand arrow indicator for mobile users */}
                    <span 
                      className={`text-[7px] opacity-60 sm:hidden block transition-transform duration-300 ${lvl.badgeText}`}
                      style={{ 
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      ▼
                    </span>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default TechProgressionMap;
