/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['garfxtaapwmphxeqfrnd.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'podcastle.ai',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
