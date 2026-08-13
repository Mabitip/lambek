import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/our-story", destination: "/about", permanent: true },
      { source: "/origin", destination: "/about", permanent: true },
      { source: "/processing", destination: "/about", permanent: true },
      { source: "/quality", destination: "/about", permanent: true },
      { source: "/journal", destination: "/blog", permanent: true },
      { source: "/journal/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/our-coffee", destination: "/coffee", permanent: true },
      { source: "/our-coffee/:slug", destination: "/coffee/:slug", permanent: true },
      { source: "/traceability", destination: "/coffee", permanent: true },
      { source: "/request-coffee", destination: "/contact", permanent: true },
      { source: "/request-sample", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
