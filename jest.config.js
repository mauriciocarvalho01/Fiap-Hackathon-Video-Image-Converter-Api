module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/application/helpers/**',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/infra/docs/**',
    '!<rootDir>/src/infra/repos/mongodb/migrations/*',
    '!<rootDir>/src/infra/helpers/*',
    '!<rootDir>/src/**/errors/*',
    '!<rootDir>/src/infra/repos/mongodb/entities/*',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1',
  },
  testMatch: ['**/*.spec.ts'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: {
    '\\.ts$': 'ts-jest',
  },
  clearMocks: true,
  setupFiles: ['dotenv/config'],
};
