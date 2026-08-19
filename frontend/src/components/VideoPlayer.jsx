import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import PreRollAd from './PreRollAd';
import './VideoPlayer.css';

export const parseVideoSource = (url) => {
  if (!url || typeof url !== 'string') {
    return { type: 'unknown', rawUrl: '' };
  }

  const trimmed = url.trim();

  // Extract from <iframe> tag if user pasted embed code
  const iframeSrcMatch = trimmed.match(/<iframe.*?src=["'](.*?)["']/i);
  const cleanUrl = iframeSrcMatch ? iframeSrcMatch[1] : trimmed;

  // 1. YouTube detection
  const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      rawUrl: cleanUrl
    };
  }

  // 2. Vimeo detection
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      rawUrl: cleanUrl
    };
  }

  // 3. Dailymotion detection
  const dmMatch = cleanUrl.match(/(?:dailymotion\.com\/(?:video|embed\/video)\/|dai\.ly\/)([a-zA-Z0-9]+)/i);
  if (dmMatch && dmMatch[1]) {
    const videoId = dmMatch[1];
    return {
      type: 'dailymotion',
      videoId,
      embedUrl: `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`,
      rawUrl: cleanUrl
    };
  }

  // 4. Other third-party iframe embed URLs
  if (cleanUrl.includes('/embed') || cleanUrl.includes('/preview') || cleanUrl.includes('/e/')) {
    return {
      type: 'embed',
      embedUrl: cleanUrl,
      rawUrl: cleanUrl
    };
  }

  // 5. Direct video stream or local uploaded file
  return {
    type: 'direct',
    rawUrl: cleanUrl
  };
};

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [adFinished, setAdFinished] = useState(false);
  const [error, setError] = useState(false);

  const source = useMemo(() => parseVideoSource(videoUrl), [videoUrl]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!adFinished || source.type !== 'direct') return;
      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
        case 'arrowright':
          if (videoRef.current) videoRef.current.currentTime += 5;
          break;
        case 'arrowleft':
          if (videoRef.current) videoRef.current.currentTime -= 5;
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adFinished, isPlaying, source.type]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleError = () => {
    setError(true);
  };

  const retry = () => {
    setError(false);
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) videoRef.current.play();
    }
  };

  const handleAdComplete = () => {
    setAdFinished(true);
    if (source.type === 'direct' && videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error(err));
    }
  };

  if (source.type === 'youtube' || source.type === 'vimeo' || source.type === 'dailymotion' || source.type === 'embed') {
    return (
      <div className="video-container" ref={containerRef}>
        {!adFinished && <PreRollAd onComplete={handleAdComplete} />}
        {adFinished && (
          <iframe
            src={source.embedUrl}
            title="Video Player"
            className="video-iframe-element"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    );
  }

  return (
    <div className="video-container" ref={containerRef}>
      {!adFinished && <PreRollAd onComplete={handleAdComplete} />}
      
      {error ? (
        <div className="video-error">
          <p>Failed to load video.</p>
          <button onClick={retry}>Retry</button>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={source.rawUrl}
          className="video-element"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {adFinished && !error && (
        <div className="video-controls">
          <div className="progress-container">
            <input 
              type="range" 
              min={0} 
              max={duration || 0} 
              value={currentTime}
              onChange={handleSeek}
              className="progress-bar"
            />
          </div>
          <div className="controls-row">
            <div className="controls-left">
              <button onClick={togglePlay} className="control-btn" aria-label="Play/Pause">
                {isPlaying ? <Pause size={20}/> : <Play size={20}/>}
              </button>
              <div className="volume-container">
                <button onClick={toggleMute} className="control-btn" aria-label="Mute">
                  {isMuted || volume === 0 ? <VolumeX size={20}/> : <Volume2 size={20}/>}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
              <span className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="controls-right">
              <button onClick={toggleFullscreen} className="control-btn" aria-label="Fullscreen">
                {isFullscreen ? <Minimize size={20}/> : <Maximize size={20}/>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default VideoPlayer;