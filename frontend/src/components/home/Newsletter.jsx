import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';

const Newsletter = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 mb-16">
      <GlassCard className="p-8 sm:p-12 border border-border-subtle bg-bg-card/80 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden shadow-2xl">
        {/* Glow Background */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-purple/10 rounded-full blur-[80px] -z-10" />

        {/* Copy */}
        <div className="max-w-md space-y-3 text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The Weekly Compile
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Zero fluff. Just pure technical insights, architectural breakdowns, and code delivered straight to your terminal.
          </p>
        </div>
        
        {/* Form Container */}
        <div className="w-full md:w-auto flex-1 max-w-md space-y-3">
          <form className="flex flex-col sm:flex-row gap-2.5 items-stretch" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Developer network email..." 
              className="w-full bg-border-subtle/20 border border-border-subtle rounded-xl px-5 py-3 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brand-cyan transition-colors"
              required
            />
            <Button variant="primary" className="py-3 px-6 text-xs font-bold uppercase tracking-wider whitespace-nowrap !rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple hover:opacity-95 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              Subscribe
            </Button>
          </form>
          <p className="text-[10px] text-gray-500 pl-2 text-left">
            by subscribing, you agree to our <Link to="/privacy" className="underline hover:text-white transition-colors">privacy protocol</Link>
          </p>
        </div>
      </GlassCard>
    </section>
  );
};

export default Newsletter;
