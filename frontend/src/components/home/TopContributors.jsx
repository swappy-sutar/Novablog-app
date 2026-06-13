import React from 'react';
import GlassCard from '../ui/GlassCard';

const TopContributors = () => {
  const contributors = [
    { name: 'Marco Silva', handle: '@msilva_dev', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Sarah Chen', handle: '@schen_js', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Jordan Poe', handle: '@jpoe_writes', avatar: 'https://i.pravatar.cc/150?img=8' },
    { name: 'Lee Park', handle: '@leedev', avatar: 'https://i.pravatar.cc/150?img=15' },
    { name: 'Aria Vane', handle: '@aria_v', avatar: 'https://i.pravatar.cc/150?img=20' },
    { name: 'Devin Gray', handle: '@graycode', avatar: 'https://i.pravatar.cc/150?img=53' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Top Contributors</h2>
        <p className="text-gray-400">The authors shaping the developer discourse.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {contributors.map((user, idx) => (
          <GlassCard key={idx} className="p-6 flex flex-col items-center text-center cursor-pointer group hover:border-brand-cyan/30">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-brand-cyan/20 blur-md group-hover:bg-brand-cyan/40 transition-colors"></div>
              <img src={user.avatar} alt={user.name} className="relative w-20 h-20 rounded-full border-2 border-border-subtle group-hover:border-brand-cyan transition-colors z-10" />
            </div>
            <h4 className="font-semibold text-white">{user.name}</h4>
            <span className="text-xs text-brand-purple">{user.handle}</span>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default TopContributors;
