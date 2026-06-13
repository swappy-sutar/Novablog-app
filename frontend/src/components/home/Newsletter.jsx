import React from 'react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';

const Newsletter = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 mb-24">
      <GlassCard className="p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 border-brand-blue/20">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-4">The Weekly Compile</h2>
          <p className="text-gray-400">
            Get a curated summary of the week's most influential technical articles, delivered to your inbox every Monday.
          </p>
        </div>
        
        <div className="w-full md:w-auto flex-1 max-w-md">
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-bg-base/50 border border-border-subtle rounded-full px-6 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
              required
            />
            <Button variant="primary" className="py-3 px-8 whitespace-nowrap">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-3 pl-4">No spam. Only high-signal technical content. Unsubscribe anytime.</p>
        </div>
      </GlassCard>
    </section>
  );
};

export default Newsletter;
