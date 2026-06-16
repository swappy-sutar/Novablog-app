import React from 'react';
import toast from 'react-hot-toast';

const ShareToolbar = ({ blog, likeCount, userLiked, onToggleLike }) => {
  const scrollToComments = () => {
    document.getElementById("discussion-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const shareOnX = () => {
    const text = encodeURIComponent(`Check out this article: "${blog?.title || ''}"`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-40">
      <div className="glass-panel p-2 flex flex-col gap-3 rounded-full border-border-subtle/50 shadow-lg text-xs">
        <button 
          onClick={onToggleLike}
          className={`p-3 rounded-full transition-all group relative ${
            userLiked 
              ? 'text-red-500 bg-red-500/10' 
              : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
          }`}
          title="Like post"
        >
          Like
          <span className="absolute -left-12 top-1/2 -translate-y-1/2 font-bold px-2 py-1 rounded bg-[#161726] border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity text-white">
            {likeCount || 0}
          </span>
        </button>
        
        <button 
          onClick={scrollToComments}
          className="p-3 text-gray-400 hover:text-brand-cyan hover:bg-brand-cyan/10 rounded-full transition-all"
          title="Scroll to comments"
        >
          Talk
        </button>
        
        <div className="w-full h-px bg-border-subtle my-1"></div>
        
        <button 
          onClick={shareOnX}
          className="p-3 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-full transition-all"
          title="Share on X (Twitter)"
        >
          X
        </button>
        
        <button 
          onClick={copyLink}
          className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          title="Copy post link"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default ShareToolbar;
