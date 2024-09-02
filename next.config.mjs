/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // …
        serverComponentsExternalPackages: ['@react-pdf/renderer'],
      }
};

export default nextConfig;
