import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowUp } from 'lucide-react';
import BlogHero from '../components/blog/BlogHero';
import Sidebar from '../components/blog/Sidebar';
import ArticleContent from '../components/blog/ArticleContent';
import ShareToolbar from '../components/blog/ShareToolbar';
import Discussion from '../components/blog/Discussion';
import GlassCard from '../components/ui/GlassCard';
import Loader from '../components/ui/Loader';
import { blogAPI, likeAPI, bookmarkAPI, getErrorMessage } from '../lib/api';
import useDocumentTitle from '../hooks/useDocumentTitle';

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userBookmarked, setUserBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Listen for real-time notifications to update counters dynamically
  useEffect(() => {
    const handleNewNotification = (event) => {
      const notification = event.detail;
      if (
        notification &&
        notification.type === 'LIKE' &&
        blog?.title &&
        notification.message?.includes(blog.title)
      ) {
        setLikeCount((prev) => prev + 1);
      }
    };

    window.addEventListener("new-notification", handleNewNotification);
    return () => {
      window.removeEventListener("new-notification", handleNewNotification);
    };
  }, [blog]);

  useDocumentTitle(blog ? blog.title : "Loading Post");

  const loadBlogData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await blogAPI.getBlogById(id);
      if (res.success && res.data) {
        setBlog(res.data);
        setLikeCount(res.data._count?.likes || 0);
        // Hide full page loader immediately now that we have the article details
        setLoading(false);
        
        // Fetch like count, check like, and check bookmark status in parallel in background
        const token = localStorage.getItem('accessToken');
        const promises = [likeAPI.getLikeCount(id)];
        if (token) {
          promises.push(likeAPI.checkLikeStatus(id));
          promises.push(bookmarkAPI.checkBookmarkStatus(id));
        }

        Promise.allSettled(promises).then(([countResult, likeResult, bookmarkResult]) => {
          if (countResult && countResult.status === 'fulfilled' && countResult.value.success) {
            setLikeCount(countResult.value.data.count);
          }
          if (likeResult && likeResult.status === 'fulfilled' && likeResult.value.success) {
            setUserLiked(likeResult.value.data.liked);
          }
          if (bookmarkResult && bookmarkResult.status === 'fulfilled' && bookmarkResult.value.success) {
            setUserBookmarked(bookmarkResult.value.data.bookmarked);
          }
        }).catch(err => {
          console.error("Failed to load background blog interactive metadata:", err);
        });
      } else {
        setError("Post not found.");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || e.message || "Failed to load post.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBlogData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadBlogData]);

  useEffect(() => {
    if (!blog) return;
    const fetchRelated = async () => {
      setLoadingRelated(true);
      try {
        let searchCategory = blog.category?.name;
        let fetched = [];
        if (searchCategory) {
          const res = await blogAPI.getAllBlogs({ search: searchCategory, limit: 4 });
          if (res.success && res.data && res.data.blogs) {
            fetched = res.data.blogs.filter(b => b.id !== blog.id);
          }
        }
        if (fetched.length < 3) {
          const resFallback = await blogAPI.getAllBlogs({ limit: 6 });
          if (resFallback.success && resFallback.data && resFallback.data.blogs) {
            const extra = resFallback.data.blogs.filter(b => b.id !== blog.id && !fetched.some(f => f.id === b.id));
            fetched = [...fetched, ...extra];
          }
        }
        setRelatedBlogs(fetched.slice(0, 3));
      } catch (err) {
        console.error("Failed to load related blogs:", err);
      } finally {
        setLoadingRelated(false);
      }
    };
    fetchRelated();
  }, [blog]);

  const handleToggleLike = async () => {
    const previousUserLiked = userLiked;
    const previousLikeCount = likeCount;

    // Optimistically update states
    const newUserLiked = !previousUserLiked;
    setUserLiked(newUserLiked);
    setLikeCount((prev) => (newUserLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await likeAPI.toggleLike(id);
      if (res.success && res.data) {
        const liked = res.data.liked;
        setUserLiked(liked);
        toast.success(liked ? "Post liked!" : "Post unliked.");
      }
    } catch (e) {
      console.error(e);
      // Roll back state on failure
      setUserLiked(previousUserLiked);
      setLikeCount(previousLikeCount);

      if (e.response?.status === 401) {
        toast.error("Please log in to like posts.");
      } else {
        toast.error(getErrorMessage(e, "Failed to toggle like."));
      }
    }
  };

  const handleToggleBookmark = async () => {
    const previousUserBookmarked = userBookmarked;

    // Optimistically update state
    setUserBookmarked(!previousUserBookmarked);

    try {
      const res = await bookmarkAPI.toggleBookmark(id);
      if (res.success && res.data) {
        const bookmarked = res.data.bookmarked;
        setUserBookmarked(bookmarked);
        toast.success(bookmarked ? "Post bookmarked!" : "Bookmark removed.");
      }
    } catch (e) {
      console.error(e);
      // Roll back state on failure
      setUserBookmarked(previousUserBookmarked);

      if (e.response?.status === 401) {
        toast.error("Please log in to bookmark posts.");
      } else {
        toast.error(getErrorMessage(e, "Failed to toggle bookmark."));
      }
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="pb-20 relative select-none"
      >
        {/* Widescreen Hero Section Skeleton */}
        <div className="relative w-full h-[360px] sm:h-[420px] bg-white/[0.01] border-b border-border-subtle/20 flex flex-col justify-end overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#04040c] via-transparent to-transparent z-10" />
          <div className="max-w-7xl mx-auto px-6 w-full pb-10 z-20 space-y-4">
            {/* Category tag */}
            <div className="h-5 w-16 bg-white/[0.04] border border-white/[0.05] animate-pulse rounded-lg" />
            
            {/* Article Title */}
            <div className="space-y-3">
              <div className="h-10 w-3/4 sm:w-2/3 bg-white/[0.04] animate-pulse rounded-md" />
              <div className="h-10 w-1/2 sm:w-1/3 bg-white/[0.04] animate-pulse rounded-md" />
            </div>

            {/* Author Meta Details */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-white/[0.04] animate-pulse" />
              <div className="h-4 w-24 bg-white/[0.03] animate-pulse rounded" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/[0.02] animate-pulse" />
              <div className="h-4 w-16 bg-white/[0.03] animate-pulse rounded" />
            </div>
          </div>
        </div>

        {/* Share/Actions Toolbar Skeleton */}
        <div className="sticky top-[64px] z-30 w-full h-14 bg-bg-card/75 backdrop-blur-md border-b border-border-subtle/20 flex items-center justify-center gap-8">
          {Array(4).fill(null).map((_, idx) => (
            <div key={idx} className="w-5 h-5 rounded-full bg-white/[0.04] animate-pulse" />
          ))}
        </div>

        {/* Content & Sidebar Grid Skeleton */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-start gap-12 lg:gap-16 pt-12 relative">
          {/* Left/Sidebar meta placeholder */}
          <div className="hidden lg:block w-64 shrink-0 space-y-6">
            <div className="h-4 w-24 bg-white/[0.03] animate-pulse rounded" />
            <div className="space-y-2">
              <div className="h-4 w-5/6 bg-white/[0.02] animate-pulse rounded" />
              <div className="h-4 w-4/5 bg-white/[0.02] animate-pulse rounded" />
            </div>
            <div className="h-px w-full bg-white/[0.05]" />
            <div className="h-4 w-32 bg-white/[0.03] animate-pulse rounded" />
          </div>

          {/* Main article lines placeholder */}
          <div className="flex-grow w-full max-w-3xl space-y-8">
            <div className="space-y-3">
              <div className="h-4 w-full bg-white/[0.02] animate-pulse rounded" />
              <div className="h-4 w-full bg-white/[0.02] animate-pulse rounded" />
              <div className="h-4 w-11/12 bg-white/[0.02] animate-pulse rounded" />
              <div className="h-4 w-4/5 bg-white/[0.02] animate-pulse rounded" />
            </div>
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full bg-white/[0.02] animate-pulse rounded" />
              <div className="h-4 w-full bg-white/[0.02] animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-white/[0.02] animate-pulse rounded" />
            </div>
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full bg-white/[0.02] animate-pulse rounded" />
              <div className="h-4 w-11/12 bg-white/[0.02] animate-pulse rounded" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-7xl mx-auto px-6 text-center py-24 pt-32">
        <p className="text-gray-400 mb-6 text-lg">{error || "Article not found."}</p>
        <button 
          onClick={loadBlogData}
          className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-20 relative"
    >
      <BlogHero blog={blog} />
      
      <ShareToolbar 
        blog={blog} 
        likeCount={likeCount} 
        userLiked={userLiked} 
        onToggleLike={handleToggleLike} 
        userBookmarked={userBookmarked}
        onToggleBookmark={handleToggleBookmark}
      />

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-start gap-12 lg:gap-16 relative">
        <Sidebar blog={blog} />
        
        <div className="flex-grow w-full max-w-3xl min-w-0">
          <ArticleContent blog={blog} />
          
          {/* Related Articles Section */}
          <section className="mt-20 border-t border-border-subtle pt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">More from NovaBlog</h3>
              <Link to="/explore" className="text-sm text-brand-blue hover:text-brand-cyan transition-colors flex items-center gap-1">
                View all <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loadingRelated ? (
                [1, 2, 3].map((n) => (
                  <div key={n} className="h-[230px] bg-white/[0.01] border border-border-subtle rounded-2xl animate-pulse" />
                ))
              ) : relatedBlogs.length > 0 ? (
                relatedBlogs.map((item, i) => {
                  const colors = ['brand-cyan', 'brand-blue', 'brand-purple'];
                  const color = colors[i % colors.length];
                  return (
                    <Link key={item.id} to={`/post/${item.id}`} className="block">
                      <GlassCard className="group cursor-pointer border-transparent hover:border-border-subtle h-[230px] flex flex-col justify-between overflow-hidden">
                        <div className="h-32 overflow-hidden shrink-0">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2664&auto=format&fit=crop" alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                          )}
                        </div>
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider text-${color} mb-2 block`}>
                              {item.category?.name || 'Insight'}
                            </span>
                            <h4 className="font-bold text-white text-sm group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">
                              {item.title}
                            </h4>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-6 text-xs text-gray-500">
                  No related posts found.
                </div>
              )}
            </div>
          </section>

          <Discussion blog={blog} />
        </div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 xl:bottom-8 xl:right-8 p-3.5 glass-panel rounded-full shadow-2xl text-gray-400 hover:text-white hover:border-gray-500 transition-all duration-200 z-50 cursor-pointer active:scale-90"
            title="Go to Top"
          >
            <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BlogDetailsPage;
