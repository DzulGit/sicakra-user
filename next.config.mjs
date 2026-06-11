/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    output: 'standalone',
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
