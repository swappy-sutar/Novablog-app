import React from 'react';
import { Star } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';

const ROW1_DATA = [
  {
    name: 'Maria S',
    location: 'California, USA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    stars: 5,
    title: 'Incredible depth of technical blogs',
    text: 'The articles on NovaBlog are exceptionally well-researched. The community of technical minds helps me stay up to date with modern systems architecture and coding best practices.'
  },
  {
    name: 'David Smith',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    stars: 5,
    title: 'Perfect for technical growth',
    text: "I was looking for a platform that goes beyond basic tutorials. NovaBlog's articles provide deep architectural explanations that helped me level up my software engineering skills."
  },
  {
    name: 'Emily P',
    location: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
    stars: 5,
    title: 'Excellent community of writers',
    text: 'The technical insights and curated feeds make reading a daily habit. The badge progression system keeps me motivated to read regularly and improve my expertise.'
  }
];

const ROW2_DATA = [
  {
    name: 'David L.',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    stars: 4,
    title: 'Valuable real-world insights',
    text: 'Having access to high-quality blog posts written by real industry experts is invaluable. It is like having a mentor sharing real production experience 24/7.'
  },
  {
    name: 'Marsh',
    location: 'Berlin, Germany',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120',
    stars: 5,
    title: 'Interactive and clean blogging interface',
    text: 'The reading interface is distraction-free and beautifully designed. The technical progression roadmap is a fun addition that tracks my developer growth.'
  },
  {
    name: 'Nunnez',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120',
    stars: 5,
    title: 'Best platform for developers',
    text: 'NovaBlog has built an amazing community of authors. The quality of writing here is much higher than other platforms, and the insights are immediately actionable.'
  }
];

// Repeat data arrays 6 times to allow seamless infinite looping marquee without empty space on wide viewports
const row1Doubled = [...ROW1_DATA, ...ROW1_DATA, ...ROW1_DATA, ...ROW1_DATA, ...ROW1_DATA, ...ROW1_DATA];
const row2Doubled = [...ROW2_DATA, ...ROW2_DATA, ...ROW2_DATA, ...ROW2_DATA, ...ROW2_DATA, ...ROW2_DATA];

const Testimonials = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-24 overflow-visible relative">
      {/* Self-contained CSS styles for infinite marquee scrolling & hover-pause */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-ltr {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes marquee-rtl {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-ltr {
          animation: marquee-ltr 60s linear infinite;
        }
        .animate-marquee-rtl {
          animation: marquee-rtl 60s linear infinite;
        }
        .hover-pause:hover {
          animation-play-state: paused !important;
        }
      `}} />

      {/* Header Container */}
      <div className="text-center mb-16 space-y-3 relative flex flex-col items-center">
        <p className="text-[10px] sm:text-xs font-black tracking-widest text-brand-cyan uppercase">
          Public opinion suggests
        </p>
        
        <div className="flex items-center justify-center gap-3 sm:gap-5 w-full max-w-lg">
          {/* Left Laurel Wreath (High-Fidelity Award-Style Branch) */}
          <svg className="w-10 h-10 sm:w-16 sm:h-16 text-brand-purple/95 shrink-0 select-none fill-current overflow-visible" viewBox="0 0 100 100">
            <defs>
              <filter id="laurel-shadow-left" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="-0.8" dy="1.2" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.25" />
              </filter>
            </defs>
            {/* Stem */}
            <path d="M68,85 C52,75 44,53 50,22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" filter="url(#laurel-shadow-left)" />
            {/* Leaves Group */}
            <g filter="url(#laurel-shadow-left)">
              {/* Top central leaf */}
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(50, 18) rotate(-15) scale(1.3)" />
              
              {/* Left-side leaves pointing up-left */}
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(45, 23) rotate(-35) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(40, 31) rotate(-40) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(36, 40) rotate(-45) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(34, 50) rotate(-50) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(34, 60) rotate(-55) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(36, 70) rotate(-60) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(40, 79) rotate(-65) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(46, 87) rotate(-70) scale(1.3)" />
              
              {/* Right-side leaves pointing up-right */}
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(55, 25) rotate(15) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(57, 33) rotate(20) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(58, 42) rotate(25) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(57, 52) rotate(30) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(54, 62) rotate(35) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(49, 72) rotate(40) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(43, 81) rotate(45) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(35, 88) rotate(50) scale(1.3)" />
            </g>
          </svg>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Our Happy <span className="text-gradient">Readers</span>
          </h2>

          {/* Right Laurel Wreath (Mirrored High-Fidelity Award-Style Branch) */}
          <svg className="w-10 h-10 sm:w-16 sm:h-16 text-brand-purple/95 shrink-0 select-none fill-current scale-x-[-1] overflow-visible" viewBox="0 0 100 100">
            <defs>
              <filter id="laurel-shadow-right" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="-0.8" dy="1.2" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.25" />
              </filter>
            </defs>
            {/* Stem */}
            <path d="M68,85 C52,75 44,53 50,22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" filter="url(#laurel-shadow-right)" />
            {/* Leaves Group */}
            <g filter="url(#laurel-shadow-right)">
              {/* Top central leaf */}
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(50, 18) rotate(-15) scale(1.3)" />
              
              {/* Left-side leaves pointing up-left */}
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(45, 23) rotate(-35) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(40, 31) rotate(-40) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(36, 40) rotate(-45) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(34, 50) rotate(-50) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(34, 60) rotate(-55) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(36, 70) rotate(-60) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(40, 79) rotate(-65) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(46, 87) rotate(-70) scale(1.3)" />
              
              {/* Right-side leaves pointing up-right */}
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(55, 25) rotate(15) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(57, 33) rotate(20) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(58, 42) rotate(25) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(57, 52) rotate(30) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(54, 62) rotate(35) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(49, 72) rotate(40) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(43, 81) rotate(45) scale(1.3)" />
              <path d="M0,0 C-3,-6 -6,-10 0,-15 C6,-10 3,-6 0,0 Z" transform="translate(35, 88) rotate(50) scale(1.3)" />
            </g>
          </svg>
        </div>

        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          See how our readers are talking about our blogs
        </p>
      </div>

      {/* Infinite Marquee Double Rows Wrapper */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden flex flex-col gap-5 max-w-[100vw]">
        {/* Left Gradient Fade Overlay */}
        <div 
          className="absolute inset-y-0 left-0 w-24 sm:w-36 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--color-bg-base, #05050f), transparent)' }}
        />
        {/* Right Gradient Fade Overlay */}
        <div 
          className="absolute inset-y-0 right-0 w-24 sm:w-36 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--color-bg-base, #05050f), transparent)' }}
        />

        {/* Row 1: Scroll Left to Right */}
        <div className="flex w-full overflow-hidden py-1">
          <div className="flex gap-6 animate-marquee-ltr hover-pause select-none">
            {row1Doubled.map((card, idx) => (
              <div key={`${card.name}-${idx}`} className="w-[260px] sm:w-[320px] shrink-0">
                <GlassCard className="p-4 flex flex-col justify-between border border-border-subtle bg-bg-card hover:border-brand-purple/20 hover:bg-white/[0.01] transition-all duration-300 h-full">
                  <div>
                    {/* User profile row */}
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={card.avatar}
                        alt={card.name}
                        className="w-8 h-8 rounded-full object-cover border border-border-subtle shadow-sm"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">
                          {card.name}
                        </h4>
                        <p className="text-[9px] text-gray-500 truncate">
                          {card.location}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {Array(5).fill(null).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3 h-3"
                          fill={idx < card.stars ? "#eab308" : "none"}
                          stroke={idx < card.stars ? "#eab308" : "var(--color-border-subtle)"}
                          strokeWidth={2}
                        />
                      ))}
                    </div>

                    {/* Review title */}
                    <h5 className="text-xs font-bold text-white mb-1 leading-snug line-clamp-1">
                      {card.title}
                    </h5>

                    {/* Review text */}
                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                      {card.text}
                    </p>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scroll Right to Left */}
        <div className="flex w-full overflow-hidden py-1">
          <div className="flex gap-6 animate-marquee-rtl hover-pause select-none">
            {row2Doubled.map((card, idx) => (
              <div key={`${card.name}-${idx}`} className="w-[280px] sm:w-[320px] shrink-0">
                <GlassCard className="p-4 flex flex-col justify-between border border-border-subtle bg-bg-card hover:border-brand-purple/20 hover:bg-white/[0.01] transition-all duration-300 h-full">
                  <div>
                    {/* User profile row */}
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={card.avatar}
                        alt={card.name}
                        className="w-8 h-8 rounded-full object-cover border border-border-subtle shadow-md"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">
                          {card.name}
                        </h4>
                        <p className="text-[9px] text-gray-500 truncate">
                          {card.location}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {Array(5).fill(null).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3 h-3"
                          fill={idx < card.stars ? "#eab308" : "none"}
                          stroke={idx < card.stars ? "#eab308" : "var(--color-border-subtle)"}
                          strokeWidth={2}
                        />
                      ))}
                    </div>

                    {/* Review title */}
                    <h5 className="text-xs font-bold text-white mb-1 leading-snug line-clamp-1">
                      {card.title}
                    </h5>

                    {/* Review text */}
                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                      {card.text}
                    </p>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write a Review Button */}
      <div className="flex justify-center mt-12">
        <Button 
          variant="primary" 
          className="shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_25px_rgba(139,92,246,0.45)] transition-all duration-300 transform active:scale-95"
        >
          Write a Review
        </Button>
      </div>
    </section>
  );
};

export default Testimonials;
