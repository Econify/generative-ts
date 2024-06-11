const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../tsconfig.base.json');

module.exports = {
  displayName: 'integration/e2e',
  testEnvironment: 'node',
  rootDir: '../',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  testTimeout: 30000,
};
