import React from 'react';
import Tag from '../ui/Tag';

const BlogHero = ({ blog }) => {
  if (!blog) return null;

  const initials = `${blog.author?.firstname?.[0] || ''}${blog.author?.lastname?.[0] || ''}`.toUpperCase() || blog.author?.username?.[0]?.toUpperCase() || 'U';
  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const authorName = `${blog.author?.firstname || ''} ${blog.author?.lastname || ''}`.trim() || blog.author?.username || "Anonymous";

  // Category fallback
  const categoryName = blog.category?.name || "Engineering";

  // Cover image fallback
  const coverImage = blog.thumbnail || "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2664&auto=format&fit=crop";

  return (
    <section className="relative w-full overflow-hidden mb-16">
      {/* Massive featured image */}
      <div className="absolute inset-0 -z-10 h-[600px] w-full">
        <img 
          src={coverImage} 
          alt={blog.title} 
          className="w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/80 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <Tag active>{categoryName}</Tag>
          <span className="text-gray-400 text-xs tracking-widest uppercase font-semibold">Featured Article</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight text-white">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 border-t border-border-subtle pt-6 mt-6 w-max">
          {blog.author?.avatar ? (
            <img 
              src={blog.author.avatar} 
              alt={authorName} 
              className="w-12 h-12 rounded-full border-2 border-brand-blue/30 object-cover" 
            />
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-brand-blue/30 bg-gradient-to-br from-brand-purple/40 to-brand-cyan/20 flex items-center justify-center text-sm font-bold text-white">
              {initials}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-white">{authorName}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              <span>•</span>
              <span>{blog.readTime || 5} min read</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
