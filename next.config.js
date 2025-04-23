/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // This enables both the app and pages directory 
    // which allows us to gradually migrate
    experimental: {
      appDir: true,
    },
    // Configure CORS headers
    async headers() {
      return [
        {
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" },
            { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
            { key: "Access-Control-Allow-Headers", value: "Origin, X-Requested-With, Content-Type, Accept, Authorization" },
          ],
        },
      ];
    },
  }
  
  module.exports = nextConfig