import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, ThumbsUp, Send, User, Sparkles } from 'lucide-react';
import { getComments, addComment, likeComment } from '../services/api';
import './CommentSection.css';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return past.toLocaleDateString();
};

const CommentSection = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem('hubplays_user_name') || '');
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [likedCommentIds, setLikedCommentIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hubplays_liked_comments') || '[]');
    } catch {
      return [];
    }
  });

  const fetchComments = useCallback(async () => {
    if (!movieId) return;
    try {
      const data = await getComments(movieId);
      if (data.success) {
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Error loading comments', err);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const author = userName.trim() || 'Anonymous Viewer';
      localStorage.setItem('hubplays_user_name', author);

      const res = await addComment(movieId, {
        userName: author,
        content: content.trim()
      });

      if (res.success && res.comment) {
        setComments((prev) => [res.comment, ...prev]);
        setContent('');
        setIsFocused(false);
      }
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    const isLiked = likedCommentIds.includes(commentId);
    const action = isLiked ? 'unlike' : 'like';

    // Optimistic UI update
    setComments((prev) =>
      prev.map((c) => {
        if (c._id === commentId) {
          const newLikes = isLiked ? Math.max(0, (c.likes || 0) - 1) : (c.likes || 0) + 1;
          return { ...c, likes: newLikes };
        }
        return c;
      })
    );

    const updatedLikedIds = isLiked
      ? likedCommentIds.filter((id) => id !== commentId)
      : [...likedCommentIds, commentId];

    setLikedCommentIds(updatedLikedIds);
    localStorage.setItem('hubplays_liked_comments', JSON.stringify(updatedLikedIds));

    try {
      await likeComment(commentId, action);
    } catch (err) {
      console.error('Failed to like comment', err);
      // Revert on error
      fetchComments();
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="comment-section">
      <div className="comment-header">
        <div className="comment-title-group">
          <MessageSquare className="comment-icon" size={22} />
          <h3>Comments <span className="comment-count-badge">({comments.length})</span></h3>
        </div>
      </div>

      {/* Add comment box */}
      <form className={`comment-form ${isFocused ? 'focused' : ''}`} onSubmit={handleSubmit}>
        <div className="comment-form-top">
          <div className="user-avatar-placeholder" style={{ backgroundColor: '#e50914' }}>
            {getInitials(userName || 'You')}
          </div>
          <div className="comment-inputs">
            <input
              type="text"
              className="comment-name-input"
              placeholder="Your name (optional)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              maxLength={50}
            />
            <textarea
              className="comment-textarea"
              placeholder="Add a comment or review..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              rows={isFocused ? 3 : 2}
              maxLength={1000}
            />
          </div>
        </div>

        {isFocused && (
          <div className="comment-form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setContent('');
                setIsFocused(false);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={!content.trim() || submitting}
            >
              <Send size={15} />
              {submitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        )}
      </form>

      {/* Comments list */}
      <div className="comment-list">
        {loading ? (
          <div className="comments-loading">
            <div className="comment-spinner"></div>
            <span>Loading discussion...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="comments-empty">
            <Sparkles size={32} className="empty-sparkle" />
            <h4>No comments yet</h4>
            <p>Be the first to share your thoughts on this movie!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isLiked = likedCommentIds.includes(comment._id);
            return (
              <div key={comment._id} className="comment-item">
                <div
                  className="comment-avatar"
                  style={{ backgroundColor: comment.avatarColor || '#e50914' }}
                >
                  {getInitials(comment.userName)}
                </div>

                <div className="comment-body">
                  <div className="comment-author-row">
                    <span className="comment-author">{comment.userName || 'Anonymous Viewer'}</span>
                    <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                  </div>

                  <p className="comment-text">{comment.content}</p>

                  <div className="comment-actions">
                    <button
                      className={`comment-like-btn ${isLiked ? 'liked' : ''}`}
                      onClick={() => handleLikeComment(comment._id)}
                      title={isLiked ? 'Unlike' : 'Like'}
                    >
                      <ThumbsUp size={14} fill={isLiked ? 'currentColor' : 'none'} />
                      <span>{comment.likes > 0 ? comment.likes : ''}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;
