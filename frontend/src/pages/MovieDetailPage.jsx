import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Eye, Calendar, Clock, ThumbsUp, Share2, Heart } from 'lucide-react';
import { useMovie, useMovies } from '../hooks/useMovies';
import { likeMovie } from '../services/api';
import ErrorState from '../components/ErrorState';
import MovieGrid from '../components/MovieGrid';
import ShareModal from '../components/ShareModal';
import CommentSection from '../components/CommentSection';
import './MovieDetailPage.css';

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

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, loading, error, refetch } = useMovie(id);
  const { data: relatedData } = useMovies({ 
    genre: movie?.genre?.[0], 
    limit: 6 
  });

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

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
  if (error || !movie) return <ErrorState onRetry={refetch} />;

  const related = relatedData?.movies?.filter(m => m._id !== movie._id).slice(0, 5);

  return (
    <div className="movie-detail-page">
      <div className="movie-backdrop" style={{ backgroundImage: `url(${movie.posterUrl})` }}>
        <div className="backdrop-overlay"></div>
      </div>
      
      <div className="movie-detail-content">
        <div className="movie-detail-main">
          <div className="poster-col">
            <img src={movie.posterUrl} alt={movie.title} className="detail-poster" />
            <button className="play-movie-btn" onClick={() => navigate(`/watch/${movie._id}`)}>
              <Play fill="currentColor" size={20} /> Play Movie
            </button>
          </div>
          
          <div className="info-col">
            <h1 className="detail-title">{movie.title}</h1>
            
            <div className="detail-meta">
              <span className="meta-item"><Calendar size={16}/> {movie.releaseYear}</span>
              {movie.duration && (
                <span className="meta-item"><Clock size={16}/> {formatDuration(movie.duration)}</span>
              )}
              <span className="meta-item"><Eye size={16}/> {formatNumber(movie.views)} views</span>
            </div>
            
            <div className="detail-genres">
              {movie.genre?.map(g => (
                <Link key={g} to={`/search?genre=${g}`} className="genre-chip">{g}</Link>
              ))}
            </div>

            {/* Quick Action Bar: Like & Share */}
            <div className="detail-action-bar">
              <button 
                className={`action-pill-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{likesCount > 0 ? formatNumber(likesCount) : 'Like'}</span>
              </button>

              <button 
                className="action-pill-btn"
                onClick={() => setIsShareOpen(true)}
                title="Share this movie"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>
            
            <div className="detail-desc">
              <h3>Synopsis</h3>
              <p>{movie.description || 'No description available for this title.'}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection movieId={movie._id} />
        
        {/* Related Movies */}
        {related && related.length > 0 && (
          <div className="related-movies">
            <MovieGrid title="More Like This" movies={related} />
          </div>
        )}
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

export default MovieDetailPage;