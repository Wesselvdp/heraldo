/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    NEXT_PUBLIC_OPENAI_ORG: process.env.NEXT_PUBLIC_OPENAI_ORG,
    NEXT_PUBLIC_NEWS_API_KEY: process.env.NEXT_PUBLIC_NEWS_API_KEY
  }
};

module.exports = nextConfig;
