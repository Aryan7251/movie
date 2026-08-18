import Movie from '../models/Movie.js';
import Comment from '../models/Comment.js';

// Available avatar colors for user comments
const AVATAR_COLORS = [
  '#e50914', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1'
];

export const likeMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    const movie = await Movie.findById(id);
    if (!movie || !movie.published) {
      res.status(404);
      throw new Error('Movie not found');
    }

    if (action === 'unlike') {
      movie.likes = Math.max(0, (movie.likes || 0) - 1);
    } else {
      movie.likes = (movie.likes || 0) + 1;
    }

    await movie.save();

    res.json({
      success: true,
      likes: movie.likes,
      action: action === 'unlike' ? 'unliked' : 'liked'
    });
  } catch (error) {
    next(error);
  }
};

export const getMovieComments = async (req, res, next) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }

    const comments = await Comment.find({ movieId: id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      total: comments.length,
      comments
    });
  } catch (error) {
    next(error);
  }
};

export const addMovieComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userName, content } = req.body;

    if (!content || !content.trim()) {
      res.status(400);
      throw new Error('Comment content cannot be empty');
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }

    // Pick random color or consistent color based on name length
    const colorIndex = (userName ? userName.length : Math.floor(Math.random() * 10)) % AVATAR_COLORS.length;
    const avatarColor = AVATAR_COLORS[colorIndex];

    const newComment = await Comment.create({
      movieId: id,
      userName: userName?.trim() || 'Anonymous Viewer',
      content: content.trim(),
      avatarColor
    });

    res.status(201).json({
      success: true,
      comment: newComment
    });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    if (action === 'unlike') {
      comment.likes = Math.max(0, (comment.likes || 0) - 1);
    } else {
      comment.likes = (comment.likes || 0) + 1;
    }

    await comment.save();

    res.json({
      success: true,
      likes: comment.likes,
      action: action === 'unlike' ? 'unliked' : 'liked'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
