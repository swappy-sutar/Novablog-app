import React from 'react';
import { Star } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

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

// Double data arrays to allow seamless infinite looping marquee
const row1Doubled = [...ROW1_DATA, ...ROW1_DATA];
const row2Doubled = [...ROW2_DATA, ...ROW2_DATA];

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
          animation: marquee-ltr 28s linear infinite;
        }
        .animate-marquee-rtl {
          animation: marquee-rtl 28s linear infinite;
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
          {/* Left Laurel Wreath (Feather/Leaf Branch) */}
          <svg className="w-8 h-8 sm:w-12 sm:h-12 text-brand-purple/80 shrink-0 select-none fill-current" viewBox="0 0 40 40">
            {/* Stem */}
            <path d="M30,35 C22,30 20,20 28,5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Leaf pairs */}
            {/* Pair 1 - top */}
            <path d="M28,5 C25,4 23,6 23,8 C24,10 26,10 28,5 Z" />
            <path d="M28,5 C30,3 32,4 32,6 C31,8 29,9 28,5 Z" />
            {/* Pair 2 */}
            <path d="M26.2,9.8 C23.2,9.3 21.2,11.3 21.2,13.3 C22.2,15.3 24.2,14.8 26.2,9.8 Z" />
            <path d="M26.2,9.8 C28.2,7.8 30.2,8.8 30.2,10.8 C29.2,12.8 27.2,13.8 26.2,9.8 Z" />
            {/* Pair 3 */}
            <path d="M24.7,15.2 C21.7,15.2 19.7,17.2 19.7,19.2 C20.7,21.2 22.7,20.2 24.7,15.2 Z" />
            <path d="M24.7,15.2 C26.7,13.2 28.7,14.2 28.7,16.2 C27.7,18.2 25.7,19.2 24.7,15.2 Z" />
            {/* Pair 4 */}
            <path d="M23.9,21 C20.9,21.5 18.9,23.5 18.9,25.5 C19.9,27.5 21.9,26.5 23.9,21 Z" />
            <path d="M23.9,21 C25.9,19 27.9,20 27.9,22 C26.9,24 24.9,25 23.9,21 Z" />
            {/* Pair 5 */}
            <path d="M24.2,27 C21.2,28 19.2,30 19.2,32 C20.2,33.5 22.2,32.5 24.2,27 Z" />
            <path d="M24.2,27 C26.2,25 28.2,26 28.2,28 C27.2,30 25.2,31 24.2,27 Z" />
          </svg>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Our Happy <span className="text-gradient">Readers</span>
          </h2>

          {/* Right Laurel Wreath (Mirrored Feather/Leaf Branch) */}
          <svg className="w-8 h-8 sm:w-12 sm:h-12 text-brand-purple/80 shrink-0 select-none fill-current scale-x-[-1]" viewBox="0 0 40 40">
            {/* Stem */}
            <path d="M30,35 C22,30 20,20 28,5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Leaf pairs */}
            {/* Pair 1 - top */}
            <path d="M28,5 C25,4 23,6 23,8 C24,10 26,10 28,5 Z" />
            <path d="M28,5 C30,3 32,4 32,6 C31,8 29,9 28,5 Z" />
            {/* Pair 2 */}
            <path d="M26.2,9.8 C23.2,9.3 21.2,11.3 21.2,13.3 C22.2,15.3 24.2,14.8 26.2,9.8 Z" />
            <path d="M26.2,9.8 C28.2,7.8 30.2,8.8 30.2,10.8 C29.2,12.8 27.2,13.8 26.2,9.8 Z" />
            {/* Pair 3 */}
            <path d="M24.7,15.2 C21.7,15.2 19.7,17.2 19.7,19.2 C20.7,21.2 22.7,20.2 24.7,15.2 Z" />
            <path d="M24.7,15.2 C26.7,13.2 28.7,14.2 28.7,16.2 C27.7,18.2 25.7,19.2 24.7,15.2 Z" />
            {/* Pair 4 */}
            <path d="M23.9,21 C20.9,21.5 18.9,23.5 18.9,25.5 C19.9,27.5 21.9,26.5 23.9,21 Z" />
            <path d="M23.9,21 C25.9,19 27.9,20 27.9,22 C26.9,24 24.9,25 23.9,21 Z" />
            {/* Pair 5 */}
            <path d="M24.2,27 C21.2,28 19.2,30 19.2,32 C20.2,33.5 22.2,32.5 24.2,27 Z" />
            <path d="M24.2,27 C26.2,25 28.2,26 28.2,28 C27.2,30 25.2,31 24.2,27 Z" />
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
    </section>
  );
};

export default Testimonials;
