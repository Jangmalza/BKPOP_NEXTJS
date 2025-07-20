import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker standalone 빌드를 위한 설정
  output: 'standalone',
  
  // 이미지 최적화 설정
  images: {
    unoptimized: false,
    domains: ['localhost'],
  },

  // 환경변수 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // ESLint 설정 (빌드 시 에러 무시)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript 타입 체크 비활성화 (빌드 속도 향상)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
