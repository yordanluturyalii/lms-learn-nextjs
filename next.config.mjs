/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "utfs.io"
        ]
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
