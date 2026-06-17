import React, { useState, useEffect, useCallback } from "react";
import FeaturedPostCard from "../components/feed/FeaturedPostCard";
import PostCard from "../components/feed/PostCard";
import Button from "../components/ui/Button";
import { blogAPI } from "../lib/api";
import { FeaturedPostSkeleton, PostCardSkeleton } from "../components/ui/Skeleton";

const FeedPage = () => {
  const [activeTab, setActiveTab] = useState("Latest");
  const [selectedTag, setSelectedTag] = useState("All");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tagsList, setTagsList] = useState(["All", "React", "TypeScript", "Rust", "Web3", "DevOps", "AI"]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // 1. Fetch Tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await blogAPI.getTags();
        if (res.success && res.data) {
          const names = res.data.map((t) => t.name);
          setTagsList(["All", ...names]);
        }
      } catch (err) {
        console.error("Failed to load tags:", err);
      }
    };
    fetchTags();
  }, []);

  // 2. Fetch Feed posts
  const fetchFeedPosts = useCallback(async (pageNum, tabVal, tagVal, append = false) => {
    setLoading(true);
    try {
      const res = await blogAPI.getFeed({
        page: pageNum,
        limit: 9,
        tab: tabVal,
        tag: tagVal,
      });

      if (res.success && res.data) {
        const mapped = (res.data.blogs || []).map((blog) => {
          const authorName = blog.author
            ? `${blog.author.firstname || ""} ${blog.author.lastname || ""}`.trim() || blog.author.username
            : "Anonymous";
          return {
            id: blog.id,
            title: blog.title,
            category: blog.category?.name || "Insight",
            author: authorName,
            avatarUrl: blog.author?.avatar || null,
            readTime: `${blog.readTime || 5} min read`,
            views: blog.views || 0,
            thumbnailUrl: blog.thumbnail || null,
            tags: blog.tags?.map((t) => t.tag.name) || [],
            authorUsername: blog.author?.username || "",
          };
        });

        if (append) {
          setPosts((prev) => [...prev, ...mapped]);
        } else {
          setPosts(mapped);
        }

        const meta = res.data.meta;
        if (meta) {
          setHasMore(meta.page < meta.totalPages);
        }
      }
    } catch (err) {
      console.error("Failed to load feed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Trigger reload on filters changes
  useEffect(() => {
    setPage(1);
    fetchFeedPosts(1, activeTab, selectedTag, false);
  }, [activeTab, selectedTag, fetchFeedPosts]);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeedPosts(nextPage, activeTab, selectedTag, true);
  };

  // Divide posts into sections for the magazine layout
  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 3);
  const gridPosts = posts.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-10 font-sans">
      
      {/* 1. Header & Filter/Sort Bar */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Technical Feed</h1>
            <p className="text-sm text-gray-400 mt-1">Curated insights from the global developer narrative.</p>
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-1 bg-bg-card border border-border-subtle p-1 rounded-xl w-fit">
            {["Latest", "Trending", "Following"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan shadow-sm"
                      : "text-gray-400 hover:text-gray-200 border border-transparent"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tag Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {tagsList.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(tag);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                  isSelected
                    ? "bg-brand-purple border-brand-purple text-[#ffffff] shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                    : "bg-white/[0.02] border-border-subtle text-gray-400 hover:text-gray-200 hover:border-border-subtle/80"
                }`}
              >
                {tag === "All" ? "All Tags" : `#${tag}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border-subtle rounded-2xl bg-white/[0.01]">
          <span className="text-gray-500 text-sm">No articles match the selected filters.</span>
        </div>
      )}

      {/* Skeleton Loading State */}
      {loading && posts.length === 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-[14px]">
            <div className="h-full">
              <FeaturedPostSkeleton />
            </div>
            <div className="flex flex-col gap-[14px] justify-between h-full">
              <PostCardSkeleton variant="compact" />
              <PostCardSkeleton variant="compact" />
            </div>
          </div>
        </div>
      ) : (
        /* 2. Hero Block (Magazine Layout) */
        posts.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-[14px]">
            {/* Left: One large featured post card */}
            {featuredPost && (
              <div className="h-full">
                <FeaturedPostCard post={featuredPost} />
              </div>
            )}

            {/* Right: Stacked into 2 smaller post cards */}
            <div className="flex flex-col gap-[14px] justify-between">
              {sidePosts.map((post) => (
                <div key={post.id} className="flex-grow h-[calc(50%-7px)]">
                  <PostCard post={post} variant="compact" />
                </div>
              ))}
              {/* Fallback space filler if only 1 post matches filter */}
              {sidePosts.length === 0 && (
                <div className="flex items-center justify-center h-full border border-dashed border-border-subtle rounded-2xl bg-white/[0.01]">
                  <span className="text-xs text-gray-500">More articles coming soon</span>
                </div>
              )}
              {/* Fallback filler if only 2 posts match filter */}
              {sidePosts.length === 1 && (
                <div className="flex-grow h-[calc(50%-7px)] border border-dashed border-border-subtle rounded-2xl bg-white/[0.01]" />
              )}
            </div>
          </section>
        )
      )}

      {/* 3. Grid Section Below */}
      {gridPosts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white tracking-tight">More Perspectives</h2>
            <div className="h-px bg-border-subtle flex-grow" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {gridPosts.map((post) => (
              <div key={post.id}>
                <PostCard post={post} variant="grid" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Load More Control */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={handleLoadMore}
            variant="secondary"
            className="!rounded-xl border border-border-subtle hover:bg-white/[0.03] text-gray-300 px-8 py-3 text-xs font-bold tracking-wider uppercase"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Articles"}
          </Button>
        </div>
      )}

    </div>
  );
};

export default FeedPage;
