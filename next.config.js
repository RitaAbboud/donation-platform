/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
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
<<<<<<< HEAD
=======

>>>>>>> 851450ad40a429743f7666ca486bab7498eb8e46
};

export default nextConfig;