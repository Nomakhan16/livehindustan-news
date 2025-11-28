/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'static.politico.com',
      'www.politico.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'cdn.cnn.com',
      'abcnews.go.com',
      'www.reuters.com',
      'www.bbc.co.uk',
      'media.cnn.com',
      'a4.espncdn.com',
      's.yimg.com',
      'i.insider.com'
    ],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig