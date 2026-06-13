import React from 'react';
import Tag from '../ui/Tag';

const TrendingTags = () => {
  const tags = ['#TypeScript', '#Web3', '#Architecture', '#Rust', '#MachineLearning', '#DevOps'];

  return (
    <section className="py-10 border-y border-border-subtle bg-bg-base/50 mb-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center gap-6">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest whitespace-nowrap">
          Trending Now:
        </span>
        <div className="flex items-center gap-3 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-hide">
          {tags.map((tag, idx) => (
            <Tag key={idx} active={idx === 0}>{tag}</Tag>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingTags;
