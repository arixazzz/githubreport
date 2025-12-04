/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "newus-bucket.s3.ap-southeast-2.amazonaws.com",
      "loremflickr.com",
      "picsum.photos",
    ],
  },

  compiler: {
    ...(process.env.NEXT_PUBLIC_MODE === "PRODUCTION" && {
      removeConsole: { exclude: ["error"] },
    }),
  },

  devIndicators: { position: "bottom-right" },

  // ❗ Disable ALL Turbopack features
  experimental: {
    serverMinification: false,
    ppr: false,
    webpackBuildWorker: false,
  },

  // ❗ Paksa gunakan Webpack
  webpack(config: any) {
    return config;
  },
};

export default nextConfig;
