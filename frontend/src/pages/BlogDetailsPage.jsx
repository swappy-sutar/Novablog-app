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
        
        // Check if current user liked this blog
        // We can fetch the like count explicitly to sync
        const countRes = await likeAPI.getLikeCount(id);
        if (countRes.success && countRes.data) {
          setLikeCount(countRes.data.count);
        }

        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const statusRes = await likeAPI.checkLikeStatus(id);
            if (statusRes.success && statusRes.data) {
              setUserLiked(statusRes.data.liked);
            }

            const bookmarkRes = await bookmarkAPI.checkBookmarkStatus(id);
            if (bookmarkRes.success && bookmarkRes.data) {
              setUserBookmarked(bookmarkRes.data.bookmarked);
            }
          } catch (err) {
            console.error("Failed to check like/bookmark status:", err);
          }
        }
      } else {
        setError("Post not found.");
      }
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || e.message || "Failed to load post.");
    } finally {
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-center min-h-[60vh] pt-24">
        <Loader message="Retrieving article details..." size="md" />
      </div>
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
