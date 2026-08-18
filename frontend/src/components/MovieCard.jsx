import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye } from 'lucide-react';
import './MovieCard.css';

const formatViews = (views) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views || 0;
};

const formatDuration = (seconds) => {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie._id}`} className="movie-card">
      <div className="poster-container">
        <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
        <div className="poster-overlay">
          <Play size={48} className="play-icon" />
        </div>
        {movie.duration && (
          <span className="duration-badge">{formatDuration(movie.duration)}</span>
        )}
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span>{movie.genre?.[0] || 'Unknown'} &middot; {movie.releaseYear}</span>
          <span className="views-count">
            <Eye size={12} /> {formatViews(movie.views)}
          </span>
        </div>
      </div>
    </Link>
  );
};
export default MovieCard;