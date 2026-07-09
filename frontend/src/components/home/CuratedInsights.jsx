import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { blogAPI } from '../../lib/api';

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
        const res = await blogAPI.getAllBlogs({ page: 1, limit: 9 });
        if (res.success && res.data && res.data.blogs?.length > 0) {
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

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 mb-20 space-y-8">
        <div className="flex items-end justify-between border-b border-border-subtle/30 pb-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Curated <span className="text-gradient">Insights</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">Top engineering minds sharing knowledge today.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main featured skeleton */}
          <div className="lg:col-span-8 flex flex-col">
            <GlassCard className="relative p-8 border border-border-subtle bg-bg-card min-h-[480px] flex flex-col justify-end overflow-hidden">
              <div className="space-y-4 w-full">
                {/* Category chip placeholder */}
                <div>
                  <div className="h-6 w-16 bg-white/[0.04] border border-white/[0.05] animate-pulse rounded-lg" />
                </div>
                {/* Title lines placeholder */}
                <div className="space-y-2.5">
                  <div className="h-8 w-3/4 bg-white/[0.04] animate-pulse rounded-md" />
                  <div className="h-8 w-1/2 bg-white/[0.04] animate-pulse rounded-md" />
                </div>
                {/* Excerpt line placeholder */}
                <div className="space-y-2 pt-1">
                  <div className="h-4 w-5/6 bg-white/[0.02] animate-pulse rounded" />
                  <div className="h-4 w-2/3 bg-white/[0.02] animate-pulse rounded" />
                </div>
                {/* Author and meta details placeholder */}
                <div className="flex items-center gap-3 pt-4 border-t border-border-subtle/10 mt-2">
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] animate-pulse" />
                  <div className="h-4 w-24 bg-white/[0.03] animate-pulse rounded" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/[0.02] animate-pulse" />
                  <div className="h-4 w-12 bg-white/[0.03] animate-pulse rounded" />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Side blogs skeletons */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {Array(2).fill(null).map((_, idx) => (
              <GlassCard key={idx} className="p-6 flex flex-col justify-between border border-border-subtle bg-bg-card min-h-[228px] h-auto lg:h-[calc(50%-12px)]">
                <div className="space-y-3.5">
                  {/* Category chip placeholder */}
                  <div className="h-4 w-12 bg-white/[0.04] animate-pulse rounded" />
                  {/* Title placeholder */}
                  <div className="space-y-2">
                    <div className="h-5 w-5/6 bg-white/[0.04] animate-pulse rounded-md" />
                    <div className="h-5 w-2/3 bg-white/[0.04] animate-pulse rounded-md" />
                  </div>
                  {/* Excerpt placeholder */}
                  <div className="h-3.5 w-11/12 bg-white/[0.02] animate-pulse rounded" />
                </div>
                {/* Divider line and footer */}
                <div className="flex items-center justify-between border-t border-border-subtle/10 pt-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/[0.04] animate-pulse" />
                    <div className="h-3.5 w-16 bg-white/[0.03] animate-pulse rounded" />
                  </div>
                  <div className="h-3.5 w-20 bg-white/[0.03] animate-pulse rounded" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 mb-20 space-y-8">
        <div className="flex items-end justify-between border-b border-border-subtle/30 pb-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Curated <span className="text-gradient">Insights</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">Top engineering minds sharing knowledge today.</p>
          </div>
        </div>
        <div className="text-center py-20 bg-white/[0.01] rounded-2xl border border-dashed border-border-subtle p-8">
          <p className="text-gray-400 text-sm">No insights have been published yet.</p>
        </div>
      </section>
    );
  }

  const mainBlog = {
    id: blogs[0].id,
    title: blogs[0].title,
    excerpt: stripHtml(blogs[0].excerpt) || (blogs[0].content ? stripHtml(blogs[0].content).slice(0, 140) + "..." : ""),
    category: "FEATURED",
    readTime: `${blogs[0].readTime || 10} Min Read`,
    thumbnail: blogs[0].thumbnail || "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2664&auto=format&fit=crop",
    views: blogs[0].views || 0,
    author: {
      name: `${blogs[0].author?.firstname || ""} ${blogs[0].author?.lastname || ""}`.trim() || blogs[0].author?.username || "Anonymous",
      role: "Staff Writer @ NovaBlog",
      avatar: blogs[0].author?.avatar || null,
      username: blogs[0].author?.username || ""
    }
  };

  const sideBlogs = blogs.slice(1, 3).map((apiBlog) => {
    const authorName = `${apiBlog.author?.firstname || ""} ${apiBlog.author?.lastname || ""}`.trim() || apiBlog.author?.username || "Anonymous";
    const initials = `${apiBlog.author?.firstname?.[0] || ""}${apiBlog.author?.lastname?.[0] || ""}`.toUpperCase() || apiBlog.author?.username?.[0]?.toUpperCase() || "U";
    return {
      id: apiBlog.id,
      title: apiBlog.title,
      excerpt: stripHtml(apiBlog.excerpt) || (apiBlog.content ? stripHtml(apiBlog.content).slice(0, 90) + "..." : ""),
      category: apiBlog.category?.name?.toUpperCase() || "INSIGHT",
      readTime: apiBlog.readTime || 5,
      views: apiBlog.views || 0,
      author: {
        name: authorName,
        initials: initials,
        avatar: apiBlog.author?.avatar || null,
        username: apiBlog.author?.username || ""
      }
    };
  });

  const gridBlogs = blogs.slice(3, 9).map((apiBlog) => {
    const authorName = `${apiBlog.author?.firstname || ""} ${apiBlog.author?.lastname || ""}`.trim() || apiBlog.author?.username || "Anonymous";
    const initials = `${apiBlog.author?.firstname?.[0] || ""}${apiBlog.author?.lastname?.[0] || ""}`.toUpperCase() || apiBlog.author?.username?.[0]?.toUpperCase() || "U";
    return {
      id: apiBlog.id,
      title: apiBlog.title,
      category: apiBlog.category?.name?.toUpperCase() || "INSIGHT",
      readTime: `${apiBlog.readTime || 3} min read`,
      thumbnail: apiBlog.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
      author: {
        name: authorName,
        initials: initials,
        avatar: apiBlog.author?.avatar || null,
        username: apiBlog.author?.username || ""
      }
    };
  });

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24 space-y-16">
      {/* 1. Curated Insights */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border-subtle/30 pb-4 gap-2">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Curated <span className="text-gradient">Insights</span>
            </h2>
            <p className="text-sm text-text-muted mt-1 leading-relaxed">Top engineering minds sharing knowledge today.</p>
          </div>
          <Link 
            to="/explore" 
            className="text-xs font-bold text-brand-purple hover:text-[#c4b5fd] transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap self-start sm:self-auto mt-2 sm:mt-0"
          >
            View All <span className="text-sm">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className={`${sideBlogs.length > 0 ? "lg:col-span-8" : "lg:col-span-12"} flex flex-col`}>
            <GlassCard className="relative p-0 border border-border-subtle bg-bg-card hover:border-brand-purple/40 transition-all duration-300 h-full overflow-hidden flex flex-col justify-end min-h-[480px] group">
              <Link to={`/post/${mainBlog.id}`} className="absolute inset-0 w-full h-full -z-10 cursor-pointer block">
                <img 
                  src={mainBlog.thumbnail} 
                  alt={mainBlog.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04040c] via-[#04040c]/60 to-transparent" />
              </Link>

              <div className="p-8 space-y-4 z-10">
                <Link to={`/post/${mainBlog.id}`} className="block space-y-4 group/text cursor-pointer">
                  <div>
                    <span className="inline-block px-3 py-1.5 rounded-lg bg-brand-purple/25 border border-brand-purple/30 text-[10px] font-bold text-brand-purple tracking-widest uppercase">
                      {mainBlog.category}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#ffffff] tracking-tight leading-tight group-hover/text:text-brand-purple transition-colors max-w-2xl line-clamp-2">
                    {mainBlog.title}
                  </h3>
                  <p className="text-[#d1d5db] text-sm leading-relaxed max-w-xl line-clamp-2">
                    {mainBlog.excerpt}
                  </p>
                </Link>

                <div className="flex items-center gap-3 z-20 pt-4 mt-2">
                  <Link
                    to={mainBlog.author?.username ? `/profile/${mainBlog.author.username}` : "#"}
                    className="flex items-center gap-3 group/author cursor-pointer"
                  >
                    {mainBlog.author.avatar ? (
                      <img 
                        src={mainBlog.author.avatar} 
                        alt={mainBlog.author.name} 
                        className="w-8 h-8 rounded-full object-cover border border-border-subtle group-hover/author:border-brand-purple/50 transition-colors"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-xs font-bold text-white">
                        {mainBlog.author.name?.[0]?.toUpperCase()}
                      </div>
                    )}
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

          {sideBlogs.length > 0 && (
            <div className="lg:col-span-4 flex flex-col justify-between gap-6">
              {sideBlogs.map((post) => (
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
            </div>
          )}
        </div>
      </div>

      {/* 2. More Perspectives Grid (NASA Apps inspired Layout) */}
      {gridBlogs.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-end justify-between border-b border-border-subtle/30 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">More Perspectives</h2>
              <p className="text-sm text-gray-400 mt-1">Explore diverse angles across the modern engineering stack.</p>
            </div>
            <Link 
              to="/feed" 
              className="text-xs font-bold text-brand-purple hover:text-[#c4b5fd] transition-colors"
            >
              See more insights
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridBlogs.map((post) => (
              <GlassCard 
                key={post.id} 
                className="relative p-0 border border-border-subtle bg-bg-card hover:border-brand-purple/40 transition-all duration-300 h-80 overflow-hidden flex flex-col justify-end group"
              >
                {/* Card Badge on top-left (teal theme) */}
                <span className="absolute top-4 left-4 inline-block px-2.5 py-1 rounded bg-[#115e59]/35 border border-[#14b8a6]/25 text-[8.5px] font-extrabold text-[#2dd4bf] tracking-widest uppercase z-10">
                  {post.category}
                </span>

                {/* Full-bleed Thumbnail Background */}
                <Link to={`/post/${post.id}`} className="absolute inset-0 w-full h-full -z-10 cursor-pointer block">
                  <img 
                    src={post.thumbnail} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04040c] via-[#04040c]/70 to-transparent" />
                </Link>

                {/* Card Content Overlay */}
                <div className="p-6 space-y-3 z-10 w-full text-left">
                  <Link to={`/post/${post.id}`} className="block">
                    <h3 className="text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-brand-purple transition-colors line-clamp-2 cursor-pointer">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Author Info Row */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                    <div className="flex items-center gap-2 text-xs">
                      {post.author.avatar ? (
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name} 
                          className="w-6 h-6 rounded-full object-cover border border-border-subtle"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-[10px] font-bold text-white">
                          {post.author.initials || post.author.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <Link 
                        to={post.author.username ? `/profile/${post.author.username}` : "#"}
                        className="font-bold text-gray-300 hover:text-brand-purple transition-colors truncate max-w-[120px]"
                      >
                        {post.author.name}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-semibold tracking-wider">
                      <Clock className="w-3.5 h-3.5 opacity-60" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CuratedInsights;
