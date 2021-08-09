module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: [
    'js',
    'json',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!coverage/**',
    '!babel.config.js',
    '!jest.config.js',
  ],
  coverageReporters: [
    "json-summary",
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
}
