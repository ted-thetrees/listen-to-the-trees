import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
}

export interface AudioPlayerHandle {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  seekToPercent: (percent: number) => void;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
}

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(({ audioUrl }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);

  // Expose controls to parent components via ref
  useImperativeHandle(ref, () => ({
    play: () => {
      const audio = audioRef.current;
      if (audio) {
        audio.play();
        setIsPlaying(true);
      }
    },
    pause: () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    },
    toggle: () => {
      togglePlay();
    },
    seek: (time: number) => {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = Math.max(0, Math.min(time, audio.duration || 0));
        setCurrentTime(audio.currentTime);
      }
    },
    seekToPercent: (percent: number) => {
      const audio = audioRef.current;
      if (audio && audio.duration) {
        const clampedPercent = Math.max(0, Math.min(percent, 100));
        audio.currentTime = (clampedPercent / 100) * audio.duration;
        setCurrentTime(audio.currentTime);
      }
    },
    isPlaying,
    currentTime,
    duration,
    progress: duration ? (currentTime / duration) * 100 : 0,
  }));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    };

    // Check if already loaded (in case event fired before listener attached)
    if (audio.readyState >= 1) {
      setDuration(audio.duration);
    }

    audio.addEventListener('loadedmetadata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;


  return (
    <div className="audio-player-wrapper">
      <audio ref={audioRef} src={audioUrl} preload="auto" />
      
      <div className="container">
        <div className="view">
          <div className="time-display">{formatTime(currentTime)}</div>
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progressPercentage}%` }}
            />
            <div 
              className="progress-thumb"
              style={{ left: `${progressPercentage}%` }}
            />
            <input
              ref={progressRef}
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={handleSeek}
              className="progress-input"
            />
          </div>
          <div className="time-display">{formatTime(duration)}</div>
        </div>
        
        <div className="controllers">
          <button className="btn-shuffle" aria-label="Shuffle">
            <ShuffleIcon />
          </button>
          
          <div className="main-controls">
            <button className="btn-prev" aria-label="Previous">
              <PrevIcon />
            </button>
            <button className="btn-play" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="btn-next" aria-label="Next">
              <NextIcon />
            </button>
          </div>
          
          <button 
            className={`btn-repeat ${isRepeat ? 'active' : ''}`} 
            onClick={toggleRepeat}
            aria-label="Repeat"
          >
            <RepeatIcon />
          </button>
        </div>
      </div>

      <style jsx>{`
        .audio-player-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D1BC8E;
          font-family: "Cabinet Grotesk", sans-serif;
        }
        
        .container {
          width: 100%;
          border-radius: 0;
          padding: 1.14cqw 1.7cqw;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0, 0, 0, 0.85);
          gap: 1.14cqw;
        }
        
        .view {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          gap: 0.86cqw;
        }
        
        .time-display {
          width: 3.2cqw;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1cqw;
        }

        .progress-container {
          position: relative;
          flex-grow: 1;
          height: 0.43cqw;
          background-color: rgba(255, 255, 255, 0.33);
          border-radius: 0.43cqw;
        }
        
        .progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: #D1BC8E;
          border-radius: 0.43cqw 0 0 0.43cqw;
          pointer-events: none;
        }
        
        .progress-thumb {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 1cqw;
          height: 1cqw;
          background: #D1BC8E;
          border-radius: 50%;
          pointer-events: none;
        }
        
        .progress-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .controllers {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .controllers button {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.86cqw;
          cursor: pointer;
          background: none;
          border: none;
          border-radius: 0.29cqw;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .controllers button:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .main-controls {
          display: flex;
          gap: 0.43cqw;
          align-items: center;
        }
        
        .btn-play {
          background: rgba(255, 255, 255, 0.15) !important;
          border-radius: 50% !important;
          width: 3.4cqw;
          height: 3.4cqw;
        }
        
        .btn-repeat.active {
          color: #D1BC8E;
        }
      `}</style>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;


// Icon components
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style={{ width: '1.7cqw', height: '1.7cqw' }}>
    <path d="M19.8906 12.846C19.5371 14.189 17.8667 15.138 14.5257 17.0361C11.296 18.8709 9.6812 19.7884 8.37983 19.4196C7.8418 19.2671 7.35159 18.9776 6.95624 18.5787C6 17.6139 6 15.7426 6 12C6 8.2574 6 6.3861 6.95624 5.42132C7.35159 5.02245 7.8418 4.73288 8.37983 4.58042C9.6812 4.21165 11.296 5.12907 14.5257 6.96393C17.8667 8.86197 19.5371 9.811 19.8906 11.154C20.0365 11.7084 20.0365 12.2916 19.8906 12.846Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style={{ width: '1.7cqw', height: '1.7cqw' }}>
    <path d="M4 7C4 5.58579 4 4.87868 4.43934 4.43934C4.87868 4 5.58579 4 7 4C8.41421 4 9.12132 4 9.56066 4.43934C10 4.87868 10 5.58579 10 7V17C10 18.4142 10 19.1213 9.56066 19.5607C9.12132 20 8.41421 20 7 20C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V7Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 7C14 5.58579 14 4.87868 14.4393 4.43934C14.8787 4 15.5858 4 17 4C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V17C20 18.4142 20 19.1213 19.5607 19.5607C19.1213 20 18.4142 20 17 20C15.5858 20 14.8787 20 14.4393 19.5607C14 19.1213 14 18.4142 14 17V7Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const PrevIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style={{ width: '1.7cqw', height: '1.7cqw' }}>
    <path d="M8.06492 12.6258C8.31931 13.8374 9.67295 14.7077 12.3802 16.4481C15.3247 18.3411 16.797 19.2876 17.9895 18.9229C18.3934 18.7994 18.7654 18.5823 19.0777 18.2876C20 17.4178 20 15.6118 20 12C20 8.38816 20 6.58224 19.0777 5.71235C18.7654 5.41773 18.3934 5.20057 17.9895 5.07707C16.797 4.71243 15.3247 5.6589 12.3802 7.55186C9.67295 9.29233 8.31931 10.1626 8.06492 11.3742C7.97836 11.7865 7.97836 12.2135 8.06492 12.6258Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);


const NextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style={{ width: '1.7cqw', height: '1.7cqw', transform: 'scale(-1, 1)' }}>
    <path d="M8.06492 12.6258C8.31931 13.8374 9.67295 14.7077 12.3802 16.4481C15.3247 18.3411 16.797 19.2876 17.9895 18.9229C18.3934 18.7994 18.7654 18.5823 19.0777 18.2876C20 17.4178 20 15.6118 20 12C20 8.38816 20 6.58224 19.0777 5.71235C18.7654 5.41773 18.3934 5.20057 17.9895 5.07707C16.797 4.71243 15.3247 5.6589 12.3802 7.55186C9.67295 9.29233 8.31931 10.1626 8.06492 11.3742C7.97836 11.7865 7.97836 12.2135 8.06492 12.6258Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ShuffleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style={{ width: '1.7cqw', height: '1.7cqw' }}>
    <path d="M19.5576 4L20.4551 4.97574C20.8561 5.41165 21.0566 5.62961 20.9861 5.81481C20.9155 6 20.632 6 20.0649 6C18.7956 6 17.2771 5.79493 16.1111 6.4733C15.3903 6.89272 14.8883 7.62517 14.0392 9M3 18H4.58082C6.50873 18 7.47269 18 8.2862 17.5267C9.00708 17.1073 9.50904 16.3748 10.3582 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.5576 20L20.4551 19.0243C20.8561 18.5883 21.0566 18.3704 20.9861 18.1852C20.9155 18 20.632 18 20.0649 18C18.7956 18 17.2771 18.2051 16.1111 17.5267C15.2976 17.0534 14.7629 16.1815 13.6935 14.4376L10.7038 9.5624C9.63441 7.81853 9.0997 6.9466 8.2862 6.4733C7.47269 6 6.50873 6 4.58082 6H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RepeatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style={{ width: '1.7cqw', height: '1.7cqw' }}>
    <path d="M16.3884 3L17.3913 3.97574C17.8393 4.41165 18.0633 4.62961 17.9844 4.81481C17.9056 5 17.5888 5 16.9552 5H9.19422C5.22096 5 2 8.13401 2 12C2 13.4872 2.47668 14.8662 3.2895 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.61156 21L6.60875 20.0243C6.16074 19.5883 5.93673 19.3704 6.01557 19.1852C6.09441 19 6.4112 19 7.04478 19H14.8058C18.779 19 22 15.866 22 12C22 10.5128 21.5233 9.13383 20.7105 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
