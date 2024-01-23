/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "e-cdn-images.dzcdn.net",
            },
            {
                hostname: "api.deezer.com",
            },
            {
                hostname: "lh3.googleusercontent.com",
            },
            {
                hostname: "res.cloudinary.com",
            },
            {
                hostname: "s.gravatar.com",
            },
        ],
    },
};

export default nextConfig
