import type { Config } from 'jest';
import ngPreset from 'jest-preset-angular/presets/index.js';

const jestConfig: Config = {
  ...(ngPreset.defaultsESM as Config),
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  testMatch: ['**/__tests__/**/*.spec.ts'],
  moduleNameMapper: {
    tslib: 'tslib/tslib.es6.js',
    rxjs: '<rootDir>/node_modules/rxjs/dist/bundles/rxjs.umd.js',
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};

export default jestConfig;
