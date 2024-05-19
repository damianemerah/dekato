/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["dekato-store.s3.eu-north-1.amazonaws.com"],
  },
};

module.exports = nextConfig;

// module.exports = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 's3.amazonaws.com',
//         port: '',
//         pathname: '/my-bucket/**',
//       },
//     ],
//   },
// }
