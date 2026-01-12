import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',

  // No basePath for user site at root domain
  basePath: '',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Better GitHub Pages compatibility
  trailingSlash: true,
};

export default nextConfig;
