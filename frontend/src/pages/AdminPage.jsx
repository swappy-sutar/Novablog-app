import { useState, useEffect, useRef } from "react";
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
  Search,
  LayoutDashboard,
  Activity,
  ShieldAlert,
  Cpu,
  LogOut,
  Globe,
  DollarSign,
  Gauge,
  Shield,
  HardDrive,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Pause,
  ChevronDown,
  Mail,
  UserCheck,
  UserX,
} from "lucide-react";
import { blogAPI, authAPI, adminAPI } from "../lib/api";
import Button from "../components/ui/Button";
import { ExploreInsightSkeleton as SkeletonCard } from "../components/ui/Skeleton";

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

const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [displayBlogs, setDisplayBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, published, drafts, scheduled
  const [search, setSearch] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Layout states
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, analytics, content, moderation, system, users
  const [currentUser, setCurrentUser] = useState(null);

  // Interactive dashboard states
  const [timeRange, setTimeRange] = useState("real-time"); // real-time, 24h, 7d
  const [hoveredNode, setHoveredNode] = useState(null);
  const [chartHoverData, setChartHoverData] = useState(null);

  // Console logs for System Health tab
  const [consoleLogs, setConsoleLogs] = useState([
    "[SYS] Starting compilation in watch mode...",
    "[SYS] NestJS application successfully bootstrapped.",
    "[DB] Prisma client successfully generated.",
    "[DB] Connected to PostgreSQL instance at db:5432.",
    "[REDIS] Connection established with Redis on host redis:6379.",
    "[SYS] Server listening on port 3000.",
  ]);
  const consoleContainerRef = useRef(null);
  const isAtBottomRef = useRef(true);
  const [isLogPaused, setIsLogPaused] = useState(false);
  const [pingingServices, setPingingServices] = useState({});

  const handleConsoleScroll = (e) => {
    const container = e.currentTarget;
    // Check if the user is near the bottom (within 15px threshold)
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 15;
    isAtBottomRef.current = isAtBottom;
  };

  const handlePingService = (idx, name) => {
    setPingingServices((prev) => ({ ...prev, [idx]: true }));
    
    // Simulate network delay
    setTimeout(() => {
      const latencies = {
        0: Math.floor(Math.random() * 12) + 4, // NestJS
        1: Math.floor(Math.random() * 5) + 1,  // PostgreSQL
        2: Math.floor(Math.random() * 2) + 1,  // Redis
        3: Math.floor(Math.random() * 20) + 10 // BullMQ
      };
      const latency = latencies[idx] || (Math.floor(Math.random() * 15) + 5);
      
      toast.success(`${name} connected. Latency: ${latency}ms`, {
        style: {
          background: '#0c0c1e',
          color: '#fff',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          fontSize: '11px',
          fontWeight: 'bold',
        },
        iconTheme: {
          primary: '#06b6d4',
          secondary: '#0c0c1e',
        }
      });
      
      setPingingServices((prev) => ({ ...prev, [idx]: false }));
    }, 1000);
  };

  // Moderation state
  const [flaggedPosts, setFlaggedPosts] = useState([]);

  // Users state
  const [userList, setUserList] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      if (res.success && res.data) {
        setUserList(res.data.users || []);
      }
    } catch (e) {
      console.error("Failed to load users", e);
    }
  };

  const loadModerationQueue = async () => {
    try {
      const res = await adminAPI.getModerationQueue();
      if (res.success && res.data) {
        setFlaggedPosts(res.data.flaggedPosts || []);
      }
    } catch (e) {
      console.error("Failed to load moderation queue", e);
    }
  };

  // Load all blogs on the platform for global administration
  const loadAllBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogAPI.getAllBlogs({ page: 1, limit: 100 });
      if (res.success && res.data) {
        setBlogs(res.data.blogs || []);
        setDisplayBlogs(res.data.blogs || []);
      }
    } catch (e) {
      toast.error("Failed to load platform blogs.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllBlogs();
    
    // Sync current user from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error(err);
      }
    }

    // Listen to click outside dropdowns
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Fetch tab specific administrative data
  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "moderation") {
      loadModerationQueue();
    }
  }, [activeTab]);

  // Live log generator for System Health tab
  useEffect(() => {
    if (activeTab !== "system" || isLogPaused) return;
    const mockLogs = [
      "[INFO] Connection established on db:5432",
      "[JOB] Sent weekly digest email to 24,812 subscribers",
      "[REDIS] Cache hit for blog:get-blog:mock-scheduled-id",
      "[INFO] GET /api/v1/blog/get-all-blogs 200 OK - 18ms",
      "[REDIS] Cache write for analytics:dashboard:summary",
      "[SYS] Health check ping from load-balancer - 200 OK",
      "[WARN] Database connection pool reached 8 active connections",
      "[INFO] POST /api/v1/comments/create-comment/104 201 Created - 45ms",
      "[JOB] Completed processing avatar resize job for user:elena",
    ];

    const interval = setInterval(() => {
      const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
      const timestamp = new Date().toLocaleTimeString();
      setConsoleLogs((prev) => [...prev, `[${timestamp}] ${randomLog}`].slice(-25));
    }, 2500);

    return () => clearInterval(interval);
  }, [activeTab, isLogPaused]);

  // Automatically scroll console to bottom on tab activation
  useEffect(() => {
    if (activeTab === "system" && consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
      isAtBottomRef.current = true;
    }
  }, [activeTab]);

  // Handle auto-scrolling on new logs only if the user was already at the bottom
  useEffect(() => {
    if (activeTab === "system" && consoleContainerRef.current && isAtBottomRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  const handleLogout = () => {
    authAPI.logout();
    toast.success("Successfully logged out.");
    navigate("/signin");
  };

  // Blog operations (Admin override capabilities)
  const handleToggleStatus = async (blogId, currentStatus) => {
    const nextStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await blogAPI.updateBlog(blogId, { status: nextStatus });
      if (res.success) {
        toast.success(`Post status updated to ${nextStatus.toLowerCase()}.`);
        loadAllBlogs();
      }
    } catch (e) {
      toast.error("Failed to update post status.");
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this post as an administrator?")) return;
    try {
      const res = await blogAPI.deleteBlog(blogId);
      if (res.success) {
        toast.success("Post successfully deleted.");
        loadAllBlogs();
      }
    } catch (e) {
      toast.error("Failed to delete post.");
    }
  };

  // Moderation operations
  const handleApprovePost = async (id, title) => {
    try {
      const res = await adminAPI.approvePost(id);
      if (res.success) {
        toast.success(`Approved "${title}". Restored to public feed.`);
        loadModerationQueue();
      }
    } catch (e) {
      toast.error("Failed to approve post.");
    }
  };

  const handleRejectPost = async (id, title) => {
    try {
      const res = await adminAPI.rejectPost(id);
      if (res.success) {
        toast.error(`Rejected "${title}". Permanently deleted.`);
        loadModerationQueue();
      }
    } catch (e) {
      toast.error("Failed to reject post.");
    }
  };

  // User management operations
  const handleToggleUserStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    try {
      const res = await adminAPI.toggleUserStatus(id, nextStatus);
      if (res.success) {
        if (nextStatus === "Active") {
          toast.success("User account activated successfully.");
        } else {
          toast.error("User account suspended.");
        }
        loadUsers();
      }
    } catch (e) {
      toast.error("Failed to update user status.");
    }
  };

  const handleChangeUserRole = async (id, newRole) => {
    try {
      const res = await adminAPI.changeUserRole(id, newRole);
      if (res.success) {
        toast.success(`Role updated to ${newRole}.`);
        loadUsers();
      }
    } catch (e) {
      toast.error("Failed to update user role.");
    }
  };

  // Stats calculation
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
  const publishedCount = blogs.filter((b) => b.status === "PUBLISHED").length;

  // Users calculations
  const totalUsersCount = userList.length;
  const activeAuthorsCount = userList.filter((u) => u.role === "Author" && u.status === "Active").length;
  const staffCount = userList.filter((u) => u.role === "Admin" || u.role === "Editor").length;
  const suspendedCount = userList.filter((u) => u.status === "Suspended").length;

  const filteredUserList = userList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Process blogs filter (specifically for Content tab)
  const processedBlogs = (() => {
    return blogs.filter((b) => {
      const matchesSearch =
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === "published") return b.status === "PUBLISHED";
      if (filter === "drafts") return b.status === "DRAFT";
      if (filter === "scheduled") return b.status === "SCHEDULED";
      return true;
    });
  })();

  // World map nodes configuration
  const mapNodes = [
    { id: "na-west", name: "US West (Seattle)", cx: 70, cy: 50, ping: "14ms", load: "34%" },
    { id: "na-east", name: "US East (New York)", cx: 105, cy: 62, ping: "18ms", load: "55%" },
    { id: "sa-east", name: "SA East (Sao Paulo)", cx: 120, cy: 115, ping: "85ms", load: "28%" },
    { id: "eu-west", name: "EU West (London)", cx: 175, cy: 45, ping: "12ms", load: "74%" },
    { id: "eu-central", name: "EU Central (Frankfurt)", cx: 190, cy: 50, ping: "18ms", load: "62%" },
    { id: "af-south", name: "AF South (Cape Town)", cx: 195, cy: 120, ping: "92ms", load: "12%" },
    { id: "as-south", name: "AP South (Mumbai)", cx: 245, cy: 78, ping: "42ms", load: "48%" },
    { id: "as-southeast", name: "AP Southeast (Singapore)", cx: 260, cy: 95, ping: "38ms", load: "67%" },
    { id: "as-east", name: "AP East (Tokyo)", cx: 298, cy: 58, ping: "45ms", load: "51%" },
    { id: "oc-east", name: "AP Oceania (Sydney)", cx: 310, cy: 130, ping: "64ms", load: "22%" },
  ];

  // spline chart hover interaction
  const handleChartMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    
    // Sample data calculation based on hover position
    const index = Math.round(percentage * 6);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const views = [4200, 5800, 4900, 7200, 8100, 6400, 9400];
    const conversions = [320, 450, 390, 510, 680, 520, 890];
    
    setChartHoverData({
      x: percentage * width,
      day: days[index],
      views: views[index],
      conversions: conversions[index],
    });
  };

  const handleChartMouseLeave = () => {
    setChartHoverData(null);
  };

  const navItemClass = (active) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors border text-left cursor-pointer shrink-0 ${
      active
        ? "bg-brand-purple/15 text-brand-purple border-brand-purple/20"
        : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-bg-card-sub"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8 lg:gap-10 pb-20 pt-12">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 lg:self-start space-y-6">
        
        {/* Header (Visual card for terminal architecture) */}
        <div className="px-1">
          <p className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
            Admin Panel
          </p>
          <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Systems Terminal
          </h2>
        </div>

        {/* Terminal Info Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-bg-card-sub border border-border-subtle shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-bg-card border border-border-subtle flex items-center justify-center text-brand-cyan">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wide">Terminal</h3>
            <p className="text-[10px] text-gray-500 font-semibold tracking-tight mt-0.5">v2.0 Architecture</p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1 custom-scrollbar">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "analytics", label: "Analytics", icon: Activity },
            { id: "content", label: "Content", icon: FileText },
            { id: "moderation", label: "Moderation", icon: ShieldAlert },
            { id: "system", label: "System Health", icon: Cpu },
            { id: "users", label: "Users", icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={navItemClass(isActive)}
              >
                <Icon className={`w-4 h-4 ${isActive ? "opacity-100" : "opacity-70"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Upgrade Cluster Card */}
        <div className="hidden lg:block relative overflow-hidden rounded-2xl border border-brand-purple/20 bg-gradient-to-b from-brand-purple/10 to-transparent p-5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-2 text-brand-cyan mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-extrabold tracking-wider uppercase">Upgrade Cluster</span>
          </div>
          <p className="text-xs font-medium text-gray-400 leading-relaxed">
            Unlock advanced neural analytics & custom hostnames.
          </p>
          <button
            onClick={() => toast.success("Cluster upgrade request submitted.")}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-purple hover:opacity-90 transition-all shadow-md shadow-brand-purple/20 cursor-pointer"
          >
            Upgrade Cluster
          </button>
        </div>

        {/* Quick Docs & Logout links */}
        <div className="flex flex-col gap-1 border-t border-border-subtle pt-4">
          <Link
            to="/about"
            className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors"
          >
            <HelpCircle className="w-4 h-4 opacity-70" />
            <span>Docs</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-red-400/80 hover:text-red-400 transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4 opacity-70" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN DISPLAY AREA */}
      <main className="flex-1 min-w-0 space-y-8">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: SYSTEMS OVERVIEW (DASHBOARD) */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Dashboard Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Systems Overview
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-extrabold tracking-wider text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                    <span className="text-emerald-500">ALL NODES OPERATIONAL</span>
                    <span className="text-white/20">•</span>
                    <span>UPTIME: 99.998%</span>
                  </div>
                </div>

                {/* Time selectors */}
                <div className="flex bg-border-subtle/30 border border-border-subtle p-1 rounded-xl shadow-inner">
                  {[
                    { id: "real-time", label: "Real-time" },
                    { id: "24h", label: "24 Hours" },
                    { id: "7d", label: "7 Days" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setTimeRange(item.id);
                        toast(`Dashboard telemetry synced for ${item.label}`);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        timeRange === item.id
                          ? "bg-white/[0.08] text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dashboard Layout Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Column (Wide Widgets) */}
                <div className="xl:col-span-2 space-y-8">
                  
                  {/* Global Network Traffic Map */}
                  <div className="relative border border-border-subtle bg-bg-card backdrop-blur-xl p-6 rounded-2xl flex flex-col h-[320px] justify-between overflow-hidden shadow-sm hover:bg-bg-card-hover transition-colors duration-350">
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <h3 className="text-xs font-bold text-white tracking-wide uppercase">Global Network Traffic</h3>
                        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Live egress/ingress visualization across 10 node regions</p>
                      </div>
                      <button className="w-8 h-8 rounded-lg bg-bg-card-sub border border-border-subtle flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <Globe className="w-4 h-4" />
                      </button>
                    </div>

                    {/* SVG World Map Vector Representation */}
                    <div className="absolute inset-0 flex items-center justify-center p-8 mt-8">
                       <svg viewBox="0 0 380 180" className="w-full h-full opacity-90 select-none z-0">
                        {/* Dotted Coordinate Grid Background and High-Tech Landmass Dot Matrix Pattern */}
                        <defs>
                          <pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse">
                            <circle cx="1" cy="1" r="0.6" className="fill-border-subtle" />
                          </pattern>
                          <pattern id="land-dots" width="3.2" height="3.2" patternUnits="userSpaceOnUse">
                            <circle cx="1.6" cy="1.6" r="0.9" className="fill-brand-cyan" opacity="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* High-Tech Dot Matrix Continent Outlines */}
                        {/* North America */}
                        <path d="M 25,35 C 30,30 45,25 60,25 C 70,25 75,20 85,20 C 95,20 100,25 105,28 C 112,32 110,40 115,45 C 120,48 118,52 115,55 C 105,58 102,52 98,62 C 95,68 96,78 92,80 C 88,82 84,72 82,68 C 80,66 76,68 74,74 C 72,80 66,85 64,90 C 60,95 55,100 52,98 C 48,96 52,88 50,84 C 48,80 44,78 40,76 C 36,74 38,68 36,65 C 34,62 30,62 28,58 C 26,54 22,54 20,50 C 18,46 20,40 25,35 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* Greenland */}
                        <path d="M 118,15 C 125,12 135,12 142,15 C 145,20 140,28 135,32 C 128,35 120,30 118,15 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* Iceland */}
                        <path d="M 148,26 C 150,24 153,26 152,30 C 150,32 147,30 148,26 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* South America */}
                        <path d="M 82,96 C 88,96 95,100 102,105 C 110,110 118,115 120,122 C 122,130 118,138 114,145 C 110,152 104,160 98,168 C 96,171 94,171 93,168 C 91,162 89,152 87,144 C 85,136 81,128 79,120 C 77,112 76,104 82,96 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* Africa */}
                        <path d="M 152,78 C 158,74 170,72 182,72 C 188,72 195,70 200,75 C 204,78 202,84 204,88 C 206,92 210,95 212,100 C 214,105 212,112 210,118 C 206,126 202,134 198,142 C 195,148 190,154 187,156 C 185,158 183,158 182,154 C 180,148 180,138 177,130 C 174,122 170,116 165,110 C 160,104 154,100 150,94 C 146,88 148,82 152,78 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* Madagascar */}
                        <path d="M 212,125 C 215,122 218,125 217,132 C 215,138 211,142 209,140 C 208,138 210,130 212,125 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* Europe & Asia */}
                        <path d="M 145,68 C 142,65 142,58 145,55 C 148,52 152,54 155,50 C 158,46 155,38 160,32 C 165,26 172,22 178,20 C 184,18 190,24 188,30 C 186,36 192,38 198,34 C 204,30 212,28 220,28 C 235,28 250,25 265,25 C 280,25 295,22 310,22 C 325,22 335,24 342,28 C 345,30 342,36 340,42 C 338,48 335,54 336,58 C 337,62 332,60 328,62 C 324,64 320,68 316,72 C 312,76 308,82 302,80 C 296,78 298,72 294,70 C 290,68 286,72 282,76 C 278,80 278,88 275,94 C 272,100 274,106 271,108 C 268,110 265,106 263,102 C 261,98 260,94 256,92 C 252,90 250,94 247,98 C 244,102 241,102 239,98 C 237,94 238,88 234,86 C 230,84 226,88 222,92 C 218,96 212,98 208,95 C 204,92 208,86 206,82 C 204,78 198,78 194,78 C 190,78 185,82 178,82 C 172,82 168,76 164,74 C 160,72 155,74 150,74 C 145,74 148,70 145,68 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* Great Britain & Ireland */}
                        <path d="M 140,42 C 142,38 146,38 148,42 C 150,46 148,52 144,52 C 141,52 138,46 140,42 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* Sri Lanka */}
                        <path d="M 248,105 C 249,104 251,105 250,108 C 249,110 247,109 248,105 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* Japan */}
                        <path d="M 324,54 C 326,50 329,54 328,60 C 327,66 323,72 321,70 C 320,68 322,58 324,54 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* Sumatra */}
                        <path d="M 260,105 L 268,112 L 265,115 L 257,108 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* Borneo */}
                        <path d="M 272,108 C 275,106 278,110 277,115 C 275,118 270,116 272,108 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* New Guinea */}
                        <path d="M 285,118 C 288,115 292,118 290,122 C 288,124 283,122 285,118 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* Philippines */}
                        <path d="M 282,92 C 284,90 286,94 284,98 L 282,100 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* Australia */}
                        <path d="M 288,118 C 294,114 304,112 312,112 C 320,112 325,116 325,122 C 325,128 322,134 318,136 C 314,138 310,135 306,138 C 302,141 298,142 294,139 C 290,136 288,130 286,125 C 284,120 284,118 288,118 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />
                        {/* New Zealand */}
                        <path d="M 334,142 C 336,138 338,142 337,148 C 336,154 332,158 331,156 C 330,154 332,146 334,142 Z" fill="url(#land-dots)" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.45" />

                        {/* Interactive Network Traffic Connection Arcs */}
                        <g stroke="rgba(6, 182, 212, 0.22)" strokeWidth="1" fill="none">
                          <path d="M 70,50 Q 120,20 175,45" className="stroke-dasharray-4 animate-[dash_10s_linear_infinite]" strokeDasharray="5,5" />
                          <path d="M 105,62 Q 150,90 245,78" strokeDasharray="5,5" />
                          <path d="M 175,45 Q 230,40 298,58" strokeDasharray="3,3" />
                          <path d="M 245,78 Q 280,100 310,130" strokeDasharray="5,5" />
                          <path d="M 120,115 Q 150,130 195,120" strokeDasharray="4,4" />
                        </g>

                        {/* Node pulses and markers */}
                        {mapNodes.map((node) => (
                          <g
                            key={node.id}
                            onMouseEnter={() => setHoveredNode(node)}
                            onMouseLeave={() => setHoveredNode(null)}
                            className="cursor-pointer group"
                          >
                            {/* Pulsing Outer Circle */}
                            <circle
                              cx={node.cx}
                              cy={node.cy}
                              r="5"
                              className="fill-brand-cyan/20 stroke-brand-cyan/40 stroke-1 group-hover:scale-150 transition-transform origin-center"
                            />
                            <circle
                              cx={node.cx}
                              cy={node.cy}
                              r="8"
                              className="fill-none stroke-brand-cyan/10 stroke-1 animate-ping origin-center"
                              style={{ animationDuration: "3s" }}
                            />
                            {/* Center Dot */}
                            <circle
                              cx={node.cx}
                              cy={node.cy}
                              r="2.5"
                              className="fill-brand-cyan shadow-[0_0_8px_#06b6d4]"
                            />
                          </g>
                        ))}
                      </svg>
                    </div>

                    {/* Map Node Tooltip / Status Display */}
                    <div className="h-6 flex items-center justify-between border-t border-border-subtle pt-2 z-10 text-[9px] text-gray-500 font-bold">
                      {hoveredNode ? (
                        <div className="flex items-center gap-3 text-brand-cyan animate-fade-in">
                          <span className="uppercase tracking-wide">{hoveredNode.name}</span>
                          <span>•</span>
                          <span>LATENCY: {hoveredNode.ping}</span>
                          <span>•</span>
                          <span>CPU LOAD: {hoveredNode.load}</span>
                        </div>
                      ) : (
                        <span>HOVER NODES FOR REGIONAL SYSTEM TELEMETRY</span>
                      )}
                      <span>SECURE LAYER: ACTIVE</span>
                    </div>
                  </div>

                  {/* Subscriber Engagement Index spline chart */}
                  <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-6 rounded-2xl space-y-6 shadow-sm hover:bg-bg-card-hover transition-colors duration-350">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs font-bold text-white tracking-wide uppercase">Subscriber Engagement Index</h3>
                        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Dual-spline visualization comparing page views and organic user conversions</p>
                      </div>
                      
                      {/* Chart Legend */}
                      <div className="flex items-center gap-4 text-[9px] font-bold text-gray-400">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
                          <span>VIEWS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-1 border-t-2 border-dashed border-brand-cyan" />
                          <span>CONVERSIONS</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Spline Area */}
                    <div
                      className="relative h-[200px] w-full"
                      onMouseMove={handleChartMouseMove}
                      onMouseLeave={handleChartMouseLeave}
                    >
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                        <defs>
                          {/* Purple View Gradient */}
                          <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid horizontal lines */}
                        <line x1="0" y1="40" x2="500" y2="40" className="stroke-border-subtle" strokeOpacity="0.3" strokeWidth="1" />
                        <line x1="0" y1="90" x2="500" y2="90" className="stroke-border-subtle" strokeOpacity="0.3" strokeWidth="1" />
                        <line x1="0" y1="140" x2="500" y2="140" className="stroke-border-subtle" strokeOpacity="0.3" strokeWidth="1" />

                        {/* View Spline Gradient Area */}
                        <path
                          d="M 10,140 C 70,165 120,65 180,95 C 240,125 300,50 360,85 C 420,120 450,45 490,75 L 490,195 L 10,195 Z"
                          fill="url(#purpleGrad)"
                        />

                        {/* View Spline (Solid Purple) */}
                        <path
                          d="M 10,140 C 70,165 120,65 180,95 C 240,125 300,50 360,85 C 420,120 450,45 490,75"
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_6px_rgba(139,92,246,0.3)]"
                        />

                        {/* Conversion Spline (Dashed Cyan) */}
                        <path
                          d="M 10,175 C 70,150 120,105 180,125 C 240,145 300,95 360,125 C 420,145 450,65 490,110"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_6px_rgba(6,182,212,0.3)]"
                        />

                        {/* Interactive tracking line */}
                        {chartHoverData && (
                          <line
                            x1={chartHoverData.x}
                            y1="0"
                            x2={chartHoverData.x}
                            y2="195"
                            stroke="rgba(255, 255, 255, 0.15)"
                            strokeWidth="1.5"
                            strokeDasharray="3,3"
                          />
                        )}
                      </svg>

                      {/* Interactive Tooltip popup */}
                      {chartHoverData && (
                        <div
                          className="absolute bg-bg-dropdown border border-border-subtle rounded-lg p-2.5 shadow-xl text-[10px] font-bold flex flex-col gap-1 z-10 transition-all duration-75 pointer-events-none"
                          style={{ left: `${chartHoverData.x - 50}px`, top: "30px" }}
                        >
                          <span className="text-gray-500 uppercase tracking-wide text-[8px]">{chartHoverData.day} Telemetry</span>
                          <span className="text-white flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                            Views: {formatNumber(chartHoverData.views)}
                          </span>
                          <span className="text-brand-cyan flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />
                            Conversions: {chartHoverData.conversions}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom small horizontal cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    
                    {/* Storage utilized card */}
                    <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between hover:border-border-subtle/50 hover:bg-bg-card-hover transition-all duration-300 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-brand-purple">
                          <HardDrive className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">9.4k GB</h4>
                          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Cloud Storage Utilized</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>

                    {/* Threats Blocked card */}
                    <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between hover:border-border-subtle/50 hover:bg-bg-card-hover transition-all duration-300 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center text-brand-cyan">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">1.2M</h4>
                          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Threats Blocked (24h)</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>

                  </div>

                </div>

                {/* Right Column (Stacked Small Widgets) */}
                <div className="space-y-8">
                  
                  {/* Writer Growth card */}
                  <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-6 rounded-2xl space-y-4 shadow-sm hover:bg-bg-card-hover transition-colors duration-350">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-brand-purple">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs">
                        <ArrowUpRight className="w-4.5 h-4.5" />
                        <span>+14.2%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold tracking-wide uppercase">Writer Growth</p>
                      <h4 className="text-2xl font-extrabold text-white mt-1">24,812</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">Active Authors on Platform</p>
                    </div>
                    
                    {/* Mini Progress Bar */}
                    <div className="w-full bg-bg-card-sub border border-border-subtle h-1.8 rounded-full overflow-hidden">
                      <div className="bg-brand-purple h-full w-[72%] rounded-full shadow-[0_0_8px_#8b5cf6]" />
                    </div>
                  </div>

                  {/* Revenue Metrics card */}
                  <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-6 rounded-2xl space-y-4 shadow-sm hover:bg-bg-card-hover transition-colors duration-350">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center text-brand-cyan">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs">
                        <ArrowUpRight className="w-4.5 h-4.5" />
                        <span>+8.5%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold tracking-wide uppercase">Revenue Metrics</p>
                      <h4 className="text-2xl font-extrabold text-white mt-1">$184.2k</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">Current Month Earnings</p>
                    </div>

                    {/* Custom Mini Bar Chart */}
                    <div className="h-10 flex items-end justify-between gap-1.5 px-2 pt-2">
                      {[30, 45, 38, 55, 42, 68, 50].map((h, idx) => (
                        <div
                          key={idx}
                          style={{ height: `${h}%` }}
                          className={`w-full rounded-sm transition-all hover:scale-x-115 ${
                            idx === 5 ? "bg-brand-cyan shadow-[0_0_8px_#06b6d4]" : "bg-bg-card-sub border border-border-subtle"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Server Latency card */}
                  <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-6 rounded-2xl space-y-4 shadow-sm hover:bg-bg-card-hover transition-colors duration-350">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                        <Gauge className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs">
                        <ArrowDownRight className="w-4.5 h-4.5 text-emerald-500" />
                        <span>-4ms</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold tracking-wide uppercase">Server Latency</p>
                      <h4 className="text-2xl font-extrabold text-white mt-1">18ms</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">Global Average Ping</p>
                    </div>

                    {/* Region badges & Uptime */}
                    <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-[9px] font-bold">
                      <div className="flex gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-bg-card-sub text-gray-500 border border-border-subtle">US</span>
                        <span className="px-1.5 py-0.5 rounded bg-bg-card-sub text-gray-500 border border-border-subtle">EU</span>
                        <span className="px-1.5 py-0.5 rounded bg-bg-card-sub text-brand-cyan border border-border-subtle">AS</span>
                      </div>
                      <span className="text-emerald-500">99.9% RELIABLE</span>
                    </div>
                  </div>

                  {/* Recent Activity panel */}
                  <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-5 rounded-2xl space-y-4 shadow-sm hover:bg-bg-card-hover transition-colors duration-350">
                    <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wide">Recent Activity</h3>
                      <button
                        onClick={() => {
                          setActiveTab("content");
                          toast("Redirected to recent content logs.");
                        }}
                        className="text-[10px] font-bold text-gray-400 hover:text-brand-purple hover:underline cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    {/* Activity Feed list */}
                    <div className="flex flex-col gap-4">
                      
                      {/* Event 1 */}
                      <div className="flex items-start gap-3.5 group">
                        <div className="w-8 h-8 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center font-bold text-brand-purple text-[10px] group-hover:scale-105 transition-transform shrink-0">
                          EV
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-baseline gap-2">
                            <span className="text-[11px] font-bold text-white">Elena Vance</span>
                            <span className="text-[9px] text-gray-500 font-semibold">2m ago</span>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-normal">Published <span className="text-brand-purple font-semibold">"The Future of Web3"</span></p>
                          <div className="flex gap-1.5 pt-0.5">
                            <span className="px-1.5 py-0.2 rounded text-[8px] font-bold border border-[#06b6d4]/20 text-brand-cyan bg-[#06b6d4]/5">TECH</span>
                            <span className="px-1.5 py-0.2 rounded text-[8px] font-bold border border-white/20 text-white bg-white/5">NEW</span>
                          </div>
                        </div>
                      </div>

                      {/* Event 2 */}
                      <div className="flex items-start gap-3.5 group">
                        <div className="w-8 h-8 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center font-bold text-brand-cyan text-[10px] group-hover:scale-105 transition-transform shrink-0">
                          MT
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-baseline gap-2">
                            <span className="text-[11px] font-bold text-white">Marcus Thorne</span>
                            <span className="text-[9px] text-gray-500 font-semibold">15m ago</span>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-normal">Updated system cluster configuration for Node 07</p>
                          <div className="pt-0.5">
                            <span className="px-1.5 py-0.2 rounded text-[8px] font-bold border border-white/10 text-gray-400 bg-white/[0.02]">SYSTEM_ROOT</span>
                          </div>
                        </div>
                      </div>

                      {/* Event 3 */}
                      <div className="flex items-start gap-3.5 group">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center font-bold text-red-500 text-[10px] group-hover:scale-105 transition-transform shrink-0">
                          SC
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-baseline gap-2">
                            <span className="text-[11px] font-bold text-white">Sarah Connor</span>
                            <span className="text-[9px] text-gray-500 font-semibold">42m ago</span>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-normal">Flagged 3 posts for moderation review in Community Forum</p>
                          <div className="pt-0.5">
                            <span className="px-1.5 py-0.2 rounded text-[8px] font-bold border border-red-500/20 text-red-400 bg-red-500/5 uppercase tracking-wide">Action Required</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: ANALYTICS */}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center border-b border-border-subtle pb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Performance Analytics
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">Deep-dive neural analysis of platform views and user engagement rates</p>
                </div>
              </div>

              {/* 4 Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Total Views", val: formatNumber(totalViews), change: "+18.2%", color: "text-brand-purple", bg: "bg-brand-purple/10" },
                  { title: "Engagement Rate", val: "64.8%", change: "+3.4%", color: "text-brand-cyan", bg: "bg-brand-cyan/10" },
                  { title: "Avg Read Time", val: "4.2 mins", change: "+12s", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { title: "Bounce Rate", val: "38.2%", change: "-2.1%", color: "text-red-400", bg: "bg-red-400/10" },
                ].map((item, idx) => (
                  <div key={idx} className="border border-border-subtle bg-bg-card backdrop-blur-xl p-5 rounded-2xl space-y-3 shadow-sm hover:bg-bg-card-hover transition-colors duration-350">
                    <p className="text-[10px] text-gray-500 font-bold tracking-wide uppercase">{item.title}</p>
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-2xl font-extrabold text-white">{item.val}</h4>
                      <span className={`text-[10px] font-extrabold ${item.change.startsWith("+") ? "text-emerald-500" : "text-red-400"}`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Monthly Views Chart & Top Performing Blogs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Monthly views chart */}
                <div className="lg:col-span-2 border border-border-subtle bg-bg-card backdrop-blur-xl p-6 rounded-2xl space-y-4 shadow-sm hover:bg-bg-card-hover transition-colors duration-350">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">Monthly Traffic Distribution</h3>
                  
                  {/* Visual Bar Chart */}
                  <div className="h-[240px] flex items-end justify-between gap-4 pt-6 px-4">
                    {[
                      { m: "Jan", v: 45 }, { m: "Feb", v: 62 }, { m: "Mar", v: 58 },
                      { m: "Apr", v: 75 }, { m: "May", v: 88 }, { m: "Jun", v: 100 },
                      { m: "Jul", v: 82 }, { m: "Aug", v: 68 }, { m: "Sep", v: 92 }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div
                          style={{ height: `${bar.v}%` }}
                          className="w-full bg-brand-purple/25 border border-brand-purple/35 rounded-t-lg transition-all group-hover:bg-brand-purple group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] relative"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-bg-dropdown border border-border-subtle text-white text-[9px] font-bold px-1.5 py-0.8 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {(bar.v * 120).toLocaleString()} views
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold">{bar.m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top posts list */}
                <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-6 rounded-2xl space-y-4 shadow-sm hover:bg-bg-card-hover transition-colors duration-350">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">Top Performing Articles</h3>
                  <div className="flex flex-col gap-4">
                    {blogs.slice(0, 4).map((blog) => (
                      <div key={blog.id} className="flex items-center justify-between border-b border-border-subtle pb-3 last:border-b-0 last:pb-0">
                        <div className="space-y-0.5 pr-2 truncate">
                          <h4 className="text-[11px] font-bold text-white truncate">{blog.title}</h4>
                          <p className="text-[9px] text-gray-500 font-semibold">{blog.status} • {new Date(blog.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-extrabold text-brand-cyan">{formatNumber(blog.views || 0)}</span>
                          <p className="text-[8px] text-gray-500 font-bold">VIEWS</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: CONTENT MANAGER */}
          {activeTab === "content" && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Content Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Content Manager
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">Audit and organize all articles, toggle visibility states, and delete platform content.</p>
                </div>
                
                {/* Write Post link */}
                <Link to="/write" className="shrink-0">
                  <Button variant="primary" className="!rounded-lg !py-2.5 !px-4 flex items-center gap-2 text-xs cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Write New Post</span>
                  </Button>
                </Link>
              </div>

              {/* Sub Filters & Stats */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-4">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "all", label: "All Posts" },
                    { id: "published", label: "Published" },
                    { id: "drafts", label: "Drafts" },
                    { id: "scheduled", label: "Scheduled" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setFilter(tab.id);
                        setSearch("");
                      }}
                      className={`px-3.5 py-1.8 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        filter === tab.id
                          ? "bg-brand-purple/15 border border-brand-purple/25 text-brand-purple shadow-sm"
                          : "text-gray-400 hover:text-gray-200 border border-transparent hover:bg-bg-card-sub"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Quick stats indicators */}
                <div className="flex items-center gap-6 text-[10px] text-gray-500 font-bold">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-brand-purple">{formatNumber(totalViews)}</span>
                    <span>TOTAL VIEWS</span>
                  </div>
                  <div className="h-3 w-px bg-border-subtle" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-white">{publishedCount}</span>
                    <span>PUBLISHED</span>
                  </div>
                </div>
              </div>

              {/* Local search input */}
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-bg-card-sub border border-border-subtle focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                />
              </div>

              {/* CMS Blog list display */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                  {[1, 2, 3, 4].map((n) => (
                    <SkeletonCard key={n} />
                  ))}
                </div>
              ) : processedBlogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-bg-card border border-border-subtle p-12 text-center max-w-md mx-auto my-8 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-bg-card-sub border border-border-subtle flex items-center justify-center text-gray-500">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">No Articles Found</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      {search ? "No posts match your search query." : "There are no blog posts populated on the platform."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {processedBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="border border-border-subtle bg-bg-card backdrop-blur-xl p-5 hover:border-brand-purple/30 hover:bg-bg-card-hover transition-all flex flex-col justify-between h-[180px] group relative shadow-sm"
                    >
                      {/* Thumbnail background overlay if available */}
                      {blog.thumbnail && (
                        <div 
                          className="absolute inset-0 bg-cover bg-center rounded-2xl pointer-events-none opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"
                          style={{ backgroundImage: `url(${blog.thumbnail})` }}
                        />
                      )}

                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          {/* Title */}
                          <h3 className="text-sm font-extrabold text-white group-hover:text-brand-purple transition-colors leading-tight line-clamp-2 pr-6">
                            {blog.title}
                          </h3>

                          {/* Dropdown Menu Trigger */}
                          <div className="absolute right-4 top-4" ref={dropdownRef}>
                            <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(openDropdownId === blog.id ? null : blog.id);
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-bg-card-sub transition-colors cursor-pointer"
                              >
                                <MoreVertical className="w-4.5 h-4.5" />
                              </button>
                              
                              {/* Floating context dropdown */}
                              {openDropdownId === blog.id && (
                                <div className="absolute right-0 mt-1 w-36 bg-bg-dropdown border border-border-subtle rounded-lg p-1.5 shadow-xl z-25 flex flex-col gap-1 text-[10px] font-bold">
                                  <Link
                                    to={`/write?edit=${blog.id}`}
                                    className="w-full px-3 py-2 rounded text-left hover:bg-bg-card-sub flex items-center gap-2 text-gray-300 hover:text-white"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>Edit Post</span>
                                  </Link>
                                  <button
                                    onClick={() => handleToggleStatus(blog.id, blog.status)}
                                    className="w-full px-3 py-2 rounded text-left hover:bg-bg-card-sub flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer"
                                  >
                                    <FileEdit className="w-3.5 h-3.5" />
                                    <span>{blog.status === "PUBLISHED" ? "Unpublish" : "Publish"}</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBlog(blog.id)}
                                    className="w-full px-3 py-2 rounded text-left hover:bg-red-500/10 hover:text-red-400 flex items-center gap-2 text-red-500/80 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Post</span>
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Excerpt */}
                        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 pr-2">
                          {stripHtml(blog.content) || blog.excerpt || "No description provided."}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="flex justify-between items-center pt-3 border-t border-border-subtle text-[9px] font-bold text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className={`px-1.5 py-0.5 rounded uppercase tracking-wide border ${
                            blog.status === "PUBLISHED"
                              ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
                              : "border-amber-500/20 text-amber-500 bg-amber-500/5"
                          }`}>
                            {blog.status}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {formatNumber(blog.views || 0)} views
                          </span>
                        </div>
                        
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: MODERATION QUEUE */}
          {activeTab === "moderation" && (
            <motion.div
              key="moderation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div className="border-b border-border-subtle pb-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Moderation Center
                </h1>
                <p className="text-sm text-gray-400 mt-1">Review articles flagged by the automated anti-abuse layer or reported by the community</p>
              </div>

              {flaggedPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-bg-card border border-border-subtle p-12 text-center max-w-md mx-auto my-8 space-y-4 animate-fade-in">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Moderation Queue Clear</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      All flagged posts have been reviewed. There are no items pending approval or deletion.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-w-3xl animate-fade-in">
                  {flaggedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-border-subtle bg-bg-card backdrop-blur-xl p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-border-subtle/50 hover:bg-bg-card-hover transition-all duration-300 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold border border-red-500/20 text-red-400 bg-red-500/5 px-1.5 py-0.5 rounded uppercase">Flagged</span>
                          <span className="text-[10px] text-gray-500 font-bold">{post.flaggedAt}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white">{post.title}</h3>
                        <p className="text-[10px] text-gray-400">
                          Author: <span className="text-brand-cyan font-bold">{post.author}</span> • Reason: <span className="text-red-400/80 font-semibold">{post.reason}</span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleApprovePost(post.id, post.title)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectPost(post.id, post.title)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
                        >
                          Reject & Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: SYSTEM HEALTH & MONITORS */}
          {activeTab === "system" && (
            <motion.div
              key="system"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div className="border-b border-border-subtle pb-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  System Telemetry
                </h1>
                <p className="text-sm text-gray-400 mt-1">Live infrastructure metrics and application compiler output streams</p>
              </div>

              {/* Telemetry Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                {[
                  { title: "CPU Utilization", val: "42.5%", status: "NORMAL", color: "text-emerald-500" },
                  { title: "Memory Allocation", val: "68.2%", status: "HIGH", color: "text-amber-500" },
                  { title: "Network Bandwidth", val: "1.4 GB/s", status: "STABLE", color: "text-brand-cyan" },
                  { title: "Database Pools", val: "8 / 20 active", status: "HEALTHY", color: "text-emerald-500" },
                ].map((item, idx) => (
                  <div key={idx} className="border border-border-subtle bg-bg-card backdrop-blur-xl p-5 rounded-2xl space-y-4 shadow-sm hover:bg-bg-card-hover transition-colors duration-350">
                    <div>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{item.title}</p>
                      <h4 className="text-2xl font-extrabold text-white mt-1.5">{item.val}</h4>
                    </div>
                    
                    <div className="flex justify-between items-center text-[8px] font-bold">
                      <span className="text-gray-500">ENGINE STATUS</span>
                      <span className={item.color}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Running Services & Monospace logs console */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Microservices statuses */}
                <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-6 rounded-2xl space-y-5 shadow-sm hover:bg-bg-card-hover transition-colors duration-350">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">Infrastructure Clusters</h3>
                  
                  <div className="flex flex-col gap-4">
                    {[
                      { name: "NestJS core API", endpoint: "localhost:3000/api/v1", status: "Operational", color: "bg-emerald-500" },
                      { name: "PostgreSQL Instance", endpoint: "db:5432/blog_app", status: "Operational", color: "bg-emerald-500" },
                      { name: "Redis Core Cache", endpoint: "redis:6379", status: "Operational", color: "bg-emerald-500" },
                      { name: "BullMQ Email Engine", endpoint: "background:queue", status: "Operational", color: "bg-emerald-500" },
                    ].map((svc, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-border-subtle pb-3 last:border-b-0 last:pb-0">
                        <div className="space-y-0.5">
                          <h4 className="text-[11px] font-bold text-white">{svc.name}</h4>
                          <code className="text-[9px] text-gray-500 font-mono block">{svc.endpoint}</code>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-500">
                            <span className={`w-1.5 h-1.5 rounded-full ${svc.color} animate-pulse`} />
                            <span>{svc.status}</span>
                          </div>
                          
                          <button
                            onClick={() => handlePingService(idx, svc.name)}
                            disabled={pingingServices[idx]}
                            className={`text-[8px] font-bold px-2 py-1 rounded border transition-all ${
                              pingingServices[idx]
                                ? "border-border-subtle text-gray-500 bg-bg-card-sub cursor-not-allowed"
                                : "border-brand-cyan/25 text-brand-cyan hover:bg-brand-cyan/10 hover:border-brand-cyan/50 cursor-pointer"
                            }`}
                          >
                            {pingingServices[idx] ? "Pinging..." : "Test Connection"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mono compiler output stream */}
                <div className="lg:col-span-2 border border-white/[0.08] bg-[#020208] p-5 rounded-2xl flex flex-col justify-between h-[300px] shadow-inner">
                  <div className="flex justify-between items-center border-b border-white/[0.06] pb-2 text-[9px] font-bold gap-4 flex-wrap">
                    <span className="text-[#cbd5e1]">CONSOLE LOGGER STREAM - NESTJS watch:dev</span>
                    
                    {/* Console Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsLogPaused(!isLogPaused)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[8px] font-bold transition-all cursor-pointer ${
                          isLogPaused
                            ? "border-[#10b981]/30 text-[#10b981] hover:bg-[#10b981]/10"
                            : "border-[#f59e0b]/30 text-[#f59e0b] hover:bg-[#f59e0b]/10"
                        }`}
                      >
                        {isLogPaused ? (
                          <>
                            <Play className="w-3 h-3" />
                            <span>Resume</span>
                          </>
                        ) : (
                          <>
                            <Pause className="w-3 h-3" />
                            <span>Pause</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => setConsoleLogs(["[SYS] Console cleared."])}
                        className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#ef4444]/30 text-[#f87171] hover:bg-[#ef4444]/10 text-[8px] font-bold transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear</span>
                      </button>

                      <span className={`text-[8px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${isLogPaused ? "text-[#f59e0b]" : "text-[#c084fc] animate-pulse"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isLogPaused ? "bg-[#f59e0b]" : "bg-[#c084fc]"}`} />
                        {isLogPaused ? "Paused" : "Live Stream"}
                      </span>
                    </div>
                  </div>

                  {/* Scrolling terminal stream */}
                  <div 
                    ref={consoleContainerRef}
                    onScroll={handleConsoleScroll}
                    className="flex-1 overflow-y-auto mt-4 font-mono text-[10px] text-[#22c55e] space-y-1.5 pr-2 custom-scrollbar"
                  >
                    {consoleLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed hover:bg-white/[0.02] px-1 rounded transition-colors">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 6: USERS MANAGEMENT */}
          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    User Accounts
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">Audit platform accounts, adjust author roles, and restrict access for violators</p>
                </div>
              </div>

              {/* Users Overview Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat 1 */}
                <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Total Writers</p>
                    <h4 className="text-2xl font-extrabold text-white mt-1.5">{totalUsersCount}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                
                {/* Stat 2 */}
                <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Active Authors</p>
                    <h4 className="text-2xl font-extrabold text-white mt-1.5">{activeAuthorsCount}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Staff Members</p>
                    <h4 className="text-2xl font-extrabold text-white mt-1.5">{staffCount}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
                    <Shield className="w-5 h-5" />
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="border border-border-subtle bg-bg-card backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Suspended</p>
                    <h4 className="text-2xl font-extrabold text-white mt-1.5">{suspendedCount}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                    <UserX className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Search & Filtering Bar */}
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-border-subtle pb-4">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search writers by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-bg-input border border-border-subtle focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Filters dropdowns */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Role Filter */}
                  <div className="flex items-center gap-1.5 bg-bg-input border border-border-subtle rounded-xl px-3 py-1.5 text-xs text-gray-400">
                    <span className="text-[9px] font-bold uppercase text-gray-500">Role:</span>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="bg-transparent border-none text-xs text-white focus:outline-none font-bold cursor-pointer"
                    >
                      <option value="all">All Roles</option>
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Author">Author</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5 bg-bg-input border border-border-subtle rounded-xl px-3 py-1.5 text-xs text-gray-400">
                    <span className="text-[9px] font-bold uppercase text-gray-500">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent border-none text-xs text-white focus:outline-none font-bold cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* User details table container */}
              <div className="border border-border-subtle bg-bg-card backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border-subtle text-gray-500 font-bold uppercase tracking-wider bg-bg-card-sub/20">
                        <th className="p-4 pl-6">Writer Details</th>
                        <th className="p-4">Assigned Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Platform Age</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {filteredUserList.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="w-12 h-12 rounded-xl bg-bg-input border border-border-subtle flex items-center justify-center text-gray-500">
                                <Users className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-white">No Writers Found</h3>
                                <p className="text-[11px] text-gray-400 mt-1">
                                  No writer accounts match your search query or filters.
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredUserList.map((user) => {
                          const avatarGradients = [
                            "from-violet-500 to-indigo-500 shadow-violet-500/20",
                            "from-cyan-500 to-blue-500 shadow-cyan-500/20",
                            "from-fuchsia-500 to-pink-500 shadow-fuchsia-500/20",
                            "from-emerald-500 to-teal-500 shadow-emerald-500/20",
                            "from-amber-500 to-orange-500 shadow-amber-500/20"
                          ];
                          const gradient = avatarGradients[user.id % avatarGradients.length];

                          return (
                            <tr 
                              key={user.id} 
                              className="hover:bg-bg-card-sub/10 transition-all duration-200"
                            >
                              {/* Column 1: Details with modern Avatar and Status Dot */}
                              <td className="p-4 pl-6 flex items-center gap-3">
                                <div className="relative shrink-0">
                                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-extrabold text-xs shadow-sm border border-border-subtle`}>
                                    {user.name[0]}
                                  </div>
                                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-dropdown ${
                                    user.status === "Active" ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" : "bg-red-500"
                                  }`} />
                                </div>
                                <div className="space-y-0.5">
                                  <h4 className="font-extrabold text-white text-xs">{user.name}</h4>
                                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                    <Mail className="w-3 h-3 opacity-60" />
                                    <span>{user.email}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Column 2: Role selection (Styled Custom Select with Chevron Down) */}
                              <td className="p-4">
                                <div className="relative w-28">
                                  <select
                                    value={user.role}
                                    onChange={(e) => handleChangeUserRole(user.id, e.target.value)}
                                    className="w-full bg-bg-input border border-border-subtle rounded-xl pl-3 pr-8 py-1.5 text-[10px] font-bold text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 cursor-pointer appearance-none"
                                  >
                                    <option value="Admin">Admin</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Author">Author</option>
                                  </select>
                                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>
                              </td>

                              {/* Column 3: Status Badge */}
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                                  user.status === "Active"
                                    ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5 shadow-sm shadow-emerald-500/5"
                                    : "border-red-500/20 text-red-400 bg-red-500/5 shadow-sm shadow-red-500/5"
                                }`}>
                                  <span className={`w-1 h-1 rounded-full ${user.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
                                  {user.status}
                                </span>
                              </td>

                              {/* Column 4: Platform Age */}
                              <td className="p-4 text-gray-500 font-semibold text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 opacity-60" />
                                  <span>{user.joined}</span>
                                </div>
                              </td>

                              {/* Column 5: Actions (Sleek pill buttons) */}
                              <td className="p-4 pr-6 text-right">
                                <button
                                  onClick={() => handleToggleUserStatus(user.id, user.status)}
                                  className={`text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer border shadow-sm ${
                                    user.status === "Active"
                                      ? "border-red-500/20 bg-red-500/5 text-red-400/90 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40 hover:shadow-red-500/5"
                                      : "border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/40 hover:shadow-emerald-500/5"
                                  }`}
                                >
                                  {user.status === "Active" ? "Suspend Writer" : "Activate Writer"}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

    </div>
  );
};

export default AdminPage;
