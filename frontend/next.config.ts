import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',

  // No basePath needed for user/org site (ayeshadev283-max.github.io)
  basePath: '',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Better GitHub Pages compatibility
  trailingSlash: true,
};

export default nextConfig;
