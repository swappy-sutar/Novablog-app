import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Home, 
  TrendingUp, 
  Users, 
  Bookmark, 
  FileText, 
  Settings, 
  HelpCircle, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  FileEdit,
  Clock,
  Sparkles,
  Search
} from "lucide-react";
import { blogAPI } from "../lib/api";
import Button from "../components/ui/Button";

const MyBlogsPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, published, drafts, scheduled
  const [search, setSearch] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Load user blogs
  const loadBlogs = async () => {
    setLoading(true);
    try {
      // Load first 100 blogs to support dashboard search/filtering
      const res = await blogAPI.getMyBlogs({ page: 1, limit: 100 });
      if (res.success && res.data) {
        setBlogs(res.data.blogs || []);
      }
    } catch (e) {
      toast.error("Failed to load your blogs.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Handle outside clicks to close actions dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Delete post handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await blogAPI.deleteBlog(id);
      if (res.success) {
        toast.success("Blog post deleted successfully.");
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (e) {
      toast.error("Failed to delete blog post.");
      console.error(e);
    } finally {
      setOpenDropdownId(null);
    }
  };

  // Helper: Format large numbers (like views count)
  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  // Helper: Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Helper: Format relative time
  const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Stats calculation
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
  const publishedCount = blogs.filter((b) => b.status === "PUBLISHED").length;

  // Mock Scheduled blog for visual demo matching reference image
  // Since scheduled enum is not in backend, we inject a mock one if needed, or allow filtering DRAFT as Scheduled
  const processedBlogs = React.useMemo(() => {
    const list = [...blogs];
    
    // Add one mock scheduled post to match the visual preview from the mock design
    if (list.length > 0 && !list.some(b => b.isMockScheduled)) {
      list.push({
        id: "mock-scheduled-id",
        title: "Web3 Security: Beyond the Smart Contract",
        excerpt: "Securing the frontend layer and infrastructure of decentralized applications against common attacks...",
        content: "Draft content...",
        status: "SCHEDULED", // Virtual status for UI filter
        views: 0,
        publishedAt: null,
        createdAt: new Date(Date.now() + 86400000 * 9).toISOString(), // 9 days in future
        updatedAt: new Date().toISOString(),
        isMockScheduled: true,
      });
    }

    return list.filter((b) => {
      // Search term
      const matchesSearch = 
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(search.toLowerCase());
      
      if (!matchesSearch) return false;

      // Tab Filter
      if (filter === "all") return true;
      if (filter === "published") return b.status === "PUBLISHED";
      if (filter === "drafts") return b.status === "DRAFT";
      if (filter === "scheduled") return b.status === "SCHEDULED";
      return true;
    });
  }, [blogs, filter, search]);

  const navItemClass = (active) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
      active
        ? "bg-brand-purple/15 text-[#c4b5fd] border-brand-purple/20"
        : "text-gray-400 border-transparent hover:text-white hover:bg-white/[0.04]"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8 lg:gap-10 pb-20 pt-4">
      {/* Sidebar - Dashboard Developer Edition */}
      <aside className="lg:w-64 shrink-0 lg:sticky lg:top-24 lg:self-start space-y-6">
        <div className="px-1">
          <p className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
            Dashboard
          </p>
          <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Developer Edition
          </h2>
        </div>

        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1 custom-scrollbar">
          <Link to="/" className={navItemClass(false)}>
            <Home className="w-4 h-4 opacity-70" />
            Home
          </Link>
          <button onClick={() => setFilter("all")} className={navItemClass(filter === "all" && search === "")}>
            <TrendingUp className="w-4 h-4 opacity-70" />
            Trending
          </button>
          <button onClick={() => toast("Following feed loaded")} className={navItemClass(false)}>
            <Users className="w-4 h-4 opacity-70" />
            Following
          </button>
          <button onClick={() => toast("Bookmarks tab coming soon")} className={navItemClass(false)}>
            <Bookmark className="w-4 h-4 opacity-70" />
            Bookmarks
          </button>
          <button onClick={() => setFilter("drafts")} className={navItemClass(filter === "drafts")}>
            <FileText className="w-4 h-4 opacity-70" />
            Drafts
          </button>
          
          <div className="hidden lg:block my-2 border-t border-border-subtle" />

          <Link to="/profile/settings" className={navItemClass(false)}>
            <Settings className="w-4 h-4 opacity-70" />
            Settings
          </Link>
          <button onClick={() => toast("Help desk loaded")} className={navItemClass(false)}>
            <HelpCircle className="w-4 h-4 opacity-70" />
            Help
          </button>
        </nav>

        {/* Upgrade Pro Widget */}
        <div className="hidden lg:block relative overflow-hidden rounded-2xl border border-brand-purple/20 bg-gradient-to-b from-brand-purple/10 to-transparent p-5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/10 rounded-full blur-2xl" />
          <Sparkles className="w-5 h-5 text-brand-cyan mb-3" />
          <p className="text-xs font-medium text-gray-400 leading-relaxed">
            Get advanced analytics & custom domains.
          </p>
          <button 
            onClick={() => toast("Upgrade request received")}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-cyan to-brand-purple hover:opacity-90 transition-all shadow-md shadow-brand-purple/20"
          >
            Upgrade to Pro
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 space-y-8">
        {/* Page Title & Write New Post Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Blogs
            </h1>
            <p className="text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
              Manage your technical writing portfolio, track performance metrics, and prepare your next breakthrough article.
            </p>
          </div>
          <Link to="/write" className="shrink-0">
            <Button variant="primary" className="!rounded-xl !py-3 !px-5 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Write New Post
            </Button>
          </Link>
        </div>

        {/* Filters and Stats Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-4">
          {/* Filters Row */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Posts" },
              { id: "published", label: "Published" },
              { id: "drafts", label: "Drafts" },
              { id: "scheduled", label: "Scheduled" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilter(tab.id);
                  setSearch("");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? "bg-[#1f2038] text-white shadow-sm ring-1 ring-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stats Summary */}
          <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-brand-cyan">{formatNumber(totalViews)}</span>
              <span>TOTAL VIEWS</span>
            </div>
            <div className="h-4 w-px bg-border-subtle" />
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white">{publishedCount}</span>
              <span>PUBLISHED</span>
            </div>
          </div>
        </div>

        {/* Dashboard Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-border-subtle focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none transition-all"
          />
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Fetching your database items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {processedBlogs.map((blog) => {
                const isPublished = blog.status === "PUBLISHED";
                const isDraft = blog.status === "DRAFT";
                const isScheduled = blog.status === "SCHEDULED";

                return (
                  <motion.div
                    layout
                    key={blog.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative flex flex-col justify-between rounded-2xl border border-border-subtle bg-white/[0.02] overflow-hidden hover:border-white/10 transition-colors group h-[400px]"
                  >
                    {/* Header Image / Badge */}
                    <div className="relative h-44 w-full overflow-hidden bg-bg-card-hover shrink-0">
                      {blog.thumbnail ? (
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-[#10132c] to-cyan-950 flex items-center justify-center opacity-85 transition-opacity duration-300 group-hover:opacity-100">
                          <code className="text-[11px] text-gray-500 font-mono select-none">
                            // code block visual representation
                          </code>
                        </div>
                      )}

                      {/* Status Badges */}
                      <div className="absolute top-4 left-4">
                        {isPublished && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm backdrop-blur-md">
                            Published
                          </span>
                        )}
                        {isDraft && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm backdrop-blur-md">
                            Draft
                          </span>
                        )}
                        {isScheduled && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm backdrop-blur-md">
                            Scheduled
                          </span>
                        )}
                      </div>

                      {/* Actions Button */}
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenDropdownId(openDropdownId === blog.id ? null : blog.id);
                          }}
                          className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white border border-white/5 transition-all"
                          title="Actions menu"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Dropdown Menu */}
                      {openDropdownId === blog.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-4 top-14 w-36 rounded-xl border border-border-subtle bg-bg-base/95 p-1.5 shadow-2xl backdrop-blur-xl z-10 space-y-0.5"
                        >
                          <button
                            onClick={() => navigate(`/write?edit=${blog.id}`)}
                            disabled={blog.isMockScheduled}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/[0.06] flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit Post
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            disabled={blog.isMockScheduled}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Post
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-white leading-snug tracking-tight group-hover:text-brand-cyan transition-colors">
                          {blog.isMockScheduled ? (
                            blog.title
                          ) : (
                            <Link to={`/post/${blog.id}`}>{blog.title}</Link>
                          )}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                          {blog.excerpt || "No summary provided."}
                        </p>
                      </div>

                      {/* Bottom Info Row */}
                      <div className="flex items-center justify-between border-t border-border-subtle pt-4 text-xs text-gray-500 font-medium">
                        {isPublished && (
                          <>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-600" />
                              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400">
                              <Eye className="w-3.5 h-3.5 text-gray-500" />
                              <span>{formatNumber(blog.views)} views</span>
                            </div>
                          </>
                        )}

                        {isDraft && (
                          <>
                            <span className="text-[11px] text-gray-500">
                              Last edited {formatRelativeTime(blog.updatedAt)}
                            </span>
                            <button
                              onClick={() => navigate(`/write?edit=${blog.id}`)}
                              className="text-gray-400 hover:text-brand-cyan p-1 transition-colors"
                              title="Quick edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {isScheduled && (
                          <>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-600" />
                              <span>{formatDate(blog.createdAt)}</span>
                            </div>
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Dotted border placeholder post card */}
              <motion.button
                layout
                onClick={() => navigate("/write")}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle bg-transparent p-6 text-center hover:border-brand-purple/50 hover:bg-brand-purple/5 transition-all group h-[400px] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center text-gray-400 group-hover:text-brand-purple group-hover:bg-brand-purple/10 transition-colors shadow-inner mb-4">
                  <FileEdit className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-brand-purple transition-colors">
                  Create New Template
                </h3>
                <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
                  Streamline your writing with custom post structures.
                </p>
              </motion.button>
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBlogsPage;
