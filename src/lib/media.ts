// Media configuration for DigitalOcean Spaces
// Base URLs for media assets

export const MEDIA_CONFIG = {
  // Direct Spaces URL (CDN not currently enabled)
  baseUrl: 'https://trees-media.nyc3.digitaloceanspaces.com',
  
  // Paths
  audio: '/audio',
  image: '/image',
};

// Helper functions
export const getAudioUrl = (filename: string): string => {
  return `${MEDIA_CONFIG.baseUrl}${MEDIA_CONFIG.audio}/${filename}`;
};

export const getImageUrl = (filename: string): string => {
  return `${MEDIA_CONFIG.baseUrl}${MEDIA_CONFIG.image}/${filename}`;
};

// For Next.js Image component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const imageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  // DigitalOcean Spaces doesn't have built-in image optimization
  // Return the original URL - consider adding imgproxy later for optimization
  return src.startsWith('http') ? src : `${MEDIA_CONFIG.baseUrl}${src}`;
};

// Example usage:
// import { getAudioUrl, getImageUrl } from '@/lib/media';
// <audio src={getAudioUrl('episode1.mp3')} />
// <Image src={getImageUrl('photo.webp')} alt="..." width={800} height={600} />
