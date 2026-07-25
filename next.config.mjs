/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Image URLs are admin-controlled (uploaded to Vercel Blob, or pasted
    // into the dashboard's image fields). Previously only a handful of hosts
    // were whitelisted, so pasting any other image URL made next/image throw
    // "hostname not configured" DURING RENDER — which crashes the whole
    // public route for every visitor, not just the admin. Allowing any https
    // host removes that crash; the optimizer surface is only reachable by the
    // authenticated admin who sets these URLs.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
};

export default nextConfig;
