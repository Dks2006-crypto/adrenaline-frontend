/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },

  // Если используешь App Router и хочешь, чтобы всё работало без ревалидаций и т.п.
  reactStrictMode: false,
  swcMinify: true,
};

export default nextConfig;