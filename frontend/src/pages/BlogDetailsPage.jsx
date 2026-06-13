import React from 'react';
import { motion } from 'framer-motion';
import BlogHero from '../components/blog/BlogHero';
import Sidebar from '../components/blog/Sidebar';
import ArticleContent from '../components/blog/ArticleContent';
import ShareToolbar from '../components/blog/ShareToolbar';
import Discussion from '../components/blog/Discussion';
import GlassCard from '../components/ui/GlassCard';

const BlogDetailsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-20 relative"
    >
      <BlogHero />
      <ShareToolbar />

      <div className="max-w-7xl mx-auto px-6 flex items-start gap-16 relative">
        <Sidebar />
        
        <div className="flex-1 max-w-3xl">
          <ArticleContent />
          
          {/* Related Articles Section */}
          <section className="mt-20 border-t border-border-subtle pt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">More from NovaBlog</h3>
              <a href="#" className="text-sm text-brand-blue hover:text-brand-cyan transition-colors flex items-center gap-1">
                View all <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { category: 'Cybersecurity', title: 'Quantum-Resistant Encryption in Node.js', color: 'brand-cyan', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop' },
                { category: 'Cloud Arch', title: 'Serverless: The Hidden Operational Cost', color: 'brand-blue', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop' },
                { category: 'Hardware', title: 'Optimizing Silicon for Edge WebAssembly', color: 'brand-purple', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop' },
              ].map((item, i) => (
                <GlassCard key={i} className="group cursor-pointer border-transparent hover:border-border-subtle">
                  <div className="h-32 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider text-${item.color} mb-2 block`}>{item.category}</span>
                    <h4 className="font-bold text-white text-sm group-hover:text-brand-blue transition-colors">{item.title}</h4>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          <Discussion />
        </div>
      </div>
    </motion.div>
  );
};

export default BlogDetailsPage;
