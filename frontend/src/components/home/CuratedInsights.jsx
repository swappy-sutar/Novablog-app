import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';

const CuratedInsights = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2">Curated Insights</h2>
          <p className="text-gray-400">Top engineering minds sharing knowledge today.</p>
        </div>
        <a href="#" className="hidden sm:flex text-brand-blue hover:text-brand-cyan transition-colors items-center gap-1 text-sm font-medium">
          View All <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured Post */}
        <Link to="/post/1" className="lg:col-span-2 block">
          <GlassCard className="relative group cursor-pointer h-[500px]">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
            alt="Abstract complex data structure" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-8">
            <span className="inline-block px-3 py-1 bg-brand-cyan/20 text-brand-cyan text-xs font-semibold rounded-full mb-4 backdrop-blur-md">
              System Design
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-brand-blue transition-colors">
              Mastering High-Concurrency Distributed Systems in 2024
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <img src="https://i.pravatar.cc/100?img=33" alt="Author" className="w-8 h-8 rounded-full border border-gray-600" />
                <span className="font-medium text-white">Alex Rivera</span>
              </div>
              <span>•</span>
              <span>12 min read</span>
              <span>•</span>
              <span>24k views</span>
            </div>
          </div>
        </GlassCard>
        </Link>

        {/* Side Posts */}
        <div className="flex flex-col gap-6">
          <GlassCard className="p-6 flex flex-col justify-between h-full group cursor-pointer hover:bg-bg-card-hover/60">
            <div>
              <span className="text-brand-purple text-xs font-semibold mb-3 block">Web Development</span>
              <h4 className="text-xl font-bold mb-3 group-hover:text-brand-purple transition-colors">The Shift to Server-Side Components</h4>
              <p className="text-gray-400 text-sm line-clamp-2">Exploring why the industry is moving back to the server for optimal performance.</p>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <img src="https://i.pravatar.cc/100?img=47" alt="Author" className="w-6 h-6 rounded-full" />
              <span className="text-xs text-gray-300">Sarah Chen</span>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col justify-between h-full group cursor-pointer hover:bg-bg-card-hover/60">
            <div>
              <span className="text-brand-blue text-xs font-semibold mb-3 block">Future Tech</span>
              <h4 className="text-xl font-bold mb-3 group-hover:text-brand-blue transition-colors">Edge Computing: The New Front Line</h4>
              <p className="text-gray-400 text-sm line-clamp-2">Latency-free experiences require a complete paradigm shift in deployment strategies.</p>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <img src="https://i.pravatar.cc/100?img=12" alt="Author" className="w-6 h-6 rounded-full" />
              <span className="text-xs text-gray-300">Marcus Johnson</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default CuratedInsights;
