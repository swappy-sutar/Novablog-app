import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-premium text-[#ffffff] shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105",
    secondary: "glass-panel text-white hover:bg-bg-card-hover hover:scale-105",
    outline: "border border-border-subtle text-gray-300 hover:text-white hover:border-gray-400"
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
