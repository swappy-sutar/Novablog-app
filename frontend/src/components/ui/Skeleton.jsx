import { motion } from "framer-motion";

// Shared shimmer element
export const Shimmer = () => (
  <motion.div
    className="absolute inset-0 shimmer-gradient"
    animate={{
      x: ["-100%", "100%"],
    }}
    transition={{
      repeat: Infinity,
      duration: 1.6,
      ease: "easeInOut",
    }}
  />
);

// Basic skeleton block
export const SkeletonBlock = ({ className = "" }) => (
  <div className={`relative bg-border-subtle/30 overflow-hidden ${className}`}>
    <Shimmer />
  </div>
);

// Featured post card skeleton (FeedPage)
export const FeaturedPostSkeleton = () => {
  return (
    <div className="relative rounded-2xl border border-border-subtle bg-bg-card overflow-hidden h-full flex flex-col min-h-[380px]">
      {/* Thumbnail skeleton */}
      <SkeletonBlock className="h-44 sm:h-52 w-full shrink-0" />
      {/* Content skeleton */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <SkeletonBlock className="h-3 w-16 rounded-md" />
          <SkeletonBlock className="h-5 w-11/12 rounded-lg" />
          <SkeletonBlock className="h-5 w-3/4 rounded-lg" />
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-subtle/50 pt-4">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="w-6 h-6 rounded-full" />
            <SkeletonBlock className="w-24 h-3.5 rounded" />
          </div>
          <div className="flex gap-3">
            <SkeletonBlock className="w-12 h-3.5 rounded" />
            <SkeletonBlock className="w-10 h-3.5 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

// PostCard skeleton (FeedPage - Compact / Grid variant)
export const PostCardSkeleton = ({ variant = "grid" }) => {
  const isCompact = variant === "compact";
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-5 h-full flex flex-col justify-between min-h-[175px]">
      <div className="space-y-3">
        <SkeletonBlock className="h-3 w-14 rounded-md" />
        <SkeletonBlock className={`h-4.5 rounded-lg ${isCompact ? "w-11/12" : "w-10/12"}`} />
        {!isCompact && <SkeletonBlock className="h-4.5 w-7/12 rounded-lg" />}
      </div>

      <div className="flex items-center justify-between mt-5 pt-3 border-t border-border-subtle/50">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="w-5.5 h-5.5 rounded-full" />
          <SkeletonBlock className="w-20 h-3 rounded" />
        </div>
        {!isCompact && (
          <SkeletonBlock className="w-14 h-3 rounded" />
        )}
      </div>
    </div>
  );
};

// Explore featured card skeleton (ExplorePage)
export const ExploreFeaturedSkeleton = ({ className = "" }) => {
  return (
    <div className={`relative h-[480px] overflow-hidden flex flex-col justify-end p-8 border border-white/5 bg-bg-card rounded-2xl ${className}`}>
      <div className="space-y-4 max-w-xl z-10">
        <SkeletonBlock className="w-16 h-4.5 rounded-md" />
        <SkeletonBlock className="w-11/12 h-7 rounded-lg" />
        <SkeletonBlock className="w-3/4 h-7 rounded-lg" />
        <div className="space-y-2 pt-2">
          <SkeletonBlock className="w-full h-3.5 rounded" />
          <SkeletonBlock className="w-5/6 h-3.5 rounded" />
        </div>
        <SkeletonBlock className="w-32 h-9 rounded-xl mt-4" />
      </div>
    </div>
  );
};

// Explore popular card skeleton (ExplorePage)
export const ExplorePopularSkeleton = () => {
  return (
    <div className="p-6 flex flex-col justify-between h-[228px] border border-white/5 bg-bg-card rounded-2xl">
      <div className="space-y-3">
        <SkeletonBlock className="w-16 h-3 rounded-md" />
        <SkeletonBlock className="w-11/12 h-4.5 rounded-lg" />
        <div className="space-y-2 pt-1">
          <SkeletonBlock className="w-full h-3 rounded" />
          <SkeletonBlock className="w-4/5 h-3 rounded" />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border-subtle pt-3 mt-4">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="w-6 h-6 rounded-full" />
          <SkeletonBlock className="w-20 h-3 rounded" />
        </div>
        <SkeletonBlock className="w-14 h-3 rounded" />
      </div>
    </div>
  );
};

// Explore general insight card skeleton (ExplorePage / MyBlogsPage)
export const ExploreInsightSkeleton = () => {
  return (
    <div className="flex flex-col h-[400px] border border-white/5 bg-bg-card rounded-2xl overflow-hidden">
      <SkeletonBlock className="h-44 w-full shrink-0" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <SkeletonBlock className="w-16 h-3 rounded-md" />
          <SkeletonBlock className="w-11/12 h-4.5 rounded-lg" />
          <SkeletonBlock className="w-3/4 h-4.5 rounded-lg" />
          <div className="space-y-2 pt-1">
            <SkeletonBlock className="w-full h-3 rounded" />
            <SkeletonBlock className="w-5/6 h-3 rounded" />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border-subtle pt-4">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="w-6 h-6 rounded-full" />
            <SkeletonBlock className="w-20 h-3 rounded" />
          </div>
          <SkeletonBlock className="w-16 h-3 rounded" />
        </div>
      </div>
    </div>
  );
};

// Profile page skeleton loader
export const ProfileSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-12 space-y-8">
      {/* Profile Header GlassCard Skeleton */}
      <div className="p-6 md:p-8 rounded-2xl border border-white/5 bg-bg-card relative overflow-hidden flex flex-col md:flex-row items-start gap-6">
        {/* Avatar skeleton */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/5 shrink-0" />
        
        {/* Bio details skeleton */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <SkeletonBlock className="h-6 w-48 rounded-lg" />
              <SkeletonBlock className="h-4 w-32 rounded" />
            </div>
            <SkeletonBlock className="h-9 w-24 rounded-xl" />
          </div>

          <div className="space-y-2 pt-2">
            <SkeletonBlock className="h-4 w-full rounded" />
            <SkeletonBlock className="h-4 w-5/6 rounded" />
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <SkeletonBlock className="h-4.5 w-24 rounded" />
            <SkeletonBlock className="h-4.5 w-24 rounded" />
            <SkeletonBlock className="h-4.5 w-28 rounded" />
          </div>
        </div>
      </div>

      {/* Profile Details Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About column */}
        <div className="md:col-span-1 space-y-6">
          {/* Tech stack card skeleton */}
          <div className="p-6 rounded-2xl border border-white/5 bg-bg-card space-y-4">
            <SkeletonBlock className="h-5 w-24 rounded" />
            <div className="flex flex-wrap gap-2">
              <SkeletonBlock className="h-7 w-16 rounded-lg" />
              <SkeletonBlock className="h-7 w-20 rounded-lg" />
              <SkeletonBlock className="h-7 w-14 rounded-lg" />
              <SkeletonBlock className="h-7 w-24 rounded-lg" />
            </div>
          </div>

          {/* Activity card skeleton */}
          <div className="p-6 rounded-2xl border border-white/5 bg-bg-card space-y-4">
            <SkeletonBlock className="h-5 w-32 rounded" />
            <SkeletonBlock className="h-28 w-full rounded-lg" />
          </div>
        </div>

        {/* Blogs column */}
        <div className="md:col-span-2 space-y-6">
          <SkeletonBlock className="h-6 w-32 rounded-lg" />
          <div className="space-y-4">
            <div className="p-6 rounded-2xl border border-white/5 bg-bg-card space-y-3">
              <SkeletonBlock className="h-4.5 w-1/4 rounded" />
              <SkeletonBlock className="h-6 w-11/12 rounded-lg" />
              <SkeletonBlock className="h-4 w-5/6 rounded" />
              <div className="flex gap-4 pt-2">
                <SkeletonBlock className="h-4 w-12 rounded" />
                <SkeletonBlock className="h-4 w-16 rounded" />
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-bg-card space-y-3">
              <SkeletonBlock className="h-4.5 w-1/4 rounded" />
              <SkeletonBlock className="h-6 w-11/12 rounded-lg" />
              <SkeletonBlock className="h-4 w-5/6 rounded" />
              <div className="flex gap-4 pt-2">
                <SkeletonBlock className="h-4 w-12 rounded" />
                <SkeletonBlock className="h-4 w-16 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
