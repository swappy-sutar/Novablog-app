import { Link, useNavigate } from 'react-router-dom';
import Tag from '../ui/Tag';

const getTitleSizeClass = (titleText) => {
  if (!titleText) return "text-4xl md:text-5xl lg:text-6xl";
  const len = titleText.length;
  if (len > 150) {
    return "text-xl sm:text-2xl md:text-3xl";
  }
  if (len > 100) {
    return "text-2xl sm:text-3xl md:text-4xl";
  }
  if (len > 50) {
    return "text-3xl sm:text-4xl md:text-5xl";
  }
  return "text-4xl sm:text-5xl md:text-6xl";
};

const BlogHero = ({ blog }) => {
  const navigate = useNavigate();
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
      <div className="absolute inset-0 -z-10 w-full h-full">
        <img 
          src={coverImage} 
          alt={blog.title} 
          className="w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/80 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200 transition-colors group cursor-pointer font-semibold bg-border-subtle/30 hover:bg-border-subtle/80 border border-border-subtle py-2 px-4 rounded-xl"
          >
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Link to="/" className="hover:text-gray-200 transition-colors">Feed</Link>
            <span>/</span>
            <Link to="/explore" className="hover:text-gray-200 transition-colors">Explore</Link>
            <span>/</span>
            <span className="text-gray-400 truncate max-w-[120px] sm:max-w-[200px]">{blog.title}</span>
          </div>
        </div>
 
        <div className="flex items-center gap-3 mb-6">
          <Tag active>{categoryName}</Tag>
          <span className="text-gray-400 text-xs tracking-widest uppercase font-semibold">Featured Article</span>
        </div>
        
        <h1 className={`${getTitleSizeClass(blog.title)} font-bold tracking-tight mb-8 leading-tight text-gray-200`}>
          {blog.title}
        </h1>
 
        <Link 
          to={blog.author?.username ? `/profile/${blog.author.username}` : "#"}
          className="flex items-center gap-4 border-t border-border-subtle pt-6 mt-6 w-max group cursor-pointer"
        >
          {blog.author?.avatar ? (
            <img 
              src={blog.author.avatar} 
              alt={authorName} 
              className="w-12 h-12 rounded-full border-2 border-brand-blue/30 object-cover group-hover:border-brand-blue/60 transition-colors" 
            />
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-brand-blue/30 bg-gradient-to-br from-brand-purple/40 to-brand-cyan/20 flex items-center justify-center text-sm font-bold text-[#ffffff] group-hover:border-brand-blue/60 transition-colors">
              {initials}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-200 group-hover:text-brand-cyan transition-colors">{authorName}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              <span>•</span>
              <span>{blog.readTime || 5} min read</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default BlogHero;
