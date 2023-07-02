import { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/.+/async.tsx",
    "<rootDir>/src/testing/",
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'ts',
    'tsx'
  ],
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/$1',
  },
  modulePathIgnorePatterns: [
    '.*__mocks__.*',
  ],
  preset: 'ts-jest',
  roots: [
    '<rootDir>/src',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/testing/setup.ts',
    '<rootDir>/src/testing/setupMocks.ts',
  ],
  testEnvironment: 'jsdom',
};

export default config;
