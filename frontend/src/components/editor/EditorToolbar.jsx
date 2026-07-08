import { useRef, useState, useEffect, useCallback } from 'react';

const IconButton = ({ children, onClick, disabled = false, title, active = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    aria-pressed={active}
    className={`relative w-8 h-8 flex items-center justify-center rounded-md transition-all duration-150 flex-shrink-0 ${disabled
        ? 'text-gray-700 cursor-not-allowed'
        : active
          ? 'text-white bg-brand-purple/25 shadow-[inset_0_0_0_1px_rgba(168,85,247,0.4)]'
          : 'text-gray-500 hover:text-white hover:bg-border-subtle active:scale-95'
      }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-border-subtle mx-1 flex-shrink-0" />;

const ToolbarSelect = ({ value, onChange, options, width = 'w-28' }) => (
  <div className={`relative ${width}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full appearance-none bg-transparent border border-border-subtle rounded-md text-gray-400 text-xs py-1.5 pl-2 pr-6 hover:border-gray-600 focus:outline-none focus:border-brand-purple focus:text-white transition-colors cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-bg-base text-gray-200">
          {opt.label}
        </option>
      ))}
    </select>
    <svg
      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </div>
);

const ColorSwatchButton = ({ title, icon, color, onPick, inputRef }) => (
  <div className="relative">
    <IconButton title={title} onClick={() => inputRef.current?.click()}>
      <span className="relative flex flex-col items-center justify-center">
        {icon}
        <span
          className="absolute -bottom-1.5 w-4 h-[3px] rounded-full ring-1 ring-black/30"
          style={{ backgroundColor: color }}
        />
      </span>
    </IconButton>
    <input
      type="color"
      ref={inputRef}
      value={color}
      onInput={(e) => onPick(e.target.value)}
      className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
      tabIndex={-1}
    />
  </div>
);

const LinkPopover = ({ open, onClose, onSubmit, anchorRef }) => {
  const [url, setUrl] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUrl('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target)) onClose();
    };
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div className="absolute top-full left-0 mt-2 z-20 w-64 glass-panel rounded-lg p-3 shadow-xl border border-border-subtle">
      <label className="block text-[11px] text-gray-500 mb-1.5">Link URL</label>
      <form
        onSubmit={(e) => { e.preventDefault(); if (url.trim()) onSubmit(url.trim()); }}
        className="flex items-center gap-1.5"
      >
        <input
          ref={inputRef}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 bg-bg-base border border-border-subtle rounded-md px-2 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-purple transition-colors"
        />
        <button
          type="submit"
          disabled={!url.trim()}
          className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-brand-purple text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-purple/90 transition-colors"
        >
          Add
        </button>
      </form>
    </div>
  );
};

const FONT_OPTIONS = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: "'Courier New', Courier, monospace", label: 'Monospace' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: "'Times New Roman', Times, serif", label: 'Times New Roman' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
];

const SIZE_OPTIONS = [
  { value: '1', label: 'Small' },
  { value: '3', label: 'Normal' },
  { value: '4', label: 'Large' },
  { value: '5', label: 'X-Large' },
  { value: '6', label: 'Huge' },
];

const EditorToolbar = ({ editorRef }) => {
  const fileInputRef = useRef(null);
  const colorInputRef = useRef(null);
  const highlightInputRef = useRef(null);
  const linkAnchorRef = useRef(null);

  const [linkOpen, setLinkOpen] = useState(false);
  const [textColor, setTextColor] = useState('#ffffff');
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value);
  const [fontSize, setFontSize] = useState('3');

  const [activeStates, setActiveStates] = useState({
    bold: false, italic: false, underline: false, strikeThrough: false,
    justifyLeft: false, justifyCenter: false, justifyRight: false, justifyFull: false,
    insertUnorderedList: false, insertOrderedList: false,
    h1: false, h2: false,
  });

  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef?.current?.focus();
    refreshActiveStates();
  };

  const refreshActiveStates = useCallback(() => {
    try {
      const blockTag = document.queryCommandValue('formatBlock')?.toLowerCase();
      setActiveStates({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
        justifyFull: document.queryCommandState('justifyFull'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
        h1: blockTag === 'h1',
        h2: blockTag === 'h2',
      });

      // Synchronize font family and font size dropdowns with the cursor's selection
      try {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          let container = range.startContainer;
          if (container.nodeType === Node.TEXT_NODE) {
            container = container.parentNode;
          }

          if (container) {
            // Check Font Family
            const fontFaceElement = container.closest('font[face]');
            if (fontFaceElement) {
              const faceAttr = fontFaceElement.getAttribute('face');
              if (faceAttr) {
                const cleanFont = faceAttr.replace(/['"]/g, '').split(',')[0].trim().toLowerCase();
                const matchedOption = FONT_OPTIONS.find(opt => 
                  opt.value.replace(/['"]/g, '').split(',')[0].trim().toLowerCase() === cleanFont
                );
                if (matchedOption) {
                  setFontFamily(matchedOption.value);
                }
              }
            } else {
              // Default to Inter
              setFontFamily(FONT_OPTIONS[0].value);
            }

            // Check Font Size
            const fontSizeElement = container.closest('font[size]');
            if (fontSizeElement) {
              const sizeAttr = fontSizeElement.getAttribute('size');
              if (sizeAttr) {
                setFontSize(sizeAttr);
              }
            } else {
              // Default to Normal ("3")
              setFontSize('3');
            }
          }
        }
      } catch (e) {
        console.warn('Failed to sync selection font properties:', e);
      }
    } catch {
      // queryCommandState can throw in some edge cases; ignore safely
    }
  }, [setFontFamily, setFontSize]);

  useEffect(() => {
    const node = editorRef?.current;
    if (!node) return;
    const handler = () => refreshActiveStates();
    document.addEventListener('selectionchange', handler);
    node.addEventListener('keyup', handler);
    node.addEventListener('mouseup', handler);
    return () => {
      document.removeEventListener('selectionchange', handler);
      node.removeEventListener('keyup', handler);
      node.removeEventListener('mouseup', handler);
    };
  }, [editorRef, refreshActiveStates]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      exec('insertImage', imageUrl);
      e.target.value = null;
    }
  };

  const handleLinkSubmit = (url) => {
    exec('createLink', url);
    setLinkOpen(false);
  };

  const handleHeading = (tag) => {
    const isActive = activeStates[tag.toLowerCase()];
    exec('formatBlock', isActive ? 'P' : tag);
  };

  return (
    <div className="w-full py-2 px-4 glass-panel flex items-center justify-between overflow-x-auto custom-scrollbar border-b border-border-subtle">
      <div className="flex items-center gap-1 min-w-max">

        {/* History Group */}
        <IconButton title="Undo" onClick={() => exec('undo')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
        </IconButton>
        <IconButton title="Redo" onClick={() => exec('redo')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" /></svg>
        </IconButton>
        <Divider />

        {/* Font Selectors */}
        <div className="flex items-center gap-2 mx-1">
          <ToolbarSelect
            value={fontFamily}
            onChange={(e) => { setFontFamily(e.target.value); exec('fontName', e.target.value); }}
            options={FONT_OPTIONS}
            width="w-32"
          />
          <ToolbarSelect
            value={fontSize}
            onChange={(e) => { setFontSize(e.target.value); exec('fontSize', e.target.value); }}
            options={SIZE_OPTIONS}
            width="w-24"
          />
        </div>
        <Divider />

        {/* Text Formatting Group */}
        <IconButton title="Bold" active={activeStates.bold} onClick={() => exec('bold')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>
        </IconButton>
        <IconButton title="Italic" active={activeStates.italic} onClick={() => exec('italic')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>
        </IconButton>
        <IconButton title="Underline" active={activeStates.underline} onClick={() => exec('underline')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" /><line x1="4" y1="21" x2="20" y2="21" /></svg>
        </IconButton>
        <IconButton title="Strikethrough" active={activeStates.strikeThrough} onClick={() => exec('strikeThrough')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" y1="12" x2="20" y2="12" /></svg>
        </IconButton>
        <IconButton title="Subscript" onClick={() => exec('subscript')}>
          <span className="font-bold text-[10px] mt-2">X₂</span>
        </IconButton>
        <IconButton title="Superscript" onClick={() => exec('superscript')}>
          <span className="font-bold text-[10px] mb-2">X²</span>
        </IconButton>
        <Divider />

        {/* Headings */}
        <IconButton title="Heading 1" active={activeStates.h1} onClick={() => handleHeading('H1')}>
          <span className="font-bold text-xs tracking-tight">H1</span>
        </IconButton>
        <IconButton title="Heading 2" active={activeStates.h2} onClick={() => handleHeading('H2')}>
          <span className="font-bold text-xs tracking-tight">H2</span>
        </IconButton>
        <Divider />

        {/* Colors Group */}
        <ColorSwatchButton
          title="Text Color"
          color={textColor}
          inputRef={colorInputRef}
          onPick={(c) => { setTextColor(c); exec('foreColor', c); }}
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
          }
        />
        <ColorSwatchButton
          title="Highlight Color"
          color={highlightColor}
          inputRef={highlightInputRef}
          onPick={(c) => { setHighlightColor(c); exec('hiliteColor', c); }}
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
          }
        />
        <Divider />

        {/* Alignment Group */}
        <IconButton title="Align Left" active={activeStates.justifyLeft} onClick={() => exec('justifyLeft')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="15" y1="12" x2="3" y2="12" /><line x1="17" y1="18" x2="3" y2="18" /></svg>
        </IconButton>
        <IconButton title="Align Center" active={activeStates.justifyCenter} onClick={() => exec('justifyCenter')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="17" y1="12" x2="7" y2="12" /><line x1="19" y1="18" x2="5" y2="18" /></svg>
        </IconButton>
        <IconButton title="Align Right" active={activeStates.justifyRight} onClick={() => exec('justifyRight')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="12" x2="9" y2="12" /><line x1="21" y1="18" x2="7" y2="18" /></svg>
        </IconButton>
        <IconButton title="Justify" active={activeStates.justifyFull} onClick={() => exec('justifyFull')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="12" x2="3" y2="12" /><line x1="21" y1="18" x2="3" y2="18" /></svg>
        </IconButton>
        <Divider />

        {/* Media & Lists */}
        <IconButton title="Bullet List" active={activeStates.insertUnorderedList} onClick={() => exec('insertUnorderedList')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
        </IconButton>
        <IconButton title="Numbered List" active={activeStates.insertOrderedList} onClick={() => exec('insertOrderedList')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
        </IconButton>
        <Divider />

        <div className="relative" ref={linkAnchorRef}>
          <IconButton title="Link" active={linkOpen} onClick={() => setLinkOpen((v) => !v)}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
          </IconButton>
          <LinkPopover
            open={linkOpen}
            onClose={() => setLinkOpen(false)}
            onSubmit={handleLinkSubmit}
            anchorRef={linkAnchorRef}
          />
        </div>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        <IconButton title="Image" onClick={() => fileInputRef.current?.click()}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
        </IconButton>

      </div>
    </div>
  );
};

export default EditorToolbar;