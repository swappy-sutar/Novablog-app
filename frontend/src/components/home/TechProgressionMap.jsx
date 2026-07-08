import React, { useState } from 'react';
import { Sprout, Flame, FileText, Crown, Award, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const TIER_DETAILS = {
  seedling: {
    title: 'SEEDLING BADGE',
    color: '#06b6d4',
    requirements: [
      "Read 1-10 technical articles across any category",
      "Follow at least 1 author profile on the platform"
    ],
    badgeShowcase: "Unlocks the Seedling profile badge, displaying a cyan sprout icon on your public profile to showcase early platform exploration.",
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-5"
  },
  contributor: {
    title: 'CONTRIBUTOR BADGE',
    color: '#10b981',
    requirements: [
      "Read 10-50 technical articles",
      "Initiate 1 discussion comment thread"
    ],
    badgeShowcase: "Unlocks the Contributor profile badge, featuring a green clipboard icon on comments and discussions to identify active tech contributors.",
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-5"
  },
  influencer: {
    title: 'INFLUENCER BADGE',
    color: '#f97316',
    requirements: [
      "Read 50-100 technical articles",
      "Share at least 3 custom blog reference links"
    ],
    badgeShowcase: "Unlocks the Influencer profile badge, showing an orange flame icon on your profile marking you as a prominent technical content curator.",
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-5"
  },
  rising_writer: {
    title: 'RISING WRITER BADGE',
    color: '#a855f7',
    requirements: [
      "Publish 3+ technical drafts or articles",
      "Earn 100-500 total views from readers"
    ],
    badgeShowcase: "Unlocks the Rising Writer badge, adding a purple pencil icon next to your name to recognize your technical writing and initial reader reach.",
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-5"
  },
  legend: {
    title: 'LEGEND BADGE',
    color: '#eab308',
    requirements: [
      "Read 500+ technical articles",
      "Keep a 90% weekly reading goal streak"
    ],
    badgeShowcase: "Unlocks the golden Legend badge, displaying an amber crown icon on your user card, reserved exclusively for the top technical reading elite.",
    placement: "bottom-full left-1/2 -translate-x-1/2 mb-5"
  },
  established: {
    title: 'ESTABLISHED VOICE BADGE',
    color: '#94a3b8',
    requirements: [
      "Accumulate 10+ published articles on Nova",
      "Secure peer editorial board recommendation check"
    ],
    badgeShowcase: "Unlocks the Verified Blue Checkmark and silver established seal, highlighting your high-quality writing and verified platform authority.",
    placement: "bottom-full right-0 mb-5 translate-x-[15%]"
  }
};

const NODES = [
  {
    id: 'seedling',
    title: 'SEEDLING',
    subtitle: '1-10 READS',
    desc: 'Begin your technical exploration.',
    icon: Sprout,
    color: '#06b6d4', // cyan
    glowClass: 'shadow-[0_0_20px_rgba(6,182,212,0.35)] border-brand-cyan/40',
    top: '75%',
    left: '10%',
    x: 100,
    y: 300
  },
  {
    id: 'contributor',
    title: 'CONTRIBUTOR',
    subtitle: '10-50 READS',
    desc: 'Share verified insights.',
    icon: FileText,
    color: '#10b981', // green
    glowClass: 'shadow-[0_0_20px_rgba(16,185,129,0.35)] border-emerald-500/40',
    top: '25%',
    left: '26%',
    x: 260,
    y: 100
  },
  {
    id: 'influencer',
    title: 'INFLUENCER',
    subtitle: '50-100 READS',
    desc: 'Command attention with your views.',
    icon: Flame,
    color: '#f97316', // orange
    glowClass: 'shadow-[0_0_20px_rgba(249,115,22,0.35)] border-orange-500/40',
    top: '75%',
    left: '42%',
    x: 420,
    y: 300
  },
  {
    id: 'rising_writer',
    title: 'RISING WRITER',
    subtitle: '100-500 READS',
    desc: 'Grow technical creative reach.',
    icon: Pencil,
    color: '#a855f7', // purple
    glowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.35)] border-purple-500/40',
    top: '25%',
    left: '58%',
    x: 580,
    y: 100
  },
  {
    id: 'legend',
    title: 'LEGEND',
    subtitle: '500+ READS',
    desc: 'Master the developer narrative.',
    icon: Crown,
    color: '#eab308', // gold
    glowClass: 'shadow-[0_0_20px_rgba(234,179,8,0.35)] border-yellow-500/40',
    top: '75%',
    left: '74%',
    x: 740,
    y: 300
  },
  {
    id: 'established',
    title: 'ESTABLISHED VOICE',
    subtitle: 'VERIFIED SYSTEM BADGE',
    desc: 'Ultimate platform authority badge.',
    icon: Award,
    color: '#94a3b8', // slate/silver
    glowClass: 'shadow-[0_0_20px_rgba(148,163,184,0.35)] border-slate-500/40',
    top: '25%',
    left: '90%',
    x: 900,
    y: 100
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
        .circuit-active-path {
          stroke-dasharray: 8 12;
          animation: path-dash-flow 1.5s linear infinite;
        }
        @keyframes path-glide {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        .gliding-dot {
          offset-path: path("M 100 300 L 260 100 L 420 300 L 580 100 L 740 300 L 900 100");
          animation: path-glide 10s linear infinite;
        }
        
        /* 3D Isometric Platform Transforms */
        .iso-platform {
          transform: rotateX(60deg) rotateZ(-45deg);
          transform-style: preserve-3d;
        }
        
        /* Soft Floating Keyframes for Spheres */
        @keyframes float-badge {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-7px) scale(1.03); }
        }
        .animate-float-badge {
          animation: float-badge 3s ease-in-out infinite;
        }
      `}} />

      {/* Header */}
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Level Up As You <span className="text-gradient">Read</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          Unlock exclusive badges as your technical knowledge expands.
        </p>
      </div>

      {/* DESKTOP VIEWPORT: ZIGZAG GAME PATH MAP WITH 3D PLATFORMS */}
      <div className="hidden lg:block relative w-full max-w-5xl mx-auto aspect-[2.3/1] select-none">
        
        {/* Background Network Circuit Lines SVG Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 400" fill="none">
          <defs>
            <filter id="neon-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Rainbow-like cyber gradient for the zigzag trace */}
            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="20%" stopColor="#10b981" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="60%" stopColor="#a855f7" />
              <stop offset="80%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {/* Underlay dark dashed track */}
          <path 
            d="M 100 300 L 260 100 L 420 300 L 580 100 L 740 300 L 900 100" 
            stroke="#1b1c30" 
            strokeWidth="3.5" 
            strokeDasharray="6 8"
          />

          {/* Glowing active animated path */}
          <path 
            d="M 100 300 L 260 100 L 420 300 L 580 100 L 740 300 L 900 100" 
            stroke="url(#path-gradient)" 
            strokeWidth="3.5" 
            className="circuit-active-path"
            style={{ 
              filter: 'url(#neon-glow-filter)',
              animationPlayState: hoveredNode ? 'paused' : 'running'
            }}
          />
        </svg>

        {/* Gliding Glowing Orb along the path */}
        <div 
          className="absolute w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_15px_#06b6d4,0_0_30px_#a855f7] pointer-events-none z-10 gliding-dot"
          style={{ animationPlayState: hoveredNode ? 'paused' : 'running' }}
        />

        {/* ZIGZAG PATH NODES WITH 3D PLATFORMS AND BEACON BEAMS */}
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
                    className="absolute z-50 w-72 p-4 rounded-2xl bg-gradient-to-br from-[#0b0c16]/98 via-[#131526]/98 to-[#0b0c16]/98 border shadow-2xl backdrop-blur-xl pointer-events-none"
                    style={{ 
                      borderColor: `${node.color}50`, 
                      boxShadow: `0 0 25px ${node.color}15, 0 10px 30px rgba(0,0,0,0.5)`,
                      bottom: '100%',
                      left: details.placement.includes('right-0') ? 'auto' : '50%',
                      right: details.placement.includes('right-0') ? '0px' : 'auto',
                      transform: details.placement.includes('right-0') ? 'translate(20%, -15px)' : 'translate(-50%, -15px)'
                    }}
                  >
                    <div className="space-y-3.5 text-left">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <IconComponent className="w-4 h-4" style={{ color: node.color }} />
                        <h5 className="text-[11px] font-extrabold text-white tracking-widest">{details.title}</h5>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-widest block">How to Unlock</span>
                        <ul className="space-y-1 text-[10px] text-gray-300">
                          {details.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 leading-snug">
                              <span style={{ color: node.color }} className="mt-0.5">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[8px] font-semibold uppercase tracking-widest block" style={{ color: node.color }}>Badge Showcase</span>
                        <p className="text-[10px] text-gray-300 leading-snug">
                          {details.badgeShowcase}
                        </p>
                      </div>
                    </div>
                    {/* Tooltip pointer */}
                    <div 
                      className={`absolute top-full border-8 border-transparent border-t-[#0b0c16]/98 pointer-events-none ${
                        node.id === 'established' ? 'right-12 translate-x-1/2' : 'left-1/2 -translate-x-1/2'
                      }`} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3D Isometric Platform Group */}
              <div className="relative w-28 h-28 flex flex-col items-center justify-center">
                
                {/* 3D Platform Plane */}
                <div 
                  className={`absolute w-20 h-20 bg-gradient-to-br from-[#101124] to-[#080812] border rounded-2xl transition-all duration-300 group-hover:scale-105 iso-platform shadow-[0_15px_30px_rgba(0,0,0,0.65)] ${node.glowClass}`}
                  style={{
                    borderColor: isHovered ? node.color : 'rgba(255,255,255,0.06)'
                  }}
                />

                {/* Cyber Vertical Beacon Light Beam */}
                <div 
                  className="absolute w-[2px] h-12 bg-gradient-to-b from-transparent via-[#ffffff] to-transparent opacity-30 transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, transparent, ${node.color}, transparent)`,
                    opacity: isHovered ? 0.75 : 0.25,
                    transform: 'translateY(-6px)'
                  }}
                />

                {/* Floating Glowing Badge Sphere */}
                <div 
                  className="absolute z-10 w-12 h-12 rounded-full border flex items-center justify-center animate-float-badge shadow-lg bg-gradient-to-t from-transparent transition-all duration-300"
                  style={{ 
                    top: '-6px',
                    borderColor: `${node.color}50`,
                    boxShadow: isHovered 
                      ? `0 0 25px ${node.color}80, inset 0 0 10px ${node.color}40` 
                      : `0 0 15px ${node.color}35, inset 0 0 8px ${node.color}20`,
                    backgroundImage: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.1), ${node.color}15)`,
                    color: node.color,
                    animationDelay: `${NODES.indexOf(node) * 0.25}s`
                  }}
                >
                  <IconComponent className="w-5.5 h-5.5" />
                </div>
              </div>

              {/* Monospace Centered Label */}
              <div className="text-center mt-3 select-none">
                <h4 className="text-[10px] font-extrabold text-white tracking-widest uppercase">{node.title}</h4>
                <span className="text-[8px] font-mono font-bold tracking-widest block mt-0.5" style={{ color: node.color }}>
                  {node.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE / TABLET TIMELINE VERSION */}
      <div className="lg:hidden space-y-6 max-w-md mx-auto">
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
                      <span className="text-[9px] font-mono font-bold" style={{ color: node.color }}>{node.subtitle}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{node.desc}</p>
                  </div>
                </div>

                {details && (
                  <div className="pt-4 border-t border-white/5 space-y-3 w-full text-left">
                    <div className="space-y-1">
                      <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-widest block">How to Unlock:</span>
                      <ul className="list-disc pl-3.5 text-[10px] text-gray-300 space-y-1">
                        {details.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] font-semibold uppercase tracking-widest block" style={{ color: node.color }}>Badge Showcase:</span>
                      <p className="text-[10px] text-gray-300 leading-snug">{details.badgeShowcase}</p>
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
