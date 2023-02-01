import { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/$1'
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
};

export default config;
