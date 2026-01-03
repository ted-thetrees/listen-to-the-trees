import { useState } from 'react';
import SplineAudioPlayer from '@/components/SplineAudioPlayer';
import { getAudioUrl } from '@/lib/media';

// Sample episodes from Baserow Content Blocks table
const SAMPLE_EPISODES = [
  {
    id: 1,
    title: 'Novelist | Maine',
    description: '"If not for my seventh-grade teacher whose name I can\'t remember, I probably wouldn\'t have discovered my love for writing."',
    audioFile: 'Novelist-Maine-001.mp3',
  },
  {
    id: 2,
    title: 'Painter | Colorado',
    description: '"If not for Chuck Foresman, I would not be finishing my paintings today."',
    audioFile: 'Painter-Colorado-001.mp3',
  },
  {
    id: 3,
    title: 'Sailor | British Columbia',
    description: '"If not for Byron Caine, I wouldn\'t be a sailor, I wouldn\'t have a sailboat..."',
    audioFile: 'Sailor-BritishColumbia-001.mp3',
  },
];

// Exported Spline scene URL
const SPLINE_SCENE_URL = 'https://prod.spline.design/Aus4nR1hKQoZHyfN/scene.splinecode';

/**
 * Demo page for Spline + AudioPlayer integration
 */
export default function SplineAudioDemo() {
  const [currentEpisode, setCurrentEpisode] = useState(SAMPLE_EPISODES[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1a1a1a', 
      color: '#D1BC8E',
      padding: '2rem',
      fontFamily: '"Cabinet Grotesk", sans-serif',
    }}>
      <h1 style={{ marginBottom: '2rem' }}>Spline Audio Player Demo</h1>
      
      {/* Episode selector */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem', opacity: 0.7 }}>Select Episode:</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {SAMPLE_EPISODES.map((episode) => (
            <button
              key={episode.id}
              onClick={() => setCurrentEpisode(episode)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: currentEpisode.id === episode.id ? '#D1BC8E' : 'transparent',
                color: currentEpisode.id === episode.id ? '#1a1a1a' : '#D1BC8E',
                border: '1px solid #D1BC8E',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {episode.title}
            </button>
          ))}
        </div>
      </div>

      {/* Current episode info */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{currentEpisode.title}</h2>
        <p style={{ opacity: 0.8, fontStyle: 'italic' }}>{currentEpisode.description}</p>
        <p style={{ 
          marginTop: '0.5rem', 
          fontSize: '0.875rem', 
          opacity: 0.5 
        }}>
          Status: {isPlaying ? '▶ Playing' : '⏸ Paused'}
        </p>
      </div>

      {/* Spline + Audio Player */}
      <div style={{ 
        maxWidth: '800px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <SplineAudioPlayer
          sceneUrl={SPLINE_SCENE_URL}
          audioUrl={getAudioUrl(currentEpisode.audioFile)}
          triggerObjectName="Cylinder"
          onPlayStateChange={setIsPlaying}
        />
      </div>
    </div>
  );
}
