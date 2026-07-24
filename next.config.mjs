/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'pixabay.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com'
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com'
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com'
      },
      {
        // Admin-uploaded images/logos/resume land here (see lib/blob-content.ts).
        // Every public Vercel Blob store gets a unique <id>.public.blob.vercel-storage.com
        // hostname, so this needs a wildcard rather than one fixed host.
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com'
      }
    ]
  }
};

export default nextConfig;
