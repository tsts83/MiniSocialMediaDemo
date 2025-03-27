require('dotenv').config({ path: '.env.test' });

module.exports = {
    testEnvironment: 'node',  // Use Node.js environment for backend tests

    transform: {
      '^.+\\.js$': 'babel-jest',  // Use Babel for JavaScript files
    },
    moduleFileExtensions: ['js', 'json', 'node'],
    testMatch: [
        '**/api/tests/**/*.(test|spec).(js)',  // Match test files in the /api/tests folder
    ],
  };  