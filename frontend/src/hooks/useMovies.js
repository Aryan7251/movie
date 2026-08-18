import { useState, useEffect, useCallback } from 'react';
import { getMovies, getFeaturedMovies, getGenres, getMovieById } from '../services/api';

export const useMovies = (params = {}) => {
  const [data, setData] = useState({ movies: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMovies(params);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { data, loading, error, refetch: fetchMovies };
};

export const useFeaturedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFeaturedMovies();
      setMovies(result.movies || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return { movies, loading, error, refetch: fetchFeatured };
};

export const useGenres = () => {
  const [genres, setGenres] = useState([]);
  useEffect(() => {
    getGenres().then(res => setGenres(res.genres || [])).catch(console.error);
  }, []);
  return { genres };
};

export const useMovie = (id) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovie = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getMovieById(id);
      setMovie(result.movie);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  return { movie, loading, error, refetch: fetchMovie };
};