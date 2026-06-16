import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import BlogHero from '../components/blog/BlogHero';
import Sidebar from '../components/blog/Sidebar';
import ArticleContent from '../components/blog/ArticleContent';
import ShareToolbar from '../components/blog/ShareToolbar';
import Discussion from '../components/blog/Discussion';
import GlassCard from '../components/ui/GlassCard';
import { blogAPI, likeAPI } from '../lib/api';

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    loadBlogData();
  }, [loadBlogData]);

  const handleToggleLike = async () => {
    try {
      const res = await likeAPI.toggleLike(id);
      if (res.success && res.data) {
        const liked = res.data.liked;
        setUserLiked(liked);
        setLikeCount((prev) => (liked ? prev + 1 : Math.max(0, prev - 1)));
        toast.success(liked ? "Post liked!" : "Post unliked.");
      }
    } catch (e) {
      console.error(e);
      // Check if user is logged in
      if (e.response?.status === 401) {
        toast.error("Please log in to like posts.");
      } else {
        toast.error("Failed to toggle like.");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center justify-center min-h-[60vh] gap-4 pt-24">
        <div className="w-10 h-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Retrieving article details...</p>
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
      />

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-start gap-12 lg:gap-16 relative">
        <Sidebar blog={blog} />
        
        <div className="flex-grow w-full max-w-3xl min-w-0">
          <ArticleContent blog={blog} />
          
          {/* Related Articles Section */}
          <section className="mt-20 border-t border-border-subtle pt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">More from NovaBlog</h3>
              <a href="#" className="text-sm text-brand-blue hover:text-brand-cyan transition-colors flex items-center gap-1">
                View all <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { category: 'Cybersecurity', title: 'Quantum-Resistant Encryption in Node.js', color: 'brand-cyan', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop' },
                { category: 'Cloud Arch', title: 'Serverless: The Hidden Operational Cost', color: 'brand-blue', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop' },
                { category: 'Hardware', title: 'Optimizing Silicon for Edge WebAssembly', color: 'brand-purple', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop' },
              ].map((item, i) => (
                <GlassCard key={i} className="group cursor-pointer border-transparent hover:border-border-subtle">
                  <div className="h-32 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider text-${item.color} mb-2 block`}>{item.category}</span>
                    <h4 className="font-bold text-white text-sm group-hover:text-brand-blue transition-colors">{item.title}</h4>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          <Discussion blog={blog} />
        </div>
      </div>
    </motion.div>
  );
};

export default BlogDetailsPage;
