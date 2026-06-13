import React from 'react';
import GlassCard from '../ui/GlassCard';

const ArticleContent = () => {
  return (
    <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-brand-cyan hover:prose-a:text-brand-blue prose-pre:bg-bg-card prose-pre:border prose-pre:border-border-subtle">
      
      <p className="lead text-xl text-gray-300 leading-relaxed mb-8">
        <span className="float-left text-6xl font-bold text-brand-purple leading-none pr-3 pt-2">D</span>istributed systems are evolving at a pace that demands a complete rethink of how we handle UI synchronization across multiple clusters. The challenge isn't just about speed anymore; it's about the precision of state management in a world where "latency-free" is the baseline expectation of every developer.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-6">The Shift to Edge Consciousness</h2>
      <p className="text-gray-400 mb-6 leading-relaxed">
        We've moved past simple client-server architectures. Today's applications are edge-native, requiring rendering engines that understand global state as a fluid entity rather than a static database record. 
      </p>

      {/* Code Snippet Container */}
      <div className="my-10 rounded-xl overflow-hidden border border-border-subtle bg-[#0d0d17]">
        <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-border-subtle">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-500 font-mono">render_engine.rs</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="p-6 text-sm font-mono text-gray-300 overflow-x-auto">
          <code>
{`async fn optimize_state(cluster: &Cluster) -> Result<(), Error> {
    // Distribute rendering buffer across edge locations
    let buffer = Buffer::new("global_sync");
    
    loop {
        match cluster.pulse().await {
            Ok(signal) => buffer.commit(signal),
            Err(_) => break,
        }
    }
}`}
          </code>
        </pre>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6">Architectural Pillars</h2>
      <p className="text-gray-400 mb-8 leading-relaxed">
        The core of our approach relies on three fundamental principles that bridge the gap between backend reliability and frontend fluidity:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 not-prose">
        <GlassCard className="p-5 border-t-2 border-t-brand-purple">
          <div className="w-8 h-8 rounded bg-brand-purple/20 flex items-center justify-center mb-4">
            <svg className="w-4 h-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>
          <h4 className="font-semibold text-white mb-2 text-sm">Always-State</h4>
          <p className="text-xs text-gray-400">Continuous state updates across nodes.</p>
        </GlassCard>
        <GlassCard className="p-5 border-t-2 border-t-brand-cyan">
          <div className="w-8 h-8 rounded bg-brand-cyan/20 flex items-center justify-center mb-4">
            <svg className="w-4 h-4 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h4 className="font-semibold text-white mb-2 text-sm">Predictive Rendering</h4>
          <p className="text-xs text-gray-400">Zero-latency streams by predicting UI.</p>
        </GlassCard>
        <GlassCard className="p-5 border-t-2 border-t-brand-blue">
          <div className="w-8 h-8 rounded bg-brand-blue/20 flex items-center justify-center mb-4">
            <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <h4 className="font-semibold text-white mb-2 text-sm">Fluid Orchestration</h4>
          <p className="text-xs text-gray-400">Micro-animations on distributed events.</p>
        </GlassCard>
      </div>

      <GlassCard className="my-12 p-8 border-l-4 border-l-brand-cyan bg-gradient-to-r from-brand-cyan/10 to-transparent not-prose">
        <h3 className="text-2xl font-bold text-white mb-4">"The most efficient system is the one that anticipates the bottleneck before the first packet is even sent."</h3>
        <p className="text-sm text-brand-cyan font-semibold">— Dr. Elena Vance, CTO at NovaTech</p>
      </GlassCard>

      <p className="text-gray-400 leading-relaxed mb-8">
        As we look toward the next decade of development, the boundaries between the OS and the browser will continue to dissolve, creating a unified workspace for digital creation.
      </p>

    </article>
  );
};

export default ArticleContent;
