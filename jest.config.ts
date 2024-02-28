import type { Config } from 'jest';
import ngPreset from 'jest-preset-angular/presets/index.js';

const jestConfig: Config = {
  ...ngPreset.defaultsESM,
  testMatch: ['**/__tests__/**/*.spec.ts'],
  moduleNameMapper: {
    tslib: 'tslib/tslib.es6.js',
    rxjs: '<rootDir>/node_modules/rxjs/dist/bundles/rxjs.umd.js',
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|js|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        useESM: true,
      },
    ],
  },
};

export default jestConfig;