
const Tag = ({ children, active = false, className = '' }) => {
  return (
    <span 
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap
        ${active 
          ? 'bg-brand-purple/10 border-brand-purple/30 text-brand-purple' 
          : 'glass-panel border-border-subtle text-gray-300 hover:text-white hover:border-gray-500'} 
        ${className}`}
    >
      {children}
    </span>
  );
};

export default Tag;
