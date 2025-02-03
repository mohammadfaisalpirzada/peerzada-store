/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enables React Strict Mode for highlighting potential issues

  images: {
    domains: [
      "lh3.googleusercontent.com", // For Google profile images
      "avatars.githubusercontent.com", // For GitHub avatars
      "cdn.sanity.io", // For Sanity images
      "next-ecommerce-template-4.vercel.app", // For product images from Vercel app
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
      {
        protocol: "https",
        hostname: "next-ecommerce-template-4.vercel.app",
        pathname: "**", // Allows all paths under this domain
      },
    ],
  },
};

module.exports = nextConfig;
