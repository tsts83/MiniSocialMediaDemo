module.exports = {
  testEnvironment: 'jest-environment-jsdom', 
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'node'],
  testMatch: [
    '**/tests/**/*.(test|spec).(ts|tsx)',  // Match only frontend tests
  ],

};