/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dekato.ng',
        port: '',
        pathname: '/**',
      },
      ...(process.env.NODE_ENV === 'development'
        ? [
            {
              protocol: 'https',
              hostname: 'loremflickr.com',
              port: '',
              pathname: '/**',
            },
            {
              protocol: 'https',
              hostname: 'picsum.photos',
              port: '',
              pathname: '/**',
            },
            {
              protocol: 'https',
              hostname: 'source.unsplash.com',
              port: '',
              pathname: '/**',
            },
          ]
        : []),
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },

  async headers() {
    return [
      // Next.js build assets: immutable for 1 year
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Public assets (icons, images): immutable for 1 year
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Home page (SSG): cache 30 sec, stale 60 sec
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=30, stale-while-revalidate=60',
          },
        ],
      },
    ];
  },

  poweredByHeader: false,

  webpack(config, { webpack }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
    });

    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /pug-filters/,
        path.resolve(__dirname, 'node_modules')
      )
    );

    return config;
  },
};

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
