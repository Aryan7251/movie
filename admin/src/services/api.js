import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  setup: async (username, password) => {
    const res = await api.post('/auth/setup', { username, password });
    return res.data;
  },
  login: async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const dashboardService = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  }
};

export const movieService = {
  getMovies: async (params = {}) => {
    const { page = 1, limit = 20, search = '', genre = '', published = '' } = params;
    const query = new URLSearchParams({ page, limit, search, genre, published }).toString();
    const res = await api.get(`/admin/movies?${query}`);
    return res.data;
  },
  getMovieById: async (id) => {
    const res = await api.get(`/admin/movies/${id}`);
    return res.data;
  },
  createMovie: async (formData) => {
    const res = await api.post('/admin/movies', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  updateMovie: async (id, formData) => {
    const res = await api.put(`/admin/movies/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  publishMovie: async (id, published) => {
    const res = await api.patch(`/admin/movies/${id}/publish`, { published });
    return res.data;
  },
  featureMovie: async (id, featured) => {
    const res = await api.patch(`/admin/movies/${id}/feature`, { featured });
    return res.data;
  },
  deleteMovie: async (id) => {
    const res = await api.delete(`/admin/movies/${id}`);
    return res.data;
  }
};

export const adsService = {
  getAdsConfig: async () => {
    const res = await api.get('/ads/config');
    return res.data;
  },
  updateAdsConfig: async (config) => {
    const res = await api.put('/ads/config', config);
    return res.data;
  }
};
