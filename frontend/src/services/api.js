import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const getMovies = async (params = {}) => {
  const { data } = await api.get('/movies', { params });
  return data;
};

export const getFeaturedMovies = async () => {
  const { data } = await api.get('/movies/featured');
  return data;
};

export const getGenres = async () => {
  const { data } = await api.get('/movies/genres');
  return data;
};

export const getMovieById = async (id) => {
  const { data } = await api.get(`/movies/${id}`);
  return data;
};

export const getAdsConfig = async () => {
  const { data } = await api.get('/ads/config');
  return data;
};

// Likes & Comments
export const likeMovie = async (id, action = 'like') => {
  const { data } = await api.post(`/movies/${id}/like`, { action });
  return data;
};

export const getComments = async (movieId) => {
  const { data } = await api.get(`/movies/${movieId}/comments`);
  return data;
};

export const addComment = async (movieId, { userName, content }) => {
  const { data } = await api.post(`/movies/${movieId}/comments`, { userName, content });
  return data;
};

export const likeComment = async (commentId, action = 'like') => {
  const { data } = await api.post(`/movies/comments/${commentId}/like`, { action });
  return data;
};