import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.erturk-lab.com", pathname: "/**" },
      { protocol: "https", hostname: "erturk-lab.com", pathname: "/**" },
      { protocol: "https", hostname: "www.science.org", pathname: "/**" },
    ],
  },
};

export default nextConfig;
