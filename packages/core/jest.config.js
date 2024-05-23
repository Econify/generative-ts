const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../../tsconfig.base.json');

module.exports = {
  displayName: 'core',
  testEnvironment: 'node',
  rootDir: '../../',
  roots: ['<rootDir>/packages/core/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['<rootDir>/packages/core/src/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
};
