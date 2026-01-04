import React, { useRef, useCallback } from 'react';
import Spline from '@splinetool/react-spline';
import type { Application, SPEObject } from '@splinetool/runtime';
import AudioPlayer, { AudioPlayerHandle } from './AudioPlayer';

interface SplineAudioPlayerProps {
  /** URL to the Spline scene (.splinecode file) */
  sceneUrl: string;
  /** URL to the audio file */
  audioUrl: string;
  /** Name of the Spline object that triggers play/pause (default: 'PlayButton') */
  triggerObjectName?: string;
  /** Optional callback when playback state changes */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** Optional className for the wrapper */
  className?: string;
}

// Progress bar position mapping
const PROGRESS_X_START = -225;
const PROGRESS_X_END = 225;

/**
 * SplineAudioPlayer - Combines a Spline 3D scene with an AudioPlayer
 * 
 * Clicking on a designated object in the Spline scene toggles audio playback.
 * The Spline scene handles the visual interface, while AudioPlayer handles
 * the actual audio playback from dynamic URLs (e.g., from Baserow/DigitalOcean).
 * 
 * @example
 * ```tsx
 * <SplineAudioPlayer
 *   sceneUrl="https://prod.spline.design/xxx/scene.splinecode"
 *   audioUrl={getAudioUrl('Novelist-Maine-001.mp3')}
 *   triggerObjectName="Play Button"
 * />
 * ```
 */
export default function SplineAudioPlayer({
  sceneUrl,
  audioUrl,
  triggerObjectName = 'PlayButton',
  onPlayStateChange,
  className,
}: SplineAudioPlayerProps) {
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);
  const splineRef = useRef<Application>();

  // Map percentage (0-100) to X position for progress handle
  const mapProgressToX = (percentage: number): number => {
    return PROGRESS_X_START + (percentage / 100) * (PROGRESS_X_END - PROGRESS_X_START);
  };

  // Update Spline progress variable when audio progress changes
  const handleProgressUpdate = useCallback((percentage: number) => {
    const spline = splineRef.current;
    if (spline) {
      const xPosition = mapProgressToX(percentage);
      spline.setVariable('progress', xPosition);
    }
  }, []);

  const handleSplineLoad = useCallback((splineApp: Application) => {
    splineRef.current = splineApp;

    // Listen for mouse down events on any object
    splineApp.addEventListener('mouseDown', (e: { target: SPEObject }) => {
      // Check if the clicked object is our trigger
      if (e.target.name === triggerObjectName) {
        const player = audioPlayerRef.current;
        if (player) {
          player.toggle();
          onPlayStateChange?.(!player.isPlaying);
        }
      }
    });
  }, [triggerObjectName, onPlayStateChange]);

  return (
    <div className={className} style={{ position: 'relative', width: '100%' }}>
      {/* Spline 3D scene - visual interface */}
      {/* Container maintains 7:1 aspect ratio, Spline canvas scales to fit */}
      <div style={{ 
        width: '100%', 
        aspectRatio: '7 / 1',
        overflow: 'hidden',
      }}>
        <div style={{
          width: '700px',
          height: '100px',
          transformOrigin: 'top left',
          transform: 'scale(var(--spline-scale, 1))',
        }} ref={(el) => {
          if (el) {
            const updateScale = () => {
              const parentWidth = el.parentElement?.clientWidth || 700;
              el.style.setProperty('--spline-scale', String(parentWidth / 700));
            };
            updateScale();
            window.addEventListener('resize', updateScale);
          }
        }}>
          <Spline
            scene={sceneUrl}
            onLoad={handleSplineLoad}
          />
        </div>
      </div>
      
      {/* AudioPlayer - handles actual audio playback */}
      <div>
        <AudioPlayer
          ref={audioPlayerRef}
          audioUrl={audioUrl}
          onProgressUpdate={handleProgressUpdate}
        />
      </div>
    </div>
  );
}
