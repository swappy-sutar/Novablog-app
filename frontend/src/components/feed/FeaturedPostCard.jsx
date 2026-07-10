import { Link } from "react-router-dom";
import { Eye, Clock } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const FeaturedPostCard = ({ post }) => {
  const { id, title, category, author, avatarUrl, readTime, views, thumbnailUrl, authorUsername } = post;

  return (
    <GlassCard className="h-full overflow-hidden p-0 flex flex-col border border-border-subtle bg-bg-card hover:border-brand-purple/40 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300">
      {/* Full-bleed Thumbnail */}
      <Link to={`/post/${id}`} className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0 bg-border-subtle/20 group/thumbnail block cursor-pointer">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-contain bg-black/20 group-hover/thumbnail:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2664&auto=format&fit=crop"
            alt={title}
            className="w-full h-full object-contain bg-black/20 group-hover/thumbnail:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-bg-base/70 backdrop-blur-sm border border-border-subtle text-[10px] font-bold text-brand-purple tracking-wider uppercase">
          {category}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <Link to={`/post/${id}`} className="space-y-2 block group/title cursor-pointer">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug group-hover/title:text-brand-purple transition-colors line-clamp-3">
            {title}
          </h3>
        </Link>

        {/* Author & Meta Row */}
        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-border-subtle pt-4">
          <Link
            to={authorUsername ? `/profile/${authorUsername}` : "#"}
            className="flex items-center gap-2 group/author cursor-pointer"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={author}
                className="w-6 h-6 rounded-full object-cover border border-border-subtle group-hover/author:border-brand-purple/50 transition-colors"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center font-bold text-[10px] group-hover/author:bg-brand-purple/30 transition-colors">
                {author?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="font-medium text-white group-hover/author:text-brand-purple transition-colors">{author}</span>
          </Link>

          <div className="flex items-center gap-3 text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {views}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default FeaturedPostCard;
