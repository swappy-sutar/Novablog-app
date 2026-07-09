import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Link2, Bookmark } from 'lucide-react';

const ShareToolbar = ({ blog, likeCount, userLiked, onToggleLike, userBookmarked, onToggleBookmark }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null);
  const isLoggedIn = !!localStorage.getItem('token');

  const scrollToComments = () => {
    document.getElementById("discussion-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const shareOnX = () => {
    const text = encodeURIComponent(`Check out this article: "${blog?.title || ''}"`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Check out this article: "${blog?.title || ''}"`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const shareOnInstagram = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied! Share it on your Instagram bio or stories.", {
      duration: 5000,
      icon: "📸"
    });
    window.open("https://instagram.com", "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // Close share menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };
    if (showShareMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showShareMenu]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md xl:bottom-auto xl:left-auto xl:right-6 xl:top-1/2 xl:-translate-y-1/2 xl:w-auto xl:max-w-none z-40">
      <div className="glass-panel w-full xl:w-auto p-2.5 flex flex-row xl:flex-col gap-4.5 rounded-full border-border-subtle/50 shadow-2xl items-center justify-around bg-bg-card backdrop-blur-md">
        {/* Like Button */}
        <button
          onClick={isLoggedIn ? onToggleLike : undefined}
          disabled={!isLoggedIn}
          className={`group flex flex-col items-center focus:outline-none ${isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}
          title={isLoggedIn ? "Like post" : "Log in to like this post"}
        >
          <motion.div
            whileHover={isLoggedIn ? { scale: 1.12 } : {}}
            whileTap={isLoggedIn ? { scale: 0.88 } : {}}
            animate={{
              scale: userLiked && isLoggedIn ? [1, 1.25, 1] : 1,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 15 }}
            className={`p-3 rounded-full transition-colors duration-300 ${userLiked && isLoggedIn
              ? 'bg-red-500/10 text-red-500'
              : 'bg-border-subtle/30 text-gray-400'
              } ${isLoggedIn ? 'hover:text-red-500 hover:bg-red-500/10' : ''}`}
          >
            <Heart
              className="w-5 h-5 transition-transform duration-300"
              fill={userLiked && isLoggedIn ? "#ef4444" : "none"}
              strokeWidth={2}
            />
          </motion.div>
          <span className={`text-[10px] font-bold mt-1 transition-colors duration-300 ${userLiked && isLoggedIn ? 'text-red-500' : 'text-gray-400'}`}>
            {likeCount || 0}
          </span>
        </button>

        {/* Talk / Comments Button */}
        <button
          onClick={scrollToComments}
          className="group flex flex-col items-center focus:outline-none cursor-pointer"
          title="Scroll to comments"
        >
          <motion.div
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            className="p-3 bg-border-subtle/30 text-gray-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-full transition-colors duration-300"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={2} />
          </motion.div>
          <span className="text-[10px] text-gray-400 font-bold mt-1 group-hover:text-brand-purple transition-colors duration-300">
            {blog?._count?.comments || 0}
          </span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={isLoggedIn ? onToggleBookmark : undefined}
          disabled={!isLoggedIn}
          className={`group flex flex-col items-center focus:outline-none ${isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}
          title={isLoggedIn ? "Bookmark post" : "Log in to bookmark this post"}
        >
          <motion.div
            whileHover={isLoggedIn ? { scale: 1.12 } : {}}
            whileTap={isLoggedIn ? { scale: 0.88 } : {}}
            animate={{
              scale: userBookmarked && isLoggedIn ? [1, 1.25, 1] : 1,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 15 }}
            className={`p-3 rounded-full transition-colors duration-300 ${userBookmarked && isLoggedIn
              ? 'bg-brand-purple/10 text-brand-purple'
              : 'bg-border-subtle/30 text-gray-400'
              } ${isLoggedIn ? 'hover:text-brand-purple hover:bg-brand-purple/10' : ''}`}
          >
            <Bookmark
              className="w-5 h-5 transition-transform duration-300"
              fill={userBookmarked && isLoggedIn ? "#8b5cf6" : "none"}
              strokeWidth={2}
            />
          </motion.div>
          <span className={`text-[9px] font-bold mt-1 uppercase tracking-wider transition-colors duration-300 ${userBookmarked && isLoggedIn ? 'text-brand-purple' : 'text-gray-500'}`}>
            {userBookmarked && isLoggedIn ? 'Saved' : 'Save'}
          </span>
        </button>

        <div className="w-px h-6 xl:w-6 xl:h-px bg-border-subtle/60"></div>

        {/* Share Button with Popover */}
        <div className="relative" ref={shareMenuRef}>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="group flex flex-col items-center focus:outline-none cursor-pointer"
            title="Share options"
          >
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              className={`p-3 rounded-full transition-colors duration-300 ${showShareMenu
                ? 'bg-brand-blue/15 text-brand-blue'
                : 'bg-border-subtle/30 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10'
                }`}
            >
              <Share2 className="w-5 h-5" strokeWidth={2} />
            </motion.div>
            <span className={`text-[9px] font-bold mt-1 uppercase tracking-wider transition-colors duration-300 ${showShareMenu ? 'text-brand-blue' : 'text-gray-500 group-hover:text-brand-blue'}`}>
              Share
            </span>
          </button>

          {/* Share Options Popover Menu */}
          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 xl:bottom-auto xl:left-auto xl:right-full xl:translate-x-0 xl:top-1/2 xl:-translate-y-1/2 xl:mr-4 xl:mb-0 bg-bg-dropdown border border-border-subtle/80 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex items-center gap-3 w-max z-50"
              >
                {/* X / Twitter */}
                <button
                  onClick={() => {
                    shareOnX();
                    setShowShareMenu(false);
                  }}
                  className="p-2.5 rounded-xl bg-black hover:bg-neutral-900 text-white border border-white/10 transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95"
                  title="Share on X"
                >
                  <svg className="w-4 h-4" fill="#ffffff" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => {
                    shareOnWhatsApp();
                    setShowShareMenu(false);
                  }}
                  className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white border border-[#25d366]/20 transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95"
                  title="Share on WhatsApp"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path 
                      fill="white" 
                      d="M12.162 21.085h-.004a9.23 9.23 0 0 1-4.707-1.288l-.338-.2-3.504.919 1.363-3.417-.22-.353a9.213 9.213 0 0 1-1.411-4.872c0-5.083 4.137-9.22 9.22-9.22a9.176 9.176 0 0 1 6.536 2.715 9.178 9.178 0 0 1 2.715 6.537c0 5.084-4.137 9.22-9.22 9.22z" 
                    />
                    <path 
                      fill="#25D366" 
                      d="M17.205 14.179c-.276-.138-1.631-.805-1.884-.897-.245-.093-.424-.138-.603.138-.178.277-.69.897-.798 1.081-.107.184-.214.207-.492.069-.276-.138-1.164-.43-2.217-1.371-.82-.73-1.373-1.632-1.533-1.916-.16-.284-.017-.437.126-.578.13-.129.288-.337.432-.505.143-.167.19-.284.285-.461.095-.178.048-.334-.023-.467-.071-.133-.603-1.453-.827-1.99-.219-.523-.443-.452-.603-.461-.157-.008-.336-.009-.516-.009-.18 0-.471.068-.718.344-.247.276-.944.922-.944 2.247 0 1.325 1.002 2.607 1.141 2.791.139.184 1.968 3.005 4.766 4.217.663.286 1.18.457 1.583.585.666.211 1.27.182 1.748.111.532-.08 1.631-.666 1.859-1.309.227-.644.227-1.196.159-1.309-.068-.113-.248-.182-.524-.32z" 
                    />
                  </svg>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => {
                    shareOnLinkedIn();
                    setShowShareMenu(false);
                  }}
                  className="p-2.5 rounded-xl bg-[#0077b5] hover:bg-[#0a66c2] text-white border border-[#0077b5]/20 transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95"
                  title="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="#ffffff" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                  </svg>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => {
                    shareOnInstagram();
                    setShowShareMenu(false);
                  }}
                  className="p-2.5 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:brightness-110 text-white border border-white/10 transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95"
                  title="Share on Instagram"
                >
                  <svg className="w-4 h-4" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </button>

                {/* Copy Link */}
                <button
                  onClick={() => {
                    copyLink();
                    setShowShareMenu(false);
                  }}
                  className="p-2.5 rounded-xl bg-brand-purple/20 hover:bg-brand-purple text-brand-purple hover:text-white border border-brand-purple/30 transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95"
                  title="Copy link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Copy Link Button */}
        <button
          onClick={copyLink}
          className="group flex flex-col items-center focus:outline-none cursor-pointer"
          title="Copy post link"
        >
          <motion.div
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            className="p-3 bg-border-subtle/30 text-gray-400 hover:text-gray-200 hover:bg-border-subtle/80 rounded-full transition-colors duration-300"
          >
            <Link2 className="w-5 h-5" strokeWidth={2} />
          </motion.div>

          <span className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-wider group-hover:text-gray-200 transition-colors duration-300">
            Link
          </span>
        </button>
      </div>
    </div>
  );
};

export default ShareToolbar;
