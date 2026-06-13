import React from 'react';

const ShareToolbar = () => {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-40">
      <div className="glass-panel p-2 flex flex-col gap-3 rounded-full border-border-subtle/50 shadow-lg text-xs">
        <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all group relative">
          Like
          <span className="absolute -left-10 top-1/2 -translate-y-1/2 font-bold opacity-0 group-hover:opacity-100 transition-opacity text-white">124</span>
        </button>
        <button className="p-3 text-gray-400 hover:text-brand-cyan hover:bg-brand-cyan/10 rounded-full transition-all">
          Talk
        </button>
        <div className="w-full h-px bg-border-subtle my-1"></div>
        <button className="p-3 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-full transition-all">
          X
        </button>
        <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all">
          Copy
        </button>
      </div>
    </div>
  );
};

export default ShareToolbar;
