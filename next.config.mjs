/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'f004.backblazeb2.com',
        pathname: '/file/trees-image/**',
      },
    ],
  },
};

export default nextConfig;
