/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // …
        serverComponentsExternalPackages: ['@react-pdf/renderer'],
        serverActions: {
          bodySizeLimit: '3mb',
        },
      }
};

export default nextConfig;
