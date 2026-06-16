import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import { blogAPI } from '../../lib/api';

const fallbacks = [
  {
    id: "fallback-1",
    title: "Mastering High-Concurrency Distributed Systems in 2024",
    excerpt: "Top engineering minds sharing knowledge today.",
    category: { name: "System Design" },
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    readTime: 12,
    views: 24000,
    author: {
      firstname: "Alex",
      lastname: "Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    },
    isFallback: true
  },
  {
    id: "fallback-2",
    title: "The Shift to Server-Side Components",
    excerpt: "Exploring why the industry is moving back to the server for optimal performance.",
    category: { name: "Web Development" },
    readTime: 8,
    views: 1200,
    author: {
      firstname: "Sarah",
      lastname: "Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    },
    isFallback: true
  },
  {
    id: "fallback-3",
    title: "Edge Computing: The New Front Line",
    excerpt: "Latency-free experiences require a complete paradigm shift in deployment strategies.",
    category: { name: "Future Tech" },
    readTime: 10,
    views: 3100,
    author: {
      firstname: "Marcus",
      lastname: "Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    },
    isFallback: true
  }
];

const CuratedInsights = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await blogAPI.getAllBlogs({ page: 1, limit: 3 });
        if (res.success && res.data) {
          setBlogs(res.data.blogs || []);
        }
      } catch (e) {
        console.error("Failed to fetch public insights:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000) {
      return (views / 1000).toFixed(0) + 'k';
    }
    return views.toString();
  };

  const displayBlogs = [
    blogs[0] || fallbacks[0],
    blogs[1] || fallbacks[1],
    blogs[2] || fallbacks[2]
  ];

  const renderAvatar = (author, sizeClass = "w-8 h-8") => {
    if (author?.avatar) {
      return (
        <img 
          src={author.avatar} 
          alt="Author" 
          className={`${sizeClass} rounded-full border border-white/10 object-cover`} 
        />
      );
    }
    const initials = `${author?.firstname?.[0] || ''}${author?.lastname?.[0] || ''}`.toUpperCase() || author?.username?.[0]?.toUpperCase() || 'U';
    return (
      <div className={`${sizeClass} rounded-full border border-white/10 bg-gradient-to-br from-brand-purple/40 to-brand-cyan/30 flex items-center justify-center text-[10px] font-bold text-white`}>
        {initials}
      </div>
    );
  };

  const getAuthorName = (author) => {
    if (!author) return "";
    const first = author.firstname || "";
    const last = author.lastname || "";
    if (first || last) return `${first} ${last}`.trim();
    return author.username || "Anonymous";
  };

  const mainBlog = displayBlogs[0];
  const sideBlog1 = displayBlogs[1];
  const sideBlog2 = displayBlogs[2];

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2">Curated Insights</h2>
          <p className="text-gray-400">Top engineering minds sharing knowledge today.</p>
        </div>
        <Link 
          to="/my-blogs" 
          className="hidden sm:flex text-brand-blue hover:text-brand-cyan transition-colors items-center gap-1 text-sm font-medium"
        >
          View All <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured Post */}
        <Link to={mainBlog.isFallback ? "#" : `/post/${mainBlog.id}`} className="lg:col-span-2 block">
          <GlassCard className="relative group cursor-pointer h-[500px]">
            <img 
              src={mainBlog.thumbnail || fallbacks[0].thumbnail} 
              alt={mainBlog.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/60 to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-8">
              <span className="inline-block px-3 py-1 bg-brand-cyan/20 text-brand-cyan text-xs font-semibold rounded-full mb-4 backdrop-blur-md">
                {mainBlog.category?.name || "System Design"}
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-brand-blue transition-colors">
                {mainBlog.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  {renderAvatar(mainBlog.author, "w-8 h-8")}
                  <span className="font-medium text-white">{getAuthorName(mainBlog.author)}</span>
                </div>
                <span>•</span>
                <span>{mainBlog.readTime || 12} min read</span>
                <span>•</span>
                <span>{formatViews(mainBlog.views)} views</span>
              </div>
            </div>
          </GlassCard>
        </Link>

        {/* Side Posts */}
        <div className="flex flex-col gap-6">
          <Link to={sideBlog1.isFallback ? "#" : `/post/${sideBlog1.id}`} className="block h-full">
            <GlassCard className="p-6 flex flex-col justify-between h-full group cursor-pointer hover:bg-bg-card-hover/60">
              <div>
                <span className="text-brand-purple text-xs font-semibold mb-3 block">
                  {sideBlog1.category?.name || "Web Development"}
                </span>
                <h4 className="text-xl font-bold mb-3 group-hover:text-brand-purple transition-colors">
                  {sideBlog1.title}
                </h4>
                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                  {sideBlog1.excerpt || "Exploring new frontiers in frontend engineering and software components."}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-6">
                {renderAvatar(sideBlog1.author, "w-6 h-6")}
                <span className="text-xs text-gray-300">{getAuthorName(sideBlog1.author)}</span>
              </div>
            </GlassCard>
          </Link>

          <Link to={sideBlog2.isFallback ? "#" : `/post/${sideBlog2.id}`} className="block h-full">
            <GlassCard className="p-6 flex flex-col justify-between h-full group cursor-pointer hover:bg-bg-card-hover/60">
              <div>
                <span className="text-brand-blue text-xs font-semibold mb-3 block">
                  {sideBlog2.category?.name || "Future Tech"}
                </span>
                <h4 className="text-xl font-bold mb-3 group-hover:text-brand-blue transition-colors">
                  {sideBlog2.title}
                </h4>
                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                  {sideBlog2.excerpt || "Decentralized networks and cloud computing performance optimizations."}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-6">
                {renderAvatar(sideBlog2.author, "w-6 h-6")}
                <span className="text-xs text-gray-300">{getAuthorName(sideBlog2.author)}</span>
              </div>
            </GlassCard>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CuratedInsights;
