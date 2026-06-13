import React from 'react';
import GlassCard from '../ui/GlassCard';

const Sidebar = () => {
  return (
    <div className="sticky top-28 hidden lg:block w-64 shrink-0">
      <div className="mb-8">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 block">Navigation</span>
        <ul className="space-y-3 text-sm">
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors block border-l-2 border-brand-cyan pl-3">The Shift to Edge</a></li>
          <li><a href="#" className="text-gray-500 hover:text-white transition-colors block border-l-2 border-transparent pl-3">Architectural Pillars</a></li>
          <li><a href="#" className="text-gray-500 hover:text-white transition-colors block border-l-2 border-transparent pl-3">Code Implementation</a></li>
          <li><a href="#" className="text-gray-500 hover:text-white transition-colors block border-l-2 border-transparent pl-3">Future Outlook</a></li>
        </ul>
      </div>

      <GlassCard className="p-5 mt-12 bg-gradient-to-b from-bg-card to-bg-base">
        <span className="text-xs font-semibold text-brand-purple uppercase tracking-widest mb-2 block">Newsletter</span>
        <h4 className="font-bold text-white mb-2">Subscribe to Nova</h4>
        <p className="text-xs text-gray-400 mb-4">Get weekly deep dives delivered securely.</p>
        <input 
          type="email" 
          placeholder="Email..." 
          className="w-full bg-black/50 border border-border-subtle rounded p-2 text-xs text-white mb-2 focus:border-brand-purple focus:outline-none"
        />
        <button className="w-full bg-white text-black font-semibold text-xs py-2 rounded hover:bg-gray-200 transition-colors">
          Subscribe
        </button>
      </GlassCard>
    </div>
  );
};

export default Sidebar;
