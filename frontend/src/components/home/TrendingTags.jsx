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

const MARQUEE_ITEMS = [
  { text: 'NovaBlog Architecture 💻', color: 'text-brand-cyan' },
  { text: 'Built by Developers for Developers 🛠', color: 'text-gray-500' },
  { text: 'Markdown-First Editor ✍', color: 'text-gray-500' },
  { text: 'Scale Beyond Limits ⚡', color: 'text-brand-purple' },
  { text: 'SEO Optimized for Tech Articles 📈', color: 'text-gray-500' },
  { text: 'Ultra-Fast Static Site Speeds 🚀', color: 'text-gray-500' },
  { text: 'Open Source Friendly 🌐', color: 'text-gray-500' },
  { text: 'Write Once · Reach Millions ✦', color: 'text-brand-cyan' }
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
        <div className="flex w-max animate-[marquee_50s_linear_infinite] marquee-track">
          {/* Group 1 */}
          <div className="flex gap-12 pr-12 whitespace-nowrap text-xs font-mono tracking-widest uppercase">
            {MARQUEE_ITEMS.map((item, itemIdx) => (
              <span key={itemIdx} className={item.color}>
                {item.text}
              </span>
            ))}
          </div>
          {/* Group 2 (Duplicate for seamless loop) */}
          <div className="flex gap-12 pr-12 whitespace-nowrap text-xs font-mono tracking-widest uppercase">
            {MARQUEE_ITEMS.map((item, itemIdx) => (
              <span key={itemIdx} className={item.color}>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tailwind keyframe insertion for marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover {
          animation-play-state: paused;
          cursor: pointer;
        }
      `}</style>

      {/* Trending Topics Grid */}
      <div className="max-w-7xl mx-auto px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-md sm:text-lg font-bold tracking-wider text-white uppercase">
            Trending Technical <span className="text-gradient">Topics</span>
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
