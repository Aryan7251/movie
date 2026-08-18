import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';
import { useToast } from '../context/ToastContext';
import MovieTable from '../components/MovieTable';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import './MoviesPage.css';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  
  const [filters, setFilters] = useState({ search: '', genre: '', published: '' });
  
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
  const { addToast } = useToast();

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await movieService.getMovies({ ...filters, page: pagination.page });
      if (res.success) {
        setMovies(res.movies);
        setPagination(res.pagination);
      }
    } catch (err) {
      addToast('error', 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePublishToggle = async (id, published) => {
    try {
      const res = await movieService.publishMovie(id, published);
      if (res.success) {
        setMovies(prev => prev.map(m => m._id === id ? { ...m, published } : m));
        addToast('success', `Movie ${published ? 'published' : 'unpublished'}`);
      }
    } catch (err) {
      addToast('error', 'Failed to update status');
    }
  };

  const handleFeatureToggle = async (id, featured) => {
    try {
      const res = await movieService.featureMovie(id, featured);
      if (res.success) {
        setMovies(prev => prev.map(m => m._id === id ? { ...m, featured } : m));
        addToast('success', `Movie ${featured ? 'featured' : 'unfeatured'}`);
      }
    } catch (err) {
      addToast('error', 'Failed to update featured status');
    }
  };

  const confirmDelete = (id) => {
    setDeleteDialog({ isOpen: true, id });
  };

  const handleDelete = async () => {
    try {
      const res = await movieService.deleteMovie(deleteDialog.id);
      if (res.success) {
        setMovies(prev => prev.filter(m => m._id !== deleteDialog.id));
        addToast('success', 'Movie deleted successfully');
      }
    } catch (err) {
      addToast('error', 'Failed to delete movie');
    } finally {
      setDeleteDialog({ isOpen: false, id: null });
    }
  };

  return (
    <div className="movies-page">
      <div className="movies-header">
        <div className="filters">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" name="search" placeholder="Search movies..." value={filters.search} onChange={handleFilterChange} />
          </div>
          <select name="published" value={filters.published} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
        <Link to="/movies/add" className="btn btn-primary">
          <Plus size={18} /> Add Movie
        </Link>
      </div>

      {loading ? (
        <div className="page-loader"><LoadingSpinner /></div>
      ) : (
        <>
          <MovieTable 
            movies={movies} 
            onPublishToggle={handlePublishToggle} 
            onFeatureToggle={handleFeatureToggle} 
            onDelete={confirmDelete} 
          />
          
          {pagination.pages > 1 && (
            <div className="pagination">
              <button disabled={pagination.page === 1} onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}>
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.pages}</span>
              <button disabled={pagination.page === pagination.pages} onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}>
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Movie"
        message="Are you sure you want to delete this movie? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default MoviesPage;
