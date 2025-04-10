/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"], // Path to jest.setup.ts
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  roots: ["<rootDir>/src/tests"], // Specify the directory where test files are located
  testMatch: ["**/*.test.ts"], // Match all test files with .test.ts extension
  globalTeardown: "<rootDir>/src/tests/globalTeardown.ts", // Path to globalTeardown.ts
};