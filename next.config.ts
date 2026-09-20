import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Expose RECAPTCHA_SITE_KEY to browser (bina NEXT_PUBLIC_ prefix ke)
  env: {
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  },
};

export default nextConfig;
