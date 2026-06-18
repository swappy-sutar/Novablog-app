import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import EditorToolbar from "../components/editor/EditorToolbar";
import { blogAPI } from "../lib/api";

const AUTOSAVE_DEBOUNCE_MS = 1500;

const SaveStatusIndicator = ({ status }) => {
  const config = {
    idle: { label: "All changes saved", dot: "bg-gray-600" },
    pending: { label: "Unsaved changes", dot: "bg-gray-500" },
    saving: { label: "Saving…", dot: "bg-amber-400 animate-pulse" },
    saved: { label: "Saved", dot: "bg-emerald-400" },
    error: { label: "Couldn't save draft", dot: "bg-red-400" },
  };
  const { label, dot } = config[status] || config.idle;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 select-none">
      <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
      <span>{label}</span>
    </div>
  );
};

const getWordStats = (html) => {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
  const words = text.length ? text.split(/\s+/).filter(Boolean).length : 0;
  const characters = text.length;
  const readingMinutes = words ? Math.max(1, Math.round(words / 200)) : 0;
  return { words, characters, readingMinutes };
};

const WritePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const editorRef = useRef(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Autosave state
  const [draftId, setDraftId] = useState(editId || null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const autosaveTimerRef = useRef(null);
  const inFlightRef = useRef(false);
  const dirtyWhileSavingRef = useRef(false);
  const hasLoadedRef = useRef(!editId); // skip the first autosave fire while loading an existing post

  const { words, characters, readingMinutes } = getWordStats(content);

  // Load blog post for editing
  useEffect(() => {
    if (!editId) return;

    const fetchBlog = async () => {
      try {
        const res = await blogAPI.getBlogById(editId);
        if (res.success && res.data) {
          const blog = res.data;
          setTitle(blog.title);
          setContent(blog.content);
          setIsFeatured(blog.isFeatured);
          if (blog.thumbnail) {
            setThumbnailPreview(blog.thumbnail);
          }
          if (blog.tags) {
            setTags(blog.tags.map((t) => t.tag?.name).filter(Boolean));
          }
          if (editorRef.current) {
            editorRef.current.innerHTML = blog.content;
          }
        }
      } catch (e) {
        toast.error("Failed to load blog post for editing.");
        console.error("Load edit blog error:", e);
      } finally {
        hasLoadedRef.current = true;
      }
    };

    fetchBlog();
  }, [editId]);

  // Sync content with contentEditable editor box once loaded
  useEffect(() => {
    if (editorRef.current && content && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  // Revoke the previous blob URL whenever the thumbnail preview changes or
  // the page unmounts, so swapping the cover image repeatedly doesn't leak memory.
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const buildDraftFormData = useCallback(() => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", "DRAFT");
    formData.append("isFeatured", isFeatured.toString());
    tags.forEach((tag) => formData.append("tags[]", tag));
    if (thumbnail instanceof File) {
      formData.append("thumbnail", thumbnail);
    }
    return formData;
  }, [title, content, isFeatured, tags, thumbnail]);

  const runAutosaveRef = useRef(null);

  const runAutosave = useCallback(async () => {
    // Don't create a draft out of nothing — needs at least a title.
    if (!title.trim()) {
      setSaveStatus("idle");
      return;
    }

    if (inFlightRef.current) {
      // A save is already running; mark that more changes came in and
      // let that save's completion handler kick off another pass using
      // the *latest* runAutosave (via the ref below), not this stale closure.
      dirtyWhileSavingRef.current = true;
      return;
    }

    inFlightRef.current = true;
    setSaveStatus("saving");

    try {
      const formData = buildDraftFormData();
      let response;
      if (draftId) {
        response = await blogAPI.updateBlog(draftId, formData);
      } else {
        response = await blogAPI.createBlog(formData);
      }

      if (response.success) {
        if (!draftId && response.data?.id) {
          setDraftId(response.data.id);
        }
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus((s) => (s === "saved" ? "idle" : s)), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch (e) {
      console.error("Autosave error:", e);
      setSaveStatus("error");
    } finally {
      inFlightRef.current = false;
      if (dirtyWhileSavingRef.current) {
        dirtyWhileSavingRef.current = false;
        // Call through the ref, not the local `runAutosave` name, so this
        // retry always uses the most recent title/content/tags rather than
        // whatever was captured when this particular save started.
        runAutosaveRef.current();
      }
    }
  }, [title, draftId, buildDraftFormData]);

  useEffect(() => {
    runAutosaveRef.current = runAutosave;
  }, [runAutosave]);

  // Debounced autosave triggered by edits to title/content/tags/featured flag.
  useEffect(() => {
    if (!hasLoadedRef.current) return; // don't autosave while the initial load effect is still running
    if (isPublishing) return; // publish flow handles its own save

    setSaveStatus("pending");
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      runAutosave();
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => clearTimeout(autosaveTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tags, isFeatured, thumbnail]);

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, []);

  const handlePublish = async () => {
    if (!title || !content) {
      toast.error("Title and content are required.");
      return;
    }

    // Stop any pending autosave from racing the publish call.
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    setIsPublishing(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      // Auto-generate a clean plain-text excerpt by stripping HTML tags and entities
      const cleanText = content
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
      const excerpt =
        cleanText.length > 150
          ? cleanText.substring(0, 150).trim() + "..."
          : cleanText;

      formData.append("excerpt", excerpt);
      formData.append("status", "PUBLISHED");
      formData.append("isFeatured", isFeatured.toString());
      tags.forEach((tag) => formData.append("tags[]", tag));

      // Only append if a new file was uploaded
      if (thumbnail instanceof File) {
        formData.append("thumbnail", thumbnail);
      }

      let response;
      const targetId = draftId || editId;
      if (targetId) {
        response = await blogAPI.updateBlog(targetId, formData);
      } else {
        response = await blogAPI.createBlog(formData);
      }

      if (response.success) {
        toast.success(editId ? "Blog updated successfully!" : "Blog published successfully!");
        navigate(`/post/${response.data.id}`);
      }
    } catch (error) {
      console.error("Publish error:", error);
      toast.error(error.response?.data?.message || "Failed to publish blog");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-sans pt-20">
      <Navbar />

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-8 pt-8 pb-24">
        {/* Editor Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {editId ? "Edit Post" : "Write a New Post"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
              Draft your technical story, add a cover image, and publish it to the technical frontiers.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SaveStatusIndicator status={saveStatus} />
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-brand-purple hover:opacity-90 text-white text-xs sm:text-sm font-semibold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-brand-purple/10 flex items-center gap-2"
            >
              {isPublishing ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-8 md:p-12 flex flex-col gap-4 sm:gap-6">
          {/* Thumbnail Upload */}
          <div className="w-full">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="thumbnail-upload"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
                    URL.revokeObjectURL(thumbnailPreview);
                  }
                  setThumbnail(file);
                  setThumbnailPreview(URL.createObjectURL(file));
                }
              }}
            />
            {thumbnailPreview ? (
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden group">
                <img
                  src={thumbnailPreview}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button
                    onClick={() => {
                      if (thumbnailPreview.startsWith("blob:")) {
                        URL.revokeObjectURL(thumbnailPreview);
                      }
                      setThumbnail(null);
                      setThumbnailPreview("");
                    }}
                    className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Remove Cover Image
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="thumbnail-upload"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border-subtle hover:border-brand-purple/50 hover:bg-brand-purple/5 rounded-xl cursor-pointer transition-all group"
              >
                <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-brand-purple transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium text-sm">Add a cover image</span>
                </div>
              </label>
            )}
          </div>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-bold text-white placeholder-gray-500 focus:outline-none tracking-tight leading-tight"
          />

          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple text-xs font-semibold px-3 py-1 rounded-full border border-brand-purple/20"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-white transition-colors"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1 bg-transparent text-gray-400 text-xs font-semibold px-3 py-1 rounded-full border border-dashed border-gray-600 focus-within:border-gray-400 transition-colors">
                <span className="text-gray-500">+</span>
                <input
                  type="text"
                  placeholder="Add Tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="bg-transparent focus:outline-none w-16 focus:w-24 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-bg-base/50 px-4 py-2 rounded-xl border border-border-subtle">
              <span className="text-gray-300 text-sm font-semibold tracking-wide">
                Featured Post
              </span>
              <button
                type="button"
                onClick={() => setIsFeatured(!isFeatured)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${isFeatured ? 'bg-brand-purple' : 'bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFeatured ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="sticky top-20 z-40 my-2">
            <EditorToolbar editorRef={editorRef} />
          </div>

          <div className="w-full mt-4">
            <div
              ref={editorRef}
              contentEditable
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              className="w-full min-h-[50vh] sm:min-h-[60vh] prose prose-invert prose-sm sm:prose-base lg:prose-xl max-w-none text-gray-300 leading-loose focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-500 empty:before:italic bg-bg-base/40 border border-border-subtle rounded-xl p-4 sm:p-6 md:p-8 focus:border-brand-purple/40 focus:bg-bg-base/60 transition-all shadow-inner selection:bg-brand-purple/30"
              data-placeholder="Write your story..."
            />
            <div className="flex items-center justify-end gap-3 mt-3 px-1 text-xs text-gray-500 select-none">
              <span>{words.toLocaleString()} {words === 1 ? "word" : "words"}</span>
              <span className="text-gray-700">·</span>
              <span>{characters.toLocaleString()} characters</span>
              {readingMinutes > 0 && (
                <>
                  <span className="text-gray-700">·</span>
                  <span>{readingMinutes} min read</span>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WritePage;