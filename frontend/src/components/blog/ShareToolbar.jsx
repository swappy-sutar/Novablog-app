import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Link2, Bookmark } from 'lucide-react';

const ShareToolbar = ({ blog, likeCount, userLiked, onToggleLike, userBookmarked, onToggleBookmark }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null);

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
    <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-40">
      <div className="glass-panel p-2.5 flex flex-col gap-4.5 rounded-full border-border-subtle/50 shadow-2xl items-center bg-bg-card backdrop-blur-md">
        {/* Like Button */}
        <button
          onClick={onToggleLike}
          className="group flex flex-col items-center focus:outline-none cursor-pointer"
          title="Like post"
        >
          <motion.div
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            animate={{
              scale: userLiked ? [1, 1.25, 1] : 1,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 15 }}
            className={`p-3 rounded-full transition-colors duration-300 ${userLiked
              ? 'bg-red-500/10 text-red-500'
              : 'bg-border-subtle/30 text-gray-400 hover:text-red-500 hover:bg-red-500/10'
              }`}
          >
            <Heart
              className="w-5 h-5 transition-transform duration-300"
              fill={userLiked ? "#ef4444" : "none"}
              strokeWidth={2}
            />
          </motion.div>
          <span className={`text-[10px] font-bold mt-1 transition-colors duration-300 ${userLiked ? 'text-red-500' : 'text-gray-400'}`}>
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
          onClick={onToggleBookmark}
          className="group flex flex-col items-center focus:outline-none cursor-pointer"
          title="Bookmark post"
        >
          <motion.div
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            animate={{
              scale: userBookmarked ? [1, 1.25, 1] : 1,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 15 }}
            className={`p-3 rounded-full transition-colors duration-300 ${userBookmarked
              ? 'bg-brand-purple/10 text-brand-purple'
              : 'bg-border-subtle/30 text-gray-400 hover:text-brand-purple hover:bg-brand-purple/10'
              }`}
          >
            <Bookmark
              className="w-5 h-5 transition-transform duration-300"
              fill={userBookmarked ? "#8b5cf6" : "none"}
              strokeWidth={2}
            />
          </motion.div>
          <span className={`text-[9px] font-bold mt-1 uppercase tracking-wider transition-colors duration-300 ${userBookmarked ? 'text-brand-purple' : 'text-gray-500 group-hover:text-brand-purple'}`}>
            {userBookmarked ? 'Saved' : 'Save'}
          </span>
        </button>

        <div className="w-6 h-px bg-border-subtle/60"></div>

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
                initial={{ opacity: 0, x: 15, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 15, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-bg-dropdown border border-border-subtle/80 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex items-center gap-3 w-max z-50"
              >
                {/* X / Twitter */}
                <button
                  onClick={() => {
                    shareOnX();
                    setShowShareMenu(false);
                  }}
                  className="p-2.5 rounded-xl bg-border-subtle/30 hover:bg-border-subtle/80 text-white hover:text-brand-blue transition-colors duration-300 cursor-pointer flex items-center justify-center"
                  title="Share on X"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => {
                    shareOnWhatsApp();
                    setShowShareMenu(false);
                  }}
                  className="p-2.5 rounded-xl bg-border-subtle/30 hover:bg-border-subtle/80 text-white hover:text-emerald-500 transition-colors duration-300 cursor-pointer flex items-center justify-center"
                  title="Share on WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6-1.155 3.48-1.472 4.198-1.472h.168c5.4 0 9.79-4.378 9.794-9.76 0-2.584-1.002-5.016-2.822-6.837C16.16 1.05 13.73.05 11.156.05c-5.4 0-9.79 4.38-9.794 9.762-.001 2.213.568 4.305 1.648 6.136l-.946 3.454 3.583-.938zm13.107-7.89c-.104-.174-.388-.278-.767-.468-.379-.19-2.24-1.107-2.59-1.233-.353-.127-.61-.19-.868.19-.258.379-.997 1.266-1.222 1.519-.224.25-.45.282-.83.09-.379-.19-1.602-.59-3.05-1.884-1.127-1.006-1.888-2.25-2.11-2.63-.223-.379-.024-.585.166-.774.17-.17.38-.44.57-.66.19-.224.25-.38.38-.633.128-.254.065-.477-.03-.666-.097-.19-.868-2.09-1.192-2.87-.315-.76-.636-.66-.868-.672-.224-.01-.482-.012-.74-.012-.258 0-.677.097-1.03.477-.353.379-1.353 1.325-1.353 3.227 0 1.9 1.383 3.738 1.577 3.99.19.25 2.72 4.153 6.59 5.823.92.397 1.637.633 2.196.81.925.294 1.766.252 2.43.153.74-.11 2.24-.915 2.55-1.8.31-.884.31-1.643.217-1.8-.094-.158-.379-.25-.768-.44z" />
                  </svg>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => {
                    shareOnLinkedIn();
                    setShowShareMenu(false);
                  }}
                  className="p-2.5 rounded-xl bg-border-subtle/30 hover:bg-border-subtle/80 text-white hover:text-[#0a66c2] transition-colors duration-300 cursor-pointer flex items-center justify-center"
                  title="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z" />
                  </svg>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => {
                    shareOnInstagram();
                    setShowShareMenu(false);
                  }}
                  className="p-2.5 rounded-xl bg-border-subtle/30 hover:bg-border-subtle/80 text-white hover:text-pink-500 transition-colors duration-300 cursor-pointer flex items-center justify-center"
                  title="Share on Instagram"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
                  className="p-2.5 rounded-xl bg-border-subtle/30 hover:bg-border-subtle/80 text-white hover:text-brand-purple transition-colors duration-300 cursor-pointer flex items-center justify-center"
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
