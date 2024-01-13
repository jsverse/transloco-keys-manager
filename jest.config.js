module.exports = {
  testMatch: ["**/__tests__/**/*.spec.ts"],
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
