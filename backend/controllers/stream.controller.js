import Movie from '../models/Movie.js';
import { storageService } from '../services/storage.service.js';

export const streamVideo = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || !movie.published) {
      res.status(404);
      throw new Error('Movie not found');
    }

    if (!movie.videoUrl) {
      res.status(404);
      throw new Error('Video file not found');
    }

    if (movie.videoUrl.startsWith('http://') || movie.videoUrl.startsWith('https://')) {
      return res.redirect(movie.videoUrl);
    }

    const filePath = storageService.getFilePath(movie.videoUrl);
    const range = req.headers.range;

    try {
      const { stream, head, status } = storageService.getFileStream(filePath, range);
      res.writeHead(status, head);
      stream.pipe(res);
    } catch (err) {
      res.status(404);
      throw new Error('Video file not found on server');
    }

  } catch (error) {
    next(error);
  }
};
