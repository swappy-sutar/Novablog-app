
const GradientText = ({ children, className = '', as = 'span' }) => {
  const Tag = as;
  return (
    <Tag className={`text-gradient ${className}`}>
      {children}
    </Tag>
  );
};

export default GradientText;
