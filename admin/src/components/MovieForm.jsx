import React, { useState, useEffect, useRef } from 'react';
import { Upload, Film, Image as ImageIcon } from 'lucide-react';
import './MovieForm.css';

const MovieForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    durationMinutes: 0,
    featured: false,
    published: false
  });
  const [posterFile, setPosterFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        genre: initialData.genre?.join(', ') || '',
        releaseYear: initialData.releaseYear || new Date().getFullYear(),
        durationMinutes: initialData.duration ? Math.floor(initialData.duration / 60) : 0,
        featured: initialData.featured || false,
        published: initialData.published || false
      });
      if (initialData.posterUrl) {
        setPosterPreview(initialData.posterUrl);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!initialData && !posterFile) newErrors.poster = 'Poster is required for new movies';
    if (!initialData && !videoFile) newErrors.video = 'Video file is required for new movies';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('genre', formData.genre);
    data.append('releaseYear', formData.releaseYear);
    data.append('duration', parseInt(formData.durationMinutes) * 60);
    data.append('featured', formData.featured);
    data.append('published', formData.published);
    
    if (posterFile) data.append('poster', posterFile);
    if (videoFile) data.append('video', videoFile);

    onSubmit(data);
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-main">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={errors.title ? 'error' : ''} />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="releaseYear">Release Year</label>
              <input type="number" id="releaseYear" name="releaseYear" value={formData.releaseYear} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label htmlFor="durationMinutes">Duration (minutes)</label>
              <input type="number" id="durationMinutes" name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genres</label>
            <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} placeholder="Action, Drama, Thriller" />
            <span className="helper-text">Comma separated values</span>
          </div>
          
          <div className="form-switches">
            <label className="switch-label">
              <div className="switch">
                <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} />
                <span className="slider"></span>
              </div>
              Published
            </label>
            <label className="switch-label">
              <div className="switch">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                <span className="slider"></span>
              </div>
              Featured
            </label>
          </div>
        </div>

        <div className="form-sidebar">
          <div className="form-group">
            <label>Poster Image *</label>
            <div className={`file-upload-box ${errors.poster ? 'error' : ''}`} onClick={() => document.getElementById('poster-input').click()}>
              {posterPreview ? (
                <img src={posterPreview} alt="Preview" className="poster-preview" />
              ) : (
                <div className="upload-placeholder">
                  <ImageIcon size={32} />
                  <span>Click to upload poster</span>
                </div>
              )}
              <input type="file" id="poster-input" accept="image/*" onChange={handlePosterChange} hidden />
            </div>
            {errors.poster && <span className="error-text">{errors.poster}</span>}
          </div>

          <div className="form-group">
            <label>Video File *</label>
            <div className={`file-upload-box video ${errors.video ? 'error' : ''}`} onClick={() => document.getElementById('video-input').click()}>
              <div className="upload-placeholder">
                <Film size={32} />
                <span>{videoFile ? videoFile.name : (initialData?.videoUrl ? 'Video uploaded (click to change)' : 'Click to upload video')}</span>
              </div>
              <input type="file" id="video-input" accept="video/*" onChange={handleVideoChange} hidden />
            </div>
            {errors.video && <span className="error-text">{errors.video}</span>}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Movie'}
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
