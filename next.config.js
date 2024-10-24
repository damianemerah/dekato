/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dekato-store.s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
  logging: {
    fetches: {
      hmrRefreshes: true,
      fullUrl: true,
    },
  },
  webpack(config, { webpack }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: "@svgr/webpack", options: { icon: true } }],
    });

    // Add ContextReplacementPlugin to handle dynamic requires
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /pug-filters/,
        path.resolve(__dirname, "node_modules"),
      ),
    );

    return config;
  },
};

module.exports = nextConfig;
