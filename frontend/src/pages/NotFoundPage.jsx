import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Compass, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFoundPage = () => {
  useDocumentTitle("Page Not Found");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -12, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 25,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center bg-bg-base overflow-hidden bg-dot-grid py-16 px-4">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-brand-purple/10 blur-[100px] opacity-40 pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-cyan/10 blur-[120px] opacity-35 pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Orbiting Space Ring Background */}
      <motion.div 
        variants={orbitVariants}
        animate="animate"
        className="absolute w-[500px] h-[500px] border border-white/[0.03] rounded-full pointer-events-none flex items-center justify-center z-0"
      >
        <div className="absolute top-0 w-2 h-2 rounded-full bg-brand-purple/40 blur-[1px]" />
        <div className="absolute bottom-1/4 left-0 w-3 h-3 rounded-full bg-brand-cyan/40 blur-[2px]" />
      </motion.div>
      
      <motion.div 
        variants={orbitVariants}
        animate="animate"
        className="absolute w-[300px] h-[300px] border border-dashed border-white/[0.02] rounded-full pointer-events-none z-0"
        style={{ animationDirection: "reverse", animationDuration: "18s" }}
      >
        <div className="absolute right-0 top-1/4 w-1.5 h-1.5 rounded-full bg-brand-blue/40 blur-[1px]" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-xl w-full text-center relative z-10 font-sans"
      >
        {/* Floating 404 Visual */}
        <motion.div 
          variants={floatVariants}
          animate="animate"
          className="relative inline-block mb-6 select-none"
        >
          {/* Main 404 Text */}
          <h1 className="text-[120px] sm:text-[150px] md:text-[180px] font-black leading-none tracking-tighter bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-blue bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(139,92,246,0.15)]">
            404
          </h1>
          
          {/* Futuristic Orbiting Badge */}
          <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 backdrop-blur-md shadow-lg animate-bounce" style={{ animationDuration: "3s" }}>
            <span className="text-[9px] font-bold text-[#c4b5fd] tracking-widest uppercase">Lost in space</span>
          </div>
        </motion.div>

        {/* Content Info */}
        <motion.div variants={itemVariants} className="space-y-4 px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            The page you are looking for has drifted into deep space, been renamed, or never existed in this quadrant.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 px-4"
        >
          <Link to="/" className="w-full sm:w-auto">
            <Button
              variant="primary"
              className="w-full !rounded-xl !py-3.5 !px-8 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" /> Go Back Home
            </Button>
          </Link>
          
          <Link to="/explore" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              className="w-full !rounded-xl !py-3.5 !px-8 text-sm border border-border-subtle hover:bg-white/[0.04] text-white font-semibold flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" /> Explore Blogs
            </Button>
          </Link>
        </motion.div>
        
        {/* Go back helper */}
        <motion.div variants={itemVariants} className="pt-6">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center text-xs text-gray-500 hover:text-brand-cyan transition-colors gap-1.5 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go back to previous page
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
