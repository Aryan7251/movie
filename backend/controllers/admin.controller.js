import Movie from '../models/Movie.js';
import { storageService } from '../services/storage.service.js';

export const getAdminMovies = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', genre = '', published } = req.query;
    
    const query = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (genre) {
      query.genre = genre;
    }
    if (published !== undefined && published !== '') {
      query.published = published === 'true';
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }
    };

    const result = await Movie.paginate(query, options);

    res.json({
      success: true,
      movies: result.docs,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.totalDocs,
        pages: result.totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }
    res.json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

export const createMovie = async (req, res, next) => {
  try {
    const { title, description, genre, releaseYear, duration, featured, published, posterUrl: bodyPosterUrl, videoUrl: bodyVideoUrl } = req.body;
    
    let posterUrl = bodyPosterUrl || '';
    let videoUrl = bodyVideoUrl || '';

    if (req.files) {
      if (req.files.poster && req.files.poster.length > 0) {
        posterUrl = await storageService.upload(req.files.poster[0], 'poster');
      }
      if (req.files.video && req.files.video.length > 0) {
        videoUrl = await storageService.upload(req.files.video[0], 'video');
      }
    }

    const movie = await Movie.create({
      title,
      description,
      genre: genre ? (Array.isArray(genre) ? genre : genre.split(',').map(g => g.trim()).filter(Boolean)) : [],
      releaseYear: releaseYear ? parseInt(releaseYear, 10) : undefined,
      duration: duration ? parseInt(duration, 10) : undefined,
      featured: featured === 'true' || featured === true,
      published: published === 'true' || published === true,
      posterUrl,
      videoUrl
    });

    res.status(201).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }

    const { title, description, genre, releaseYear, duration, featured, published, posterUrl: bodyPosterUrl, videoUrl: bodyVideoUrl } = req.body;
    
    movie.title = title || movie.title;
    if (description !== undefined) movie.description = description;
    if (genre !== undefined) {
      movie.genre = Array.isArray(genre) ? genre : genre.split(',').map(g => g.trim()).filter(Boolean);
    }
    if (releaseYear !== undefined) movie.releaseYear = parseInt(releaseYear, 10);
    if (duration !== undefined) movie.duration = parseInt(duration, 10);
    if (featured !== undefined) movie.featured = featured === 'true' || featured === true;
    if (published !== undefined) movie.published = published === 'true' || published === true;

    // Handle poster update (uploaded file vs link URL)
    if (req.files?.poster && req.files.poster.length > 0) {
      if (movie.posterUrl && movie.posterUrl.startsWith('/uploads/')) {
        await storageService.delete(movie.posterUrl);
      }
      movie.posterUrl = await storageService.upload(req.files.poster[0], 'poster');
    } else if (bodyPosterUrl !== undefined) {
      if (movie.posterUrl && movie.posterUrl.startsWith('/uploads/') && movie.posterUrl !== bodyPosterUrl) {
        await storageService.delete(movie.posterUrl);
      }
      movie.posterUrl = bodyPosterUrl;
    }

    // Handle video update (uploaded file vs link URL)
    if (req.files?.video && req.files.video.length > 0) {
      if (movie.videoUrl && movie.videoUrl.startsWith('/uploads/')) {
        await storageService.delete(movie.videoUrl);
      }
      movie.videoUrl = await storageService.upload(req.files.video[0], 'video');
    } else if (bodyVideoUrl !== undefined) {
      if (movie.videoUrl && movie.videoUrl.startsWith('/uploads/') && movie.videoUrl !== bodyVideoUrl) {
        await storageService.delete(movie.videoUrl);
      }
      movie.videoUrl = bodyVideoUrl;
    }

    const updatedMovie = await movie.save();
    res.json({ success: true, movie: updatedMovie });
  } catch (error) {
    next(error);
  }
};

export const togglePublish = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }
    movie.published = req.body.published;
    const updatedMovie = await movie.save();
    res.json({ success: true, movie: updatedMovie });
  } catch (error) {
    next(error);
  }
};

export const toggleFeature = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }
    movie.featured = req.body.featured;
    const updatedMovie = await movie.save();
    res.json({ success: true, movie: updatedMovie });
  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }

    if (movie.posterUrl && movie.posterUrl.startsWith('/uploads/')) {
      await storageService.delete(movie.posterUrl);
    }
    if (movie.videoUrl && movie.videoUrl.startsWith('/uploads/')) {
      await storageService.delete(movie.videoUrl);
    }

    await movie.deleteOne();
    res.json({ success: true, message: 'Movie removed' });
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const publishedMovies = await Movie.countDocuments({ published: true });
    const featuredMovies = await Movie.countDocuments({ featured: true });
    
    const result = await Movie.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = result.length > 0 ? result[0].totalViews : 0;

    const recentUploads = await Movie.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      totalMovies,
      publishedMovies,
      featuredMovies,
      totalViews,
      recentUploads
    });
  } catch (error) {
    next(error);
  }
};
