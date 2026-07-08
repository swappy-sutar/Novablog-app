import React, { useState } from 'react';
import { Sprout, Flame, FileText, Crown, Award, Pencil } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const LEVELS_DATA = [
  {
    level: 'LEVEL 1',
    title: 'SEEDLING',
    id: 'seedling',
    icon: Sprout,
    accentColor: '#06b6d4', // Cyan glow
    summary: 'Unlocked by reading your first technical articles.',
    description: 'Read 1-10 technical articles across any category and follow at least 1 author profile on the platform.',
    tooltipAlign: 'left-0 translate-x-0',
    pointerAlign: 'left-8 -translate-x-1/2'
  },
  {
    level: 'LEVEL 2',
    title: 'CONTRIBUTOR',
    id: 'contributor',
    icon: FileText,
    accentColor: '#10b981', // Green glow
    summary: 'Unlocked by engaging with the community.',
    description: 'Read 10-50 technical articles and initiate 1 active technical discussion thread.',
    tooltipAlign: 'left-1/2 -translate-x-1/2',
    pointerAlign: 'left-1/2 -translate-x-1/2'
  },
  {
    level: 'LEVEL 3',
    title: 'INFLUENCER',
    id: 'influencer',
    icon: Flame,
    accentColor: '#f97316', // Orange glow
    summary: 'Unlocked by sharing and curation.',
    description: 'Read 50-100 technical articles and share 3 blog reference links.',
    tooltipAlign: 'left-1/2 -translate-x-1/2',
    pointerAlign: 'left-1/2 -translate-x-1/2'
  },
  {
    level: 'LEVEL 4',
    title: 'RISING WRITER',
    id: 'rising_writer',
    icon: Pencil,
    accentColor: '#a855f7', // Purple glow
    summary: 'Unlocked by publishing high-quality drafts.',
    description: 'Publish 3+ technical drafts or articles and earn 100-500 views.',
    tooltipAlign: 'left-1/2 -translate-x-1/2',
    pointerAlign: 'left-1/2 -translate-x-1/2'
  },
  {
    level: 'LEVEL 5',
    title: 'LEGEND',
    id: 'legend',
    icon: Crown,
    accentColor: '#3b82f6', // Blue glow
    summary: 'Unlocked by maintaining an active streak.',
    description: 'Read 500+ technical articles and keep a 90% weekly reading streak.',
    tooltipAlign: 'left-1/2 -translate-x-1/2',
    pointerAlign: 'left-1/2 -translate-x-1/2'
  },
  {
    level: 'LEVEL 6',
    title: 'ESTABLISHED',
    id: 'established',
    icon: Award,
    accentColor: '#eab308', // Gold glow
    summary: 'The ultimate editorial achievement.',
    description: 'Accumulate 10+ published articles on Nova and secure peer recommendations.',
    tooltipAlign: 'right-0 left-auto translate-x-0',
    pointerAlign: 'right-8 translate-x-1/2'
  }
];

const TechProgressionMap = () => {
  const [hoveredLevel, setHoveredLevel] = useState(null);

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24 overflow-visible relative">
      {/* Self-contained CSS styles for cinematic glass chevrons */}
      <style dangerouslySetInnerHTML={{ __html: `
        .cinematic-chevron-border {
          clip-path: polygon(0 24px, 50% 0, 100% 24px, 100% 100%, 0 100%);
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .cinematic-chevron-inner {
          clip-path: polygon(0 23px, 50% 0, 100% 23px, 100% 100%, 0 100%);
        }
        .cinematic-group:hover .cinematic-chevron-border {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.8);
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
          return (
            <div 
              key={lvl.level} 
              className="relative flex flex-col cinematic-group"
              onMouseEnter={() => setHoveredLevel(lvl.id)}
              onMouseLeave={() => setHoveredLevel(null)}
            >
              
              {/* Backlight Ambient Glow behind the card */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none z-0"
                style={{
                  backgroundImage: `radial-gradient(circle, ${lvl.accentColor}20 0%, transparent 70%)`
                }}
              />

              {/* CINEMATIC TOOLTIP POPOVER */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute bottom-full mb-5 w-64 p-4 rounded-2xl bg-[#070814] border shadow-2xl backdrop-blur-xl pointer-events-none z-50 text-left font-sans ${lvl.tooltipAlign}`}
                    style={{ 
                      borderColor: `${lvl.accentColor}50`, 
                      boxShadow: `0 0 25px ${lvl.accentColor}20, 0 10px 30px rgba(0,0,0,0.6)`
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
                      className={`absolute top-full -mt-1.5 w-2.5 h-2.5 rotate-45 border-r border-b bg-[#070814] pointer-events-none ${lvl.pointerAlign}`}
                      style={{ 
                        borderColor: `${lvl.accentColor}50`
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 1px Gradient Border Chevron Container */}
              <div 
                className="flex-grow p-[1px] rounded-b-2xl bg-white/10 cinematic-chevron-border z-10 shadow-2xl"
                style={{
                  background: `linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(to bottom, ${lvl.accentColor}, ${lvl.accentColor}10)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`;
                }}
              >
                
                {/* Dark Glass Inner Card Content */}
                <div 
                  className="w-full h-full pt-12 pb-6 px-4.5 flex flex-col items-center text-center bg-[#070814]/90 backdrop-blur-2xl rounded-b-2xl cinematic-chevron-inner"
                >
                  
                  {/* Glowing Icon Shield Wrapper */}
                  <div 
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-5.5 transition-all duration-500 group-hover:scale-105 group-hover:-rotate-3"
                    style={{
                      borderColor: 'rgba(255,255,255,0.05)',
                      boxShadow: `inset 0 0 10px rgba(255,255,255,0.02)`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${lvl.accentColor}40`;
                      e.currentTarget.style.boxShadow = `0 0 20px ${lvl.accentColor}25, inset 0 0 10px ${lvl.accentColor}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.boxShadow = `inset 0 0 10px rgba(255,255,255,0.02)`;
                    }}
                  >
                    <IconComponent className="w-5.5 h-5.5 text-white/90" />
                  </div>

                  {/* Level Name */}
                  <h3 
                    className="text-xs font-black tracking-widest mb-6 transition-colors duration-300"
                    style={{ color: '#ffffff' }}
                  >
                    {lvl.title}
                  </h3>

                  {/* Simple Card Subtitle Description */}
                  <p className="text-[10px] text-gray-400 leading-relaxed font-sans font-medium px-1 flex-grow mb-8">
                    {lvl.summary}
                  </p>

                  {/* Step Level Identifier Badge */}
                  <div 
                    className="mt-auto py-1.5 px-4 rounded-full border border-white/5 bg-white/5 transition-all duration-300"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${lvl.accentColor}40`;
                      e.currentTarget.style.backgroundColor = `${lvl.accentColor}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    }}
                  >
                    <span className="text-[9px] font-black text-white/90 tracking-widest font-mono uppercase">
                      {lvl.level}
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
