const preset = require('jest-expo/jest-preset');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Uniwind ships untranspiled TypeScript for React Native, so Jest must compile it.
  transformIgnorePatterns: [
    ...preset.transformIgnorePatterns.map((pattern) =>
      pattern.replace('/node_modules/(?!(', '/node_modules/(?!(uniwind|'),
    ),
  ],
  moduleNameMapper: {
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.expo/', '/dist/'],
};
