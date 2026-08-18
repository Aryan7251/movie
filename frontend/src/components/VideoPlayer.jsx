import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import PreRollAd from './PreRollAd';
import './VideoPlayer.css';

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!adFinished) return;
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
  }, [adFinished, isPlaying]);

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
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error(err));
    }
  };

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
          src={videoUrl}
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
              <button onClick={togglePlay} className="control-btn">
                {isPlaying ? <Pause size={20}/> : <Play size={20}/>}
              </button>
              <div className="volume-container">
                <button onClick={toggleMute} className="control-btn">
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
              <button onClick={toggleFullscreen} className="control-btn">
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