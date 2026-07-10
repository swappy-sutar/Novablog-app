import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, ArrowRight, Clock, BookOpen } from "lucide-react";
import { blogAPI } from "../lib/api";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import { ExploreFeaturedSkeleton, ExplorePopularSkeleton, ExploreInsightSkeleton } from "../components/ui/Skeleton";
import useDocumentTitle from "../hooks/useDocumentTitle";

const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};

const trendingTags = [
  { label: "#Rust", query: "Rust" },
  { label: "#DistributedSystems", query: "Distributed Systems" },
  { label: "#LLMOps", query: "LLMOps" },
  { label: "#Wasm", query: "Wasm" },
  { label: "#Kubernetes", query: "Kubernetes" }
];

const ExplorePage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);

  const [trendingTagsList, setTrendingTagsList] = useState(trendingTags);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [loadingExplore, setLoadingExplore] = useState(true);

  useDocumentTitle("Explore Articles");

  // Fetch all blogs on mount for the general feed
  useEffect(() => {
    const fetchAll = async () => {
      setLoadingAll(true);
      try {
        const res = await blogAPI.getAllBlogs({ page: 1, limit: 12 });
        if (res.success && res.data) {
          setAllBlogs(res.data.blogs || []);
        }
      } catch (e) {
        console.error("Failed to fetch public blogs:", e);
      } finally {
        setLoadingAll(false);
      }
    };

    const fetchExplore = async () => {
      setLoadingExplore(true);
      try {
        const res = await blogAPI.getExploreData();
        if (res.success && res.data) {
          if (res.data.trendingTags && res.data.trendingTags.length > 0) {
            setTrendingTagsList(res.data.trendingTags);
          }
          setFeaturedBlog(res.data.featuredBlog);
          setPopularBlogs(res.data.popularBlogs || []);
        }
      } catch (e) {
        console.error("Failed to fetch explore data:", e);
      } finally {
        setLoadingExplore(false);
      }
    };

    fetchAll();
    fetchExplore();
  }, []);

  // Handle Search API call
  const performSearch = async (query) => {
    const trimmed = query.trim();
    setActiveQuery(trimmed);
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await blogAPI.getAllBlogs({ search: trimmed, page: 1, limit: 20 });
      if (res.success && res.data) {
        setSearchResults(res.data.blogs || []);
      }
    } catch (e) {
      console.error("Search failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleTagClick = (query) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveQuery("");
    setSearchResults([]);
  };

  // Trigger search on query param change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    const timer = setTimeout(() => {
      if (searchParam) {
        setSearchQuery(searchParam);
        performSearch(searchParam);
      } else {
        // If there is no search param and searchQuery was active, clear it
        setSearchQuery("");
        setActiveQuery("");
        setSearchResults([]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [location.search]);



  const getAuthorName = (author) => {
    if (!author) return "Anonymous";
    const first = author.firstname || "";
    const last = author.lastname || "";
    if (first || last) return `${first} ${last}`.trim();
    return author.username || "Anonymous";
  };

  const renderAvatar = (author, sizeClass = "w-6 h-6") => {
    if (author?.avatar) {
      return (
        <img
          src={author.avatar}
          alt="Author"
          className={`${sizeClass} rounded-full border border-white/10 object-cover`}
        />
      );
    }
    const initials = `${author?.firstname?.[0] || ""}${author?.lastname?.[0] || ""}`.toUpperCase() || author?.username?.[0]?.toUpperCase() || "U";
    return (
      <div className={`${sizeClass} rounded-full border border-white/10 bg-gradient-to-br from-brand-purple/40 to-brand-purple/20 flex items-center justify-center text-[10px] font-bold text-white`}>
        {initials}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-25 space-y-20">
      {/* Top Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-5">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight"
        >
          Explore <span className="text-gradient">Technical Frontiers</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed"
        >
          Precision-engineered insights for the next generation of technical writers and system architects.
        </motion.p>
      </section>

      {/* Search Bar & Trending Tags */}
      <section className="max-w-3xl mx-auto space-y-5">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="relative w-full group">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-purple transition-colors" />
            <input
              type="text"
              placeholder="Search for technical insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-border-subtle focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 rounded-2xl py-4 pl-12 pr-40 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
            />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {activeQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 transition-colors mr-1"
              >
                Clear
              </button>
            )}
            <Button
              type="submit"
              variant="primary"
              className="!rounded-xl !py-2.5 !px-5 text-xs sm:text-sm font-semibold"
            >
              Search Insights
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm pl-1">
          <span className="text-gray-500 font-medium">Trending:</span>
          {trendingTagsList.map((tag) => (
            <button
              key={tag.label}
              onClick={() => handleTagClick(tag.query)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${activeQuery.toLowerCase() === tag.query.toLowerCase()
                ? "bg-brand-purple/15 text-brand-purple border-brand-purple/30"
                : "bg-white/[0.02] text-gray-400 border-white/[0.04] hover:text-white hover:bg-white/[0.06] hover:border-white/10"
                }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area: Search Results or Curated Collections */}
      <AnimatePresence mode="wait">
        {activeQuery ? (
          /* Search Results Section */
          <motion.section
            key="search-results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Search Results for <span className="text-brand-purple">"{activeQuery}"</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Found {searchResults.length} articles matching your criteria
                </p>
              </div>
              <button
                onClick={clearSearch}
                className="text-xs text-brand-purple hover:underline font-semibold"
              >
                Back to Explore
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <ExploreInsightSkeleton key={n} />
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((blog) => (
                  <GlassCard key={blog.id} className="flex flex-col h-[400px] hover:border-white/10 hover:bg-bg-card-hover/40 transition-all duration-300 group">
                    {/* Image header */}
                    <Link to={`/post/${blog.id}`} className="h-44 w-full bg-indigo-950/20 relative overflow-hidden shrink-0 cursor-pointer block">
                      {blog.thumbnail ? (
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2664&auto=format&fit=crop"
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30 shadow-sm backdrop-blur-md">
                        {blog.category?.name || "Insight"}
                      </span>
                    </Link>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <Link to={`/post/${blog.id}`} className="space-y-2 block group/link cursor-pointer">
                        <h3 className="text-base font-bold text-white leading-snug group-hover/link:text-brand-purple transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                          {stripHtml(blog.excerpt) || (blog.content ? stripHtml(blog.content).slice(0, 140) + "..." : "No summary available.")}
                        </p>
                      </Link>
                      <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-4 text-xs text-gray-500">
                        <Link
                          to={blog.author?.username ? `/profile/${blog.author.username}` : "#"}
                          className="flex items-center gap-2 group/author cursor-pointer"
                        >
                          {renderAvatar(blog.author, "w-6 h-6")}
                          <span className="text-white font-medium group-hover/author:text-brand-purple transition-colors">{getAuthorName(blog.author)}</span>
                        </Link>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 opacity-60" />
                          <span>{blog.readTime || 5} min read</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/[0.01] rounded-2xl border border-dashed border-border-subtle p-8">
                <p className="text-gray-400 text-sm">No insights found for "{activeQuery}". Try another keyword or check spelling.</p>
                <button
                  onClick={clearSearch}
                  className="mt-4 text-xs text-brand-purple hover:text-brand-purple/80 transition-colors font-bold uppercase tracking-wider"
                >
                  Clear search
                </button>
              </div>
            )}
          </motion.section>
        ) : (
          /* Default Page: Curated Collections & Feed */
          <motion.div
            key="default-explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-16"
          >
            {/* Curated Collections Section */}
            {(loadingExplore || featuredBlog || (popularBlogs && popularBlogs.length > 0)) && (
              <section className="space-y-8">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Curated Collections</h2>
                    <p className="text-sm text-gray-400 mt-1">Hand-picked deep dives from our technical staff.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Large Card */}
                  {loadingExplore ? (
                    <ExploreFeaturedSkeleton className="lg:col-span-2" />
                  ) : featuredBlog ? (
                    <Link to={`/post/${featuredBlog.id}`} className={`${popularBlogs && popularBlogs.length > 0 ? "lg:col-span-2" : "lg:col-span-3"} block group relative`}>
                      <GlassCard className="relative min-h-[480px] md:h-[480px] overflow-hidden flex flex-col-reverse md:flex-row border border-white/5 hover:bg-bg-card-hover/20 transition-colors p-0">
                        {/* Left Column (Text & Details) */}
                        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 relative z-10 md:max-w-[55%]">
                          <div className="space-y-4">
                            <span className="inline-block px-3 py-1 bg-brand-purple/20 text-brand-purple text-[10px] font-bold tracking-widest uppercase rounded-md border border-brand-purple/30 backdrop-blur-md">
                              {featuredBlog.category?.name || "Featured"}
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight group-hover:text-brand-purple transition-colors line-clamp-3">
                              {featuredBlog.title}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                              {stripHtml(featuredBlog.excerpt) || (featuredBlog.content ? stripHtml(featuredBlog.content).slice(0, 180) + "..." : "No summary available.")}
                            </p>
                          </div>
                          
                          <div className="mt-6">
                            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-white/[0.06] group-hover:bg-brand-purple group-hover:text-white border border-white/5 transition-all w-fit cursor-pointer">
                              <BookOpen className="w-4 h-4" />
                              Read Article
                            </div>
                          </div>
                        </div>

                        {/* Right Column (Clean Cover Image) */}
                        <div className="relative w-full md:w-[45%] h-48 md:h-full overflow-hidden flex-shrink-0">
                          <img
                            src={featuredBlog.thumbnail || "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2664&auto=format&fit=crop"}
                            alt={featuredBlog.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                          />
                          {/* Soft edge blending overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-bg-base/20 to-transparent hidden md:block" />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-base/20 to-transparent md:hidden" />
                        </div>
                      </GlassCard>
                    </Link>
                  ) : null}

                  {/* Right Stacked Cards */}
                  {loadingExplore ? (
                    <div className="flex flex-col gap-6">
                      {[1, 2].map((n) => (
                        <ExplorePopularSkeleton key={n} />
                      ))}
                    </div>
                  ) : popularBlogs && popularBlogs.length > 0 ? (
                    <div className={`${featuredBlog ? "lg:col-span-1" : "lg:col-span-3"} flex flex-col gap-6`}>
                      {popularBlogs.map((blog, idx) => (
                        <GlassCard key={blog.id} className="p-6 flex flex-col justify-between h-[228px] hover:bg-bg-card-hover/40 transition-colors border border-white/5 group">
                          <Link to={`/post/${blog.id}`} className="space-y-2.5 block group/link cursor-pointer">
                            <span className="text-[10px] font-bold tracking-wider uppercase text-brand-purple">
                              {blog.category?.name || (idx === 0 ? "Trending" : "Popular")}
                            </span>
                            <h4 className="text-lg font-bold text-white leading-snug transition-colors line-clamp-2 group-hover/link:text-brand-purple">
                              {blog.title}
                            </h4>
                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                              {stripHtml(blog.excerpt) || (blog.content ? stripHtml(blog.content).slice(0, 120) + "..." : "No summary available.")}
                            </p>
                          </Link>
                          <div className="flex items-center justify-between border-t border-border-subtle pt-3 mt-4 text-xs text-gray-500">
                            <Link
                              to={blog.author?.username ? `/profile/${blog.author.username}` : "#"}
                              className="flex items-center gap-2 group/author cursor-pointer"
                            >
                              {renderAvatar(blog.author, "w-6 h-6")}
                              <span className="text-gray-300 group-hover/author:text-brand-purple transition-colors">{getAuthorName(blog.author)}</span>
                            </Link>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 opacity-60" />
                              <span>{blog.readTime || 5} min read</span>
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>
            )}

            {/* General Insights Feed */}
            <section className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Technical Insights</h2>
                <p className="text-sm text-gray-400 mt-1">Browse our latest peer-reviewed documentation and community contributions.</p>
              </div>

              {loadingAll ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <ExploreInsightSkeleton key={n} />
                  ))}
                </div>
              ) : allBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allBlogs.map((blog) => (
                    <GlassCard key={blog.id} className="flex flex-col h-[400px] hover:border-white/10 hover:bg-bg-card-hover/40 transition-all duration-300 group">
                      {/* Image header */}
                      <Link to={`/post/${blog.id}`} className="h-44 w-full bg-indigo-950/20 relative overflow-hidden shrink-0 cursor-pointer block">
                        {blog.thumbnail ? (
                          <img
                            src={blog.thumbnail}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <img
                            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2664&auto=format&fit=crop"
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30 shadow-sm backdrop-blur-md">
                          {blog.category?.name || "Insight"}
                        </span>
                      </Link>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <Link to={`/post/${blog.id}`} className="space-y-2 block group/link cursor-pointer">
                          <h3 className="text-base font-bold text-white leading-snug group-hover/link:text-brand-purple transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                            {stripHtml(blog.excerpt) || (blog.content ? stripHtml(blog.content).slice(0, 140) + "..." : "No summary available.")}
                          </p>
                        </Link>
                        <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-4 text-xs text-gray-500">
                          <Link
                            to={blog.author?.username ? `/profile/${blog.author.username}` : "#"}
                            className="flex items-center gap-2 group/author cursor-pointer"
                          >
                            {renderAvatar(blog.author, "w-6 h-6")}
                            <span className="text-white font-medium group-hover/author:text-brand-purple transition-colors">{getAuthorName(blog.author)}</span>
                          </Link>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 opacity-60" />
                            <span>{blog.readTime || 5} min read</span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/[0.01] rounded-2xl border border-dashed border-border-subtle p-8">
                  <p className="text-gray-500 text-sm">No public insights have been published yet.</p>
                </div>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExplorePage;
