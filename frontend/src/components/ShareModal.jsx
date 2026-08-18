import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, Send, MessageCircle, Mail, Code } from 'lucide-react';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, movie }) => {
  const [copied, setCopied] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !movie) return null;

  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/watch/${movie._id}` 
    : '';
  const shareText = `Watch "${movie.title}" on HubPlays!`;
  const embedCode = `<iframe src="${currentUrl}" width="100%" height="480" frameborder="0" allowfullscreen></iframe>`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2500);
    } catch (err) {
      console.error('Failed to copy embed', err);
    }
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`
    },
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: '#0088cc',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'Reddit',
      icon: '🤖',
      color: '#FF4500',
      url: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Email',
      icon: '✉️',
      color: '#EA4335',
      url: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`Check out this movie on HubPlays: ${currentUrl}`)}`
    }
  ];

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-header">
          <div className="share-title-group">
            <Share2 className="share-header-icon" size={20} />
            <h3>Share this Movie</h3>
          </div>
          <button className="share-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="share-preview">
          {movie.posterUrl && (
            <img src={movie.posterUrl} alt={movie.title} className="share-preview-thumb" />
          )}
          <div className="share-preview-info">
            <h4>{movie.title}</h4>
            <p>{movie.releaseYear} • {movie.genre?.join(', ')}</p>
          </div>
        </div>

        <div className="share-social-grid">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="share-social-item"
              title={`Share on ${item.name}`}
            >
              <div className="share-social-icon" style={{ backgroundColor: `${item.color}20`, borderColor: item.color }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              </div>
              <span className="share-social-name">{item.name}</span>
            </a>
          ))}
        </div>

        <div className="share-link-section">
          <label>Direct Link</label>
          <div className="share-link-box">
            <input type="text" readOnly value={currentUrl} />
            <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check size={16} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={16} /> Copy
                </>
              )}
            </button>
          </div>
        </div>

        <div className="share-embed-section">
          <button className="embed-toggle-btn" onClick={handleCopyEmbed}>
            <Code size={16} />
            <span>{copiedEmbed ? 'Embed Code Copied! ✓' : 'Copy Embed Code'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
