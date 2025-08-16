import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autoriser (quasi) tous les domaines pour next/image.
  // Option 1: utiliser remotePatterns avec wildcards (peut nécessiter version récente de Next.js)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    // Option 2 (décommentez pour vraiment tout autoriser mais sans optimisation) :
    // unoptimized: true,
  },
};

export default nextConfig;
