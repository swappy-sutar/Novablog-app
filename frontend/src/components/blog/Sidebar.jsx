import React from 'react';
import GlassCard from '../ui/GlassCard';
import toast from 'react-hot-toast';

const Sidebar = ({ blog }) => {
  const headings = React.useMemo(() => {
    if (!blog?.content) return [];
    
    // Extract text inside <h2> tags
    const matches = [...blog.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)];
    return matches.map((match, i) => ({
      id: `heading-${i}`,
      text: match[1].replace(/<[^>]*>/g, "").trim(), // Strip any nested html tags
    }));
  }, [blog]);

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
            {headings.map((heading) => (
              <li key={heading.id}>
                <a 
                  href={`#${heading.id}`}
                  onClick={(e) => scrollToHeading(e, heading.id)}
                  className="text-gray-400 hover:text-white transition-colors block border-l-2 border-transparent hover:border-brand-cyan pl-3 truncate"
                >
                  {heading.text}
                </a>
              </li>
            ))}
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
