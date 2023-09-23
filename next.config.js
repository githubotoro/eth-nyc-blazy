const {withPlausibleProxy} = require('next-plausible');
const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = withPlausibleProxy()({
  reactStrictMode: true,
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      // This is hammer approach for local dev. We can't figure out why, but node 18 starts to have
      // issues with local dev seeing multiple reacts.
      react: path.resolve('./node_modules/react'),
    };
    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
});
