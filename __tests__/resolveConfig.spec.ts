// import-conductor-skip
jest.mock('../src/utils/resolve-project-base-path');
jest.mock('@ngneat/transloco-utils');
import { getGlobalConfig } from '@ngneat/transloco-utils';
import chalk from 'chalk';
import * as path from 'path';

import { Config } from '../src/types';
import { defaultConfig as _defaultConfig } from '../src/config';
import { resolveConfig } from '../src/utils/resolve-config';
import { resolveProjectBasePath } from '../src/utils/resolve-project-base-path';
import { messages } from '../src/messages';

function noop() {}

describe('resolveConfig', () => {
  const sourceRoot = '__tests__';
  const inlineConfig = {
    defaultValue: 'test2',
    input: ['somePath'],
    outputFormat: 'pot',
  };
  let spies;
  let defaultConfig = _defaultConfig();
  beforeAll(() => {
    (resolveProjectBasePath as any).mockImplementation(() => {
      return { projectBasePath: sourceRoot };
    });
    (getGlobalConfig as any).mockImplementation(() => ({}));
    spies = [
      jest.spyOn(process, 'exit').mockImplementation(noop as any),
      jest.spyOn(console, 'log').mockImplementation(noop as any),
    ];
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
    } as Config;
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
    } as Config;
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

    beforeAll(() =>
      (getGlobalConfig as any).mockImplementation(() => translocoConfig)
    );
    afterAll(() => (getGlobalConfig as any).mockImplementation(() => ({})));

    it('should merge the default and the transloco config', () => {
      const expected = {
        ...defaultConfig,
        defaultValue: translocoConfig.keysManager.defaultValue,
        input: resolvePath(translocoConfig.keysManager.input, true),
        output: resolvePath(translocoConfig.keysManager.output),
        translationsPath: resolvePath(translocoConfig.rootTranslationsPath),
        langs: translocoConfig.langs,
      } as Config;
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
      } as Config;
      assertConfig(expected, inlineConfig);
    });
  });

  describe('validate directories', () => {
    function shouldFail(prop: string, msg: 'pathDoesntExist' | 'pathIsNotDir') {
      expect(process.exit).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        chalk.bgRed.black(`${prop} ${messages[msg]}`)
      );
      resetSpies();
    }

    function shouldPass() {
      [process.exit, console.log].forEach((s) =>
        expect(s).not.toHaveBeenCalled()
      );
      resetSpies();
    }

    function resetSpies() {
      spies.forEach((s) => s.mockReset());
    }

    it('should fail on invalid input path', () => {
      resolveConfig({ input: ['noFolder'] });
      shouldFail('Input', 'pathDoesntExist');
      resolveConfig({ input: ['comments', 'anotherMissingFolder'] });
      shouldFail('Input', 'pathDoesntExist');
      resolveConfig({ input: ['comments/1.html'] });
      shouldFail('Input', 'pathIsNotDir');
    });

    it('should fail on invalid translations path', () => {
      /* should only fail translation path when in find mode */
      resolveConfig({ input: ['comments'], translationsPath: 'noFolder' });
      shouldPass();
      resolveConfig({
        input: ['comments'],
        translationsPath: 'noFolder',
        command: 'extract',
      });
      shouldPass();
      resolveConfig({
        input: ['comments'],
        translationsPath: 'noFolder',
        command: 'find',
      });
      shouldFail('Translations', 'pathDoesntExist');
      resolveConfig({
        input: ['comments'],
        translationsPath: 'comments/1.html',
        command: 'find',
      });
      shouldFail('Translations', 'pathIsNotDir');
    });
  });

  describe('resolveConfigPaths', () => {
    it('should prefix all the paths in the config with the process cwd', () => {
      const config = resolveConfig({ input: ['comments'] });
      const assertPath = (p) =>
        expect(p.startsWith(path.resolve(process.cwd(), sourceRoot))).toBe(
          true
        );
      config.input.forEach(assertPath);
      ['output', 'translationsPath'].forEach((prop) =>
        assertPath(config[prop])
      );
    });
  });
});
