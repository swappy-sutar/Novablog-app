import React, { useRef } from 'react';

const EditorToolbar = ({ editorRef, onPublish, isPublishing }) => {
  const fileInputRef = useRef(null);
  const colorInputRef = useRef(null);
  const highlightInputRef = useRef(null);

  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef?.current?.focus();
  };

  const IconButton = ({ children, onClick, disabled = false, title }) => (
    <button 
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded transition-colors flex-shrink-0 ${
        disabled 
          ? 'text-gray-700 cursor-not-allowed'
          : 'text-gray-500 hover:text-white hover:bg-border-subtle'
      }`}
    >
      {children}
    </button>
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      exec('insertImage', imageUrl);
      e.target.value = null;
    }
  };

  const handleLink = () => {
    const url = window.prompt('URL:');
    if (url) exec('createLink', url);
  };

  const Divider = () => <div className="w-px h-5 bg-border-subtle mx-1 flex-shrink-0" />;

  return (
    <div className="w-full py-2 px-4 glass-panel flex items-center justify-between overflow-x-auto custom-scrollbar">
      <div className="flex items-center gap-1 min-w-max">
        
        {/* History Group */}
        <IconButton title="Undo" onClick={() => exec('undo')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </IconButton>
        <IconButton title="Redo" onClick={() => exec('redo')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
        </IconButton>
        <Divider />

        {/* Font Selectors */}
        <div className="flex items-center gap-2 mx-1">
          <select 
            onChange={(e) => exec('fontName', e.target.value)}
            className="bg-transparent border border-border-subtle rounded text-gray-400 text-xs py-1 px-2 focus:outline-none focus:border-brand-purple focus:text-white transition-colors"
          >
            <option value="Inter, sans-serif" className="bg-bg-base">Inter</option>
            <option value="Arial, sans-serif" className="bg-bg-base">Arial</option>
            <option value="'Courier New', Courier, monospace" className="bg-bg-base">Monospace</option>
            <option value="Georgia, serif" className="bg-bg-base">Georgia</option>
            <option value="'Times New Roman', Times, serif" className="bg-bg-base">Times New Roman</option>
            <option value="Verdana, sans-serif" className="bg-bg-base">Verdana</option>
          </select>
          
          <select 
            onChange={(e) => exec('fontSize', e.target.value)}
            defaultValue="3"
            className="bg-transparent border border-border-subtle rounded text-gray-400 text-xs py-1 px-2 focus:outline-none focus:border-brand-purple focus:text-white transition-colors"
          >
            <option value="1" className="bg-bg-base">Small</option>
            <option value="3" className="bg-bg-base">Normal</option>
            <option value="4" className="bg-bg-base">Large</option>
            <option value="5" className="bg-bg-base">X-Large</option>
            <option value="6" className="bg-bg-base">Huge</option>
          </select>
        </div>
        <Divider />

        {/* Text Formatting Group */}
        <IconButton title="Bold" onClick={() => exec('bold')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
        </IconButton>
        <IconButton title="Italic" onClick={() => exec('italic')}>
          <svg className="w-4 h-4 italic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        </IconButton>
        <IconButton title="Underline" onClick={() => exec('underline')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
        </IconButton>
        <IconButton title="Strikethrough" onClick={() => exec('strikeThrough')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
        </IconButton>
        <IconButton title="Subscript" onClick={() => exec('subscript')}>
          <span className="font-serif font-bold text-[10px] mt-2">X₂</span>
        </IconButton>
        <IconButton title="Superscript" onClick={() => exec('superscript')}>
          <span className="font-serif font-bold text-[10px] mb-2">X²</span>
        </IconButton>
        <Divider />

        {/* Headings */}
        <IconButton title="Heading 1" onClick={() => exec('formatBlock', 'H1')}>
          <span className="font-bold text-xs tracking-tight">H1</span>
        </IconButton>
        <IconButton title="Heading 2" onClick={() => exec('formatBlock', 'H2')}>
          <span className="font-bold text-xs tracking-tight">H2</span>
        </IconButton>
        <Divider />

        {/* Colors Group */}
        <input type="color" ref={colorInputRef} onInput={event => exec('foreColor', event.target.value)} className="hidden" />
        <IconButton title="Text Color" onClick={() => colorInputRef.current?.click()}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
        </IconButton>
        <input type="color" ref={highlightInputRef} onInput={event => exec('hiliteColor', event.target.value)} className="hidden" />
        <IconButton title="Highlight Color" onClick={() => highlightInputRef.current?.click()}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </IconButton>
        <Divider />

        {/* Alignment Group */}
        <IconButton title="Align Left" onClick={() => exec('justifyLeft')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
        </IconButton>
        <IconButton title="Align Center" onClick={() => exec('justifyCenter')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="12" x2="7" y2="12"/><line x1="19" y1="18" x2="5" y2="18"/></svg>
        </IconButton>
        <IconButton title="Align Right" onClick={() => exec('justifyRight')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
        </IconButton>
        <IconButton title="Justify" onClick={() => exec('justifyFull')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
        </IconButton>
        <Divider />

        {/* Media & Lists */}
        <IconButton title="Bullet List" onClick={() => exec('insertUnorderedList')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </IconButton>
        <IconButton title="Numbered List" onClick={() => exec('insertOrderedList')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </IconButton>
        <Divider />
        
        <IconButton title="Link" onClick={handleLink}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </IconButton>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        <IconButton title="Image" onClick={() => fileInputRef.current?.click()}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </IconButton>

      </div>
    </div>
  );
};

export default EditorToolbar;
