import express from 'express';
import { getAdminMovies, getAdminMovieById, createMovie, updateMovie, togglePublish, toggleFeature, deleteMovie, getDashboard } from '../controllers/admin.controller.js';
import { deleteComment } from '../controllers/interaction.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';
import { uploadFiles } from '../middleware/upload.middleware.js';
import { validateMovie } from '../validation/movie.validation.js';

const router = express.Router();

router.use(protectAdmin);

router.get('/dashboard', getDashboard);
router.get('/movies', getAdminMovies);
router.get('/movies/:id', getAdminMovieById);
router.post('/movies', uploadFiles, validateMovie, createMovie);
router.put('/movies/:id', uploadFiles, validateMovie, updateMovie);
router.patch('/movies/:id/publish', togglePublish);
router.patch('/movies/:id/feature', toggleFeature);
router.delete('/movies/:id', deleteMovie);
router.delete('/comments/:commentId', deleteComment);

export default router;
