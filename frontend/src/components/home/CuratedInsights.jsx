import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { blogAPI } from '../../lib/api';

const MOCK_FEATURED = {
  id: "featured-1",
  title: "Mastering High-Concurrency Distributed Systems",
  excerpt: "An in-depth exploration of state-of-the-art replication protocols and consensus algorithms in the modern cloud era.",
  category: "FEATURED",
  readTime: "12 Min Read",
  thumbnail: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2664&auto=format&fit=crop",
  author: {
    name: "Dr. Elena Vance",
    role: "Principal Engineer @ NovaCore",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
  }
};

const MOCK_LATEST = [
  {
    id: "latest-1",
    title: "LLVM Optimizations for Rust 1.78",
    excerpt: "How the new borrow checker improves memory safety without sacrificing compile-time performance.",
    category: "COMPILER TECH",
  },
  {
    id: "latest-2",
    title: "Observability at Petabyte Scale",
    excerpt: "The architecture behind our real-time logging infrastructure handling millions of events per second.",
    category: "DEVOPS",
  },
  {
    id: "latest-3",
    title: "Small Models, Big Impact",
    excerpt: "Deploying 7B parameter models on edge hardware with 98% accuracy retention rates.",
    category: "AI / ML",
  }
];

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

const formatViews = (views) => {
  if (!views) return "0";
  if (views >= 1000) {
    return (views / 1000).toFixed(0) + "k";
  }
  return views.toString();
};

const CuratedInsights = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await blogAPI.getAllBlogs({ page: 1, limit: 4 });
        if (res.success && res.data && res.data.blogs?.length >= 3) {
          setBlogs(res.data.blogs);
        }
      } catch (e) {
        console.error("Failed to fetch public insights:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  // Map API data to design if available, otherwise use high-fidelity mock data
  const mainBlog = blogs[0] ? {
    id: blogs[0].id,
    title: blogs[0].title,
    excerpt: stripHtml(blogs[0].excerpt) || (blogs[0].content ? stripHtml(blogs[0].content).slice(0, 140) + "..." : ""),
    category: "FEATURED",
    readTime: `${blogs[0].readTime || 10} Min Read`,
    thumbnail: blogs[0].thumbnail || MOCK_FEATURED.thumbnail,
    views: blogs[0].views || 0,
    author: {
      name: `${blogs[0].author?.firstname || ""} ${blogs[0].author?.lastname || ""}`.trim() || blogs[0].author?.username || "Dr. Elena Vance",
      role: "Staff Writer @ NovaBlog",
      avatar: blogs[0].author?.avatar || MOCK_FEATURED.author.avatar,
      username: blogs[0].author?.username || ""
    }
  } : { ...MOCK_FEATURED, views: 24000 };

  const sideBlogs = MOCK_LATEST.map((item, idx) => {
    const apiBlog = blogs[idx + 1];
    if (apiBlog) {
      const authorName = `${apiBlog.author?.firstname || ""} ${apiBlog.author?.lastname || ""}`.trim() || apiBlog.author?.username || (idx === 0 ? "Sarah Chen" : "Marcus Johnson");
      const initials = `${apiBlog.author?.firstname?.[0] || ""}${apiBlog.author?.lastname?.[0] || ""}`.toUpperCase() || apiBlog.author?.username?.[0]?.toUpperCase() || (idx === 0 ? "SC" : "MJ");
      return {
        id: apiBlog.id,
        title: apiBlog.title,
        excerpt: stripHtml(apiBlog.excerpt) || (apiBlog.content ? stripHtml(apiBlog.content).slice(0, 90) + "..." : ""),
        category: apiBlog.category?.name?.toUpperCase() || item.category,
        readTime: apiBlog.readTime || 5,
        views: apiBlog.views || 0,
        author: {
          name: authorName,
          initials: initials,
          avatar: apiBlog.author?.avatar || null,
          username: apiBlog.author?.username || ""
        }
      };
    }
    return {
      ...item,
      readTime: 5,
      views: idx === 0 ? 142 : 89,
      author: {
        name: idx === 0 ? "Sarah Chen" : "Marcus Johnson",
        initials: idx === 0 ? "SC" : "MJ",
        avatar: null,
        username: idx === 0 ? "sarah" : "marcus"
      }
    };
  });

  return (
    <section className="max-w-7xl mx-auto px-6 mb-20 space-y-8">
      {/* Section Header */}
      <div className="flex items-end justify-between border-b border-border-subtle/30 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Curated Insights</h2>
          <p className="text-sm text-gray-400 mt-1">Top engineering minds sharing knowledge today.</p>
        </div>
        <Link 
          to="/explore" 
          className="text-xs font-bold text-brand-purple hover:text-[#c4b5fd] transition-colors flex items-center gap-1"
        >
          View All <span className="text-sm">→</span>
        </Link>
      </div>      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: One large featured post card */}
        <div className="lg:col-span-8 flex flex-col">
          <GlassCard className="relative p-0 border border-border-subtle bg-bg-card hover:border-brand-purple/40 transition-all duration-300 h-full overflow-hidden flex flex-col justify-end min-h-[480px] group">
            
            {/* Full-bleed Thumbnail Background */}
            <Link to={`/post/${mainBlog.id}`} className="absolute inset-0 w-full h-full -z-10 cursor-pointer block">
              <img 
                src={mainBlog.thumbnail} 
                alt={mainBlog.title} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04040c] via-[#04040c]/60 to-transparent" />
            </Link>
 
            {/* Card Content Overlay */}
            <div className="p-8 space-y-4 z-10">
              <Link to={`/post/${mainBlog.id}`} className="block space-y-4 group/text cursor-pointer">
                <div>
                  <span className="inline-block px-3 py-1.5 rounded-lg bg-brand-purple/25 border border-brand-purple/30 text-[10px] font-bold text-brand-purple tracking-widest uppercase">
                    {mainBlog.category}
                  </span>
                </div>
 
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#ffffff] tracking-tight leading-tight group-hover/text:text-brand-purple transition-colors max-w-2xl">
                  {mainBlog.title}
                </h3>
                
                <p className="text-[#d1d5db] text-sm leading-relaxed max-w-xl line-clamp-2">
                  {mainBlog.excerpt}
                </p>
              </Link>
 
              {/* Author Info Row */}
              <div className="flex items-center gap-3 border-t border-border-subtle/30 pt-4 mt-2">
                <Link
                  to={mainBlog.author?.username ? `/profile/${mainBlog.author.username}` : "#"}
                  className="flex items-center gap-3 group/author cursor-pointer"
                >
                  <img 
                    src={mainBlog.author.avatar} 
                    alt={mainBlog.author.name} 
                    className="w-8 h-8 rounded-full object-cover border border-border-subtle group-hover/author:border-brand-purple/50 transition-colors"
                  />
                  <div className="flex items-center gap-2 text-xs">
                    <h4 className="font-bold text-[#ffffff] leading-none group-hover/author:text-brand-purple transition-colors">{mainBlog.author.name}</h4>
                    <span className="text-gray-500">•</span>
                    <span className="text-[#9ca3af] font-medium">{mainBlog.readTime}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-[#9ca3af] font-medium">{formatViews(mainBlog.views)} views</span>
                  </div>
                </Link>
              </div>
            </div>
 
          </GlassCard>
        </div>
 
        {/* Right Column: Latest Insights */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          {sideBlogs.slice(0, 2).map((post, idx) => (
            <GlassCard key={post.id} className="p-6 flex flex-col justify-between border border-border-subtle bg-bg-card hover:bg-white/[0.02] hover:border-brand-purple/40 transition-all duration-300 min-h-[228px] group lg:h-[calc(50%-12px)] h-auto">
              <Link to={`/post/${post.id}`} className="block space-y-3 group/link cursor-pointer">
                <span className="text-[10px] font-bold text-brand-purple tracking-widest uppercase block">
                  {post.category}
                </span>
                <h4 className="text-lg font-bold text-white group-hover/link:text-brand-purple transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h4>
                <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
              
              <div className="flex items-center justify-between border-t border-border-subtle/30 pt-4 mt-auto">
                <Link
                  to={post.author?.username ? `/profile/${post.author.username}` : "#"}
                  className="flex items-center gap-2 group/author cursor-pointer"
                >
                  {post.author.avatar ? (
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      className="w-6 h-6 rounded-full object-cover border border-border-subtle/50 group-hover/author:border-brand-purple/50 transition-colors"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-[10px] font-bold text-white group-hover/author:border-brand-purple/50 transition-colors">
                      {post.author.initials}
                    </div>
                  )}
                  <span className="text-xs text-gray-300 font-medium group-hover/author:text-brand-purple transition-colors">
                    {post.author.name}
                  </span>
                </Link>
                <div className="flex items-center gap-3 text-[10px] text-gray-500 font-semibold tracking-wider select-none shrink-0">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 opacity-70" />
                    <span className="lowercase">{post.readTime} min read</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 opacity-70" />
                    <span>{post.views}</span>
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div></div>
    </section>
  );
};

export default CuratedInsights;
