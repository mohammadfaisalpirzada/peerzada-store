/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com", // For Google profile images
      "avatars.githubusercontent.com", // For GitHub avatars
      "cdn.sanity.io", // For Sanity images
    ],

    
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**", // Allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "**", // Allows all paths under this domain
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "**", // Allows all paths under this domain
      },
    ],
  },
};

module.exports = nextConfig;


