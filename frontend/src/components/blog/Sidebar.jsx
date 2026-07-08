import React, { useState, useEffect } from 'react';
import GlassCard from '../ui/GlassCard';
import toast from 'react-hot-toast';

const Sidebar = ({ blog }) => {
  const [activeId, setActiveId] = useState('');

  const headings = React.useMemo(() => {
    if (!blog?.content) return [];
    
    // Extract text inside h1 and h2 tags (case-insensitive, matching across multiple lines)
    const matches = [...blog.content.matchAll(/<(h1|h2)[^>]*>([\s\S]*?)<\/\1>/gi)];
    return matches.map((match, i) => ({
      id: `heading-${i}`,
      tag: match[1].toLowerCase(),
      text: match[2].replace(/<[^>]*>/g, "").trim(), // Strip any nested html tags
    }));
  }, [blog]);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      let currentActiveId = '';
      const offset = 220; // Trigger threshold from top of viewport

      for (let i = 0; i < headings.length; i++) {
        const el = document.getElementById(headings[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            currentActiveId = headings[i].id;
          } else {
            break;
          }
        }
      }

      if (!currentActiveId && headings.length > 0) {
        currentActiveId = headings[0].id;
      }
      
      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  const scrollToHeading = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Successfully subscribed to Nova!");
  };

  return (
    <div className="sticky top-28 hidden lg:block w-64 shrink-0">
      {headings.length > 0 && (
        <div className="mb-8">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 block">Navigation</span>
          <ul className="space-y-3 text-sm">
            {headings.map((heading) => {
              const isActive = heading.id === activeId;
              return (
                <li key={heading.id} className={heading.tag === 'h2' ? 'ml-3' : ''}>
                  <a 
                    href={`#${heading.id}`}
                    onClick={(e) => scrollToHeading(e, heading.id)}
                    className={`transition-all duration-200 block border-l-2 pl-3 truncate ${
                      isActive 
                        ? 'text-brand-cyan border-brand-cyan font-bold scale-[1.01] origin-left' 
                        : 'text-gray-400 border-transparent hover:text-white hover:border-brand-cyan/50'
                    } ${
                      heading.tag === 'h2' ? 'text-xs' : 'font-medium'
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <GlassCard className="p-5 mt-12 bg-gradient-to-b from-bg-card to-bg-base">
        <span className="text-xs font-semibold text-brand-purple uppercase tracking-widest mb-2 block">Newsletter</span>
        <h4 className="font-bold text-gray-200 mb-2">Subscribe to Nova</h4>
        <p className="text-xs text-gray-400 mb-4">Get weekly deep dives delivered securely.</p>
        <form onSubmit={handleSubscribe}>
          <input 
            type="email" 
            placeholder="Email..." 
            required
            className="w-full bg-border-subtle/30 border border-border-subtle rounded p-2 text-xs text-gray-200 mb-2 focus:border-brand-purple focus:outline-none"
          />
          <button 
            type="submit"
            className="w-full bg-white text-black font-semibold text-xs py-2 rounded hover:bg-gray-200 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default Sidebar;
