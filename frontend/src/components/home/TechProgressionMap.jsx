import React, { useState } from 'react';
import { Sprout, Flame, FileText, Crown, Award, Pencil, Globe, GitBranch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const TIER_DETAILS = {
  seedling: {
    title: 'SEEDLING',
    color: '#3b82f6', // blue
    requirements: [
      "Read 1-10 technical articles across any category",
      "Follow at least 1 author profile on the platform"
    ],
    privileges: [
      "Post comments on active publications",
      "Bookmark articles to your reading dashboard",
      "Basic Seedling platform profile badge"
    ],
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-5"
  },
  contributor: {
    title: 'CONTRIBUTOR',
    color: '#a855f7', // purple
    requirements: [
      "Read 10-50 technical articles",
      "Initiate 1 discussion comment thread"
    ],
    privileges: [
      "Edit comment content within 1 hour",
      "Submit article drafts for review",
      "Exclusive Contributor profile badge"
    ],
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-5"
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
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-5"
  },
  rising_writer: {
    title: 'RISING WRITER',
    color: '#eab308', // yellow
    requirements: [
      "Publish 3+ technical drafts or articles",
      "Earn 100-500 total views from readers"
    ],
    privileges: [
      "Creator Hub statistics dashboard access",
      "Configure custom footer signature blocks",
      "Receive reader tips and support donations"
    ],
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-5"
  },
  legend: {
    title: 'LEGEND',
    color: '#3b82f6', // blue
    requirements: [
      "Read 500+ technical articles",
      "Keep a 90% weekly reading goal streak"
    ],
    privileges: [
      "VIP neon highlight surrounding comments",
      "Weekly direct feedback channel to editors",
      "Guaranteed landing page feed curation slots"
    ],
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-5"
  },
  established: {
    title: 'ESTABLISHED VOICE',
    color: '#10b981', // green
    requirements: [
      "Accumulate 10+ published articles on Nova",
      "Secure peer editorial board recommendation check"
    ],
    privileges: [
      "Verified blue creator mark on username",
      "Pin posts to the global platform feed",
      "Community moderation privileges in threads"
    ],
    placement: "bottom-full right-0 mb-5 translate-x-[15%]"
  },
  master: {
    title: 'ULTIMATE MASTER',
    color: '#06b6d4', // cyan
    requirements: [
      "Unlock all 6 lower path progression badges",
      "Maintain active contribution status for 6 months"
    ],
    privileges: [
      "Nova Platform Master public avatar seal",
      "Founder Direct Slack coordination channel access",
      "Host custom blog events on platform home page"
    ],
    placement: "bottom-full right-0 mb-5 translate-x-[10%]"
  }
};

const NODES = [
  {
    id: 'seedling',
    title: 'SEEDLING',
    icon: Sprout,
    color: '#3b82f6', // blue
    top: '36.1%', // y: 130
    left: '26.25%', // x: 210
    cx: 210,
    cy: 130
  },
  {
    id: 'contributor',
    title: 'CONTRIBUTOR',
    icon: FileText,
    color: '#a855f7', // purple/pink
    top: '63.9%', // y: 230
    left: '30%', // x: 240
    cx: 240,
    cy: 230
  },
  {
    id: 'influencer',
    title: 'INFLUENCER',
    icon: Flame,
    color: '#f97316', // orange
    top: '50%', // y: 180
    left: '41.25%', // x: 330
    cx: 330,
    cy: 180
  },
  {
    id: 'rising_writer',
    title: 'RISING WRITER',
    icon: Pencil,
    color: '#eab308', // yellow
    top: '63.9%', // y: 230
    left: '47.5%', // x: 380
    cx: 380,
    cy: 230
  },
  {
    id: 'legend',
    title: 'LEGEND',
    icon: Crown,
    color: '#3b82f6', // blue
    top: '36.1%', // y: 130
    left: '55%', // x: 440
    cx: 440,
    cy: 130
  },
  {
    id: 'established',
    title: 'ESTABLISHED',
    icon: Award,
    color: '#10b981', // green
    top: '50%', // y: 180
    left: '67.5%', // x: 540
    cx: 540,
    cy: 180
  }
];

const TechProgressionMap = () => {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24 overflow-hidden relative">
      {/* Self-contained CSS styles for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes path-dash-flow {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        .circuit-branch-path {
          stroke-dasharray: 6 10;
          animation: path-dash-flow 1.8s linear infinite;
        }
        @keyframes commit-path-glide {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        .gliding-dot-top {
          offset-path: path("M 120 180 C 170 180, 170 130, 220 130 L 600 130 C 620 130, 630 130, 640 130");
          animation: commit-path-glide 10s linear infinite;
        }
        .gliding-dot-mid {
          offset-path: path("M 120 180 L 540 180 C 580 180, 600 130, 640 130");
          animation: commit-path-glide 8s linear infinite;
        }
        .gliding-dot-bot {
          offset-path: path("M 120 180 C 170 180, 170 230, 220 230 L 380 230 C 440 230, 480 180, 540 180");
          animation: commit-path-glide 12s linear infinite;
        }
        @keyframes target-glow-pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.85; }
        }
        .animate-target-glow {
          animation: target-glow-pulse 2s ease-in-out infinite;
        }
      `}} />

      {/* Header */}
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Git <span className="text-gradient">Commit</span> Graph
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          Unlock exclusive badges and platform privileges as your technical knowledge expands.
        </p>
      </div>

      {/* DESKTOP VIEWPORT: EXACT GIT COMMIT GRAPH LAYOUT */}
      <div className="hidden lg:block relative w-full max-w-4xl mx-auto aspect-[2.2/1] select-none bg-[#070813]/40 border border-white/5 rounded-3xl p-6 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
        
        {/* Background Network Circuit Lines SVG Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 800 360" fill="none">
          <defs>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Git Branch Gradients */}
            <linearGradient id="cyan-blue-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="purple-pink-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="orange-amber-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>

          {/* Underlay Dark Base Tracks */}
          <path d="M 60 180 L 120 180" stroke="#14162e" strokeWidth="3" />
          <path d="M 120 180 C 170 180, 170 130, 220 130 L 600 130 C 620 130, 630 130, 640 130" stroke="#14162e" strokeWidth="3" />
          <path d="M 120 180 L 540 180 C 580 180, 600 130, 640 130" stroke="#14162e" strokeWidth="3" />
          <path d="M 120 180 C 170 180, 170 230, 220 230 L 380 230 C 440 230, 480 180, 540 180" stroke="#14162e" strokeWidth="3" />

          {/* Active Animated Paths */}
          <path d="M 60 180 L 120 180" stroke="#3b82f6" strokeWidth="3" />
          <path 
            d="M 120 180 C 170 180, 170 130, 220 130 L 600 130 C 620 130, 630 130, 640 130" 
            stroke="url(#cyan-blue-grad)" 
            strokeWidth="3.5" 
            className="circuit-branch-path"
            style={{ filter: 'url(#neon-glow)' }}
          />
          <path 
            d="M 120 180 L 540 180 C 580 180, 600 130, 640 130" 
            stroke="url(#purple-pink-grad)" 
            strokeWidth="3.5" 
            className="circuit-branch-path"
            style={{ filter: 'url(#neon-glow)' }}
          />
          <path 
            d="M 120 180 C 170 180, 170 230, 220 230 L 380 230 C 440 230, 480 180, 540 180" 
            stroke="url(#orange-amber-grad)" 
            strokeWidth="3.5" 
            className="circuit-branch-path"
            style={{ filter: 'url(#neon-glow)' }}
          />

          {/* Start Hollow Circle Node */}
          <circle cx="60" cy="180" r="6" fill="#0d0f1e" stroke="#3b82f6" strokeWidth="2.5" />

          {/* Root Globe Node */}
          <circle cx="120" cy="180" r="11" fill="#3b82f6" opacity="0.15" />
          <circle cx="120" cy="180" r="8" fill="#3b82f6" style={{ filter: 'url(#neon-glow)' }} />

          {/* Floating Cyan Accent Circle at (340, 195) */}
          <circle cx="340" cy="195" r="9" fill="#06b6d4" opacity="0.15" className="animate-target-glow" />
          <circle cx="340" cy="195" r="5" fill="#06b6d4" />

          {/* Middle Branch Junction circles (Yellow & Green hollow) */}
          <circle cx="410" cy="180" r="5.5" fill="#0d0f1e" stroke="#eab308" strokeWidth="2" />
          <circle cx="480" cy="180" r="5.5" fill="#0d0f1e" stroke="#10b981" strokeWidth="2" />
        </svg>

        {/* Dynamic Glowing Trace Packets */}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#3b82f6] pointer-events-none z-10 gliding-dot-top" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#db2777] pointer-events-none z-10 gliding-dot-mid" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#f97316] pointer-events-none z-10 gliding-dot-bot" />

        {/* Render World icon over the root node */}
        <div className="absolute z-10 pointer-events-none text-white flex items-center justify-center" style={{ top: '50%', left: '15%', transform: 'translate(-50%, -50%)' }}>
          <Globe className="w-3.5 h-3.5 text-white" />
        </div>

        {/* MAP PROGRESSION NODES */}
        {NODES.map((node) => {
          const IconComponent = node.icon;
          const isHovered = hoveredNode === node.id;
          const details = TIER_DETAILS[node.id];
          return (
            <div
              key={node.id}
              className="absolute z-20 group flex flex-col items-center justify-center cursor-pointer"
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
                    className={`absolute ${details.placement} w-72 p-4 rounded-2xl bg-gradient-to-br from-bg-card/98 via-bg-base/98 to-bg-card/98 border shadow-2xl backdrop-blur-xl pointer-events-none z-50`}
                    style={{ 
                      borderColor: `${node.color}50`, 
                      boxShadow: `0 0 25px ${node.color}15, 0 10px 30px rgba(0,0,0,0.5)`
                    }}
                  >
                    <div className="space-y-3.5 text-left font-sans">
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

              {/* Glowing Branch Junction Badge Circle */}
              <div 
                className="w-8 h-8 rounded-full border bg-[#0d0f1e] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-115"
                style={{ 
                  borderColor: isHovered ? '#fff' : node.color,
                  boxShadow: isHovered 
                    ? `0 0 18px ${node.color}cc, inset 0 0 8px ${node.color}50` 
                    : `0 0 8px ${node.color}40, inset 0 0 4px ${node.color}20`,
                  color: '#fff'
                }}
              >
                <IconComponent className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          );
        })}

        {/* TERMINAL ULTIMATE NODE: CYAN CONCENTRIC RINGS AT (640, 130) */}
        <div 
          className="absolute z-20 group flex flex-col items-center justify-center cursor-pointer"
          style={{ top: '36.1%', left: '80%', transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => setHoveredNode('master')}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {hoveredNode === 'master' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full right-0 mb-5 translate-x-[10%] w-72 p-4 rounded-2xl bg-gradient-to-br from-bg-card/98 via-bg-base/98 to-bg-card/98 border border-[#06b6d4]/50 shadow-2xl backdrop-blur-xl pointer-events-none z-50"
              >
                <div className="space-y-3.5 text-left font-sans">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <Award className="w-4 h-4 text-[#06b6d4]" />
                    <h5 className="text-[11px] font-extrabold text-white tracking-widest">ULTIMATE MASTER</h5>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-widest block">How to Achieve</span>
                    <ul className="space-y-1 text-[10px] text-gray-300">
                      {TIER_DETAILS.master.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-brand-cyan mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] font-semibold text-[#06b6d4] uppercase tracking-widest block">Unlocked Privileges</span>
                    <ul className="space-y-1 text-[10px] text-gray-300">
                      {TIER_DETAILS.master.privileges.map((priv, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-brand-purple mt-0.5">✓</span>
                          <span>{priv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="absolute top-full right-12 translate-x-1/2 border-8 border-transparent border-t-bg-card/98 pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Concentric pulsing rings */}
          <div className="relative w-9 h-9 rounded-full border-2 border-brand-cyan/60 bg-[#0d0f1e] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
            <div className="absolute inset-1 rounded-full border border-brand-cyan/40 animate-target-glow" />
            <div className="w-3.5 h-3.5 rounded-full bg-brand-cyan/30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
            </div>
          </div>
        </div>

        {/* FLOATING TEXT CALLOUTS / PILL BUBBLES */}
        {/* 1. "Contributor" pill (below Contributor node at x: 240, y: 230) */}
        <div 
          className="absolute z-10 px-3 py-1.5 rounded-2xl border border-white/5 bg-[#0b0c16]/75 backdrop-blur-md flex items-center gap-1.5 shadow-md pointer-events-none text-left"
          style={{ top: '78%', left: '30%', transform: 'translateX(-50%)' }}
        >
          <GitBranch className="w-3 h-3 text-[#a855f7]" />
          <span className="text-[10px] font-extrabold text-white tracking-wide">Contributor</span>
        </div>

        {/* 2. "Rising Writer" callout bubble (above Rising Writer node at x: 380, y: 230) */}
        <div 
          className="absolute z-10 px-3 py-1.5 rounded-2xl border border-white/5 bg-[#0b0c16]/75 backdrop-blur-md flex items-center gap-1.5 shadow-md pointer-events-none text-left"
          style={{ top: '51%', left: '47.5%', transform: 'translateX(-50%)' }}
        >
          <Pencil className="w-3 h-3 text-[#eab308]" />
          <span className="text-[10px] font-extrabold text-white tracking-wide">Rising Writer</span>
          {/* Small Speech Bubble tail */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0b0c16]/75 pointer-events-none" />
        </div>

        {/* 3. "Git Commit Graph" label bubble (above Legend node at x: 440, y: 130) */}
        <div 
          className="absolute z-10 px-3 py-1.5 rounded-2xl border border-white/5 bg-[#0b0c16]/75 backdrop-blur-md flex items-center gap-1.5 shadow-md pointer-events-none text-left"
          style={{ top: '21%', left: '55%', transform: 'translateX(-50%)' }}
        >
          <GitBranch className="w-3 h-3 text-[#3b82f6]" />
          <span className="text-[10px] font-extrabold text-white tracking-wide">Git Commit Graph</span>
          {/* Small Speech Bubble tail */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0b0c16]/75 pointer-events-none" />
        </div>

        {/* 4. "Git Commit Braph +0" (above Target node at x: 640, y: 130) */}
        <div 
          className="absolute z-10 px-3 py-1.5 rounded-2xl border border-rose-500/20 bg-rose-500/10 backdrop-blur-md flex items-center gap-1.5 shadow-md pointer-events-none text-left"
          style={{ top: '19%', left: '80%', transform: 'translateX(-50%)' }}
        >
          <Award className="w-3 h-3 text-rose-500" />
          <span className="text-[10px] font-extrabold text-rose-500 tracking-wide font-mono">Git Commit Braph +0</span>
          {/* Small Speech Bubble tail */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-rose-500/10 pointer-events-none" />
        </div>

        {/* 5. "Git Commit Map" green pill (to the right of target node) */}
        <div 
          className="absolute z-10 px-3 py-1.5 rounded-full border border-brand-cyan bg-[#06b6d4]/5 backdrop-blur-md flex items-center gap-1.5 shadow-md pointer-events-none text-left"
          style={{ top: '36.1%', left: '92.5%', transform: 'translateY(-50%)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
          <span className="text-[10px] font-extrabold text-brand-cyan tracking-wider font-mono uppercase">Git Commit Map</span>
        </div>

      </div>

      {/* MOBILE / TABLET TIMELINE VERSION */}
      <div className="lg:hidden space-y-6 max-w-md mx-auto text-left">
        {/* Stacked progression list */}
        <div className="space-y-4">
          {NODES.map((node) => {
            const IconComponent = node.icon;
            const details = TIER_DETAILS[node.id];
            return (
              <GlassCard 
                key={node.id} 
                className={`p-4 border bg-bg-card flex flex-col gap-4`}
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
                      <span className="text-[9px] font-mono font-bold" style={{ color: node.color }}>{node.subtitle}</span>
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
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 py-1.5 px-4 bg-border-subtle/20 border border-border-subtle rounded-full inline-block animate-pulse">
          Interactive Git Commit Graph
        </span>
      </div>
    </section>
  );
};

export default TechProgressionMap;
