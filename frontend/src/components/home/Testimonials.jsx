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
          {/* Left Laurel Wreath (Lush Leaf Branch) */}
          <svg className="w-10 h-10 sm:w-16 sm:h-16 text-brand-purple/90 shrink-0 select-none fill-current" viewBox="0 0 100 100">
            {/* Stem */}
            <path d="M70,85 C50,75 40,55 55,20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            {/* Top Leaf */}
            <path d="M55,20 C52,12 48,15 48,15 C48,15 54,23 55,20 Z" />
            <path d="M55,20 C60,14 62,18 62,18 C62,18 57,24 55,20 Z" />
            {/* Leaf Pairs */}
            <path d="M52,28 C45,21 41,25 41,25 C41,25 49,31 52,28 Z" />
            <path d="M54,26 C61,19 65,23 65,23 C65,23 57,29 54,26 Z" />
            <path d="M49,38 C41,31 37,35 37,35 C37,35 46,42 49,38 Z" />
            <path d="M51,36 C59,29 63,33 63,33 C63,33 55,40 51,36 Z" />
            <path d="M47,49 C38,43 34,47 34,47 C34,47 43,53 47,49 Z" />
            <path d="M49,47 C58,40 61,44 61,44 C61,44 53,51 49,47 Z" />
            <path d="M46,61 C37,56 33,60 33,60 C33,60 42,66 46,61 Z" />
            <path d="M48,59 C57,53 60,57 60,57 C60,57 52,63 48,59 Z" />
            <path d="M47,73 C38,69 34,73 34,73 C34,73 42,78 47,73 Z" />
            <path d="M49,71 C58,66 61,70 61,70 C61,70 53,75 49,71 Z" />
            <path d="M51,84 C42,81 38,85 38,85 C38,85 46,89 51,84 Z" />
            <path d="M53,82 C61,78 64,82 64,82 C64,82 56,86 53,82 Z" />
          </svg>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Our Happy <span className="text-gradient">Readers</span>
          </h2>

          {/* Right Laurel Wreath (Mirrored Lush Leaf Branch) */}
          <svg className="w-10 h-10 sm:w-16 sm:h-16 text-brand-purple/90 shrink-0 select-none fill-current scale-x-[-1]" viewBox="0 0 100 100">
            {/* Stem */}
            <path d="M70,85 C50,75 40,55 55,20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            {/* Top Leaf */}
            <path d="M55,20 C52,12 48,15 48,15 C48,15 54,23 55,20 Z" />
            <path d="M55,20 C60,14 62,18 62,18 C62,18 57,24 55,20 Z" />
            {/* Leaf Pairs */}
            <path d="M52,28 C45,21 41,25 41,25 C41,25 49,31 52,28 Z" />
            <path d="M54,26 C61,19 65,23 65,23 C65,23 57,29 54,26 Z" />
            <path d="M49,38 C41,31 37,35 37,35 C37,35 46,42 49,38 Z" />
            <path d="M51,36 C59,29 63,33 63,33 C63,33 55,40 51,36 Z" />
            <path d="M47,49 C38,43 34,47 34,47 C34,47 43,53 47,49 Z" />
            <path d="M49,47 C58,40 61,44 61,44 C61,44 53,51 49,47 Z" />
            <path d="M46,61 C37,56 33,60 33,60 C33,60 42,66 46,61 Z" />
            <path d="M48,59 C57,53 60,57 60,57 C60,57 52,63 48,59 Z" />
            <path d="M47,73 C38,69 34,73 34,73 C34,73 42,78 47,73 Z" />
            <path d="M49,71 C58,66 61,70 61,70 C61,70 53,75 49,71 Z" />
            <path d="M51,84 C42,81 38,85 38,85 C38,85 46,89 51,84 Z" />
            <path d="M53,82 C61,78 64,82 64,82 C64,82 56,86 53,82 Z" />
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
