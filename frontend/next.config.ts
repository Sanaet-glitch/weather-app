import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        port: '',
        pathname: '/img/wn/**', // Allows all images under /img/wn/ path
      },
    ],
  },
  /* other config options here */
};

export default nextConfig;
