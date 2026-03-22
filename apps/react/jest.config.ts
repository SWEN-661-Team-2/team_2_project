import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  roots: ['<rootDir>/tests/unit', '<rootDir>/tests/integration'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.vercel/',
    '/tests/e2e/',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|ico)$': '<rootDir>/__mocks__/fileMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.jest.json',
    }],
  },
  testMatch: [
    '**/*.test.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/App.css',
  ],
  coverageThreshold: {
    global: {
      lines: 75,
      functions: 75,
      branches: 75,
      statements: 75,
    },
  },
  coverageReporters: ['html', 'lcov', 'text-summary'],
  coverageDirectory: 'coverage',
};

export default config;
