import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import './HeroSlider.css';

const HeroSlider = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div className="hero-slider">
      {movies.map((movie, index) => (
        <div 
          key={movie._id} 
          className={`hero-slide ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${movie.posterUrl})` }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">{movie.title}</h1>
            <div className="hero-meta">
              <span>{movie.releaseYear}</span>
              {movie.genre && movie.genre.map(g => (
                <span key={g} className="hero-genre-tag">{g}</span>
              ))}
            </div>
            <p className="hero-desc">{movie.description}</p>
            <div className="hero-actions">
              <button 
                className="btn-play"
                onClick={() => navigate(`/watch/${movie._id}`)}
              >
                <Play fill="currentColor" size={20} /> Play Now
              </button>
              <button 
                className="btn-info"
                onClick={() => navigate(`/movie/${movie._id}`)}
              >
                <Info size={20} /> More Info
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="hero-dots">
        {movies.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};
export default HeroSlider;