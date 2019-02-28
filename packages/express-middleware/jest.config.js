'use strict'

module.exports = {
  testMatch: ['**/*.test.js'],
  bail: true,
  testEnvironment: 'node',
  rootDir: 'test',
  // globalSetup: '<rootDir>/jest-global-setup.js',
  // globalTeardown: '<rootDir>/jest-global-teardown.js',
  // coverageReporters: ['text', 'lcov', 'cobertura'],
  verbose: true
}
