import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Film, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  HardDrive, 
  Globe, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  ExternalLink 
} from 'lucide-react';
import './MovieForm.css';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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

  // Source selections: 'device' or 'link'
  const [posterSource, setPosterSource] = useState('device');
  const [videoSource, setVideoSource] = useState('device');

  // Device files
  const [posterFile, setPosterFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // Link URLs
  const [posterLink, setPosterLink] = useState('');
  const [videoLink, setVideoLink] = useState('');

  // Previews & state
  const [posterPreview, setPosterPreview] = useState('');
  const [posterLinkError, setPosterLinkError] = useState(false);
  const [posterLinkLoaded, setPosterLinkLoaded] = useState(false);

  const [showVideoTest, setShowVideoTest] = useState(false);
  const [videoTestError, setVideoTestError] = useState(false);

  const [errors, setErrors] = useState({});

  const posterInputRef = useRef(null);
  const videoInputRef = useRef(null);

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

      // Handle poster initial state
      if (initialData.posterUrl) {
        if (/^https?:\/\//i.test(initialData.posterUrl)) {
          setPosterSource('link');
          setPosterLink(initialData.posterUrl);
          setPosterPreview(initialData.posterUrl);
        } else {
          setPosterSource('device');
          setPosterPreview(initialData.posterUrl);
        }
      }

      // Handle video initial state
      if (initialData.videoUrl) {
        if (/^https?:\/\//i.test(initialData.videoUrl)) {
          setVideoSource('link');
          setVideoLink(initialData.videoUrl);
        } else {
          setVideoSource('device');
        }
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

  // Poster Handlers
  const handlePosterFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
      if (errors.poster) {
        setErrors(prev => ({ ...prev, poster: null }));
      }
    }
  };

  const handleClearPosterFile = (e) => {
    e.stopPropagation();
    setPosterFile(null);
    if (initialData?.posterUrl && !/^https?:\/\//i.test(initialData.posterUrl)) {
      setPosterPreview(initialData.posterUrl);
    } else {
      setPosterPreview('');
    }
    if (posterInputRef.current) {
      posterInputRef.current.value = '';
    }
  };

  const handlePosterLinkChange = (e) => {
    const url = e.target.value;
    setPosterLink(url);
    setPosterLinkError(false);
    setPosterLinkLoaded(false);
    setPosterPreview(url);
    if (errors.poster) {
      setErrors(prev => ({ ...prev, poster: null }));
    }
  };

  // Video Handlers
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      if (errors.video) {
        setErrors(prev => ({ ...prev, video: null }));
      }
    }
  };

  const handleClearVideoFile = (e) => {
    e.stopPropagation();
    setVideoFile(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleVideoLinkChange = (e) => {
    const url = e.target.value;
    setVideoLink(url);
    setVideoTestError(false);
    setShowVideoTest(false);
    if (errors.video) {
      setErrors(prev => ({ ...prev, video: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Poster validation
    if (posterSource === 'device') {
      if (!initialData?.posterUrl && !posterFile) {
        newErrors.poster = 'Poster image file is required from device';
      }
    } else {
      if (!posterLink.trim()) {
        newErrors.poster = 'Poster image URL is required';
      } else if (!/^https?:\/\/.+/i.test(posterLink.trim())) {
        newErrors.poster = 'Please enter a valid URL (starting with http:// or https://)';
      }
    }

    // Video validation
    if (videoSource === 'device') {
      if (!initialData?.videoUrl && !videoFile) {
        newErrors.video = 'Video file is required from device';
      }
    } else {
      if (!videoLink.trim()) {
        newErrors.video = 'Video stream/file URL is required';
      } else if (!/^https?:\/\/.+/i.test(videoLink.trim())) {
        newErrors.video = 'Please enter a valid URL (starting with http:// or https://)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('description', formData.description.trim());
    data.append('genre', formData.genre.trim());
    data.append('releaseYear', formData.releaseYear);
    data.append('duration', (parseInt(formData.durationMinutes, 10) || 0) * 60);
    data.append('featured', formData.featured);
    data.append('published', formData.published);

    // Poster payload
    if (posterSource === 'device') {
      if (posterFile) {
        data.append('poster', posterFile);
      } else if (initialData?.posterUrl) {
        data.append('posterUrl', initialData.posterUrl);
      }
    } else {
      data.append('posterUrl', posterLink.trim());
    }

    // Video payload
    if (videoSource === 'device') {
      if (videoFile) {
        data.append('video', videoFile);
      } else if (initialData?.videoUrl) {
        data.append('videoUrl', initialData.videoUrl);
      }
    } else {
      data.append('videoUrl', videoLink.trim());
    }

    onSubmit(data);
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {/* Left Column: Metadata */}
        <div className="form-main">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g. Inception, Avatar, The Matrix"
              className={errors.title ? 'error' : ''} 
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description / Synopsis</label>
            <textarea 
              id="description" 
              name="description" 
              rows={4} 
              value={formData.description} 
              onChange={handleChange}
              placeholder="Write a brief synopsis or overview of the movie..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="releaseYear">Release Year</label>
              <input 
                type="number" 
                id="releaseYear" 
                name="releaseYear" 
                value={formData.releaseYear} 
                onChange={handleChange} 
                min={1888}
                max={new Date().getFullYear() + 5}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="durationMinutes">Duration (minutes)</label>
              <input 
                type="number" 
                id="durationMinutes" 
                name="durationMinutes" 
                value={formData.durationMinutes} 
                onChange={handleChange} 
                min={0}
                placeholder="e.g. 120"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genres</label>
            <input 
              type="text" 
              id="genre" 
              name="genre" 
              value={formData.genre} 
              onChange={handleChange} 
              placeholder="Action, Sci-Fi, Thriller" 
            />
            <span className="helper-text">Comma separated values</span>
          </div>
          
          <div className="form-switches">
            <label className="switch-label">
              <div className="switch">
                <input 
                  type="checkbox" 
                  name="published" 
                  checked={formData.published} 
                  onChange={handleChange} 
                />
                <span className="slider"></span>
              </div>
              <div>
                <strong>Published</strong>
                <p className="switch-hint">Visible to viewers</p>
              </div>
            </label>

            <label className="switch-label">
              <div className="switch">
                <input 
                  type="checkbox" 
                  name="featured" 
                  checked={formData.featured} 
                  onChange={handleChange} 
                />
                <span className="slider"></span>
              </div>
              <div>
                <strong>Featured</strong>
                <p className="switch-hint">Display in hero banner</p>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Media Uploads (Poster & Video) */}
        <div className="form-sidebar">
          
          {/* POSTER SECTION */}
          <div className="media-upload-section">
            <div className="media-section-header">
              <label className="section-label">Poster Image *</label>
              
              {/* Source Mode Tabs */}
              <div className="source-toggle">
                <button
                  type="button"
                  className={`source-btn ${posterSource === 'device' ? 'active' : ''}`}
                  onClick={() => setPosterSource('device')}
                >
                  <HardDrive size={13} />
                  <span>Device</span>
                </button>
                <button
                  type="button"
                  className={`source-btn ${posterSource === 'link' ? 'active' : ''}`}
                  onClick={() => setPosterSource('link')}
                >
                  <Globe size={13} />
                  <span>Link</span>
                </button>
              </div>
            </div>

            {/* Poster from Device */}
            {posterSource === 'device' ? (
              <div className="device-upload-container">
                <div 
                  className={`file-upload-box poster-box ${errors.poster ? 'error' : ''} ${posterPreview ? 'has-preview' : ''}`} 
                  onClick={() => posterInputRef.current?.click()}
                >
                  {posterPreview ? (
                    <div className="preview-wrapper">
                      <img 
                        src={posterPreview} 
                        alt="Poster Preview" 
                        className="poster-preview" 
                      />
                      <div className="preview-overlay">
                        <span>Click to change</span>
                        {posterFile && (
                          <button 
                            type="button" 
                            className="remove-file-btn" 
                            onClick={handleClearPosterFile}
                            title="Remove file"
                          >
                            <X size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <ImageIcon size={34} />
                      <span className="upload-title">Choose Poster Image</span>
                      <span className="upload-subtitle">JPG, PNG, WEBP from device</span>
                    </div>
                  )}
                  <input 
                    ref={posterInputRef}
                    type="file" 
                    id="poster-input" 
                    accept="image/*" 
                    onChange={handlePosterFileChange} 
                    hidden 
                  />
                </div>
                {posterFile && (
                  <div className="file-info-badge">
                    <CheckCircle2 size={14} className="icon-success" />
                    <span className="file-name">{posterFile.name}</span>
                    <span className="file-size">({formatFileSize(posterFile.size)})</span>
                  </div>
                )}
              </div>
            ) : (
              /* Poster from Link */
              <div className="link-upload-container">
                <div className="url-input-wrapper">
                  <LinkIcon size={15} className="url-icon" />
                  <input
                    type="url"
                    placeholder="https://example.com/poster.jpg"
                    value={posterLink}
                    onChange={handlePosterLinkChange}
                    className={`url-input ${errors.poster ? 'error' : ''}`}
                  />
                  {posterLink && (
                    <button 
                      type="button" 
                      className="clear-url-btn" 
                      onClick={() => handlePosterLinkChange({ target: { value: '' } })}
                      title="Clear URL"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="link-preview-box">
                  {posterLink ? (
                    <div className="link-preview-content">
                      <img
                        src={posterLink}
                        alt="Poster preview"
                        className="link-poster-img"
                        onLoad={() => {
                          setPosterLinkLoaded(true);
                          setPosterLinkError(false);
                        }}
                        onError={() => {
                          setPosterLinkError(true);
                          setPosterLinkLoaded(false);
                        }}
                      />
                      {posterLinkLoaded && (
                        <div className="preview-status success">
                          <CheckCircle2 size={13} />
                          <span>Image loaded</span>
                        </div>
                      )}
                      {posterLinkError && (
                        <div className="preview-status error">
                          <AlertCircle size={13} />
                          <span>Unable to load image preview</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="link-preview-placeholder">
                      <Globe size={26} />
                      <span>Paste an image URL above</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {errors.poster && <span className="error-text">{errors.poster}</span>}
          </div>

          {/* VIDEO SECTION */}
          <div className="media-upload-section">
            <div className="media-section-header">
              <label className="section-label">Movie Video *</label>
              
              {/* Source Mode Tabs */}
              <div className="source-toggle">
                <button
                  type="button"
                  className={`source-btn ${videoSource === 'device' ? 'active' : ''}`}
                  onClick={() => setVideoSource('device')}
                >
                  <HardDrive size={13} />
                  <span>Device</span>
                </button>
                <button
                  type="button"
                  className={`source-btn ${videoSource === 'link' ? 'active' : ''}`}
                  onClick={() => setVideoSource('link')}
                >
                  <Globe size={13} />
                  <span>Link</span>
                </button>
              </div>
            </div>

            {/* Video from Device */}
            {videoSource === 'device' ? (
              <div className="device-upload-container">
                <div 
                  className={`file-upload-box video-box ${errors.video ? 'error' : ''} ${videoFile ? 'has-file' : ''}`} 
                  onClick={() => videoInputRef.current?.click()}
                >
                  <div className="upload-placeholder">
                    <Film size={30} />
                    <span className="upload-title">
                      {videoFile 
                        ? videoFile.name 
                        : (initialData?.videoUrl && !/^https?:\/\//i.test(initialData.videoUrl)
                            ? 'Video file uploaded (click to replace)' 
                            : 'Choose Video File')}
                    </span>
                    <span className="upload-subtitle">MP4, WebM, MKV, AVI from device</span>
                  </div>
                  <input 
                    ref={videoInputRef}
                    type="file" 
                    id="video-input" 
                    accept="video/*" 
                    onChange={handleVideoFileChange} 
                    hidden 
                  />
                </div>

                {videoFile && (
                  <div className="file-info-badge">
                    <CheckCircle2 size={14} className="icon-success" />
                    <span className="file-name">{videoFile.name}</span>
                    <span className="file-size">({formatFileSize(videoFile.size)})</span>
                    <button 
                      type="button" 
                      className="remove-badge-btn" 
                      onClick={handleClearVideoFile}
                      title="Remove file"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Video from Link */
              <div className="link-upload-container">
                <div className="url-input-wrapper">
                  <LinkIcon size={15} className="url-icon" />
                  <input
                    type="url"
                    placeholder="https://example.com/movie.mp4"
                    value={videoLink}
                    onChange={handleVideoLinkChange}
                    className={`url-input ${errors.video ? 'error' : ''}`}
                  />
                  {videoLink && (
                    <button 
                      type="button" 
                      className="clear-url-btn" 
                      onClick={() => handleVideoLinkChange({ target: { value: '' } })}
                      title="Clear URL"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="video-link-meta">
                  <span className="helper-text">
                    Direct MP4/WebM URL or external stream link.
                  </span>
                  {videoLink && (
                    <button
                      type="button"
                      className="test-video-btn"
                      onClick={() => setShowVideoTest(!showVideoTest)}
                    >
                      <Play size={12} />
                      <span>{showVideoTest ? 'Hide Player' : 'Test Player'}</span>
                    </button>
                  )}
                </div>

                {showVideoTest && videoLink && (
                  <div className="video-test-player-container">
                    <video
                      src={videoLink}
                      controls
                      className="test-video-element"
                      onError={() => setVideoTestError(true)}
                      onLoadedData={() => setVideoTestError(false)}
                    />
                    {videoTestError && (
                      <div className="preview-status error">
                        <AlertCircle size={13} />
                        <span>Could not play video stream from this link</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {errors.video && <span className="error-text">{errors.video}</span>}
          </div>

        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          <Upload size={18} />
          <span>{isLoading ? 'Saving Movie...' : (initialData ? 'Update Movie' : 'Save Movie')}</span>
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
