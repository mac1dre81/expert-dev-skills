const isCi = process.env.CI === 'true';
const shouldCollectCoverage =
  isCi || process.env.JEST_COLLECT_COVERAGE === 'true';
const shouldBail = isCi;
// Developers typically want richer test output locally; CI can stay quieter.
const shouldVerbose = process.env.JEST_VERBOSE === 'true' || !isCi;

module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'veilcipher/js/**/*.js',
    '!veilcipher/js/**/*.min.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: [],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  moduleFileExtensions: ['js', 'json'],
  verbose: shouldVerbose,
  bail: shouldBail,
  collectCoverage: shouldCollectCoverage,
  coverageThreshold: shouldCollectCoverage
    ? {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50
        }
      }
    : {}
};
