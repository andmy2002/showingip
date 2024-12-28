/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
  },
  images: {
    domains: [
      'example.com',
      'localhost',
      'ipshowcase.s3.ap-northeast-1.amazonaws.com',
      'ipshowcase.s3.amazonaws.com',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // 添加开发服务器配置
  webpack: (config, { isServer }) => {
    // 在这里添加 webpack 配置
    return config;
  },
  // 添加开发服务器配置
  serverRuntimeConfig: {
    // 仅在服务器端可用的配置
  },
  publicRuntimeConfig: {
    // 在客户端和服务器端都可用的配置
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig 