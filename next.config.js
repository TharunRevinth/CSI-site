const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    urlImports: ['https://framer.com/', 'https://framerusercontent.com/'],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      framer: path.resolve(__dirname, 'src/framer-stub.ts'),
      encoding: false,
    };
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        encoding: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
