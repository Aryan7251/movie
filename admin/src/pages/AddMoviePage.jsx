import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../services/api';
import { useToast } from '../context/ToastContext';
import MovieForm from '../components/MovieForm';
import './AddMoviePage.css';

const AddMoviePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await movieService.createMovie(formData);
      if (res.success) {
        addToast('success', 'Movie created successfully');
        navigate('/movies');
      }
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Failed to create movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-movie-page">
      <MovieForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};

export default AddMoviePage;
