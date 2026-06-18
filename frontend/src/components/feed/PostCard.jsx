import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const PostCard = ({ post, variant = "grid" }) => {
  const { id, title, category, author, avatarUrl, readTime, authorUsername, thumbnailUrl } = post;
  const isCompact = variant === "compact";

  return (
    <GlassCard className="relative overflow-hidden group h-full flex flex-col justify-between border border-border-subtle bg-bg-card p-5 hover:border-brand-purple/40 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300">
      {/* Card background thumbnail layer */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src={thumbnailUrl || "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=600&auto=format&fit=crop"}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{
            opacity: "var(--card-thumbnail-opacity, 0.22)",
            filter: "var(--card-thumbnail-filter, grayscale(10%))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-bg-base/50 to-transparent transition-colors duration-500" />
      </div>

      {/* Content wrapper to place details on top of the background layer */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        <Link to={`/post/${id}`} className="block space-y-3 group/link cursor-pointer">
          {/* Category */}
          <span className="text-[10px] font-bold text-brand-cyan tracking-wider uppercase block">
            {category}
          </span>

          {/* Title */}
          <h3 className={`font-bold text-white tracking-tight leading-snug group-hover/link:text-brand-cyan transition-colors ${
            isCompact ? "text-base line-clamp-2" : "text-md sm:text-lg line-clamp-2"
          }`}>
            {title}
          </h3>
        </Link>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-5 pt-3 border-t border-border-subtle/50">
          <Link 
            to={authorUsername ? `/profile/${authorUsername}` : "#"} 
            className="flex items-center gap-2 group/author cursor-pointer"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={author}
                className="w-5.5 h-5.5 rounded-full object-cover border border-border-subtle group-hover/author:border-brand-purple/50 transition-colors"
              />
            ) : (
              <div className="w-5.5 h-5.5 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center font-bold text-[9px] group-hover/author:bg-brand-purple/30 transition-colors">
                {author?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="font-medium text-white group-hover/author:text-brand-purple transition-colors truncate max-w-[120px]">
              {author}
            </span>
          </Link>

          {!isCompact && (
            <span className="flex items-center gap-1 text-[11px] text-gray-500 shrink-0">
              <Clock className="w-3 h-3" />
              {readTime}
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default PostCard;
