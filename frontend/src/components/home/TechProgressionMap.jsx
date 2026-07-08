import React, { useState } from 'react';
import { Sprout, Flame, FileText, Crown, Award, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const TIER_DETAILS = {
  seedling: {
    title: 'SEEDLING',
    color: '#06b6d4', // cyan
    requirements: [
      "Read 1-10 technical articles across any category",
      "Follow at least 1 author profile on the platform"
    ],
    privileges: [
      "Post comments on active publications",
      "Bookmark articles to your reading dashboard",
      "Basic Seedling platform profile badge"
    ],
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-8"
  },
  contributor: {
    title: 'CONTRIBUTOR',
    color: '#10b981', // green
    requirements: [
      "Read 10-50 technical articles",
      "Initiate 1 discussion comment thread"
    ],
    privileges: [
      "Edit comment content within 1 hour",
      "Submit article drafts for review",
      "Exclusive Contributor profile badge"
    ],
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-8"
  },
  influencer: {
    title: 'INFLUENCER',
    color: '#f97316', // orange
    requirements: [
      "Read 50-100 technical articles",
      "Share at least 3 custom blog reference links"
    ],
    privileges: [
      "Receive real-time push follower notifications",
      "Customize profile header backgrounds",
      "Access early beta layouts & features"
    ],
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-8"
  },
  rising_writer: {
    title: 'RISING WRITER',
    color: '#06b6d4', // cyan
    requirements: [
      "Publish 3+ technical drafts or articles",
      "Earn 100-500 total views from readers"
    ],
    privileges: [
      "Creator Hub statistics dashboard access",
      "Configure custom footer signature blocks",
      "Receive reader tips and support donations"
    ],
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-10"
  },
  legend: {
    title: 'LEGEND',
    color: '#eab308', // gold
    requirements: [
      "Read 500+ technical articles",
      "Keep a 90% weekly reading goal streak"
    ],
    privileges: [
      "VIP neon highlight surrounding comments",
      "Weekly direct feedback channel to editors",
      "Guaranteed landing page feed curation slots"
    ],
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-8"
  },
  established: {
    title: 'ESTABLISHED VOICE',
    color: '#94a3b8', // slate/silver
    requirements: [
      "Accumulate 10+ published articles on Nova",
      "Secure peer editorial board recommendation check"
    ],
    privileges: [
      "Verified blue creator mark on username",
      "Pin posts to the global platform feed",
      "Community moderation privileges in threads"
    ],
    placement: "bottom-full right-0 mb-8 translate-x-[15%]"
  }
};

const NODES = [
  {
    id: 'seedling',
    title: 'SEEDLING',
    icon: Sprout,
    color: '#06b6d4', // cyan
    glowClass: 'shadow-[0_0_20px_rgba(6,182,212,0.35)] border-brand-cyan/40',
    top: '25%',
    left: '22%'
  },
  {
    id: 'influencer',
    title: 'INFLUENCER',
    icon: Flame,
    color: '#f97316', // orange
    glowClass: 'shadow-[0_0_20px_rgba(249,115,22,0.35)] border-orange-500/40',
    top: '75%',
    left: '28%'
  },
  {
    id: 'contributor',
    title: 'CONTRIBUTOR',
    icon: FileText,
    color: '#10b981', // green
    glowClass: 'shadow-[0_0_20px_rgba(16,185,129,0.35)] border-emerald-500/40',
    top: '25%',
    left: '72%'
  },
  {
    id: 'legend',
    title: 'LEGEND',
    icon: Crown,
    color: '#eab308', // gold
    glowClass: 'shadow-[0_0_20px_rgba(234,179,8,0.35)] border-yellow-500/40',
    top: '75%',
    left: '78%'
  },
  {
    id: 'established',
    title: 'ESTABLISHED VOICE',
    icon: Award,
    color: '#94a3b8', // silver
    glowClass: 'shadow-[0_0_20px_rgba(148,163,184,0.35)] border-slate-500/40',
    top: '50%',
    left: '92%'
  }
];

const TechProgressionMap = () => {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24 overflow-hidden relative">
      {/* Self-contained CSS styles for animations and isometric shapes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes circuit-flow {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        .circuit-active-path {
          stroke-dasharray: 8 12;
          animation: circuit-flow 1.3s linear infinite;
        }
        @keyframes equalizer-pulse {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1.3); }
        }
        .audio-eq-bar {
          transform-origin: bottom;
          animation: equalizer-pulse 1.2s ease-in-out infinite;
        }
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.2; }
        }
        .pulse-globe-ring {
          animation: pulse-ring 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* 3D Isometric Platform Transforms */
        .iso-platform {
          transform: rotateX(60deg) rotateZ(-45deg);
          transform-style: preserve-3d;
        }
        
        /* Soft Floating Keyframes for Spheres */
        @keyframes float-badge-icon {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.03); }
        }
        .animate-float-badge-icon {
          animation: float-badge-icon 3s ease-in-out infinite;
        }
      `}} />

      {/* Header */}
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Level Up As You <span className="text-gradient">Read</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          Unlock exclusive badges and platform privileges as your technical knowledge expands.
        </p>
      </div>

      {/* DESKTOP VIEWPORT: INTERACTIVE PROGRESSION NETWORK MAP */}
      <div className="hidden lg:block relative w-full max-w-5xl mx-auto aspect-[2.5/1]">
        
        {/* Background Network Circuit Lines SVG Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 400" fill="none">
          <defs>
            <filter id="neon-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Soft Purple/Magenta gradient matching the glowing circuit traces in the screenshot */}
            <linearGradient id="purple-trace-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#db2777" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Underlay Dark Base Paths */}
          <path d="M 500 200 L 350 200 L 260 100 L 220 100" stroke="#121326" strokeWidth="2.5" />
          <path d="M 500 200 L 390 200 L 330 300 L 280 300" stroke="#121326" strokeWidth="2.5" />
          <path d="M 500 200 L 650 200 L 690 100 L 720 100" stroke="#121326" strokeWidth="2.5" />
          <path d="M 500 200 L 610 200 L 670 300 L 780 300" stroke="#121326" strokeWidth="2.5" />
          <path d="M 720 100 L 830 100 L 880 200 L 920 200" stroke="#121326" strokeWidth="1.5" />
          <path d="M 780 300 L 850 300 L 890 200 L 920 200" stroke="#121326" strokeWidth="1.5" />

          {/* Active branch lines with purple neon glow */}
          <path 
            d="M 500 200 L 350 200 L 260 100 L 220 100" 
            stroke="url(#purple-trace-grad)" 
            strokeWidth={hoveredNode === 'seedling' ? "3" : "2"} 
            className="circuit-active-path"
            style={{ 
              filter: hoveredNode === 'seedling' ? 'url(#neon-glow-filter)' : 'none',
              animationDuration: hoveredNode === 'seedling' ? '0.6s' : '1.5s'
            }}
          />
          <path 
            d="M 500 200 L 390 200 L 330 300 L 280 300" 
            stroke="url(#purple-trace-grad)" 
            strokeWidth={hoveredNode === 'influencer' ? "3" : "2"} 
            className="circuit-active-path"
            style={{ 
              filter: hoveredNode === 'influencer' ? 'url(#neon-glow-filter)' : 'none',
              animationDuration: hoveredNode === 'influencer' ? '0.6s' : '1.5s'
            }}
          />
          <path 
            d="M 500 200 L 650 200 L 690 100 L 720 100" 
            stroke="url(#purple-trace-grad)" 
            strokeWidth={hoveredNode === 'contributor' ? "3" : "2"} 
            className="circuit-active-path"
            style={{ 
              filter: hoveredNode === 'contributor' ? 'url(#neon-glow-filter)' : 'none',
              animationDuration: hoveredNode === 'contributor' ? '0.6s' : '1.5s'
            }}
          />
          <path 
            d="M 500 200 L 610 200 L 670 300 L 780 300" 
            stroke="url(#purple-trace-grad)" 
            strokeWidth={hoveredNode === 'legend' ? "3" : "2"} 
            className="circuit-active-path"
            style={{ 
              filter: hoveredNode === 'legend' ? 'url(#neon-glow-filter)' : 'none',
              animationDuration: hoveredNode === 'legend' ? '0.6s' : '1.5s'
            }}
          />
          <path 
            d="M 720 100 L 830 100 L 880 200 L 920 200" 
            stroke="#a855f7" 
            strokeOpacity="0.4"
            strokeWidth="1.5" 
            className="circuit-active-path"
            style={{ animationDuration: '2.5s' }}
          />
          <path 
            d="M 780 300 L 850 300 L 890 200 L 920 200" 
            stroke="#a855f7" 
            strokeOpacity="0.4"
            strokeWidth="1.5" 
            className="circuit-active-path"
            style={{ animationDuration: '2.5s' }}
          />
        </svg>

        {/* CENTER NODE: RISING WRITER (Equalizer Dome) */}
        <div 
          className="absolute z-10" 
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => setHoveredNode('rising_writer')}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {hoveredNode === 'rising_writer' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-10 w-72 p-4 rounded-2xl bg-gradient-to-br from-bg-card/98 via-bg-base/98 to-bg-card/98 border border-brand-cyan/45 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-xl pointer-events-none z-50 text-left font-sans"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <Pencil className="w-4 h-4 text-brand-cyan" />
                    <h5 className="text-[11px] font-extrabold text-white tracking-widest">RISING WRITER</h5>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-widest block">How to Achieve</span>
                    <ul className="space-y-1 text-[10px] text-gray-300">
                      {TIER_DETAILS.rising_writer.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-brand-cyan mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] font-semibold text-brand-cyan uppercase tracking-widest block">Unlocked Privileges</span>
                    <ul className="space-y-1 text-[10px] text-gray-300">
                      {TIER_DETAILS.rising_writer.privileges.map((priv, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-brand-purple mt-0.5">✓</span>
                          <span>{priv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-bg-card/98 pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Glowing Equalizer Glass Dome */}
          <div className="relative w-44 h-44 rounded-full flex flex-col items-center justify-center bg-gradient-to-b from-[#06b6d4]/12 to-[#8b5cf6]/5 border border-[#06b6d4]/40 backdrop-blur-xl animate-pulse-glow shadow-[0_0_30px_rgba(6,182,212,0.25)] select-none">
            
            {/* Ambient inner sheen reflection */}
            <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

            {/* Pulsing Outer Rings */}
            <div className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full border border-[#06b6d4]/15 pulse-globe-ring -z-10" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full border border-[#8b5cf6]/10 pulse-globe-ring -z-10" style={{ animationDelay: '1.5s' }} />

            {/* Glowing Icon Card (matches screenshot rounded square pencil layout) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-[#06b6d4]/20 to-[#8b5cf6]/20 border border-[#06b6d4]/40 flex items-center justify-center text-brand-cyan mb-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-float-badge-icon">
              <Pencil className="w-5.5 h-5.5" />
            </div>

            <h3 className="text-[10px] font-extrabold text-white tracking-widest uppercase">Rising Writer</h3>
            <span className="text-[8px] font-mono font-bold text-[#06b6d4]/85 mt-0.5 tracking-wider">100-500 Reads</span>

            {/* Audio Equalizer Graphics at bottom */}
            <div className="flex gap-0.5 items-end h-3.5 mt-2.5">
              {[5, 11, 16, 9, 14, 7, 12, 5].map((height, i) => (
                <span 
                  key={i} 
                  className="w-[1.5px] rounded-full bg-[#06b6d4]/65 audio-eq-bar" 
                  style={{ 
                    height: `${height}px`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: `${0.8 + (i % 3) * 0.2}s`
                  }} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* PROGRESS MAP TIER NODES: ISOMETRIC PLATFORMS */}
        {NODES.map((node) => {
          const IconComponent = node.icon;
          const isHovered = hoveredNode === node.id;
          const details = TIER_DETAILS[node.id];
          return (
            <div
              key={node.id}
              className="absolute z-20 group flex flex-col items-center justify-center w-40 h-40"
              style={{ top: node.top, left: node.left, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && details && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute ${details.placement} w-72 p-4 rounded-2xl bg-gradient-to-br from-bg-card/98 via-bg-base/98 to-bg-card/98 border shadow-2xl backdrop-blur-xl pointer-events-none z-50 text-left font-sans`}
                    style={{ 
                      borderColor: `${node.color}50`, 
                      boxShadow: `0 0 25px ${node.color}15, 0 10px 30px rgba(0,0,0,0.5)`
                    }}
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <IconComponent className="w-4 h-4" style={{ color: node.color }} />
                        <h5 className="text-[11px] font-extrabold text-white tracking-widest">{details.title}</h5>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-widest block">How to Achieve</span>
                        <ul className="space-y-1 text-[10px] text-gray-300">
                          {details.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 leading-snug">
                              <span style={{ color: node.color }} className="mt-0.5">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[8px] font-semibold uppercase tracking-widest block" style={{ color: node.color }}>Unlocked Privileges</span>
                        <ul className="space-y-1 text-[10px] text-gray-300">
                          {details.privileges.map((priv, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 leading-snug">
                              <span className="text-brand-purple mt-0.5">✓</span>
                              <span>{priv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {/* Tooltip pointer */}
                    <div 
                      className={`absolute top-full border-8 border-transparent border-t-bg-card/98 pointer-events-none ${
                        node.id === 'established' ? 'right-12 translate-x-1/2' : 'left-1/2 -translate-x-1/2'
                      }`} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3D Isometric Platform Group */}
              <div className="relative w-28 h-28 flex flex-col items-center justify-center">
                
                {/* 3D Platform Base */}
                <div 
                  className={`absolute w-20 h-20 bg-gradient-to-br from-[#101124] to-[#080812] border rounded-2xl transition-all duration-300 group-hover:scale-105 iso-platform shadow-[0_15px_30px_rgba(0,0,0,0.65)] ${node.glowClass}`}
                  style={{
                    borderColor: isHovered ? node.color : 'rgba(255,255,255,0.06)'
                  }}
                />

                {/* Vertical neon projector beam connecting platform and floating sphere */}
                <div 
                  className="absolute w-[1.5px] h-12 bg-gradient-to-b from-transparent via-[#ffffff] to-transparent opacity-20 transition-all duration-300 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, transparent, ${node.color}, transparent)`,
                    opacity: isHovered ? 0.7 : 0.2,
                    transform: 'translateY(-6px)'
                  }}
                />

                {/* Floating Badge Sphere (Matches bubble layout in screenshot) */}
                <div 
                  className="absolute z-10 w-11 h-11 rounded-full border flex items-center justify-center animate-float-badge-icon shadow-lg bg-gradient-to-t from-transparent transition-all duration-300"
                  style={{ 
                    top: '-6px',
                    borderColor: `${node.color}50`,
                    boxShadow: isHovered 
                      ? `0 0 25px ${node.color}80, inset 0 0 10px ${node.color}40` 
                      : `0 0 15px ${node.color}35, inset 0 0 8px ${node.color}20`,
                    backgroundImage: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.1), ${node.color}15)`,
                    color: node.color
                  }}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Label inside standard text layout below platform */}
              <div className="text-center mt-3 z-10 select-none pointer-events-none">
                <h4 className="text-[10px] font-extrabold text-white tracking-widest uppercase">{node.title}</h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE / TABLET TIMELINE VERSION */}
      <div className="lg:hidden space-y-6 max-w-md mx-auto text-left">
        {/* Rising Writer Dome shown at the top */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-sm rounded-2xl flex flex-col p-5 bg-bg-card border border-[#06b6d4]/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <div className="flex items-center gap-3.5 mb-3.5">
              <div className="p-3.5 rounded-2xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-brand-cyan">
                <Pencil className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-widest uppercase">Rising Writer</h3>
                <span className="text-[10px] font-mono font-bold text-[#06b6d4] tracking-wider block mt-0.5">100-500 Reads</span>
              </div>
            </div>

            <div className="pt-3.5 border-t border-white/5 space-y-2.5">
              <div className="space-y-1">
                <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-widest block">How to Achieve:</span>
                <ul className="list-disc pl-3.5 text-[10px] text-gray-300 space-y-1">
                  {TIER_DETAILS.rising_writer.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-semibold text-brand-cyan uppercase tracking-widest block">Unlocked Privileges:</span>
                <ul className="list-disc pl-3.5 text-[10px] text-gray-300 space-y-1">
                  {TIER_DETAILS.rising_writer.privileges.map((priv, idx) => (
                    <li key={idx}>{priv}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stacked progression list */}
        <div className="space-y-4">
          {NODES.map((node) => {
            const IconComponent = node.icon;
            const details = TIER_DETAILS[node.id];
            return (
              <GlassCard 
                key={node.id} 
                className={`p-4 border bg-bg-card flex flex-col gap-4 ${node.glowClass}`}
              >
                <div className="flex items-center gap-4 w-full text-left">
                  <div 
                    className="p-2.5 rounded-xl text-white shrink-0"
                    style={{ 
                      backgroundColor: `${node.color}15`,
                      border: `1px solid ${node.color}30`,
                      color: node.color
                    }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-baseline justify-between">
                      <h4 className="text-xs font-extrabold text-white tracking-widest">{node.title}</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{details.requirements[0]}</p>
                  </div>
                </div>

                {details && (
                  <div className="pt-4 border-t border-white/5 space-y-3 w-full text-left">
                    <div className="space-y-1">
                      <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-widest block">How to Achieve:</span>
                      <ul className="list-disc pl-3.5 text-[10px] text-gray-300 space-y-1">
                        {details.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] font-semibold uppercase tracking-widest block" style={{ color: node.color }}>Unlocked Privileges:</span>
                      <ul className="list-disc pl-3.5 text-[10px] text-gray-300 space-y-1">
                        {details.privileges.map((priv, idx) => (
                          <li key={idx}>{priv}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Footer Text */}
      <div className="text-center mt-12">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 py-1.5 px-4 bg-border-subtle/20 border border-border-subtle rounded-full inline-block">
          Tech Progression Map
        </span>
      </div>
    </section>
  );
};

export default TechProgressionMap;
