import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverEffect = true, ...props }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, scale: 1.01 } : {}}
      transition={{ duration: 0.3 }}
      className={`glass-panel overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
