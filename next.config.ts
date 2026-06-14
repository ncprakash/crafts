import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn3.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn1.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn2.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'encrypted-tbn3.gstatic.com',
      'encrypted-tbn0.gstatic.com',
      'encrypted-tbn1.gstatic.com',
      'encrypted-tbn2.gstatic.com',
      'lh3.googleusercontent.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'res.cloudinary.com',
    ],
  },
  webpack: (config, { isServer }) => {
    // Optimize webpack performance
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };

    // Limit memory usage
    config.performance = {
      ...config.performance,
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    };

    return config;
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Disable ESLint during build to avoid issues with generated files
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Use standalone output only for Docker builds (set DOCKER_BUILD=true in Dockerfile)
  // Vercel uses its own output system and does not need standalone mode
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  poweredByHeader: false,
  compress: true,
  // Increase function timeout for API routes
  serverRuntimeConfig: {
    maxDuration: 30,
  },
};

export default nextConfig;
