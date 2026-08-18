import React from 'react';
import { Pencil, Trash2, Star, EyeOff, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import './MovieTable.css';

const MovieTable = ({ movies, onPublishToggle, onFeatureToggle, onDelete }) => {
  
  if (!movies || movies.length === 0) {
    return <div className="empty-state">No movies found.</div>;
  }

  return (
    <>
      <div className="table-responsive">
        <table className="movie-table">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Genre</th>
              <th>Views</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie._id}>
                <td>
                  <div className="movie-cell">
                    <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
                    <div>
                      <div className="movie-title">{movie.title}</div>
                      <div className="movie-year">{movie.releaseYear} • {Math.floor(movie.duration / 60)} min</div>
                    </div>
                  </div>
                </td>
                <td>{movie.genre?.join(', ')}</td>
                <td>{movie.views?.toLocaleString() || 0}</td>
                <td>
                  <span className={`badge ${movie.published ? 'badge-success' : 'badge-warning'}`}>
                    {movie.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <button className={`action-btn ${movie.featured ? 'featured' : ''}`} onClick={() => onFeatureToggle(movie._id, !movie.featured)}>
                    <Star size={18} fill={movie.featured ? "currentColor" : "none"} />
                  </button>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="action-btn" onClick={() => onPublishToggle(movie._id, !movie.published)} title={movie.published ? "Unpublish" : "Publish"}>
                      {movie.published ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <Link to={`/movies/edit/${movie._id}`} className="action-btn">
                      <Pencil size={18} />
                    </Link>
                    <button className="action-btn danger" onClick={() => onDelete(movie._id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="movie-cards">
        {movies.map(movie => (
          <div key={movie._id} className="movie-card">
            <div className="movie-card-header">
              <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
              <div className="movie-card-info">
                <div className="movie-title">{movie.title}</div>
                <div className="movie-year">{movie.releaseYear} • {Math.floor(movie.duration / 60)} min</div>
                <div className="movie-genre">{movie.genre?.join(', ')}</div>
              </div>
            </div>
            <div className="movie-card-stats">
              <span>{movie.views?.toLocaleString() || 0} views</span>
              <span className={`badge ${movie.published ? 'badge-success' : 'badge-warning'}`}>
                {movie.published ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="movie-card-actions">
              <button className={`btn-icon ${movie.featured ? 'featured' : ''}`} onClick={() => onFeatureToggle(movie._id, !movie.featured)}>
                <Star size={18} fill={movie.featured ? "currentColor" : "none"} />
              </button>
              <button className="btn-icon" onClick={() => onPublishToggle(movie._id, !movie.published)}>
                {movie.published ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <Link to={`/movies/edit/${movie._id}`} className="btn-icon">
                <Pencil size={18} />
              </Link>
              <button className="btn-icon danger" onClick={() => onDelete(movie._id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MovieTable;
