import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // The default Vercel domain serves a full copy of the site; send it to
        // the canonical domain so search engines index only www
        source: "/:path*",
        has: [{ type: "host", value: "skrabblekeeper.vercel.app" }],
        destination: "https://www.skrabblekeeper.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
