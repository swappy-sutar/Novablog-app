import React, { useState } from 'react';
import { Sprout, Flame, FileText, Crown, Award, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const TIER_DETAILS = {
  seedling: {
    title: 'SEEDLING',
    color: '#06b6d4',
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
    color: '#10b981',
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
    color: '#f97316',
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
    color: '#a855f7',
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
    color: '#eab308',
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
    color: '#94a3b8',
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
    color: '#06b6d4',
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
    subtitle: 'LVL 1 - READS',
    icon: Sprout,
    color: '#06b6d4', // cyan
    wingStyle: 'silver',
    top: '25%',
    left: '22%'
  },
  {
    id: 'rising_writer',
    title: 'RISING WRITER',
    subtitle: 'LVL 10 - WRITER',
    icon: Pencil,
    color: '#a855f7', // purple
    wingStyle: 'cyan',
    top: '50%',
    left: '36%'
  },
  {
    id: 'contributor',
    title: 'CONTRIBUTOR',
    subtitle: 'LVL 20 - DISCUSS',
    icon: FileText,
    color: '#10b981', // green
    wingStyle: 'cyan',
    top: '25%',
    left: '50%'
  },
  {
    id: 'influencer',
    title: 'INFLUENCER',
    subtitle: 'LVL 50 - CURATE',
    icon: Flame,
    color: '#f97316', // orange
    wingStyle: 'pink',
    top: '75%',
    left: '50%'
  },
  {
    id: 'established',
    title: 'ESTABLISHED',
    subtitle: 'LVL 80 - CREATOR',
    icon: Award,
    color: '#94a3b8', // slate
    wingStyle: 'pink',
    top: '50%',
    left: '64%'
  },
  {
    id: 'legend',
    title: 'LEGEND',
    subtitle: 'LVL 100 - ELITE',
    icon: Crown,
    color: '#eab308', // gold
    wingStyle: 'gold',
    top: '25%',
    left: '78%'
  }
];

// Helper Component to Draw Hexagonal Badges with Wings based on Level/Color
const ProgressionHexBadge = ({ color, wingStyle, isHovered, IconComponent }) => {
  return (
    <div className="relative w-20 h-[74px] flex items-center justify-center">
      <svg className="absolute w-full h-full overflow-visible" viewBox="0 0 80 70" fill="none">
        <defs>
          <filter id="badge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients for wings */}
          <linearGradient id="silver-wing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="cyan-wing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="pink-wing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
          <linearGradient id="gold-wing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* WING STRUCTURES */}
        {wingStyle === 'silver' && (
          <g>
            <path d="M 20 22 L 4 18 L 4 48 L 20 44 Z" fill="url(#silver-wing)" opacity="0.85" />
            <path d="M 60 22 L 76 18 L 76 48 L 60 44 Z" fill="url(#silver-wing)" opacity="0.85" />
          </g>
        )}

        {wingStyle === 'cyan' && (
          <g>
            <path d="M 20 20 L 2 14 L 2 48 L 20 42 Z" fill="url(#cyan-wing)" opacity="0.9" />
            <path d="M 60 20 L 78 14 L 78 48 L 60 42 Z" fill="url(#cyan-wing)" opacity="0.9" />
            <path d="M 20 28 L -4 24 L -4 42 L 20 36 Z" fill="url(#cyan-wing)" opacity="0.6" />
            <path d="M 60 28 L 84 24 L 84 42 L 60 36 Z" fill="url(#cyan-wing)" opacity="0.6" />
          </g>
        )}

        {wingStyle === 'pink' && (
          <g>
            <path d="M 20 18 L 0 10 L 0 50 L 20 40 Z" fill="url(#pink-wing)" />
            <path d="M 60 18 L 80 10 L 80 50 L 60 40 Z" fill="url(#pink-wing)" />
            <path d="M 20 26 L -6 20 L -6 44 L 20 36 Z" fill="url(#pink-wing)" opacity="0.75" />
            <path d="M 60 26 L 86 20 L 86 44 L 60 36 Z" fill="url(#pink-wing)" opacity="0.75" />
            <path d="M 20 34 L -10 30 L -10 38 L 20 32 Z" fill="url(#pink-wing)" opacity="0.45" />
            <path d="M 60 34 L 90 30 L 90 38 L 60 32 Z" fill="url(#pink-wing)" opacity="0.45" />
          </g>
        )}

        {wingStyle === 'gold' && (
          <g>
            <path d="M 20 14 L -4 5 L -4 52 L 20 38 Z" fill="url(#gold-wing)" />
            <path d="M 60 14 L 84 5 L 84 52 L 60 38 Z" fill="url(#gold-wing)" />
            <path d="M 20 22 L -10 16 L -10 44 L 20 34 Z" fill="url(#gold-wing)" opacity="0.8" />
            <path d="M 60 22 L 90 16 L 90 44 L 60 34 Z" fill="url(#gold-wing)" opacity="0.8" />
            <path d="M 20 30 L -14 26 L -14 38 L 20 30 Z" fill="url(#gold-wing)" opacity="0.5" />
            <path d="M 60 30 L 94 26 L 94 38 L 60 30 Z" fill="url(#gold-wing)" opacity="0.5" />
          </g>
        )}

        {/* HEXAGON DOCK BASE */}
        <polygon 
          points="40,11 62,23 62,47 40,59 18,47 18,23" 
          fill="#0c0d21" 
          stroke={color} 
          strokeWidth="3.5"
          style={{ filter: isHovered ? 'url(#badge-glow)' : 'none' }}
        />

        {/* INNER SOLID HIGHLIGHT */}
        <polygon 
          points="40,16 57,26 57,44 40,54 23,44 23,26" 
          fill={`${color}12`} 
          stroke={`${color}40`}
          strokeWidth="1.5"
        />

        {/* INNER CENTER MICRO GEM */}
        <polygon 
          points="40,28 47,32 47,38 40,42 33,38 33,32" 
          fill={color} 
          opacity="0.85"
        />
      </svg>

      {/* Floating Center Icon */}
      <div 
        className="absolute z-10 w-8 h-8 rounded-full flex items-center justify-center text-white"
        style={{ textShadow: `0 0 10px ${color}` }}
      >
        <IconComponent className="w-4 h-4 text-white" />
      </div>
    </div>
  );
};

const TechProgressionMap = () => {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24 overflow-hidden relative">
      {/* Self-contained CSS styles for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flow-active {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        .circuit-branch-path {
          stroke-dasharray: 6 10;
          animation: flow-active 2s linear infinite;
        }
        @keyframes commit-path-glide {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        .gliding-dot-top {
          offset-path: path("M 80 200 C 140 200, 160 100, 220 100 L 780 100 C 840 100, 860 200, 920 200");
          animation: commit-path-glide 10s linear infinite;
        }
        .gliding-dot-mid {
          offset-path: path("M 80 200 L 920 200");
          animation: commit-path-glide 8s linear infinite;
        }
        .gliding-dot-bot {
          offset-path: path("M 80 200 C 140 200, 160 300, 220 300 L 640 300 C 740 300, 840 200, 920 200");
          animation: commit-path-glide 12s linear infinite;
        }
        @keyframes target-pulse {
          0%, 100% { transform: scale(0.9); opacity: 0.35; }
          50% { transform: scale(1.15); opacity: 0.85; }
        }
        .animate-target-pulse {
          animation: target-pulse 2.5s ease-in-out infinite;
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

      {/* DESKTOP VIEWPORT: GIT COMMIT GRAPH LAYOUT */}
      <div className="hidden lg:block relative w-full max-w-5xl mx-auto aspect-[2.4/1] select-none">
        
        {/* Background Network Circuit Lines SVG Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 400" fill="none">
          <defs>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Cyber Git Commit Branch Gradients */}
            <linearGradient id="cyan-blue-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="30%" stopColor="#06b6d4" />
              <stop offset="70%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="purple-pink-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="orange-amber-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>

          {/* Underlay Dark Base Tracks */}
          <path d="M 80 200 C 140 200, 160 100, 220 100 L 780 100 C 840 100, 860 200, 920 200" stroke="#121324" strokeWidth="3" />
          <path d="M 80 200 L 920 200" stroke="#121324" strokeWidth="3" />
          <path d="M 80 200 C 140 200, 160 300, 220 300 L 640 300 C 740 300, 840 200, 920 200" stroke="#121324" strokeWidth="3" />

          {/* Animated Glowing Traces */}
          <path 
            d="M 80 200 C 140 200, 160 100, 220 100 L 780 100 C 840 100, 860 200, 920 200" 
            stroke="url(#cyan-blue-grad)" 
            strokeWidth="3.5" 
            className="circuit-branch-path"
            style={{ filter: 'url(#neon-glow)', animationDuration: '2.5s' }}
          />
          <path 
            d="M 80 200 L 920 200" 
            stroke="url(#purple-pink-grad)" 
            strokeWidth="3.5" 
            className="circuit-branch-path"
            style={{ filter: 'url(#neon-glow)', animationDuration: '2s' }}
          />
          <path 
            d="M 80 200 C 140 200, 160 300, 220 300 L 640 300 C 740 300, 840 200, 920 200" 
            stroke="url(#orange-amber-grad)" 
            strokeWidth="3.5" 
            className="circuit-branch-path"
            style={{ filter: 'url(#neon-glow)', animationDuration: '3s' }}
          />

          {/* Core Root Station Dot */}
          <circle cx="80" cy="200" r="7" fill="#8b5cf6" stroke="#fff" strokeWidth="2" style={{ filter: 'url(#neon-glow)' }} />
          <circle cx="80" cy="200" r="3" fill="#fff" />
        </svg>

        {/* Gliding Glowing Orbs representing packet transfers */}
        <div className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#06b6d4,0_0_30px_#8b5cf6] pointer-events-none z-10 gliding-dot-top" />
        <div className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#d946ef,0_0_30px_#a855f7] pointer-events-none z-10 gliding-dot-mid" />
        <div className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#f97316,0_0_30px_#eab308] pointer-events-none z-10 gliding-dot-bot" />

        {/* GIT COMMIT BRANCH BADGE NODES */}
        {NODES.map((node) => {
          const IconComponent = node.icon;
          const isHovered = hoveredNode === node.id;
          const details = TIER_DETAILS[node.id];
          return (
            <div
              key={node.id}
              className="absolute z-20 group flex flex-col items-center w-36 cursor-pointer"
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
                    <div className="space-y-3.5 text-left">
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

              {/* Dynamic Hexagon Badge component */}
              <div className="transition-transform duration-300 group-hover:scale-108 group-hover:-translate-y-1">
                <ProgressionHexBadge 
                  color={node.color} 
                  wingStyle={node.wingStyle} 
                  isHovered={isHovered} 
                  IconComponent={IconComponent} 
                />
              </div>

              {/* Pill Label */}
              <div className="mt-3 px-3 py-1 rounded-full border border-white/10 bg-[#0d0f1e]/80 backdrop-blur-md flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.color }} />
                <span className="text-[9px] font-extrabold text-white tracking-wider uppercase">{node.title}</span>
              </div>
            </div>
          );
        })}

        {/* TERMINAL END STATION NODE: ULTIMATE SYSTEM MASTER BADGE */}
        <div 
          className="absolute z-20 group flex flex-col items-center w-36 cursor-pointer"
          style={{ top: '50%', left: '92%', transform: 'translate(-50%, -50%)' }}
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
                <div className="space-y-3.5 text-left">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <Award className="w-4 h-4 text-brand-cyan" />
                    <h5 className="text-[11px] font-extrabold text-white tracking-widest">ULTIMATE SYSTEM MASTER</h5>
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
                    <span className="text-[8px] font-semibold text-brand-cyan uppercase tracking-widest block">Unlocked Privileges</span>
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

          {/* Central Target Pulsing Core Node */}
          <div className="relative w-14 h-14 rounded-full border border-brand-cyan/60 bg-[#0d0f1e] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
            {/* Concentric targets */}
            <div className="absolute inset-1.5 rounded-full border border-brand-cyan/30 animate-target-pulse" />
            <div className="w-5 h-5 rounded-full bg-brand-cyan/20 border border-brand-cyan flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
            </div>
          </div>

          {/* Pill Label */}
          <div className="mt-3 px-3 py-1 rounded-full border border-brand-cyan/30 bg-[#06b6d4]/5 backdrop-blur-md flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
            <span className="text-[9px] font-extrabold text-brand-cyan tracking-wider uppercase">ULTIMATE MASTER</span>
          </div>
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
                className={`p-4 border bg-bg-card flex flex-col gap-4 ${node.glowClass || ''}`}
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
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 py-1.5 px-4 bg-border-subtle/20 border border-border-subtle rounded-full inline-block">
          Git Commit Progression Map
        </span>
      </div>
    </section>
  );
};

export default TechProgressionMap;
