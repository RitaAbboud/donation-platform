/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< Updated upstream
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pflbeftnldkmmldeokyw.supabase.co',
        pathname: '/storage/v1/object/public/**', 
      },
    ],
  },
=======
    images: {
        remotePatterns: [
            // Unsplash images
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '**',
            },

            // Supabase storage images
            {
                protocol: 'https',
                hostname: 'pflbeftnldkmmldeokyw.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
>>>>>>> Stashed changes
};

export default nextConfig;