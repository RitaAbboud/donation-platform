/** @type {import('next').NextConfig} */
const nextConfig = {
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

};

export default nextConfig;