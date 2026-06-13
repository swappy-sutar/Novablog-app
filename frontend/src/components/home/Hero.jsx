import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import GradientText from '../ui/GradientText';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-brand-cyan/20 rounded-full blur-[100px] -z-10" />
      
      {/* Floating Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[15%] w-32 h-32 glass-panel hidden lg:block -z-10 opacity-50 rotate-12"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[15%] w-48 h-48 glass-panel hidden lg:block -z-10 opacity-30 -rotate-12"
      />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-4 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-xs font-semibold tracking-wider mb-6">
            THE EVOLUTION OF CONTENT
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            The Future of <GradientText>Developer</GradientText> <br className="hidden md:block"/> <GradientText>Writing</GradientText>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience a distraction-free, hyper-functional workspace built for the modern engineer. Seamlessly ship high-quality technical content with AI-assisted clarity and native code integration.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" className="w-full sm:w-auto text-lg py-3 px-8">
              Start Writing
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto text-lg py-3 px-8">
              Explore Feed
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
