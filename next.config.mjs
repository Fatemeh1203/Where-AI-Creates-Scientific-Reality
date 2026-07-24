/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  // Ensure the private simulator HTML asset is bundled with the protected
  // route that serves it (needed for filesystem reads on Vercel).
  outputFileTracingIncludes: {
    "/lab/frame": ["./lab-assets/current-sensor.html"],
  },
};

export default nextConfig;
