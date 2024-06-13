import chalk from 'chalk';
import path from 'node:path';
import { jest } from '@jest/globals';
import type { SpyInstance } from 'jest-mock';

import { defaultConfig as _defaultConfig } from '../../src/config';
import { messages } from '../../src/messages';

import { spyOnConsole, spyOnProcess } from '../spec-utils';

const sourceRoot = '__tests__/resolveConfig';
let mockedGloblConfig;

jest.unstable_mockModule(
  '../../src/utils/resolve-project-base-path.ts',
  () => ({
    resolveProjectBasePath: jest
      .fn()
      .mockReturnValue({ projectBasePath: sourceRoot }),
  }),
);

jest.unstable_mockModule('@jsverse/transloco-utils', () => ({
  getGlobalConfig: () => mockedGloblConfig,
}));

/**
 * With ESM modules, you need to mock the modules beforehand (with jest.unstable_mockModule) and import them ashynchronously afterwards.
 * This thing is still in WIP at Jest, so keep an eye on it.
 * @see https://jestjs.io/docs/ecmascript-modules#module-mocking-in-esm
 */
const { resolveConfig } = await import('../../src/utils/resolve-config');

describe('resolveConfig', () => {
  const inlineConfig = {
    defaultValue: 'test2',
    input: ['somePath'],
    outputFormat: 'pot',
  };
  let spies: SpyInstance[];
  let processExitSpy: SpyInstance;
  let consoleLogSpy: SpyInstance;
  let defaultConfig = _defaultConfig();

  beforeAll(() => {
    mockedGloblConfig = {};
    processExitSpy = spyOnProcess('exit');
    consoleLogSpy = spyOnConsole('log');
    spies = [processExitSpy, consoleLogSpy];
  });

  afterAll(() => {
    processExitSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  function resolvePath(configPath: string[]): string[];
  function resolvePath(configPath: string): string;
  function resolvePath(configPath: string, asArray: true): string[];
  function resolvePath(configPath: string | string[], asArray = false) {
    const resolve = (p) => path.resolve(process.cwd(), sourceRoot, p);
    if (Array.isArray(configPath)) {
      return configPath.map(resolve);
    }

    return asArray ? [resolve(configPath)] : resolve(configPath);
  }

  function assertConfig(expected, inline = {}) {
    const { scopes, ...config } = resolveConfig(inline);
    expect(config).toEqual(expected);
    expect(scopes).toBeDefined();
  }

  it('should return the default config', () => {
    const expected = {
      ...defaultConfig,
      input: resolvePath(defaultConfig.input),
      output: resolvePath(defaultConfig.output),
      translationsPath: resolvePath(defaultConfig.translationsPath),
      fileFormat: 'json',
    };
    assertConfig(expected);
  });

  it('should merge the default and inline config ', () => {
    const expected = {
      ...defaultConfig,
      defaultValue: inlineConfig.defaultValue,
      outputFormat: inlineConfig.outputFormat,
      input: resolvePath(inlineConfig.input),
      output: resolvePath(defaultConfig.output),
      translationsPath: resolvePath(defaultConfig.translationsPath),
    };
    assertConfig(expected, inlineConfig);
  });

  describe('with transloco config', () => {
    const translocoConfig = {
      rootTranslationsPath: '1/2',
      langs: ['en', 'jp'],
      keysManager: {
        defaultValue: 'test',
        input: 'test',
        output: 'assets/override',
      },
    };

    beforeAll(() => {
      mockedGloblConfig = translocoConfig;
    });

    afterAll(() => {
      mockedGloblConfig = {};
    });

    it('should merge the default and the transloco config', () => {
      const expected = {
        ...defaultConfig,
        defaultValue: translocoConfig.keysManager.defaultValue,
        input: resolvePath(translocoConfig.keysManager.input, true),
        output: resolvePath(translocoConfig.keysManager.output),
        translationsPath: resolvePath(translocoConfig.rootTranslationsPath),
        langs: translocoConfig.langs,
      };
      assertConfig(expected);
    });

    it('should merge the default, transloco config and inline config ', () => {
      const expected = {
        ...defaultConfig,
        defaultValue: inlineConfig.defaultValue,
        outputFormat: inlineConfig.outputFormat,
        input: resolvePath(inlineConfig.input),
        output: resolvePath(translocoConfig.keysManager.output),
        translationsPath: resolvePath(translocoConfig.rootTranslationsPath),
        langs: translocoConfig.langs,
      };
      assertConfig(expected, inlineConfig);
    });
  });

  describe('validate directories', () => {
    function shouldFail(prop: string, msg: 'pathDoesntExist' | 'pathIsNotDir') {
      expect(processExitSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        chalk.bgRed.black(`${prop} ${messages[msg]}`),
      );
      clearSpies();
    }

    function shouldPass() {
      [processExitSpy, consoleLogSpy].forEach((s) =>
        expect(s).not.toHaveBeenCalled(),
      );
      clearSpies();
    }

    function clearSpies() {
      spies.forEach((s) => s.mockClear());
    }

    it('should fail on invalid input path', () => {
      resolveConfig({ input: ['noFolder'] });
      shouldFail('Input', 'pathDoesntExist');
      resolveConfig({ input: ['src/folder', 'anotherMissingFolder'] });
      shouldFail('Input', 'pathDoesntExist');
      resolveConfig({ input: ['src/1.html'] });
      shouldFail('Input', 'pathIsNotDir');
    });

    it('should fail on invalid translations path', () => {
      /* should only fail translation path when in find mode */
      resolveConfig({ input: ['src/folder'], translationsPath: 'noFolder' });
      shouldPass();
      resolveConfig({
        input: ['src/folder'],
        translationsPath: 'noFolder',
        command: 'extract',
      });
      shouldPass();
      resolveConfig({
        input: ['src/folder'],
        translationsPath: 'noFolder',
        command: 'find',
      });
      shouldFail('Translations', 'pathDoesntExist');
      resolveConfig({
        input: ['src/folder'],
        translationsPath: 'src/1.html',
        command: 'find',
      });
      shouldFail('Translations', 'pathIsNotDir');
    });
  });

  describe('resolveConfigPaths', () => {
    it('should prefix all the paths in the config with the process cwd', () => {
      const config = resolveConfig({ input: ['folder'] });
      const assertPath = (p) =>
        expect(p.startsWith(path.resolve(process.cwd(), sourceRoot))).toBe(
          true,
        );
      config.input.forEach(assertPath);
      ['output', 'translationsPath'].forEach((prop) =>
        assertPath(config[prop]),
      );
    });
  });
});
