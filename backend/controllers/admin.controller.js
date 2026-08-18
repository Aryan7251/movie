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
    const { title, description, genre, releaseYear, duration, featured, published } = req.body;
    
    let posterUrl = '';
    let videoUrl = '';

    if (req.files) {
      if (req.files.poster) {
        posterUrl = await storageService.upload(req.files.poster[0], 'poster');
      }
      if (req.files.video) {
        videoUrl = await storageService.upload(req.files.video[0], 'video');
      }
    }

    const movie = await Movie.create({
      title,
      description,
      genre: genre ? genre.split(',').map(g => g.trim()) : [],
      releaseYear: releaseYear ? parseInt(releaseYear) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      featured: featured === 'true',
      published: published === 'true',
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

    const { title, description, genre, releaseYear, duration, featured, published } = req.body;
    
    movie.title = title || movie.title;
    if (description !== undefined) movie.description = description;
    if (genre !== undefined) movie.genre = genre.split(',').map(g => g.trim());
    if (releaseYear !== undefined) movie.releaseYear = parseInt(releaseYear);
    if (duration !== undefined) movie.duration = parseInt(duration);
    if (featured !== undefined) movie.featured = featured === 'true';
    if (published !== undefined) movie.published = published === 'true';

    if (req.files) {
      if (req.files.poster) {
        if (movie.posterUrl) await storageService.delete(movie.posterUrl);
        movie.posterUrl = await storageService.upload(req.files.poster[0], 'poster');
      }
      if (req.files.video) {
        if (movie.videoUrl) await storageService.delete(movie.videoUrl);
        movie.videoUrl = await storageService.upload(req.files.video[0], 'video');
      }
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

    if (movie.posterUrl) await storageService.delete(movie.posterUrl);
    if (movie.videoUrl) await storageService.delete(movie.videoUrl);

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
