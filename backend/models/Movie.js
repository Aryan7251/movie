import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  posterUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  genre: [{ type: String, index: true }],
  releaseYear: { type: Number },
  duration: { type: Number },
  views: { type: Number, default: 0, index: true },
  likes: { type: Number, default: 0, index: true },
  featured: { type: Boolean, default: false, index: true },
  published: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

movieSchema.plugin(mongoosePaginate);
movieSchema.index({ title: 'text' });

movieSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Movie', movieSchema);
