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
 *   triggerObjectName="Cylinder"
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
    <div className={className} style={{ position: 'relative' }}>
      {/* Spline 3D scene - visual interface */}
      <Spline
        scene={sceneUrl}
        onLoad={handleSplineLoad}
      />
      
      {/* AudioPlayer - handles actual audio playback */}
      <div style={{ marginTop: '1rem' }}>
        <AudioPlayer
          ref={audioPlayerRef}
          audioUrl={audioUrl}
        />
      </div>
    </div>
  );
}
