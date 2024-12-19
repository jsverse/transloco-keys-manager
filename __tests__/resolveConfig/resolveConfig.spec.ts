import { vi, MockInstance, beforeAll, afterAll, expect } from 'vitest';

import chalk from 'chalk';
import path from 'node:path';

import { defaultConfig as _defaultConfig } from '../../src/config';
import { messages } from '../../src/messages';

import { spyOnConsole, spyOnProcess } from '../spec-utils';
import { resolveConfig } from '../../src/utils/resolve-config';
import { describe, it } from 'vitest';

const sourceRoot = '__tests__/resolveConfig';
let mockedGlobalConfig = {};

vi.mock('../../src/utils/resolve-project-base-path.ts', () => ({
  resolveProjectBasePath: vi
    .fn()
    .mockReturnValue({ projectBasePath: '__tests__/resolveConfig' }),
}));

vi.mock('@jsverse/transloco-utils', () => ({
  getGlobalConfig: () => mockedGlobalConfig,
}));

describe('resolveConfig', () => {
  const inlineConfig = {
    defaultValue: 'test2',
    input: [`${sourceRoot}/somePath`],
    outputFormat: 'pot',
  };
  let spies: MockInstance[];
  const defaultConfig = _defaultConfig({ sourceRoot });
  const validInput = [`${sourceRoot}/src/folder`];

  beforeAll(() => {
    mockedGlobalConfig = {};
    spies = [spyOnProcess('exit'), spyOnConsole('log')];
  });

  afterAll(() => {
    spies.forEach((s) => s.mockRestore());
  });

  function resolvePath(configPath: string[]): string[];
  function resolvePath(configPath: string): string;
  function resolvePath(configPath: string, asArray: true): string[];
  function resolvePath(configPath: string | string[], asArray = false) {
    const resolve = (p: string) => path.resolve(process.cwd(), p);
    if (Array.isArray(configPath)) {
      return configPath.map(resolve);
    }

    return asArray ? [resolve(configPath)] : resolve(configPath);
  }

  function assertConfig<T>(expected: T, inline = {}) {
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
      rootTranslationsPath: `${sourceRoot}/1/2`,
      langs: ['en', 'jp'],
      keysManager: {
        defaultValue: 'test',
        input: `${sourceRoot}/src/test`,
        output: `${sourceRoot}/src/assets/override`,
      },
    };

    beforeAll(() => {
      mockedGlobalConfig = translocoConfig;
    });

    afterAll(() => {
      mockedGlobalConfig = {};
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
      const [processExitSpy, consoleLogSpy] = spies;
      expect(processExitSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        chalk.bgRed.black(`${prop} ${messages[msg]}`),
      );
      clearSpies();
    }

    function shouldPass() {
      spies.forEach((s) => expect(s).not.toHaveBeenCalled());
      clearSpies();
    }

    function clearSpies() {
      spies.forEach((s) => s.mockClear());
    }

    it('should fail on invalid input path', () => {
      resolveConfig({ input: ['noFolder'] });
      shouldFail('Input', 'pathDoesntExist');
      resolveConfig({ input: validInput.concat('anotherMissingFolder') });
      shouldFail('Input', 'pathDoesntExist');
      resolveConfig({ input: [`${sourceRoot}/src/1.html`] });
      shouldFail('Input', 'pathIsNotDir');
    });

    it('should pass on invalid translations path in extract mode', () => {
      resolveConfig({
        input: validInput,
        translationsPath: 'noFolder',
        command: 'extract',
      });
      shouldPass();
    });

    it('should fail on invalid translations path in find mode', () => {
      resolveConfig({
        input: validInput,
        translationsPath: 'noFolder',
        command: 'find',
      });
      shouldFail('Translations', 'pathDoesntExist');
      resolveConfig({
        input: validInput,
        translationsPath: `${sourceRoot}/src/1.html`,
        command: 'find',
      });
      shouldFail('Translations', 'pathIsNotDir');
    });
  });

  describe('resolveConfigPaths', () => {
    it('should prefix all the paths in the config with the process cwd', () => {
      const config = resolveConfig({ input: ['folder'] });
      const assertPath = (p: string) =>
        expect(p.startsWith(path.resolve(process.cwd()))).toBe(true);
      config.input.forEach(assertPath);
      assertPath(config.translationsPath);
      assertPath(config.output);
    });
  });
});
