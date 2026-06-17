import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, ArrowRight, Clock, BookOpen } from "lucide-react";
import { blogAPI } from "../lib/api";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import { ExploreFeaturedSkeleton, ExplorePopularSkeleton, ExploreInsightSkeleton } from "../components/ui/Skeleton";

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
      <div className={`${sizeClass} rounded-full border border-white/10 bg-gradient-to-br from-brand-purple/40 to-brand-cyan/30 flex items-center justify-center text-[10px] font-bold text-white`}>
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
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-cyan transition-colors" />
            <input
              type="text"
              placeholder="Search for technical insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-border-subtle focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/25 rounded-2xl py-4 pl-12 pr-40 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
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
              className="!rounded-xl !py-2.5 !px-5 text-xs sm:text-sm bg-gradient-to-r from-brand-cyan to-brand-purple hover:opacity-90 transition-all font-semibold"
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
                ? "bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30"
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
                  Search Results for <span className="text-brand-cyan">"{activeQuery}"</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Found {searchResults.length} articles matching your criteria
                </p>
              </div>
              <button
                onClick={clearSearch}
                className="text-xs text-brand-cyan hover:underline font-semibold"
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
                      <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 shadow-sm backdrop-blur-md">
                        {blog.category?.name || "Insight"}
                      </span>
                    </Link>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <Link to={`/post/${blog.id}`} className="space-y-2 block group/link cursor-pointer">
                        <h3 className="text-base font-bold text-white leading-snug group-hover/link:text-brand-cyan transition-colors line-clamp-2">
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
                          <span className="text-white font-medium group-hover/author:text-brand-cyan transition-colors">{getAuthorName(blog.author)}</span>
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
                  className="mt-4 text-xs text-brand-purple hover:text-brand-cyan transition-colors font-bold uppercase tracking-wider"
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
            <section className="space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Curated Collections</h2>
                  <p className="text-sm text-gray-400 mt-1">Hand-picked deep dives from our technical staff.</p>
                </div>
                <button
                  onClick={() => handleTagClick("System Design")}
                  className="text-xs text-brand-cyan hover:text-brand-blue flex items-center gap-1 font-semibold transition-colors"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Large Card */}
                {loadingExplore ? (
                  <ExploreFeaturedSkeleton className="lg:col-span-2" />
                ) : featuredBlog ? (
                  <Link to={`/post/${featuredBlog.id}`} className="lg:col-span-2 block group relative">
                    <GlassCard className="relative h-[480px] overflow-hidden flex flex-col justify-end p-8 border border-white/5 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent">
                      {/* Visual coding background layer */}
                      <img
                        src={featuredBlog.thumbnail || "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2664&auto=format&fit=crop"}
                        alt={featuredBlog.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-[1.02] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-bg-base/30 to-transparent" />

                      <div className="relative space-y-4">
                        <span className="inline-block px-3 py-1 bg-brand-cyan/20 text-brand-cyan text-[10px] font-bold tracking-widest uppercase rounded-md border border-brand-cyan/30 backdrop-blur-md">
                          {featuredBlog.category?.name || "Featured"}
                        </span>
                        <h3 className="text-3xl font-extrabold text-white leading-tight tracking-tight group-hover:text-brand-cyan transition-colors line-clamp-2">
                          {featuredBlog.title}
                        </h3>
                        <p className="text-gray-300 text-sm max-w-xl leading-relaxed line-clamp-2">
                          {stripHtml(featuredBlog.excerpt) || (featuredBlog.content ? stripHtml(featuredBlog.content).slice(0, 180) + "..." : "No summary available.")}
                        </p>
                        <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-white/[0.06] hover:bg-brand-cyan hover:text-black border border-white/5 transition-all w-fit cursor-pointer">
                          <BookOpen className="w-4 h-4" />
                          Read Article
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                ) : (
                  <div className="lg:col-span-2 block group relative">
                    <GlassCard className="relative h-[480px] overflow-hidden flex flex-col justify-end p-8 border border-white/5 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent">
                      <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                        alt="Memory Safety"
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-[1.02] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-bg-base/30 to-transparent" />

                      <div className="relative space-y-4">
                        <span className="inline-block px-3 py-1 bg-brand-cyan/20 text-brand-cyan text-[10px] font-bold tracking-widest uppercase rounded-md border border-brand-cyan/30 backdrop-blur-md">
                          Series
                        </span>
                        <h3 className="text-3xl font-extrabold text-white leading-tight tracking-tight group-hover:text-brand-cyan transition-colors">
                          Mastering Memory Safety in Embedded Systems
                        </h3>
                        <p className="text-gray-300 text-sm max-w-xl leading-relaxed">
                          An exhaustive 12-part exploration into zero-cost abstractions and modern memory management.
                        </p>
                        <button
                          onClick={() => handleTagClick("Rust")}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-white/[0.06] hover:bg-brand-cyan hover:text-black border border-white/5 transition-all w-fit cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          Start Series
                        </button>
                      </div>
                    </GlassCard>
                  </div>
                )}

                {/* Right Stacked Cards */}
                <div className="flex flex-col gap-6">
                  {loadingExplore ? (
                    [1, 2].map((n) => (
                      <ExplorePopularSkeleton key={n} />
                    ))
                  ) : popularBlogs && popularBlogs.length > 0 ? (
                    popularBlogs.map((blog, idx) => (
                      <GlassCard key={blog.id} className="p-6 flex flex-col justify-between h-[228px] hover:bg-bg-card-hover/40 transition-colors border border-white/5 group">
                        <Link to={`/post/${blog.id}`} className="space-y-2.5 block group/link cursor-pointer">
                          <span className={`text-[10px] font-bold tracking-wider uppercase ${idx === 0 ? "text-brand-purple" : "text-brand-cyan"}`}>
                            {blog.category?.name || (idx === 0 ? "Trending" : "Popular")}
                          </span>
                          <h4 className={`text-lg font-bold text-white leading-snug transition-colors line-clamp-2 ${idx === 0 ? "group-hover/link:text-brand-purple" : "group-hover/link:text-brand-cyan"}`}>
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
                            <span className="text-gray-300 group-hover/author:text-brand-cyan transition-colors">{getAuthorName(blog.author)}</span>
                          </Link>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 opacity-60" />
                            <span>{blog.readTime || 5} min read</span>
                          </div>
                        </div>
                      </GlassCard>
                    ))
                  ) : (
                    <>
                      {/* Card 1 Fallback */}
                      <GlassCard className="p-6 flex flex-col justify-between h-[228px] hover:bg-bg-card-hover/40 transition-colors border border-white/5 group">
                        <div className="space-y-2.5">
                          <span className="text-[10px] font-bold tracking-wider text-brand-purple uppercase">
                            Rising Star
                          </span>
                          <h4 className="text-lg font-bold text-white leading-snug group-hover:text-brand-purple transition-colors">
                            The Quantum Web
                          </h4>
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            How entanglement might redefine the HTTP protocol by 2030.
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-border-subtle pt-3 mt-4 text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-brand-purple/20 border border-brand-purple flex items-center justify-center text-[10px] font-bold text-white">AC</div>
                            <span className="text-gray-300">Alex Chen</span>
                          </div>
                          <span>8 min read</span>
                        </div>
                      </GlassCard>

                      {/* Card 2 Fallback */}
                      <GlassCard className="p-6 flex flex-col justify-between h-[228px] hover:bg-bg-card-hover/40 transition-colors border border-white/5 group">
                        <div className="space-y-2.5">
                          <span className="text-[10px] font-bold tracking-wider text-brand-cyan uppercase">
                            Case Study
                          </span>
                          <h4 className="text-lg font-bold text-white leading-snug group-hover:text-brand-cyan transition-colors">
                            Scaling to 10M RPM
                          </h4>
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            Lessons from the infrastructure overhaul of Titan Labs.
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-border-subtle pt-3 mt-4 text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-brand-cyan/20 border border-brand-cyan flex items-center justify-center text-[10px] font-bold text-white">SJ</div>
                            <span className="text-gray-300">Sarah Jenkins</span>
                          </div>
                          <span>15 min read</span>
                        </div>
                      </GlassCard>
                    </>
                  )}
                </div>
              </div>
            </section>

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
                        <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 shadow-sm backdrop-blur-md">
                          {blog.category?.name || "Insight"}
                        </span>
                      </Link>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <Link to={`/post/${blog.id}`} className="space-y-2 block group/link cursor-pointer">
                          <h3 className="text-base font-bold text-white leading-snug group-hover/link:text-brand-cyan transition-colors line-clamp-2">
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
                            <span className="text-white font-medium group-hover/author:text-brand-cyan transition-colors">{getAuthorName(blog.author)}</span>
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
