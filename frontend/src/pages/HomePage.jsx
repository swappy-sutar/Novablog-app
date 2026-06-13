import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import TrendingTags from '../components/home/TrendingTags';
import CuratedInsights from '../components/home/CuratedInsights';
import TopContributors from '../components/home/TopContributors';
import Newsletter from '../components/home/Newsletter';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <TrendingTags />
      <CuratedInsights />
      <TopContributors />
      <Newsletter />
    </motion.div>
  );
};

export default HomePage;
