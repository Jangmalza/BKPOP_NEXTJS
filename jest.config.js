/**
 * Jest 테스트 환경 설정
 * @description Next.js 프로젝트용 Jest 설정
 */

const nextJest = require('next/jest')

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Next.js 앱의 루트 경로
  dir: './',
})

// Jest 설정 객체
const config = {
  // 테스트 환경 설정
  testEnvironment: 'jest-environment-jsdom',
  
  // 설정 파일들
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // 모듈 매핑
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // 테스트 파일 패턴
  testMatch: [
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/?(*.)+(spec|test).{js,jsx,ts,tsx}',
  ],
  
  // 무시할 파일들
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],
  
  // 변환 무시 패턴
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  // 코드 커버리지 설정
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
  ],
  
  // 커버리지 임계값
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // 모의 설정
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
  // 환경 변수 설정
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
}

// Jest 설정 내보내기
module.exports = createJestConfig(config) 