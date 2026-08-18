import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService } from '../services/api';
import { useToast } from '../context/ToastContext';
import MovieForm from '../components/MovieForm';
import LoadingSpinner from '../components/LoadingSpinner';
import './EditMoviePage.css';

const EditMoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await movieService.getMovieById(id);
        if (res.success) {
          setMovie(res.movie);
        }
      } catch (err) {
        addToast('error', 'Failed to fetch movie details');
        navigate('/movies');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, navigate, addToast]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      const res = await movieService.updateMovie(id, formData);
      if (res.success) {
        addToast('success', 'Movie updated successfully');
        navigate('/movies');
      }
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Failed to update movie');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loader"><LoadingSpinner /></div>;

  return (
    <div className="edit-movie-page">
      <MovieForm initialData={movie} onSubmit={handleSubmit} isLoading={saving} />
    </div>
  );
};

export default EditMoviePage;
