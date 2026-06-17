import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MessageSquare, Trash2, Send } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { commentsAPI } from '../../lib/api';

const Discussion = ({ blog }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Get current logged-in user
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await commentsAPI.getCommentsByBlog(blog.id);
      if (res.success && res.data) {
        setComments(res.data.comments || []);
      }
    } catch (e) {
      console.error("Load comments error:", e);
    } finally {
      setLoading(false);
    }
  }, [blog.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadComments();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadComments]);

  // Handle post main comment
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    try {
      const res = await commentsAPI.createComment(blog.id, { content: newCommentText });
      if (res.success) {
        toast.success("Comment posted!");
        setNewCommentText("");
        loadComments();
      }
    } catch (e) {
      toast.error("Failed to post comment.");
      console.error(e);
    }
  };

  // Handle post reply
  const handlePostReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const res = await commentsAPI.createComment(blog.id, {
        content: replyText,
        parentId
      });
      if (res.success) {
        toast.success("Reply posted!");
        setReplyText("");
        setReplyingToId(null);
        loadComments();
      }
    } catch (e) {
      toast.error("Failed to post reply.");
      console.error(e);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment permanently?")) return;
    try {
      const res = await commentsAPI.deleteComment(commentId);
      if (res.success) {
        toast.success("Comment deleted.");
        loadComments();
      }
    } catch (e) {
      toast.error("Failed to delete comment.");
      console.error(e);
    }
  };

  // Format relative time helper
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const renderAvatar = (userObj, sizeClass = "w-8 h-8") => {
    if (userObj?.avatar) {
      return (
        <img 
          src={userObj.avatar} 
          alt="Avatar" 
          className={`${sizeClass} rounded-full object-cover border border-white/5`} 
        />
      );
    }
    const initials = `${userObj?.firstname?.[0] || ''}${userObj?.lastname?.[0] || ''}`.toUpperCase() || userObj?.username?.[0]?.toUpperCase() || 'U';
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-br from-brand-purple/40 to-brand-cyan/20 flex items-center justify-center text-[10px] font-bold text-[#ffffff] border border-white/5`}>
        {initials}
      </div>
    );
  };

  const getUserName = (userObj) => {
    if (!userObj) return "Anonymous";
    const name = `${userObj.firstname || ''} ${userObj.lastname || ''}`.trim();
    return name || userObj.username || "Member";
  };

  // Sort and process comments locally
  const sortedComments = React.useMemo(() => {
    const list = [...comments];
    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return list;
  }, [comments, sortBy]);

  return (
    <section id="discussion-section" className="mt-20 pt-10 border-t border-border-subtle max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          Discussions <span className="bg-brand-blue/20 text-brand-blue text-xs py-1 px-2.5 rounded-full">{comments.length}</span>
        </h3>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value === "Newest" || e.target.value === "newest" ? "newest" : "oldest")}
          className="bg-bg-base border border-border-subtle text-xs text-gray-400 py-1.5 px-3 rounded-lg focus:outline-none focus:border-brand-cyan cursor-pointer"
        >
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
        </select>
      </div>

      {/* Main Comment Input / Join Wall */}
      {!currentUser ? (
        <GlassCard className="p-8 text-center border-dashed border-brand-cyan/25 flex flex-col items-center gap-4 mb-10">
          <MessageSquare className="w-10 h-10 text-gray-500 mb-2" />
          <h4 className="text-base font-bold text-white">Join the discussion</h4>
          <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
            NovaBlog threads are developer-curated. Register or login to comment, share insights, and engage with the author.
          </p>
          <div className="flex gap-3 mt-2">
            <Link to="/signin">
              <Button variant="primary" className="!rounded-xl text-xs py-2 px-5">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="secondary" className="!rounded-xl text-xs py-2 px-5">
                Sign Up
              </Button>
            </Link>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-6 mb-10 border-brand-cyan/20">
          <div className="flex gap-4">
            {renderAvatar(currentUser, "w-10 h-10")}
            <div className="flex-grow">
              <form onSubmit={handlePostComment}>
                <textarea 
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full bg-border-subtle/30 border border-border-subtle rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/10 focus:outline-none min-h-[90px] resize-none"
                  placeholder="Add to the discussion..."
                  required
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-gray-500">markdown supported</span>
                  <Button type="submit" variant="primary" className="!rounded-xl !py-2 !px-5 text-xs">
                    Post Comment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Comment Thread */}
      {loading && comments.length === 0 ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {sortedComments.map((comment) => {
            const isBlogAuthor = comment.userId === blog.authorId;
            const isCommentOwner = currentUser && comment.userId === currentUser.id;

            return (
              <div key={comment.id} className="flex gap-4 group/comment">
                <Link to={comment.user?.username ? `/profile/${comment.user.username}` : "#"} className="cursor-pointer shrink-0 block">
                  {renderAvatar(comment.user, "w-10 h-10")}
                </Link>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Link to={comment.user?.username ? `/profile/${comment.user.username}` : "#"} className="font-semibold text-gray-200 text-sm hover:text-brand-cyan transition-colors cursor-pointer">
                        {getUserName(comment.user)}
                      </Link>
                      {isBlogAuthor && (
                        <span className="text-[9px] font-extrabold uppercase tracking-wide text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded">
                          Author
                        </span>
                      )}
                      <span className="text-[10px] text-gray-500">
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>
                    {isCommentOwner && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-600 hover:text-red-400 p-1 opacity-0 group-hover/comment:opacity-100 transition-opacity"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-300 leading-relaxed mt-1 mb-2 whitespace-pre-line">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <button 
                      onClick={() => {
                        if (!currentUser) {
                          toast.error("Please sign in to reply to comments.");
                          return;
                        }
                        setReplyingToId(replyingToId === comment.id ? null : comment.id);
                        setReplyText("");
                      }}
                      className="flex items-center gap-1 hover:text-gray-200 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" /> Reply
                    </button>
                  </div>

                  {/* Reply Input Box */}
                  {replyingToId === comment.id && (
                    <form 
                      onSubmit={(e) => handlePostReply(e, comment.id)}
                      className="mt-4 flex gap-3 bg-bg-card border border-border-subtle p-4 rounded-xl"
                    >
                    {renderAvatar(currentUser, "w-7 h-7")}
                    <div className="flex-grow">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type reply..."
                        required
                        className="w-full bg-border-subtle/30 border border-border-subtle rounded-xl px-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:border-brand-cyan focus:outline-none min-h-[50px] resize-none"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setReplyingToId(null)}
                            className="px-3 py-1.5 rounded-lg text-[10px] text-gray-400 hover:text-gray-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg bg-brand-cyan text-black text-[10px] font-bold flex items-center gap-1.5 hover:opacity-90"
                          >
                            <Send className="w-3 h-3" /> Reply
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Nested Replies Loop */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 border-l border-border-subtle/50 pl-4 ml-1">
                      {comment.replies.map((reply) => {
                        const isReplyBlogAuthor = reply.userId === blog.authorId;
                        const isReplyOwner = currentUser && reply.userId === currentUser.id;

                        return (
                          <div key={reply.id} className="flex gap-3 group/reply">
                            <Link to={reply.user?.username ? `/profile/${reply.user.username}` : "#"} className="cursor-pointer shrink-0 block">
                              {renderAvatar(reply.user, "w-7 h-7")}
                            </Link>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-0.5">
                                <div className="flex items-center gap-1.5">
                                  <Link to={reply.user?.username ? `/profile/${reply.user.username}` : "#"} className="font-semibold text-gray-200 text-xs hover:text-brand-cyan transition-colors cursor-pointer">
                                    {getUserName(reply.user)}
                                  </Link>
                                  {isReplyBlogAuthor && (
                                    <span className="text-[8px] font-extrabold uppercase tracking-wide text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-1.5 py-0.5 rounded">
                                      Author
                                    </span>
                                  )}
                                  <span className="text-[9px] text-gray-500">
                                    {formatTime(reply.createdAt)}
                                  </span>
                                </div>
                                {isReplyOwner && (
                                  <button 
                                    onClick={() => handleDeleteComment(reply.id)}
                                    className="text-gray-600 hover:text-red-400 p-1 opacity-0 group-hover/reply:opacity-100 transition-opacity"
                                    title="Delete reply"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-gray-300 leading-relaxed mt-1 whitespace-pre-line">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Discussion;
