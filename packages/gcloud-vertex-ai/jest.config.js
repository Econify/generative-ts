const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../../tsconfig.base.json');

module.exports = {
  displayName: 'gcloud-vertex-ai',
  testEnvironment: 'node',
  rootDir: '../../',
  roots: ['<rootDir>/packages/gcloud-vertex-ai/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['<rootDir>/packages/gcloud-vertex-ai/src/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
};
