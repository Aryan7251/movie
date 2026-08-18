import Movie from '../models/Movie.js';

export const getMovies = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', genre = '', sort = 'newest' } = req.query;
    
    const query = { published: true };
    if (search) {
      query.$text = { $search: search };
    }
    if (genre) {
      query.genre = genre;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { views: -1 };
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOption
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

export const getFeaturedMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ published: true, featured: true }).sort({ createdAt: -1 });
    res.json({ success: true, movies });
  } catch (error) {
    next(error);
  }
};

export const getGenres = async (req, res, next) => {
  try {
    const genres = await Movie.distinct('genre', { published: true });
    res.json({ success: true, genres });
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || !movie.published) {
      res.status(404);
      throw new Error('Movie not found');
    }

    // Increment views
    movie.views += 1;
    await movie.save();

    res.json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};
