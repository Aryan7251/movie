import express from 'express';
import { getMovies, getFeaturedMovies, getGenres, getMovieById } from '../controllers/movie.controller.js';
import {
  likeMovie,
  getMovieComments,
  addMovieComment,
  likeComment
} from '../controllers/interaction.controller.js';

const router = express.Router();

// Public movie routes
router.get('/featured', getFeaturedMovies);
router.get('/genres', getGenres);
router.get('/:id', getMovieById);
router.get('/', getMovies);

// Interaction routes: Likes and Comments
router.post('/:id/like', likeMovie);
router.get('/:id/comments', getMovieComments);
router.post('/:id/comments', addMovieComment);
router.post('/comments/:commentId/like', likeComment);

export default router;
