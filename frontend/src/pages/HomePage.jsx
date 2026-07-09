import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import TrendingTags from '../components/home/TrendingTags';
import CuratedInsights from '../components/home/CuratedInsights';
import TopContributors from '../components/home/TopContributors';
import TechProgressionMap from '../components/home/TechProgressionMap';
import Newsletter from '../components/home/Newsletter';
import useDocumentTitle from '../hooks/useDocumentTitle';

const HomePage = () => {
  useDocumentTitle();

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
      <TechProgressionMap />
      <TopContributors />
      <Newsletter />
    </motion.div>
  );
};

export default HomePage;
