import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true
  },
  userName: {
    type: String,
    default: 'Anonymous Viewer',
    trim: true,
    maxlength: 50
  },
  content: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: 1000
  },
  likes: {
    type: Number,
    default: 0
  },
  avatarColor: {
    type: String,
    default: '#e50914'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export default mongoose.model('Comment', commentSchema);
