import type { Config } from 'jest';

const config: Config = {
  // The only reason that this is being explicitly controlled
  // is so that the cache can be cached during CI
  // to speed up testing on the CI server.
  cacheDirectory: '<rootDir>/.jest-cache',
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/.+/async.tsx',
    '<rootDir>/src/testing/',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.png$': '<rootDir>/src/testing/fileMocks/image.js',
    '~/(.*)': '<rootDir>/$1',
  },
  modulePathIgnorePatterns: ['.*__mocks__.*'],
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: [
    '<rootDir>/src/testing/setup.ts',
    '<rootDir>/src/testing/setupFetch.ts',
    '<rootDir>/src/testing/setupMocks.ts',
  ],
  testEnvironment: 'jsdom',
};

export default config;
