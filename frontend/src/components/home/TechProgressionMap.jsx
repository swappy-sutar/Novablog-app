import React, { useState } from 'react';
import { Sprout, Flame, FileText, Crown, Award, Pencil } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const LEVELS_DATA = [
  {
    level: 'LEVEL 1',
    title: 'SEEDLING',
    id: 'seedling',
    icon: Sprout,
    accentColor: '#06b6d4', // Cyan
    summary: 'Unlocked at 1+ Reads',
    description: 'Read 1 or more technical articles on the platform to unlock this badge.',
    tooltipAlign: 'left-0 translate-x-0',
    pointerAlign: 'left-8 -translate-x-1/2'
  },
  {
    level: 'LEVEL 2',
    title: 'CONTRIBUTOR',
    id: 'contributor',
    icon: FileText,
    accentColor: '#10b981', // Green
    summary: 'Unlocked at 10+ Reads',
    description: 'Read 10 or more technical articles on the platform to unlock this badge.',
    tooltipAlign: 'left-1/2 -translate-x-1/2',
    pointerAlign: 'left-1/2 -translate-x-1/2'
  },
  {
    level: 'LEVEL 3',
    title: 'INFLUENCER',
    id: 'influencer',
    icon: Flame,
    accentColor: '#f97316', // Orange
    summary: 'Unlocked at 50+ Reads',
    description: 'Read 50 or more technical articles on the platform to unlock this badge.',
    tooltipAlign: 'left-1/2 -translate-x-1/2',
    pointerAlign: 'left-1/2 -translate-x-1/2'
  },
  {
    level: 'LEVEL 4',
    title: 'RISING WRITER',
    id: 'rising_writer',
    icon: Pencil,
    accentColor: '#a855f7', // Purple
    summary: 'Unlocked at 100+ Reads',
    description: 'Read 100 or more technical articles on the platform to unlock this badge.',
    tooltipAlign: 'left-1/2 -translate-x-1/2',
    pointerAlign: 'left-1/2 -translate-x-1/2'
  },
  {
    level: 'LEVEL 5',
    title: 'LEGEND',
    id: 'legend',
    icon: Crown,
    accentColor: '#3b82f6', // Blue
    summary: 'Unlocked at 250+ Reads',
    description: 'Read 250 or more technical articles on the platform to unlock this badge.',
    tooltipAlign: 'left-1/2 -translate-x-1/2',
    pointerAlign: 'left-1/2 -translate-x-1/2'
  },
  {
    level: 'LEVEL 6',
    title: 'ESTABLISHED',
    id: 'established',
    icon: Award,
    accentColor: '#eab308', // Gold
    summary: 'Unlocked at 500+ Reads',
    description: 'Read 500 or more technical articles on the platform to unlock this badge.',
    tooltipAlign: 'right-0 left-auto translate-x-0',
    pointerAlign: 'right-8 translate-x-1/2'
  }
];

const TechProgressionMap = () => {
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const [expandedLevel, setExpandedLevel] = useState(null);

  const handleCardClick = (id) => {
    // Toggle expanded state on mobile viewports (< 640px)
    if (window.innerWidth < 640) {
      setExpandedLevel(expandedLevel === id ? null : id);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24 overflow-visible relative">
      {/* Self-contained CSS styles for cinematic glass chevrons */}
      <style dangerouslySetInnerHTML={{ __html: `
        .cinematic-chevron-border {
          clip-path: polygon(0 24px, 50% 0, 100% 24px, 100% 100%, 0 100%);
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: transform;
          filter: drop-shadow(0 8px 12px rgba(0,0,0,0.12));
        }
        .cinematic-chevron-inner {
          clip-path: polygon(0 23px, 50% 0, 100% 23px, 100% 100%, 0 100%);
        }
        @media (min-width: 640px) {
          .cinematic-group:hover .cinematic-chevron-border {
            transform: translateY(-8px);
            filter: drop-shadow(0 20px 30px rgba(0,0,0,0.3));
          }
        }
      `}} />

      {/* Header */}
      <div className="text-center mb-20 space-y-2">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Level Up As You <span className="text-gradient">Read</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          Unlock exclusive badges on your user profile as your technical knowledge expands.
        </p>
      </div>

      {/* CINEMATIC CHEVRON GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-stretch select-none">
        {LEVELS_DATA.map((lvl) => {
          const IconComponent = lvl.icon;
          const isHovered = hoveredLevel === lvl.id;
          const isExpanded = expandedLevel === lvl.id;
          return (
            <div 
              key={lvl.level} 
              className="relative flex flex-col cinematic-group cursor-pointer sm:cursor-default"
              onMouseEnter={() => setHoveredLevel(lvl.id)}
              onMouseLeave={() => setHoveredLevel(null)}
              onClick={() => handleCardClick(lvl.id)}
            >
              
              {/* Backlight Ambient Glow behind the card */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none z-0"
                style={{
                  backgroundImage: `radial-gradient(circle, ${lvl.accentColor}20 0%, transparent 70%)`
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
                      borderColor: `${lvl.accentColor}50`, 
                      boxShadow: `0 0 25px ${lvl.accentColor}20, 0 10px 30px rgba(0,0,0,0.15)`
                    }}
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <IconComponent className="w-4 h-4" style={{ color: lvl.accentColor }} />
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
                        borderColor: `transparent ${lvl.accentColor}50 ${lvl.accentColor}50 transparent`
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 1px Gradient Border Chevron Container */}
              <div 
                className="flex-grow p-[1px] bg-white/10 cinematic-chevron-border z-10"
                style={{
                  background: (isHovered || isExpanded)
                    ? `linear-gradient(to bottom, ${lvl.accentColor}, ${lvl.accentColor}10)`
                    : `linear-gradient(to bottom, var(--color-border-subtle), transparent)`
                }}
              >
                
                {/* Opaque Inner Card Content to block gradient bleed */}
                <div 
                  className="w-full h-full pt-12 pb-6 px-4.5 flex flex-col items-center text-center bg-bg-dropdown cinematic-chevron-inner"
                >
                  
                  {/* Glowing Icon Shield Wrapper (Colored border & background on rest) */}
                  <div 
                    className="p-3.5 rounded-2xl flex items-center justify-center mb-5.5 transition-all duration-500 group-hover:scale-105 group-hover:-rotate-3 border"
                    style={{
                      borderColor: (isHovered || isExpanded) ? `${lvl.accentColor}60` : `${lvl.accentColor}25`,
                      backgroundColor: (isHovered || isExpanded) ? `${lvl.accentColor}15` : `${lvl.accentColor}06`,
                      boxShadow: (isHovered || isExpanded)
                        ? `0 0 20px ${lvl.accentColor}25, inset 0 0 10px ${lvl.accentColor}15` 
                        : `inset 0 0 8px ${lvl.accentColor}05`
                    }}
                  >
                    <IconComponent 
                      className="w-5.5 h-5.5 transition-colors duration-300" 
                      style={{ color: lvl.accentColor }} 
                    />
                  </div>

                  {/* Level Name */}
                  <h3 
                    className="text-xs font-black tracking-widest mb-4 transition-colors duration-300 text-white"
                  >
                    {lvl.title}
                  </h3>

                  {/* Simple Card Subtitle Description */}
                  <p className="text-[10px] text-gray-400 leading-relaxed font-sans font-medium px-1 flex-grow mb-6">
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
                          className="text-left pt-3 border-t border-border-subtle w-full"
                        >
                          <span className="text-[7.5px] font-bold text-gray-500 uppercase tracking-wider block mb-1">How to Unlock</span>
                          <p className="text-[10px] text-gray-300 leading-relaxed font-sans font-medium">
                            {lvl.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Step Level Identifier Badge (Vibrant theme-colored pills) */}
                  <div 
                    className="mt-auto py-1.5 px-4 rounded-full border transition-all duration-300 flex items-center gap-1.5"
                    style={{
                      borderColor: (isHovered || isExpanded) ? `${lvl.accentColor}70` : `${lvl.accentColor}30`,
                      backgroundColor: (isHovered || isExpanded) ? `${lvl.accentColor}20` : `${lvl.accentColor}10`,
                    }}
                  >
                    <span 
                      className="text-[9px] font-black tracking-widest font-mono uppercase transition-colors duration-300"
                      style={{ color: lvl.accentColor }}
                    >
                      {lvl.level}
                    </span>
                    
                    {/* Expand arrow indicator for mobile users */}
                    <span 
                      className="text-[7px] opacity-60 sm:hidden block transition-transform duration-300"
                      style={{ 
                        color: lvl.accentColor,
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
