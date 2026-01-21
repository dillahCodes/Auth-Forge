import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["http://localhost:3000", "*.ngrok-free.dev"],
  headers: () => [
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Access-Control-Allow-Credentials",
          value: process.env.ACCESS_CONTROL_ALLOW_CREDENTIALS!,
        },
        {
          key: "Access-Control-Allow-Origin",
          value: process.env.ACCESS_CONTROL_ALLOW_ORIGIN!,
        },
        {
          key: "Access-Control-Allow-Methods",
          value: process.env.ACCESS_CONTROL_ALLOW_METHODS!,
        },
        {
          key: "Access-Control-Allow-Headers",
          value: process.env.ACCESS_CONTROL_ALLOW_HEADERS!,
        },
        {
          key: "Content-Security-Policy",
          value: process.env.CONTENT_SECURITY_POLICY!,
        },
      ],
    },
  ],
};

export default nextConfig;
