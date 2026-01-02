/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    // Ignore ESLint errors during production build
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Ignore TypeScript errors during production build
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
