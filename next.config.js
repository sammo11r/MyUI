const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
    };

    return config;
  },
};

module.exports = {
  i18n,
  nextConfig,
  async redirects() {
    return [
      {
        source: '/dashboards/:slug', 
        destination: '/', // Redirect to home
        permanent: true, // Make sure to cache the redirect
      },
      {
        source: '/basetables/:slug',
        destination: '/', // Redirect to the home page
        permanent: true,
      },
    ]
  },
};
