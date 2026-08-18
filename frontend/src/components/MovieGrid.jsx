import React from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import './MovieGrid.css';

const MovieGrid = ({ title, movies, seeAllLink }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="movie-grid-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {seeAllLink && (
          <Link to={seeAllLink} className="see-all-link">See All</Link>
        )}
      </div>
      <div className="movie-grid">
        {movies.map(movie => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </section>
  );
};
export default MovieGrid;