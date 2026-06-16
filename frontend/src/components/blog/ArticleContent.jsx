import React from 'react';

const ArticleContent = ({ blog }) => {
  if (!blog) return null;

  const injectDropCap = (html) => {
    if (!html) return "";
    
    // Find the first paragraph tag <p>
    const pIndex = html.indexOf("<p>");
    if (pIndex === -1) return html;
    
    // Find the first letter inside the paragraph
    const contentStart = pIndex + 3;
    const match = html.slice(contentStart).match(/[a-zA-Z]/);
    if (!match) return html;
    
    const charIndex = contentStart + match.index;
    const firstChar = html[charIndex];
    
    return (
      html.slice(0, charIndex) +
      `<span class="float-left text-6xl font-bold text-brand-purple leading-none pr-3 pt-2">${firstChar}</span>` +
      html.slice(charIndex + 1)
    );
  };

  const processedContent = React.useMemo(() => {
    let html = blog.content || "";
    
    // Replace standard h2 tags to add scrollable anchors
    let count = 0;
    html = html.replace(/<h2[^>]*>/gi, (match) => {
      const replaced = `<h2 id="heading-${count}" class="text-2xl font-bold mt-12 mb-6">`;
      count++;
      return replaced;
    });
    
    return injectDropCap(html);
  }, [blog.content]);

  return (
    <article 
      className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-brand-cyan hover:prose-a:text-brand-blue prose-pre:bg-bg-card prose-pre:border prose-pre:border-border-subtle"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default ArticleContent;
