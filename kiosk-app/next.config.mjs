/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Serve static files from data folder
  async rewrites() {
    return [
      {
        source: '/data/:path*',
        destination: '/../data/:path*',
      },
    ];
  },
}

export default nextConfig