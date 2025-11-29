/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // DigitalOcean Spaces (direct)
      {
        protocol: 'https',
        hostname: 'trees-media.nyc3.digitaloceanspaces.com',
        pathname: '/**',
      },
      // DigitalOcean Spaces CDN
      {
        protocol: 'https',
        hostname: 'trees-media.nyc3.cdn.digitaloceanspaces.com',
        pathname: '/**',
      },
      // Legacy Backblaze (keep for transition)
      {
        protocol: 'https',
        hostname: 'f004.backblazeb2.com',
        pathname: '/file/trees-image/**',
      },
    ],
  },
};

export default nextConfig;
