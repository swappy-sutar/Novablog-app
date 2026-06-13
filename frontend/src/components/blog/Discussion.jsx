import React from 'react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';

const Discussion = () => {
  return (
    <section className="mt-20 pt-10 border-t border-border-subtle max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          Discussions <span className="bg-brand-blue/20 text-brand-blue text-xs py-1 px-2 rounded-full">124</span>
        </h3>
        <select className="bg-bg-base border border-border-subtle text-sm text-gray-400 p-2 rounded-lg focus:outline-none focus:border-brand-cyan">
          <option>Sort by: Newest</option>
          <option>Sort by: Top</option>
        </select>
      </div>

      {/* Comment Input */}
      <GlassCard className="p-6 mb-10 border-brand-cyan/20">
        <div className="flex gap-4">
          <img src="https://i.pravatar.cc/100?img=11" alt="You" className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <textarea 
              className="w-full bg-black/40 border border-border-subtle rounded-lg p-4 text-sm text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none min-h-[100px] resize-none"
              placeholder="Add to the discussion..."
            ></textarea>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-gray-400">
                <button className="hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg></button>
                <button className="hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
              </div>
              <Button variant="primary" className="py-2 px-6 text-sm">Post Comment</Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Comment Thread */}
      <div className="space-y-8">
        <div className="flex gap-4">
          <img src="https://i.pravatar.cc/100?img=5" alt="User" className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">Sarah Chen</span>
                <span className="text-xs text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded">Author</span>
                <span className="text-xs text-gray-500">2h ago</span>
              </div>
              <button className="text-gray-500 hover:text-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg></button>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              The approach to predictive prefetching is fascinating. I'm curious if you've encountered any specific race conditions when dealing with cold-start shards in the virtualization layer?
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <button className="flex items-center gap-1 hover:text-white"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514" /></svg> 24</button>
              <button className="flex items-center gap-1 hover:text-white"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg> Reply</button>
            </div>

            {/* Nested Reply */}
            <div className="mt-4 flex gap-4 bg-bg-card p-4 rounded-xl border border-border-subtle">
              <img src="https://i.pravatar.cc/100?img=33" alt="Alex" className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white text-sm">Alex Rivera</span>
                  <span className="text-xs text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded">Maintainer</span>
                  <span className="text-xs text-gray-500">1h ago</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-2">
                  Great question. It definitely exists! We solved it by implementing a ghost-routing layer that keeps a shadow copy of the state in memory over WASM before it hits.
                </p>
                <button className="flex items-center gap-1 hover:text-white text-xs text-gray-500"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514" /></svg> 12</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full mt-8 py-3 text-sm text-gray-400 hover:text-white border border-border-subtle hover:border-gray-500 rounded-lg transition-colors">
        Load more comments
      </button>
    </section>
  );
};

export default Discussion;
