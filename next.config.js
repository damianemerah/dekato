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
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
