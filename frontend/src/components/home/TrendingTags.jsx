import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Tag from '../ui/Tag';
import { blogAPI } from '../../lib/api';

const DEFAULT_TAGS = [
  { label: '#Rust', query: 'Rust' },
  { label: '#DistributedSystems', query: 'Distributed Systems' },
  { label: '#AI', query: 'AI' },
  { label: '#WebAssembly', query: 'WebAssembly' },
  { label: '#Kubernetes', query: 'Kubernetes' },
  { label: '#TypeScript', query: 'TypeScript' },
  { label: '#Cryptography', query: 'Cryptography' }
];

const TrendingTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTags = async () => {
      try {
        const res = await blogAPI.getExploreData();
        if (res.success && res.data && res.data.trendingTags && res.data.trendingTags.length > 0) {
          setTags(res.data.trendingTags);
        } else {
          setTags(DEFAULT_TAGS);
        }
      } catch (err) {
        console.error("Failed to load trending tags ticker:", err);
        setTags(DEFAULT_TAGS);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingTags();
  }, []);

  return (
    <section className="space-y-8 mb-16">
      {/* Horizontal Ticker / Marquee */}
      <div className="w-full overflow-hidden border-y border-border-subtle/50 bg-bg-card/30 py-3.5 relative">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-12 text-xs font-mono tracking-widest text-gray-500 uppercase">
          {Array(4).fill(null).map((_, groupIdx) => (
            <React.Fragment key={groupIdx}>
              <span>Join 50k+ Engineers ❄</span>
              <span className="text-brand-cyan">NovaBlog Architecture 💻</span>
              <span>Join 50k+ Engineers ❄</span>
              <span className="text-brand-purple">Scale Beyond Limits ⚡</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tailwind keyframe insertion for marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Trending Topics Grid */}
      <div className="max-w-7xl mx-auto px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-md sm:text-lg font-bold text-white tracking-tight uppercase">
            Trending Technical Topics
          </h2>
          <Link 
            to="/explore" 
            className="text-xs font-semibold text-gray-400 hover:text-brand-cyan transition-colors flex items-center gap-1.5"
          >
            View all topics <span>→</span>
          </Link>
        </div>

        {/* Tag chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
          {loading ? (
            Array(5).fill(null).map((_, idx) => (
              <div 
                key={idx} 
                className="h-8 w-24 bg-white/[0.03] border border-border-subtle rounded-full animate-pulse" 
              />
            ))
          ) : (
            tags.map((tag, idx) => (
              <Link 
                key={idx} 
                to={`/explore?search=${encodeURIComponent(tag.query)}`}
                className="block"
              >
                <Tag active={idx === 0} className="!text-[11px] !py-1.5 !px-3.5 border border-border-subtle bg-bg-card hover:border-brand-cyan/40 hover:text-brand-cyan transition-colors cursor-pointer">
                  {tag.label}
                </Tag>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingTags;
