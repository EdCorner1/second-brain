/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Ignore TS errors during build (we'll catch them locally)
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
