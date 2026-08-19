import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, Share2, Eye, Calendar, Clock, Film } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import ShareModal from '../components/ShareModal';
import CommentSection from '../components/CommentSection';
import BannerAd from '../components/BannerAd';
import { useMovie } from '../hooks/useMovies';
import { likeMovie } from '../services/api';
import ErrorState from '../components/ErrorState';
import './WatchPage.css';

const formatDuration = (seconds) => {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const WatchPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, loading, error } = useMovie(id);

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (movie) {
      setLikesCount(movie.likes || 0);
      try {
        const likedMovies = JSON.parse(localStorage.getItem('hubplays_liked_movies') || '[]');
        setIsLiked(likedMovies.includes(movie._id));
      } catch {
        setIsLiked(false);
      }
    }
  }, [movie]);

  const handleLike = async () => {
    if (!movie) return;
    const nextAction = isLiked ? 'unlike' : 'like';

    // Optimistic UI
    const updatedCount = isLiked ? Math.max(0, likesCount - 1) : likesCount + 1;
    setLikesCount(updatedCount);
    setIsLiked(!isLiked);

    try {
      const likedMovies = JSON.parse(localStorage.getItem('hubplays_liked_movies') || '[]');
      const updatedList = isLiked 
        ? likedMovies.filter((mId) => mId !== movie._id)
        : [...likedMovies, movie._id];
      localStorage.setItem('hubplays_liked_movies', JSON.stringify(updatedList));

      const res = await likeMovie(movie._id, nextAction);
      if (res.success && typeof res.likes === 'number') {
        setLikesCount(res.likes);
      }
    } catch (err) {
      console.error('Failed to like movie', err);
      // Revert on error
      setLikesCount(movie.likes || 0);
      setIsLiked(isLiked);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (error || !movie) return <ErrorState message="Could not load video." />;

  return (
    <div className="watch-page">
      <div className="watch-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={22} />
          <span>Back</span>
        </button>
        <h2 className="watch-header-title">{movie.title}</h2>
      </div>
      
      <div className="player-wrapper">
        <VideoPlayer videoUrl={movie.videoUrl || `/api/stream/${id}`} />
      </div>

      <BannerAd placement="bannerWatchPage" />
      
      <div className="watch-container">
        <div className="watch-main-info">
          <div className="watch-title-row">
            <h1 className="watch-movie-title">{movie.title}</h1>

            <div className="watch-action-bar">
              <button 
                className={`watch-pill-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{likesCount > 0 ? formatNumber(likesCount) : 'Like'}</span>
              </button>

              <button 
                className="watch-pill-btn"
                onClick={() => setIsShareOpen(true)}
                title="Share video"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div className="watch-meta-row">
            <div className="watch-meta-left">
              <span className="watch-meta-item"><Eye size={16}/> {formatNumber(movie.views)} views</span>
              <span className="watch-meta-item"><Calendar size={16}/> {movie.releaseYear}</span>
              {movie.duration && (
                <span className="watch-meta-item"><Clock size={16}/> {formatDuration(movie.duration)}</span>
              )}
            </div>

            <div className="watch-genres">
              {movie.genre?.map((g) => (
                <Link key={g} to={`/search?genre=${g}`} className="watch-genre-tag">
                  {g}
                </Link>
              ))}
            </div>
          </div>

          <div className="watch-description-box">
            <h3>About this Movie</h3>
            <p>{movie.description || 'No detailed description available.'}</p>
          </div>

          {/* Comments Section */}
          <CommentSection movieId={movie._id} />
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        movie={movie}
      />
    </div>
  );
};

export default WatchPage;