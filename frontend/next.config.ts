import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',

  // basePath for project site (ayeshadev283-max.github.io/todoapp)
  basePath: '/todoapp',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Better GitHub Pages compatibility
  trailingSlash: true,
};

export default nextConfig;
