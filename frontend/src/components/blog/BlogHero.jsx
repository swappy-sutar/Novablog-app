import React from 'react';
import GradientText from '../ui/GradientText';
import Tag from '../ui/Tag';

const BlogHero = () => {
  return (
    <section className="relative w-full overflow-hidden mb-16">
      {/* Massive featured image */}
      <div className="absolute inset-0 -z-10 h-[600px] w-full">
        <img 
          src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2664&auto=format&fit=crop" 
          alt="Future of Concurrent Rendering" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/80 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <Tag active>Engineering</Tag>
          <span className="text-gray-400 text-xs tracking-widest uppercase font-semibold">Featured Article</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight text-white">
          The Future of <GradientText>Concurrent</GradientText> <br className="hidden md:block"/>
          <GradientText>Rendering</GradientText> in Distributed Systems
        </h1>

        <div className="flex items-center gap-4 border-t border-border-subtle pt-6 mt-6 w-max">
          <img src="https://i.pravatar.cc/100?img=33" alt="Author" className="w-12 h-12 rounded-full border-2 border-brand-blue/30" />
          <div>
            <h4 className="font-semibold text-white">Alex Rivera</h4>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Nov 14, 2024</span>
              <span>•</span>
              <span>12 min read</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
